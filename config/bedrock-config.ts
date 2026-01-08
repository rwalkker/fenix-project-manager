// FENIX Project Manager - AWS Bedrock Configuration
// AI model configuration for document generation
// Created: January 5, 2026

export const BEDROCK_MODELS = {
    CLAUDE_3_OPUS: 'anthropic.claude-3-opus-20240229-v1:0',
    CLAUDE_3_SONNET: 'anthropic.claude-3-sonnet-20240229-v1:0',
    CLAUDE_3_HAIKU: 'anthropic.claude-3-haiku-20240307-v1:0',
    TITAN_TEXT_EXPRESS: 'amazon.titan-text-express-v1',
    TITAN_TEXT_LITE: 'amazon.titan-text-lite-v1'
} as const;

export interface BedrockConfig {
    region: string;
    modelId: string;
    maxTokens: number;
    temperature: number;
    topP: number;
    stopSequences?: string[];
    timeout?: number;
}

export const DEFAULT_BEDROCK_CONFIG: BedrockConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    modelId: process.env.BEDROCK_MODEL_ID || BEDROCK_MODELS.CLAUDE_3_SONNET,
    maxTokens: parseInt(process.env.BEDROCK_MAX_TOKENS || '4096'),
    temperature: parseFloat(process.env.BEDROCK_TEMPERATURE || '0.7'),
    topP: parseFloat(process.env.BEDROCK_TOP_P || '0.9'),
    stopSequences: [],
    timeout: 120000 // 2 minutes for document generation
};

export const MODEL_CONFIGS: Record<string, Partial<BedrockConfig>> = {
    [BEDROCK_MODELS.CLAUDE_3_SONNET]: {
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.9
    },
    [BEDROCK_MODELS.CLAUDE_3_HAIKU]: {
        maxTokens: 2048,
        temperature: 0.5,
        topP: 0.8
    },
    [BEDROCK_MODELS.TITAN_TEXT_EXPRESS]: {
        maxTokens: 8192,
        temperature: 0.7,
        topP: 0.9
    }
};

export function getModelConfig(modelId?: string): BedrockConfig {
    const model = modelId || DEFAULT_BEDROCK_CONFIG.modelId;
    const modelSpecific = MODEL_CONFIGS[model] || {};
    
    return {
        ...DEFAULT_BEDROCK_CONFIG,
        ...modelSpecific,
        modelId: model
    };
}

export function validateBedrockConfig(config: BedrockConfig): boolean {
    if (!config.region || !config.modelId) return false;
    if (config.maxTokens <= 0) return false;
    if (config.temperature < 0 || config.temperature > 1) return false;
    return true;
}

export function isClaudeModel(modelId: string): boolean {
    return modelId.includes('anthropic.claude') || modelId.includes('claude');
}

export function isTitanModel(modelId: string): boolean {
    return modelId.includes('amazon.titan') || modelId.includes('titan');
}
