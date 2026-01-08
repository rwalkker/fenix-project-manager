export declare const BEDROCK_MODELS: {
    readonly CLAUDE_3_OPUS: "anthropic.claude-3-opus-20240229-v1:0";
    readonly CLAUDE_3_SONNET: "anthropic.claude-3-sonnet-20240229-v1:0";
    readonly CLAUDE_3_HAIKU: "anthropic.claude-3-haiku-20240307-v1:0";
    readonly TITAN_TEXT_EXPRESS: "amazon.titan-text-express-v1";
    readonly TITAN_TEXT_LITE: "amazon.titan-text-lite-v1";
};
export interface BedrockConfig {
    region: string;
    modelId: string;
    maxTokens: number;
    temperature: number;
    topP: number;
    stopSequences?: string[];
    timeout?: number;
}
export declare const DEFAULT_BEDROCK_CONFIG: BedrockConfig;
export declare const MODEL_CONFIGS: Record<string, Partial<BedrockConfig>>;
export declare function getModelConfig(modelId?: string): BedrockConfig;
export declare function validateBedrockConfig(config: BedrockConfig): boolean;
export declare function isClaudeModel(modelId: string): boolean;
export declare function isTitanModel(modelId: string): boolean;
//# sourceMappingURL=bedrock-config.d.ts.map