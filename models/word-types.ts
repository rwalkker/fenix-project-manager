// FENIX Project Manager - Word Types
// Type definitions for Word document generation
// Created: January 5, 2026

import type { ColorScheme } from './document-types';

export interface WordDocumentOptions {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  theme?: WordTheme;
  sections: WordSectionDefinition[];
  tableOfContents?: boolean;
  pageNumbers?: boolean;
  headers?: WordHeaderFooter;
  footers?: WordHeaderFooter;
}

export interface WordSectionDefinition {
  heading?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  content: WordContent[];
  pageBreakBefore?: boolean;
}

export type WordContent = 
  | WordParagraph
  | WordTable
  | WordImage
  | WordList
  | WordQuote
  | WordCodeBlock;

export interface WordParagraph {
  type: 'paragraph';
  text: string;
  style?: WordTextStyle;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  spacing?: { before?: number; after?: number; line?: number };
}

export interface WordTable {
  type: 'table';
  rows: string[][];
  headers?: string[];
  style?: WordTableStyle;
  columnWidths?: number[];
}

export interface WordImage {
  type: 'image';
  path: string;
  width?: number;
  height?: number;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface WordList {
  type: 'list';
  items: string[];
  ordered?: boolean;
  style?: WordTextStyle;
}

export interface WordQuote {
  type: 'quote';
  text: string;
  author?: string;
  style?: WordTextStyle;
}

export interface WordCodeBlock {
  type: 'code';
  code: string;
  language?: string;
}

export interface WordTextStyle {
  font?: string;
  size?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  highlight?: string;
}

export interface WordTableStyle {
  headerStyle?: WordTextStyle;
  cellStyle?: WordTextStyle;
  borders?: boolean;
  alternateRows?: boolean;
  headerRow?: boolean;
}

export interface WordHeaderFooter {
  text?: string;
  alignment?: 'left' | 'center' | 'right';
  includePageNumber?: boolean;
}

export interface WordTheme {
  name: string;
  colorScheme: ColorScheme;
  fonts: {
    heading: string;
    body: string;
    code?: string;
  };
  headingStyles: Record<number, WordTextStyle>;
  bodyStyle: WordTextStyle;
  quoteStyle?: WordTextStyle;
  codeStyle?: WordTextStyle;
}

export interface WordGenerationResult {
  success: boolean;
  filePath: string;
  fileName: string;
  fileSize: number;
  sections: number;
  wordCount: number;
  generationTime: number;
  error?: string;
}

// Pre-defined Amazon theme for Word
export const AMAZON_WORD_THEME: WordTheme = {
  name: 'Amazon',
  colorScheme: {
    primary: '#FF9900',
    secondary: '#232F3E',
    accent: '#146EB4',
    background: '#FFFFFF',
    text: '#000000',
    success: '#067D62',
    warning: '#F0B323',
    error: '#D13212'
  },
  fonts: {
    heading: 'Amazon Ember',
    body: 'Amazon Ember',
    code: 'Courier New'
  },
  headingStyles: {
    1: {
      font: 'Amazon Ember',
      size: 28,
      bold: true,
      color: '#232F3E'
    },
    2: {
      font: 'Amazon Ember',
      size: 22,
      bold: true,
      color: '#232F3E'
    },
    3: {
      font: 'Amazon Ember',
      size: 18,
      bold: true,
      color: '#146EB4'
    },
    4: {
      font: 'Amazon Ember',
      size: 14,
      bold: true,
      color: '#146EB4'
    },
    5: {
      font: 'Amazon Ember',
      size: 12,
      bold: true,
      color: '#000000'
    },
    6: {
      font: 'Amazon Ember',
      size: 11,
      bold: true,
      italic: true,
      color: '#000000'
    }
  },
  bodyStyle: {
    font: 'Amazon Ember',
    size: 11,
    color: '#000000'
  },
  quoteStyle: {
    font: 'Amazon Ember',
    size: 11,
    italic: true,
    color: '#666666'
  },
  codeStyle: {
    font: 'Courier New',
    size: 10,
    color: '#000000',
    highlight: '#F5F5F5'
  }
};

// Document templates enum
export enum WordTemplateType {
  WHITE_PAPER = 'white-paper',
  CHANGE_MANAGEMENT = 'change-management',
  PROJECT_CHARTER = 'project-charter',
  SOP = 'sop',
  MEETING_MINUTES = 'meeting-minutes',
  EXECUTIVE_SUMMARY = 'executive-summary',
  TECHNICAL_SPEC = 'technical-spec',
  TRAINING_MANUAL = 'training-manual'
}
