/**
 * Color Palette System
 */
export interface ColorPalette {
    primary: ColorSet;
    secondary: ColorSet;
    semantic: SemanticColors;
    neutrals: NeutralColors;
    backgrounds: BackgroundColors;
    gradients?: GradientSet;
}
export interface ColorSet {
    main: string;
    light?: string;
    dark?: string;
    contrast?: string;
}
export interface SemanticColors {
    success: ColorSet;
    warning: ColorSet;
    error: ColorSet;
    info: ColorSet;
}
export interface NeutralColors {
    black: string;
    darkGray: string;
    mediumGray: string;
    lightGray: string;
    white: string;
}
export interface BackgroundColors {
    primary: string;
    secondary: string;
    tertiary: string;
}
export interface GradientSet {
    [key: string]: {
        start: string;
        end: string;
        angle?: number;
    };
}
/**
 * Typography System
 */
export interface TypographySystem {
    fonts: FontFamilies;
    scale: FontScale;
    lineHeights: LineHeights;
    letterSpacing: LetterSpacing;
    fontWeights: FontWeights;
}
export interface FontFamilies {
    primary: string;
    secondary?: string;
    monospace: string;
    fallback: string[];
}
export interface FontScale {
    h1: FontDefinition;
    h2: FontDefinition;
    h3: FontDefinition;
    h4: FontDefinition;
    h5: FontDefinition;
    h6: FontDefinition;
    body: FontDefinition;
    small: FontDefinition;
    tiny: FontDefinition;
}
export interface FontDefinition {
    size: number;
    weight: number;
    lineHeight?: number;
    letterSpacing?: number;
}
export interface LineHeights {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
}
export interface LetterSpacing {
    tight: number;
    normal: number;
    wide: number;
}
export interface FontWeights {
    thin: number;
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    black: number;
}
/**
 * Spacing System
 */
export interface SpacingSystem {
    baseUnit: number;
    scale: SpacingScale;
    component: ComponentSpacing;
}
export interface SpacingScale {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
}
export interface ComponentSpacing {
    padding: SpacingScale;
    margin: SpacingScale;
    gap: SpacingScale;
}
/**
 * Layout System
 */
export interface LayoutSystem {
    grid: GridSystem;
    breakpoints: Breakpoints;
    containers: ContainerWidths;
}
export interface GridSystem {
    columns: number;
    gutter: number;
    margin: number;
}
export interface Breakpoints {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
}
export interface ContainerWidths {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    full: string;
}
/**
 * Border System
 */
export interface BorderSystem {
    radius: BorderRadius;
    width: BorderWidth;
    styles: BorderStyles;
}
export interface BorderRadius {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
}
export interface BorderWidth {
    thin: number;
    medium: number;
    thick: number;
}
export interface BorderStyles {
    solid: string;
    dashed: string;
    dotted: string;
    double: string;
}
/**
 * Shadow System
 */
export interface ShadowSystem {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
}
/**
 * Animation System
 */
export interface AnimationSystem {
    durations: AnimationDurations;
    easings: AnimationEasings;
    transitions: TransitionPresets;
}
export interface AnimationDurations {
    fast: number;
    normal: number;
    slow: number;
}
export interface AnimationEasings {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
}
export interface TransitionPresets {
    fade: string;
    slide: string;
    scale: string;
    all: string;
}
/**
 * Complete Design System
 */
export interface DesignSystem {
    name: string;
    version: string;
    colors: ColorPalette;
    typography: TypographySystem;
    spacing: SpacingSystem;
    layout: LayoutSystem;
    borders: BorderSystem;
    shadows: ShadowSystem;
    animations: AnimationSystem;
    accessibility: AccessibilityStandards;
}
/**
 * Accessibility Standards
 */
export interface AccessibilityStandards {
    contrastRatios: ContrastRatios;
    touchTargets: TouchTargetSizes;
    focusIndicators: FocusIndicators;
    textSizes: TextSizeMinimums;
}
export interface ContrastRatios {
    normalText: number;
    largeText: number;
    uiComponents: number;
    enhanced: number;
}
export interface TouchTargetSizes {
    minimum: number;
    recommended: number;
}
export interface FocusIndicators {
    width: number;
    style: string;
    color: string;
    offset: number;
}
export interface TextSizeMinimums {
    body: number;
    small: number;
    minimum: number;
}
/**
 * Design Validation
 */
