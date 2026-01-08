// FENIX Project Manager - PowerPoint Types
// Type definitions for PowerPoint presentation generation
// Created: January 6, 2026

// DesignSystem type available if needed in future
// import type { DesignSystem } from './design-system-types';

/**
 * PowerPoint Presentation Options
 */
export interface PowerPointOptions {
  title: string;
  author?: string;
  subject?: string;
  company?: string;
  theme?: PowerPointTheme;
  slides: SlideDefinition[];
  masterSlide?: MasterSlideConfig;
  transitions?: TransitionConfig;
  animations?: AnimationConfig;
  attachedFiles?: AttachedFile[];
}

/**
 * Attached File Information
 */
export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  analysis: string;
}

/**
 * Slide Definition
 */
export interface SlideDefinition {
  type: SlideType;
  title?: string;
  subtitle?: string;
  content?: SlideContent[];
  layout?: SlideLayout;
  background?: BackgroundConfig;
  notes?: string;
  transition?: string;
  hidden?: boolean;
  metadata?: any; // For AI-generated enhancements and suggestions
}

export type SlideType =
  | 'title'
  | 'section'
  | 'content'
  | 'two-column'
  | 'comparison'
  | 'image'
  | 'chart'
  | 'table'
  | 'quote'
  | 'agenda'
  | 'thank-you'
  | 'blank';

export type SlideContent =
  | TextContent
  | BulletListContent
  | ImageContent
  | ChartContent
  | TableContent
  | ShapeContent
  | QuoteContent;

/**
 * Content Types
 */
export interface TextContent {
  type: 'text';
  text: string;
  position?: Position;
  style?: TextStyle;
  alignment?: Alignment;
}

export interface BulletListContent {
  type: 'bullets';
  items: BulletItem[];
  position?: Position;
  style?: BulletStyle;
  level?: number;
}

export interface BulletItem {
  text: string;
  level?: number;
  subitems?: BulletItem[];
}

export interface ImageContent {
  type: 'image';
  path: string;
  position?: Position;
  size?: Size;
  caption?: string;
  altText?: string;
  hyperlink?: string;
}

export interface ChartContent {
  type: 'chart';
  chartType: ChartType;
  data: ChartData;
  position?: Position;
  size?: Size;
  title?: string;
  options?: ChartOptions;
}

export interface TableContent {
  type: 'table';
  headers: string[];
  rows: string[][];
  position?: Position;
  style?: TableStyle;
  columnWidths?: number[];
}

export interface ShapeContent {
  type: 'shape';
  shape: ShapeType;
  position: Position;
  size: Size;
  fill?: string;
  border?: BorderStyle;
  text?: string;
}

export interface QuoteContent {
  type: 'quote';
  text: string;
  author?: string;
  position?: Position;
  style?: TextStyle;
}

/**
 * Chart Types and Data
 */
export type ChartType =
  | 'bar'
  | 'column'
  | 'line'
  | 'pie'
  | 'doughnut'
  | 'area'
  | 'scatter'
  | 'bubble';

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  name: string;
  values: number[];
  color?: string;
}

export interface ChartOptions {
  showLegend?: boolean;
  showDataLabels?: boolean;
  showGridlines?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  colors?: string[];
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

/**
 * Styling
 */
export interface TextStyle {
  font?: string;
  size?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: Alignment;
  valign?: VerticalAlignment;
}

export interface BulletStyle {
  type?: 'bullet' | 'number' | 'none';
  color?: string;
  size?: number;
  indent?: number;
}

export interface TableStyle {
  headerStyle?: TextStyle;
  cellStyle?: TextStyle;
  headerBackground?: string;
  alternateRows?: boolean;
  alternateRowColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface BorderStyle {
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
}

/**
 * Layout and Positioning
 */
export interface Position {
  x: number | string; // pixels or percentage
  y: number | string;
}

export interface Size {
  width: number | string;
  height: number | string;
}

export interface SlideLayout {
  type: 'standard' | 'wide' | 'custom';
  contentArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type Alignment = 'left' | 'center' | 'right' | 'justify';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export type ShapeType =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'triangle'
  | 'arrow'
  | 'line';

/**
 * Background Configuration
 */
export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image';
  color?: string;
  gradient?: GradientConfig;
  image?: string;
  opacity?: number;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;
}

/**
 * Master Slide Configuration
 */
export interface MasterSlideConfig {
  background?: BackgroundConfig;
  logo?: {
    path: string;
    position: Position;
    size: Size;
  };
  footer?: {
    text: string;
    position?: Position;
    style?: TextStyle;
  };
  slideNumber?: {
    show: boolean;
    position?: Position;
    style?: TextStyle;
  };
}

/**
 * Transitions and Animations
 */
export interface TransitionConfig {
  default?: string;
  duration?: number;
  perSlide?: Record<number, string>;
}

export interface AnimationConfig {
  enabled: boolean;
  defaultEffect?: string;
  duration?: number;
}

/**
 * PowerPoint Theme
 */
export interface PowerPointTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    title: string;
    body: string;
  };
  masterSlide?: MasterSlideConfig;
}

/**
 * Generation Result
 */
export interface PowerPointGenerationResult {
  success: boolean;
  filePath: string;
  fileName: string;
  fileSize: number;
  slideCount: number;
  generationTime: number;
  error?: string;
  warnings?: string[];
}

/**
 * Template Types
 */
export type PowerPointTemplateType =
  | 'project-status'
  | 'executive-presentation'
  | 'training-deck'
  | 'change-management'
  | 'technical-review'
  | 'quarterly-review';

/**
 * Amazon PowerPoint Theme
 */
export const AMAZON_POWERPOINT_THEME: PowerPointTheme = {
  name: 'Amazon',
  colors: {
    primary: '#FF9900',
    secondary: '#232F3E',
    accent: '#146EB4',
    background: '#FFFFFF',
    text: '#000000'
  },
  fonts: {
    title: 'Amazon Ember',
    body: 'Amazon Ember'
  },
  masterSlide: {
    background: {
      type: 'solid',
      color: '#FFFFFF'
    },
    footer: {
      text: 'Amazon Confidential',
      position: { x: '5%', y: '95%' },
      style: {
        font: 'Amazon Ember',
        size: 10,
        color: '#666666'
      }
    },
    slideNumber: {
      show: true,
      position: { x: '95%', y: '95%' },
      style: {
        font: 'Amazon Ember',
        size: 10,
        color: '#666666'
      }
    }
  }
};

/**
 * Slide Templates
 */
export interface SlideTemplate {
  type: SlideType;
  name: string;
  description: string;
  defaultLayout: SlideLayout;
  contentPlaceholders: ContentPlaceholder[];
}

export interface ContentPlaceholder {
  type: string;
  position: Position;
  size: Size;
  label: string;
}

/**
 * Presentation Metadata
 */
export interface PresentationMetadata {
  title: string;
  author: string;
  subject?: string;
  keywords?: string[];
  company?: string;
  created: Date;
  modified: Date;
  slideCount: number;
  version?: string;
}

/**
 * AI Enhancement Options
 */
export interface AIEnhancementOptions {
  generateContent?: boolean;
  optimizeLayout?: boolean;
  suggestVisuals?: boolean;
  checkAccessibility?: boolean;
  improveReadability?: boolean;
}

/**
 * Validation Result
 */
export interface PresentationValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  accessibilityScore: number;
  readabilityScore: number;
}

export interface ValidationError {
  slide: number;
  type: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ValidationWarning {
  slide: number;
  type: string;
  message: string;
  recommendation?: string;
}
