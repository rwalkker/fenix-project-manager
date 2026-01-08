// FENIX Project Manager - AWS Bedrock Types
// Type definitions for AI services
// Created: January 5, 2026

export interface BedrockRequest {
    prompt: string;
    modelId?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    stopSequences?: string[];
}

export interface BedrockResponse {
    completion: string;
    stopReason: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
    };
    modelId: string;
    timestamp: Date;
}

export interface AIModelMetrics {
    modelId: string;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatency: number;
    averageTokens: number;
    lastUsed: Date;
}
