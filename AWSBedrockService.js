"use strict";
// FENIX Project Manager - AWS Bedrock Service
// AI service integration with AWS Bedrock for document generation
// Created: January 5, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSBedrockService = void 0;
exports.getBedrockService = getBedrockService;
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const credential_providers_1 = require("@aws-sdk/credential-providers");
const events_1 = require("events");
const bedrock_config_1 = require("../config/bedrock-config");
/**
 * AWS Bedrock Service for AI-powered document generation
 */
class AWSBedrockService extends events_1.EventEmitter {
    client;
    config;
    metrics;
    constructor(config) {
        super();
        this.config = {
            ...bedrock_config_1.DEFAULT_BEDROCK_CONFIG,
            ...config
        };
        // Validate configuration
        const isConfigValid = (0, bedrock_config_1.validateBedrockConfig)(this.config);
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
            this.client = new client_bedrock_runtime_1.BedrockRuntimeClient({
                region: this.config.region || 'us-east-2',
                credentials: (0, credential_providers_1.fromEnv)()
            });
            console.log(`[Bedrock] ✅ Client initialized successfully`);
            console.log(`[Bedrock] Region: ${this.config.region}`);
            console.log(`[Bedrock] Model: ${this.config.modelId}`);
        }
        catch (error) {
            console.error('[Bedrock] ❌ Failed to initialize AWS credentials');
            console.error('[Bedrock] Error:', error instanceof Error ? error.message : 'Unknown error');
            throw new Error(`Bedrock initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        this.metrics = new Map();
        console.log(`[Bedrock] ✅ AWS Bedrock Service initialized (${this.config.modelId})`);
    }
    async invoke(request) {
        const startTime = Date.now();
        const modelId = request.modelId || this.config.modelId;
        console.log(`[Bedrock] 🚀 Invoking model: ${modelId}`);
        console.log(`[Bedrock] Prompt length: ${request.prompt.length} characters`);
        try {
            const payload = this.preparePayload(request, modelId);
            console.log(`[Bedrock] Payload prepared for ${modelId}`);
            const command = new client_bedrock_runtime_1.InvokeModelCommand({
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
        }
        catch (error) {
            const latency = Date.now() - startTime;
            console.error(`[Bedrock] ❌ Invocation failed after ${latency}ms`);
            console.error(`[Bedrock] Error:`, error);
            this.updateMetrics(modelId, false, latency);
            this.emit('request:error', { modelId, error: error.message, latency });
            throw new Error(`Bedrock invocation failed: ${error.message}`);
        }
    }
    preparePayload(request, modelId) {
        const config = (0, bedrock_config_1.getModelConfig)(modelId);
        if ((0, bedrock_config_1.isClaudeModel)(modelId)) {
            return {
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: request.maxTokens || config.maxTokens,
                temperature: request.temperature ?? config.temperature,
                top_p: request.topP ?? config.topP,
                messages: [{ role: 'user', content: request.prompt }],
                stop_sequences: request.stopSequences || config.stopSequences
            };
        }
        else if ((0, bedrock_config_1.isTitanModel)(modelId)) {
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
    extractCompletion(responseBody, modelId) {
        if ((0, bedrock_config_1.isClaudeModel)(modelId)) {
            return responseBody.content?.[0]?.text || '';
        }
        else if ((0, bedrock_config_1.isTitanModel)(modelId)) {
            return responseBody.results?.[0]?.outputText || '';
        }
        return responseBody.completion || responseBody.text || '';
    }
    updateMetrics(modelId, success, latency, responseBody) {
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
            const totalTokens = (responseBody.usage.input_tokens || 0) + (responseBody.usage.output_tokens || 0);
            metrics.averageTokens =
                (metrics.averageTokens * (metrics.totalRequests - 1) + totalTokens) / metrics.totalRequests;
        }
        metrics.lastUsed = new Date();
    }
    async testConnection() {
        try {
            const response = await this.invoke({
                prompt: 'Hello! Please respond with "OK" if you can read this.',
                maxTokens: 10
            });
            return response.completion.length > 0;
        }
        catch (error) {
            console.error('Bedrock connection test failed:', error.message);
            return false;
        }
    }
    getMetrics(modelId) {
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
    setModel(modelId) {
        this.config.modelId = modelId;
        console.log(`✓ Switched to model: ${modelId}`);
    }
    getConfig() {
        return { ...this.config };
    }
}
exports.AWSBedrockService = AWSBedrockService;
let bedrockServiceInstance = null;
function getBedrockService() {
    if (!bedrockServiceInstance) {
        bedrockServiceInstance = new AWSBedrockService();
    }
    return bedrockServiceInstance;
}
//# sourceMappingURL=AWSBedrockService.js.map