import { EventEmitter } from 'events';
import { type BedrockConfig } from '../config/bedrock-config';
import type { BedrockRequest, BedrockResponse, AIModelMetrics } from '../models/bedrock-types';
/**
 * AWS Bedrock Service for AI-powered document generation
 */
export declare class AWSBedrockService extends EventEmitter {
    private client;
    private config;
    private metrics;
    constructor(config?: Partial<BedrockConfig>);
    invoke(request: BedrockRequest): Promise<BedrockResponse>;
    private preparePayload;
    private extractCompletion;
    private updateMetrics;
    testConnection(): Promise<boolean>;
    getMetrics(modelId?: string): AIModelMetrics | AIModelMetrics[];
    setModel(modelId: string): void;
    getConfig(): BedrockConfig;
}
export declare function getBedrockService(): AWSBedrockService;
//# sourceMappingURL=AWSBedrockService.d.ts.map