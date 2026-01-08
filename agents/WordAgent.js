"use strict";
// FENIX Project Manager - Word Agent
// AI-powered Word document generation
// Created: January 5, 2026
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordAgent = void 0;
exports.createWordAgent = createWordAgent;
const docx_1 = require("docx");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const AWSBedrockService_1 = require("../services/AWSBedrockService");
const ContentQualityService_1 = require("../services/ContentQualityService");
const ValidationService_1 = require("../services/ValidationService");
/**
 * Word Agent - Generates Word documents with AI enhancement
 */
class WordAgent {
    theme;
    outputDir;
    qualityService;
    validationService;
    constructor(theme) {
        this.theme = theme || require('../models/word-types').AMAZON_WORD_THEME;
        this.outputDir = process.env.STORAGE_PATH || './output/word';
        this.qualityService = new ContentQualityService_1.ContentQualityService();
        this.validationService = new ValidationService_1.ValidationService();
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    /**
     * Generate Word document
     */
    async generate(options) {
        const startTime = Date.now();
        try {
            const sections = [];
            let totalWordCount = 0;
            // Add table of contents if requested
            if (options.tableOfContents) {
                sections.push(new docx_1.Paragraph({
                    text: 'Table of Contents',
                    heading: docx_1.HeadingLevel.HEADING_1
                }), new docx_1.TableOfContents('Summary', {
                    hyperlink: true,
                    headingStyleRange: '1-3'
                }));
            }
            // Process each section
            for (const section of options.sections) {
                const sectionContent = await this.createSection(section);
                sections.push(...sectionContent);
                // Count words
                totalWordCount += this.countWords(section);
            }
            // Create document
            const doc = new docx_1.Document({
                creator: options.author || 'FENIX Project Manager',
                title: options.title,
                subject: options.subject,
                keywords: options.keywords?.join(', '),
                sections: [{
                        properties: {},
                        headers: options.headers ? {
                            default: new docx_1.Header({
                                children: [new docx_1.Paragraph({
                                        text: options.headers.text || '',
                                        alignment: this.getAlignment(options.headers.alignment)
                                    })]
                            })
                        } : undefined,
                        footers: options.footers ? {
                            default: new docx_1.Footer({
                                children: [new docx_1.Paragraph({
                                        text: options.footers.text || '',
                                        alignment: this.getAlignment(options.footers.alignment)
                                    })]
                            })
                        } : undefined,
                        children: sections
                    }]
            });
            // Generate filename
            const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.docx`;
            const filePath = path.join(this.outputDir, fileName);
            // Write file
            const buffer = await docx_1.Packer.toBuffer(doc);
            fs.writeFileSync(filePath, buffer);
            // Get file size
            const stats = fs.statSync(filePath);
            return {
                success: true,
                filePath,
                fileName,
                fileSize: stats.size,
                sections: options.sections.length,
                wordCount: totalWordCount,
                generationTime: Date.now() - startTime
            };
        }
        catch (error) {
            console.error('Word generation error:', error);
            return {
                success: false,
                filePath: '',
                fileName: '',
                fileSize: 0,
                sections: 0,
                wordCount: 0,
                generationTime: Date.now() - startTime,
                error: error.message
            };
        }
    }
    /**
     * Create section content
     */
    async createSection(section) {
        const elements = [];
        // Add heading
        if (section.heading) {
            const headingLevel = this.getHeadingLevel(section.headingLevel || 1);
            elements.push(new docx_1.Paragraph({
                text: section.heading,
                heading: headingLevel,
                spacing: { before: 240, after: 120 }
            }));
        }
        // Add content
        for (const content of section.content) {
            const contentElements = this.createContent(content);
            elements.push(...contentElements);
        }
        return elements;
    }
    /**
     * Create content element
     */
    createContent(content) {
        switch (content.type) {
            case 'paragraph':
                return [this.createParagraph(content)];
            case 'table':
                return [this.createTable(content)];
            case 'list':
                return this.createList(content);
            case 'quote':
                return [this.createQuote(content)];
            default:
                return [];
        }
    }
    /**
     * Create paragraph
     */
    createParagraph(para) {
        const style = para.style || this.theme.bodyStyle;
        return new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: para.text,
                    font: style.font,
                    size: style.size ? style.size * 2 : 22, // Half-points
                    bold: style.bold,
                    italics: style.italic,
                    underline: style.underline ? {} : undefined,
                    color: style.color?.replace('#', '')
                })
            ],
            alignment: this.getAlignment(para.alignment),
            spacing: para.spacing ? {
                before: para.spacing.before,
                after: para.spacing.after,
                line: para.spacing.line
            } : { before: 120, after: 120 }
        });
    }
    /**
     * Create table
     */
    createTable(table) {
        const rows = [];
        // Add header row
        if (table.headers) {
            rows.push(new docx_1.TableRow({
                children: table.headers.map(header => new docx_1.TableCell({
                    children: [new docx_1.Paragraph({
                            children: [new docx_1.TextRun({
                                    text: header,
                                    bold: true
                                })]
                        })],
                    shading: {
                        fill: this.theme.colorScheme.secondary.replace('#', '')
                    }
                }))
            }));
        }
        // Add data rows
        table.rows.forEach(row => {
            rows.push(new docx_1.TableRow({
                children: row.map(cell => new docx_1.TableCell({
                    children: [new docx_1.Paragraph(cell)]
                }))
            }));
        });
        const tableElement = new docx_1.Table({
            rows,
            width: {
                size: 100,
                type: docx_1.WidthType.PERCENTAGE
            },
            borders: table.style?.borders !== false ? {
                top: { style: docx_1.BorderStyle.SINGLE, size: 1 },
                bottom: { style: docx_1.BorderStyle.SINGLE, size: 1 },
                left: { style: docx_1.BorderStyle.SINGLE, size: 1 },
                right: { style: docx_1.BorderStyle.SINGLE, size: 1 }
            } : undefined
        });
        // Return as paragraph (docx requires wrapping)
        return new docx_1.Paragraph({ children: [tableElement] });
    }
    /**
     * Create list
     */
    createList(list) {
        return list.items.map((item, index) => new docx_1.Paragraph({
            text: list.ordered ? `${index + 1}. ${item}` : `• ${item}`,
            spacing: { before: 60, after: 60 }
        }));
    }
    /**
     * Create quote
     */
    createQuote(quote) {
        const style = quote.style || this.theme.quoteStyle || this.theme.bodyStyle;
        return new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: `"${quote.text}"`,
                    font: style.font,
                    size: style.size ? style.size * 2 : 22,
                    italics: true,
                    color: style.color?.replace('#', '')
                }),
                ...(quote.author ? [
                    new docx_1.TextRun({
                        text: `\n— ${quote.author}`,
                        font: style.font,
                        size: style.size ? style.size * 2 : 22,
                        italics: true
                    })
                ] : [])
            ],
            spacing: { before: 240, after: 240, line: 360 },
            indent: { left: 720 }
        });
    }
    /**
     * Get heading level
     */
    getHeadingLevel(level) {
        const levels = {
            1: docx_1.HeadingLevel.HEADING_1,
            2: docx_1.HeadingLevel.HEADING_2,
            3: docx_1.HeadingLevel.HEADING_3,
            4: docx_1.HeadingLevel.HEADING_4,
            5: docx_1.HeadingLevel.HEADING_5,
            6: docx_1.HeadingLevel.HEADING_6
        };
        return levels[level] || docx_1.HeadingLevel.HEADING_1;
    }
    /**
     * Get alignment
     */
    getAlignment(alignment) {
        const alignments = {
            left: docx_1.AlignmentType.LEFT,
            center: docx_1.AlignmentType.CENTER,
            right: docx_1.AlignmentType.RIGHT,
            justify: docx_1.AlignmentType.JUSTIFIED
        };
        return alignments[alignment || 'left'] || docx_1.AlignmentType.LEFT;
    }
    /**
     * Count words in section
     */
    countWords(section) {
        let count = 0;
        if (section.heading) {
            count += section.heading.split(/\s+/).length;
        }
        section.content.forEach(content => {
            if (content.type === 'paragraph') {
                count += content.text.split(/\s+/).length;
            }
            else if (content.type === 'list') {
                content.items.forEach(item => {
                    count += item.split(/\s+/).length;
                });
            }
            else if (content.type === 'quote') {
                count += content.text.split(/\s+/).length;
            }
        });
        return count;
    }
    /**
     * Generate from template using the comprehensive template system
     */
    async generateFromTemplate(templateId, title, data) {
        console.log(`📝 Generating Word document from template: ${templateId}`);
        try {
            // Import the template system
            const { getWordTemplate } = await Promise.resolve().then(() => __importStar(require('../templates/word-templates')));
            const { WordTemplateType } = await Promise.resolve().then(() => __importStar(require('../models/word-types')));
            // Get the template
            const templateOptions = getWordTemplate(templateId, {
                ...data,
                title: title
            });
            console.log(`   Template loaded: ${templateOptions.sections.length} sections`);
            // Generate using the template
            return this.generate(templateOptions);
        }
        catch (error) {
            console.error(`Failed to load Word template ${templateId}:`, error);
            // Fallback to basic generation
            const options = {
                title,
                author: data.author || 'FENIX Project Manager',
                subject: data.subject || title,
                keywords: data.keywords || [],
                sections: data.sections || [
                    {
                        heading: title,
                        content: [{
                                type: 'paragraph',
                                text: data.description || 'Generated document content.'
                            }]
                    }
                ],
                tableOfContents: data.tableOfContents || false
            };
            return this.generate(options);
        }
    }
    /**
     * Save document to file
     */
    async save(filePath) {
        // This method is called after generate() which already saves the file
        // For now, this is a no-op as the file is saved in generate()
        console.log(`Document would be saved to: ${filePath}`);
    }
    /**
     * AI-powered content generation
     */
    async generateContent(prompt, tone, length) {
        const bedrock = (0, AWSBedrockService_1.getBedrockService)();
        const fullPrompt = `Generate professional document content for: ${prompt}

Tone: ${tone || 'formal'}
Length: ${length || 'standard'}

Provide well-structured, clear content suitable for a business document.`;
        const response = await bedrock.invoke({
            prompt: fullPrompt,
            maxTokens: 2000,
            temperature: 0.7
        });
        return response.completion;
    }
    /**
     * AI-powered outline generation
     */
    async generateOutline(topic, sections) {
        const bedrock = (0, AWSBedrockService_1.getBedrockService)();
        const prompt = `Create a document outline for: ${topic}

Generate ${sections || 5} main section headings.
Format: One heading per line, no numbering.`;
        const response = await bedrock.invoke({
            prompt,
            maxTokens: 500,
            temperature: 0.6
        });
        return response.completion.split('\n').filter(line => line.trim());
    }
    /**
     * AI-powered grammar and style checking
     */
    async checkGrammar(text) {
        const bedrock = (0, AWSBedrockService_1.getBedrockService)();
        const prompt = `Review this text for grammar, style, and clarity issues:

"${text}"

List any issues found, one per line.`;
        const response = await bedrock.invoke({
            prompt,
            maxTokens: 800,
            temperature: 0.3
        });
        return response.completion.split('\n').filter(line => line.trim());
    }
    /**
     * AI-powered summarization
     */
    async summarize(text, maxLength) {
        const bedrock = (0, AWSBedrockService_1.getBedrockService)();
        const prompt = `Summarize this text in ${maxLength || 100} words or less:

"${text}"

Provide a clear, concise summary.`;
        const response = await bedrock.invoke({
            prompt,
            maxTokens: maxLength ? maxLength * 2 : 200,
            temperature: 0.5
        });
        return response.completion;
    }
    /**
     * Generate document (orchestrator compatibility method)
     * Wrapper around generate() for AgentOrchestrator
     */
    async generateDocument(inputs) {
        // Convert inputs to WordDocumentOptions format
        const options = {
            title: inputs.title || 'Document',
            author: inputs.author,
            subject: inputs.subject,
            sections: inputs.sections || [],
            theme: inputs.theme
        };
        const result = await this.generate(options);
        return {
            filePath: result.filePath,
            fileName: result.fileName,
            sectionCount: result.sections,
            success: result.success,
            error: result.error
        };
    }
}
exports.WordAgent = WordAgent;
/**
 * Create Word agent instance
 */
function createWordAgent(theme) {
    return new WordAgent(theme);
}
//# sourceMappingURL=WordAgent.js.map