export interface DesignValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: ValidationSuggestion[];
    score: number;
}
export interface ValidationError {
    type: ValidationErrorType;
    message: string;
    location?: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    fix?: string;
}
export interface ValidationWarning {
    type: ValidationWarningType;
    message: string;
    location?: string;
    recommendation?: string;
}
export interface ValidationSuggestion {
    type: ValidationSuggestionType;
    message: string;
    benefit?: string;
    effort?: 'low' | 'medium' | 'high';
}
export declare enum ValidationErrorType {
    CONTRAST_TOO_LOW = "contrast_too_low",
    FONT_TOO_SMALL = "font_too_small",
    TOUCH_TARGET_TOO_SMALL = "touch_target_too_small",
    MISSING_ALT_TEXT = "missing_alt_text",
    INVALID_COLOR = "invalid_color",
    BRAND_VIOLATION = "brand_violation",
    LAYOUT_OVERFLOW = "layout_overflow",
    MISSING_REQUIRED = "missing_required"
}
export declare enum ValidationWarningType {
    SUBOPTIMAL_CONTRAST = "suboptimal_contrast",
    LONG_LINE_LENGTH = "long_line_length",
    INCONSISTENT_SPACING = "inconsistent_spacing",
    MIXED_FONTS = "mixed_fonts",
    COLOR_OVERUSE = "color_overuse"
}
export declare enum ValidationSuggestionType {
    IMPROVE_HIERARCHY = "improve_hierarchy",
    ADD_WHITESPACE = "add_whitespace",
    SIMPLIFY_LAYOUT = "simplify_layout",
    ENHANCE_CONTRAST = "enhance_contrast",
    USE_BRAND_COLORS = "use_brand_colors"
}
/**
 * Design Tokens
 */
export interface DesignTokens {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    typography: Record<string, FontDefinition>;
    borders: Record<string, string>;
    shadows: Record<string, string>;
    animations: Record<string, string>;
}
/**
 * Theme Configuration
 */
export interface ThemeConfig {
    name: string;
    extends?: string;
    overrides?: Partial<DesignSystem>;
    customTokens?: Record<string, any>;
}
/**
 * Brand Guidelines
 */
export interface BrandGuidelines {
    name: string;
    logo: LogoGuidelines;
    colors: ColorGuidelines;
    typography: TypographyGuidelines;
    imagery: ImageryGuidelines;
    voice: VoiceGuidelines;
}
export interface LogoGuidelines {
    primary: string;
    secondary?: string;
    minSize: {
        width: number;
        height: number;
    };
    clearSpace: number;
    usage: string[];
    restrictions: string[];
}
export interface ColorGuidelines {
    primary: string[];
    secondary: string[];
    doNot: string[];
    combinations: ColorCombination[];
}
export interface ColorCombination {
    background: string;
    foreground: string;
    usage: string;
}
export interface TypographyGuidelines {
    primary: string;
    secondary?: string;
    usage: Record<string, string>;
    restrictions: string[];
}
export interface ImageryGuidelines {
    style: string;
    subjects: string[];
    avoid: string[];
    filters?: string[];
}
export interface VoiceGuidelines {
    tone: string[];
    language: string[];
    avoid: string[];
    examples: Record<string, string>;
}
/**
 * Amazon Design System (Default)
 */
export declare const AMAZON_DESIGN_SYSTEM: DesignSystem;
/**
 * Re-export types from other modules for convenience
 */
export interface DesignElement {
    id: string;
    type: 'text' | 'image' | 'button' | 'container' | 'other';
    properties: Record<string, any>;
    styles?: Record<string, any>;
    children?: DesignElement[];
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    lineHeight?: number;
    altText?: string;
    interactive?: boolean;
    width?: number;
    height?: number;
    spacing?: number;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings?: string[];
    issues?: ValidationIssue[];
    score?: number;
}
export interface ValidationIssue {
    ruleId: string;
    severity: 'error' | 'warning' | 'info';
    type?: 'error' | 'warning' | 'suggestion';
    category: string;
    message: string;
    location?: string;
    element?: string;
    suggestion?: string;
    autoFixable?: boolean;
}
//# sourceMappingURL=design-system-types.d.ts.map