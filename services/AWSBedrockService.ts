// FENIX Project Manager - AWS Bedrock Service
// AI service integration with AWS Bedrock for document generation
// Created: January 5, 2026

import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';
import { fromEnv } from '@aws-sdk/credential-providers';
import { EventEmitter } from 'events';
import {
    DEFAULT_BEDROCK_CONFIG,
    getModelConfig,
    validateBedrockConfig,
    isClaudeModel,
    isTitanModel,
    type BedrockConfig
} from '../config/bedrock-config';
import type {
    BedrockRequest,
    BedrockResponse,
    AIModelMetrics
} from '../models/bedrock-types';

/**
 * AWS Bedrock Service for AI-powered document generation
 */
export class AWSBedrockService extends EventEmitter {
    private client: BedrockRuntimeClient;
    private config: BedrockConfig;
    private metrics: Map<string, AIModelMetrics>;

    constructor(config?: Partial<BedrockConfig>) {
        super();
        
        this.config = {
            ...DEFAULT_BEDROCK_CONFIG,
            ...config
        };

        // Validate configuration
        const isConfigValid = validateBedrockConfig(this.config);
        
        if (!isConfigValid) {
            console.error('[Bedrock] ❌ Configuration validation failed');
            console.error('[Bedrock] Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION');
            console.error('[Bedrock] Current config:', {
                region: this.config.region,
                modelId: this.config.modelId,
                hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
                hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
            });
        }
        
        try {
            this.client = new BedrockRuntimeClient({
                region: this.config.region || 'us-east-2',
                credentials: fromEnv()
            });
            
            console.log(`[Bedrock] ✅ Client initialized successfully`);
            console.log(`[Bedrock] Region: ${this.config.region}`);
            console.log(`[Bedrock] Model: ${this.config.modelId}`);
            
        } catch (error) {
            console.error('[Bedrock] ❌ Failed to initialize AWS credentials');
            console.error('[Bedrock] Error:', error instanceof Error ? error.message : 'Unknown error');
            throw new Error(`Bedrock initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        this.metrics = new Map();

        console.log(`[Bedrock] ✅ AWS Bedrock Service initialized (${this.config.modelId})`);
    }

    async invoke(request: BedrockRequest): Promise<BedrockResponse> {
        const startTime = Date.now();
        const modelId = request.modelId || this.config.modelId;

        console.log(`[Bedrock] 🚀 Invoking model: ${modelId}`);
        console.log(`[Bedrock] Prompt length: ${request.prompt.length} characters`);

        try {
            const payload = this.preparePayload(request, modelId);
            console.log(`[Bedrock] Payload prepared for ${modelId}`);

            const command = new InvokeModelCommand({
                modelId,
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(payload)
            });

            console.log(`[Bedrock] Sending request to AWS Bedrock...`);
            const response = await this.client.send(command);
            console.log(`[Bedrock] ✅ Response received from AWS Bedrock`);
            
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            const completion = this.extractCompletion(responseBody, modelId);

            console.log(`[Bedrock] Completion length: ${completion.length} characters`);
            console.log(`[Bedrock] Completion preview: ${completion.substring(0, 100)}...`);

            const latency = Date.now() - startTime;
            this.updateMetrics(modelId, true, latency, responseBody);

            this.emit('request:complete', { modelId, latency, success: true });

            return {
                completion,
                stopReason: responseBody.stop_reason || 'end_turn',
                usage: responseBody.usage ? {
                    inputTokens: responseBody.usage.input_tokens || 0,
                    outputTokens: responseBody.usage.output_tokens || 0
                } : undefined,
                modelId,
                timestamp: new Date()
            };

        } catch (error: any) {
            const latency = Date.now() - startTime;
            console.error(`[Bedrock] ❌ Invocation failed after ${latency}ms`);
            console.error(`[Bedrock] Error:`, error);
            
            this.updateMetrics(modelId, false, latency);
            this.emit('request:error', { modelId, error: error.message, latency });
            throw new Error(`Bedrock invocation failed: ${error.message}`);
        }
    }

    private preparePayload(request: BedrockRequest, modelId: string): any {
        const config = getModelConfig(modelId);

        if (isClaudeModel(modelId)) {
            return {
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: request.maxTokens || config.maxTokens,
                temperature: request.temperature ?? config.temperature,
                top_p: request.topP ?? config.topP,
                messages: [{ role: 'user', content: request.prompt }],
                stop_sequences: request.stopSequences || config.stopSequences
            };
        } else if (isTitanModel(modelId)) {
            return {
                inputText: request.prompt,
                textGenerationConfig: {
                    maxTokenCount: request.maxTokens || config.maxTokens,
                    temperature: request.temperature ?? config.temperature,
                    topP: request.topP ?? config.topP,
                    stopSequences: request.stopSequences || config.stopSequences
                }
            };
        }

        return {
            prompt: request.prompt,
            max_tokens: request.maxTokens || config.maxTokens,
            temperature: request.temperature ?? config.temperature,
            top_p: request.topP ?? config.topP
        };
    }

    private extractCompletion(responseBody: any, modelId: string): string {
        if (isClaudeModel(modelId)) {
            return responseBody.content?.[0]?.text || '';
        } else if (isTitanModel(modelId)) {
            return responseBody.results?.[0]?.outputText || '';
        }
        return responseBody.completion || responseBody.text || '';
    }

    private updateMetrics(modelId: string, success: boolean, latency: number, responseBody?: any): void {
        let metrics = this.metrics.get(modelId);

        if (!metrics) {
            metrics = {
                modelId,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageLatency: 0,
                averageTokens: 0,
                lastUsed: new Date()
            };
            this.metrics.set(modelId, metrics);
        }

        metrics.totalRequests++;
        success ? metrics.successfulRequests++ : metrics.failedRequests++;

        metrics.averageLatency = 
            (metrics.averageLatency * (metrics.totalRequests - 1) + latency) / metrics.totalRequests;

        if (responseBody?.usage) {
            const totalTokens = 
                (responseBody.usage.input_tokens || 0) + (responseBody.usage.output_tokens || 0);
            metrics.averageTokens = 
                (metrics.averageTokens * (metrics.totalRequests - 1) + totalTokens) / metrics.totalRequests;
        }

        metrics.lastUsed = new Date();
    }

    async testConnection(): Promise<boolean> {
        try {
            const response = await this.invoke({
                prompt: 'Hello! Please respond with "OK" if you can read this.',
                maxTokens: 10
            });
            return response.completion.length > 0;
        } catch (error: any) {
            console.error('Bedrock connection test failed:', error.message);
            return false;
        }
    }

    getMetrics(modelId?: string): AIModelMetrics | AIModelMetrics[] {
        if (modelId) {
            return this.metrics.get(modelId) || {
                modelId,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageLatency: 0,
                averageTokens: 0,
                lastUsed: new Date()
            };
        }
        return Array.from(this.metrics.values());
    }

    setModel(modelId: string): void {
        this.config.modelId = modelId;
        console.log(`✓ Switched to model: ${modelId}`);
    }

    getConfig(): BedrockConfig {
        return { ...this.config };
    }
}

let bedrockServiceInstance: AWSBedrockService | null = null;

export function getBedrockService(): AWSBedrockService {
    if (!bedrockServiceInstance) {
        bedrockServiceInstance = new AWSBedrockService();
    }
    return bedrockServiceInstance;
}
