"use strict";
// FENIX Project Manager - AWS Bedrock Configuration
// AI model configuration for document generation
// Created: January 5, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_CONFIGS = exports.DEFAULT_BEDROCK_CONFIG = exports.BEDROCK_MODELS = void 0;
exports.getModelConfig = getModelConfig;
exports.validateBedrockConfig = validateBedrockConfig;
exports.isClaudeModel = isClaudeModel;
exports.isTitanModel = isTitanModel;
exports.BEDROCK_MODELS = {
    CLAUDE_3_OPUS: 'anthropic.claude-3-opus-20240229-v1:0',
    CLAUDE_3_SONNET: 'anthropic.claude-3-sonnet-20240229-v1:0',
    CLAUDE_3_HAIKU: 'anthropic.claude-3-haiku-20240307-v1:0',
    TITAN_TEXT_EXPRESS: 'amazon.titan-text-express-v1',
    TITAN_TEXT_LITE: 'amazon.titan-text-lite-v1'
};
exports.DEFAULT_BEDROCK_CONFIG = {
    region: process.env.AWS_REGION || 'us-east-1',
    modelId: process.env.BEDROCK_MODEL_ID || exports.BEDROCK_MODELS.CLAUDE_3_SONNET,
    maxTokens: parseInt(process.env.BEDROCK_MAX_TOKENS || '4096'),
    temperature: parseFloat(process.env.BEDROCK_TEMPERATURE || '0.7'),
    topP: parseFloat(process.env.BEDROCK_TOP_P || '0.9'),
    stopSequences: [],
    timeout: 120000 // 2 minutes for document generation
};
exports.MODEL_CONFIGS = {
    [exports.BEDROCK_MODELS.CLAUDE_3_SONNET]: {
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.9
    },
    [exports.BEDROCK_MODELS.CLAUDE_3_HAIKU]: {
        maxTokens: 2048,
        temperature: 0.5,
        topP: 0.8
    },
    [exports.BEDROCK_MODELS.TITAN_TEXT_EXPRESS]: {
        maxTokens: 8192,
        temperature: 0.7,
        topP: 0.9
    }
};
function getModelConfig(modelId) {
    const model = modelId || exports.DEFAULT_BEDROCK_CONFIG.modelId;
    const modelSpecific = exports.MODEL_CONFIGS[model] || {};
    return {
        ...exports.DEFAULT_BEDROCK_CONFIG,
        ...modelSpecific,
        modelId: model
    };
}
function validateBedrockConfig(config) {
    if (!config.region || !config.modelId)
        return false;
    if (config.maxTokens <= 0)
        return false;
    if (config.temperature < 0 || config.temperature > 1)
        return false;
    return true;
}
function isClaudeModel(modelId) {
    return modelId.includes('anthropic.claude') || modelId.includes('claude');
}
function isTitanModel(modelId) {
    return modelId.includes('amazon.titan') || modelId.includes('titan');
}
//# sourceMappingURL=bedrock-config.js.map