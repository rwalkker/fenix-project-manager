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
export type WordContent = WordParagraph | WordTable | WordImage | WordList | WordQuote | WordCodeBlock;
export interface WordParagraph {
    type: 'paragraph';
    text: string;
    style?: WordTextStyle;
    alignment?: 'left' | 'center' | 'right' | 'justify';
    spacing?: {
        before?: number;
        after?: number;
        line?: number;
    };
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
export declare const AMAZON_WORD_THEME: WordTheme;
export declare enum WordTemplateType {
    WHITE_PAPER = "white-paper",
    CHANGE_MANAGEMENT = "change-management",
    PROJECT_CHARTER = "project-charter",
    SOP = "sop",
    MEETING_MINUTES = "meeting-minutes",
    EXECUTIVE_SUMMARY = "executive-summary",
    TECHNICAL_SPEC = "technical-spec",
    TRAINING_MANUAL = "training-manual"
}
//# sourceMappingURL=word-types.d.ts.map