// FENIX Project Manager - Design System Types
// Comprehensive type definitions for unified design system
// Created: January 6, 2026

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
  size: number;        // in pixels
  weight: number;      // 100-900
  lineHeight?: number; // multiplier
  letterSpacing?: number; // in em
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
  normalText: number;      // WCAG AA: 4.5:1
  largeText: number;       // WCAG AA: 3:1
  uiComponents: number;    // WCAG AA: 3:1
  enhanced: number;        // WCAG AAA: 7:1
}

export interface TouchTargetSizes {
  minimum: number;         // 44x44px
  recommended: number;     // 48x48px
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
  score: number; // 0-100
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

export enum ValidationErrorType {
  CONTRAST_TOO_LOW = 'contrast_too_low',
  FONT_TOO_SMALL = 'font_too_small',
  TOUCH_TARGET_TOO_SMALL = 'touch_target_too_small',
  MISSING_ALT_TEXT = 'missing_alt_text',
  INVALID_COLOR = 'invalid_color',
  BRAND_VIOLATION = 'brand_violation',
  LAYOUT_OVERFLOW = 'layout_overflow',
  MISSING_REQUIRED = 'missing_required'
}

export enum ValidationWarningType {
  SUBOPTIMAL_CONTRAST = 'suboptimal_contrast',
  LONG_LINE_LENGTH = 'long_line_length',
  INCONSISTENT_SPACING = 'inconsistent_spacing',
  MIXED_FONTS = 'mixed_fonts',
  COLOR_OVERUSE = 'color_overuse'
}

export enum ValidationSuggestionType {
  IMPROVE_HIERARCHY = 'improve_hierarchy',
  ADD_WHITESPACE = 'add_whitespace',
  SIMPLIFY_LAYOUT = 'simplify_layout',
  ENHANCE_CONTRAST = 'enhance_contrast',
  USE_BRAND_COLORS = 'use_brand_colors'
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
  minSize: { width: number; height: number };
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
export const AMAZON_DESIGN_SYSTEM: DesignSystem = {
  name: 'Amazon',
  version: '1.0.0',
  colors: {
    primary: {
      main: '#FF9900',
      light: '#FFB84D',
      dark: '#CC7A00',
      contrast: '#FFFFFF'
    },
    secondary: {
      main: '#232F3E',
      light: '#37475A',
      dark: '#0F1419',
      contrast: '#FFFFFF'
    },
    semantic: {
      success: {
        main: '#067D62',
        light: '#0A9F7D',
        dark: '#045A46',
        contrast: '#FFFFFF'
      },
      warning: {
        main: '#F0B323',
        light: '#F3C556',
        dark: '#C08F1C',
        contrast: '#000000'
      },
      error: {
        main: '#D13212',
        light: '#E04A2A',
        dark: '#A6280E',
        contrast: '#FFFFFF'
      },
      info: {
        main: '#0073BB',
        light: '#338FCC',
        dark: '#005A95',
        contrast: '#FFFFFF'
      }
    },
    neutrals: {
      black: '#000000',
      darkGray: '#333333',
      mediumGray: '#666666',
      lightGray: '#CCCCCC',
      white: '#FFFFFF'
    },
    backgrounds: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#EAEDED'
    }
  },
  typography: {
    fonts: {
      primary: 'Amazon Ember',
      monospace: 'Courier New',
      fallback: ['Arial', 'Helvetica', 'sans-serif']
    },
    scale: {
      h1: { size: 32, weight: 700, lineHeight: 1.2 },
      h2: { size: 24, weight: 700, lineHeight: 1.3 },
      h3: { size: 20, weight: 700, lineHeight: 1.4 },
      h4: { size: 18, weight: 700, lineHeight: 1.4 },
      h5: { size: 16, weight: 700, lineHeight: 1.5 },
      h6: { size: 14, weight: 700, lineHeight: 1.5 },
      body: { size: 14, weight: 400, lineHeight: 1.5 },
      small: { size: 12, weight: 400, lineHeight: 1.5 },
      tiny: { size: 10, weight: 400, lineHeight: 1.5 }
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2.0
    },
    letterSpacing: {
      tight: -0.02,
      normal: 0,
      wide: 0.05
    },
    fontWeights: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900
    }
  },
  spacing: {
    baseUnit: 4,
    scale: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64
    },
    component: {
      padding: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64
      },
      margin: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64
      },
      gap: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64
      }
    }
  },
  layout: {
    grid: {
      columns: 12,
      gutter: 16,
      margin: 16
    },
    breakpoints: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    containers: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
      full: '100%'
    }
  },
  borders: {
    radius: {
      none: 0,
      sm: 2,
      md: 4,
      lg: 8,
      xl: 16,
      full: 9999
    },
    width: {
      thin: 1,
      medium: 2,
      thick: 4
    },
    styles: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },
  animations: {
    durations: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easings: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    transitions: {
      fade: 'opacity 300ms ease-in-out',
      slide: 'transform 300ms ease-in-out',
      scale: 'transform 300ms ease-in-out',
      all: 'all 300ms ease-in-out'
    }
  },
  accessibility: {
    contrastRatios: {
      normalText: 4.5,
      largeText: 3.0,
      uiComponents: 3.0,
      enhanced: 7.0
    },
    touchTargets: {
      minimum: 44,
      recommended: 48
    },
    focusIndicators: {
      width: 2,
      style: 'solid',
      color: '#0073BB',
      offset: 2
    },
    textSizes: {
      body: 14,
      small: 12,
      minimum: 10
    }
  }
};

/**
 * Re-export types from other modules for convenience
 */

// Design Element (from DesignSystemService)
export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'other';
  properties: Record<string, any>;
  styles?: Record<string, any>;
  children?: DesignElement[];
  // Common properties for validation
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

// Validation Result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  issues?: ValidationIssue[];  // Detailed issues
  score?: number;  // Overall score (0-100)
}

// Validation Issue
export interface ValidationIssue {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  type?: 'error' | 'warning' | 'suggestion';  // Alias for severity
  category: string;
  message: string;
  location?: string;
  element?: string;  // Alias for location
  suggestion?: string;
  autoFixable?: boolean;
}
