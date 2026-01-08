"use strict";
// FENIX Project Manager - Generate Controller
// Business logic for document generation with persistent storage
// Updated: January 7, 2026 - Integrated DocumentStorageService
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateController = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fsPromises = __importStar(require("fs/promises"));
const error_handler_1 = require("../middleware/error-handler");
const server_1 = require("../server");
const AWSBedrockService_1 = require("../../services/AWSBedrockService");
const DocumentStorageService_1 = require("../../services/DocumentStorageService");
// Import agents
const PowerPointAgent_1 = require("../../agents/PowerPointAgent");
const ExcelAgent_1 = require("../../agents/ExcelAgent");
const WordAgent_1 = require("../../agents/WordAgent");
const AgentOrchestrator_1 = require("../../services/AgentOrchestrator");
/**
 * Generate Controller
 * Handles document generation requests with persistent storage
 */
class GenerateController {
    storageService = (0, DocumentStorageService_1.getDocumentStorageService)();
    constructor() {
        // Initialize storage service
        this.initializeStorage();
    }
    /**
     * Initialize storage service
     */
    async initializeStorage() {
        try {
            await this.storageService.initialize();
            console.log('[GenerateController] Storage service initialized');
        }
        catch (error) {
            console.error('[GenerateController] Failed to initialize storage:', error);
        }
    }
    /**
     * Generate PowerPoint presentation
     */
    async generatePowerPoint(req, res) {
        let { title, description, template, content, options, themePreferences, attachedFiles } = req.body;
        // Get authenticated user
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        // Log attached files if present
        if (attachedFiles && attachedFiles.length > 0) {
            console.log(`[PowerPoint] Processing ${attachedFiles.length} attached files:`, attachedFiles.map((f) => f.name).join(', '));
        }
        // Handle natural language content - pass to AI for intelligent generation
        if (content?.naturalLanguage && content?.useAI) {
            console.log('[AI] Will use Bedrock to generate intelligent slides from natural language');
            // Don't parse here - let the AI generation logic handle it
            // Just pass the text as content
            content = {
                text: content.naturalLanguage
            };
        }
        // Create document in storage service
        const jobId = await this.storageService.createDocument('powerpoint', title, user.userId, user.username, user.role, description);
        // Return job ID immediately
        res.json({
            success: true,
            data: {
                id: jobId,
                type: 'powerpoint',
                title,
                description,
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                metadata: {
                    dynamicTheming: true,
                    themePreferences: themePreferences || null
                },
                owner: {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
            },
            message: 'PowerPoint generation with dynamic theming started',
        });
        // Start generation asynchronously with theme preferences and attached files
        this.generatePowerPointAsync(jobId, title, template, content, options, themePreferences, attachedFiles);
    }
    /**
     * Generate PowerPoint asynchronously with Agent Orchestration and Dynamic Theming
     */
    async generatePowerPointAsync(jobId, title, template, content, options, themePreferences, attachedFiles) {
        const ws = (0, server_1.getWebSocketService)();
        try {
            // Update status in storage
            await this.storageService.updateDocument(jobId, {
                status: 'in-progress',
                progress: 10
            });
            ws?.emitProgress(jobId, 10, 'Initializing', 'Starting AI-powered presentation with dynamic theming');
            ws?.emitStatus(jobId, 'in-progress');
            // Create Agent Orchestrator for multi-agent collaboration
            const orchestrator = new AgentOrchestrator_1.AgentOrchestrator();
            await this.storageService.updateDocument(jobId, { progress: 20 });
            ws?.emitProgress(jobId, 20, 'Planning', 'Orchestrating AI agents for enhanced content and dynamic theming');
            // Generate based on template or content with dynamic theming
            let result;
            if (template) {
                // Use template-based generation with orchestration and dynamic theming
                result = await this.generateWithTemplateAndDynamicTheming(orchestrator, template, title, content || {}, themePreferences, jobId, ws);
            }
            else if (content?.slides && content.slides.length > 0) {
                // User provided explicit slides - enhance with visual design and dynamic theming
                result = await this.generateWithExplicitSlidesAndDynamicTheming(orchestrator, title, content.slides, themePreferences, jobId, ws);
            }
            else {
                // Full AI generation with multi-agent orchestration and dynamic theming
                result = await this.generateWithFullAIOrchestrationAndDynamicTheming(orchestrator, title, content, options, themePreferences, jobId, ws, attachedFiles);
            }
            // Store the generated file
            const storedPath = await this.storageService.storeFile(jobId, result.filePath, result.fileName);
            await this.storageService.updateDocument(jobId, {
                progress: 100,
                status: 'complete'
            });
            ws?.emitProgress(jobId, 100, 'Complete', 'AI-enhanced PowerPoint with dynamic theming generated successfully');
            ws?.emitStatus(jobId, 'complete', {
                filename: result.fileName,
                downloadUrl: `/api/v1/generate/download/${jobId}`,
            });
            ws?.emitWorkflowNotification(jobId, 'success', 'AI-enhanced PowerPoint with creative dynamic theming generated successfully!');
        }
        catch (error) {
            await this.storageService.updateDocument(jobId, {
                status: 'failed',
                error: error.message
            });
            ws?.emitStatus(jobId, 'failed', undefined, error.message);
            ws?.emitWorkflowNotification(jobId, 'error', 'PowerPoint generation failed: ' + error.message);
            console.error('PowerPoint generation failed:', error);
        }
    }
    /**
     * Generate PowerPoint with full AI orchestration and dynamic theming (multi-agent collaboration)
     */
    async generateWithFullAIOrchestrationAndDynamicTheming(orchestrator, title, content, options, themePreferences, jobId, ws, attachedFiles) {
        const slideCount = options?.slideCount || 10;
        const contentText = content?.text || '';
        console.log(`[AI Orchestration + Dynamic Theming] Generating ${slideCount} slides with multi-agent collaboration and creative theming`);
        // Step 1: Generate slide topics using PowerPoint Agent
        ws?.emitProgress(jobId, 30, 'AI Planning', 'Generating intelligent slide topics');
        const topics = await this.generateSlideTopics(title, contentText, slideCount - 1);
        console.log(`[AI Orchestration] Generated topics:`, topics);
        // Step 2: Create workflow for multi-agent content generation with dynamic theming
        const workflow = {
            id: `powerpoint-${jobId}`,
            name: 'AI-Enhanced PowerPoint Generation with Dynamic Theming',
            description: 'Multi-agent collaboration for professional presentation with creative theming',
            steps: [
                {
                    id: 'content-generation',
                    name: 'Generate Slide Content',
                    agent: 'powerpoint',
                    task: 'generate-slide-content',
                    inputs: { topics, title, contentText },
                    status: 'pending',
                    dependencies: [] // No dependencies for first step
                },
                {
                    id: 'dynamic-theming',
                    name: 'Generate Dynamic Theme',
                    agent: 'powerpoint',
                    task: 'generate-dynamic-theme',
                    inputs: { title, topics, contentText, themePreferences },
                    status: 'pending',
                    dependencies: ['content-generation']
                },
                {
                    id: 'visual-enhancement',
                    name: 'Enhance Visual Design',
                    agent: 'visual-design',
                    task: 'enhance-presentation-visuals',
                    inputs: { title, topics, slideCount },
                    status: 'pending',
                    dependencies: ['content-generation', 'dynamic-theming']
                }
            ],
            dependencies: [
                {
                    fromStep: 'content-generation',
                    toStep: 'dynamic-theming',
                    dataMapping: { 'slides': 'inputSlides' }
                },
                {
                    fromStep: 'dynamic-theming',
                    toStep: 'visual-enhancement',
                    dataMapping: { 'theme': 'dynamicTheme' }
                }
            ],
            status: 'pending',
            createdAt: new Date()
        };
        // Step 3: Execute orchestrated workflow
        ws?.emitProgress(jobId, 40, 'AI Collaboration', 'Coordinating PowerPoint, Theming, and Visual Design agents');
        try {
            const workflowResult = await orchestrator.executeWorkflow(workflow);
            console.log(`[AI Orchestration] Workflow completed:`, workflowResult.status);
        }
        catch (orchestrationError) {
            console.warn(`[AI Orchestration] Workflow failed, falling back to single agent with dynamic theming:`, orchestrationError);
        }
        // Step 4: Generate enhanced slides with AI content and dynamic theming
        ws?.emitProgress(jobId, 50, 'Dynamic Theming', 'Creating AI-powered creative theme');
        const agent = new PowerPointAgent_1.PowerPointAgent();
        // Apply theme preferences if provided
        if (themePreferences) {
            console.log(`[Dynamic Theming] Applying user preferences:`, themePreferences);
        }
        const slides = [
            {
                type: 'title',
                title: title,
                subtitle: 'AI-Generated Presentation with Dynamic Theming'
            }
        ];
        // Generate content for each topic with enhanced AI prompts
        for (let i = 0; i < topics.length; i++) {
            console.log(`[AI Enhanced] Generating slide ${i + 2}: ${topics[i]}`);
            // Enhanced AI generation with more context
            const slideContent = await this.generateEnhancedSlideContent(agent, topics[i], title, contentText, i + 1, topics.length);
            slides.push(slideContent);
            const progress = 50 + Math.floor((i / topics.length) * 30);
            ws?.emitProgress(jobId, progress, 'AI Generation', `Creating enhanced slide ${i + 2} of ${slideCount} with dynamic theming`);
        }
        // Step 5: Apply dynamic theming and visual enhancements
        ws?.emitProgress(jobId, 80, 'Creative Theming', 'Applying AI-powered dynamic theme and visual design');
        // Import and use Visual Design Agent
        const { VisualDesignAgent } = await Promise.resolve().then(() => __importStar(require('../../agents/VisualDesignAgent')));
        const visualAgent = new VisualDesignAgent();
        // Enhance slides with visual design recommendations
        for (let i = 1; i < slides.length; i++) {
            try {
                const visualEnhancements = await this.generateVisualEnhancements(visualAgent, slides[i], topics[i - 1]);
                if (visualEnhancements) {
                    slides[i] = { ...slides[i], ...visualEnhancements };
                }
            }
            catch (visualError) {
                console.warn(`[Visual Enhancement] Failed for slide ${i + 1}:`, visualError);
            }
        }
        // Step 6: Generate final presentation with dynamic theming
        ws?.emitProgress(jobId, 90, 'Final Assembly', 'Assembling AI-enhanced presentation with creative theming');
        const result = await agent.generate({
            title,
            slides,
            attachedFiles: attachedFiles || [],
            // Dynamic theming will be applied automatically by the agent
        });
        console.log(`[AI Orchestration + Dynamic Theming] ✅ Generated enhanced presentation with creative theming: ${result.fileName}`);
        return result;
    }
    /**
     * Generate with template using orchestration and dynamic theming
     */
    async generateWithTemplateAndDynamicTheming(orchestrator, template, title, content, themePreferences, jobId, ws) {
        ws?.emitProgress(jobId, 40, 'Template Processing', 'Enhancing template with AI agents and dynamic theming');
        const agent = new PowerPointAgent_1.PowerPointAgent();
        // Apply theme preferences to template generation
        if (themePreferences) {
            console.log(`[Template + Dynamic Theming] Applying preferences:`, themePreferences);
        }
        return agent.generateFromTemplate(template, title, content);
    }
    /**
     * Generate with explicit slides using visual enhancement and dynamic theming
     */
    async generateWithExplicitSlidesAndDynamicTheming(orchestrator, title, slides, themePreferences, jobId, ws) {
        ws?.emitProgress(jobId, 40, 'Slide Enhancement', 'Enhancing provided slides with dynamic theming and visual design');
        const agent = new PowerPointAgent_1.PowerPointAgent();
        // Apply theme preferences to slide generation
        if (themePreferences) {
            console.log(`[Explicit Slides + Dynamic Theming] Applying preferences:`, themePreferences);
        }
        return agent.generate({
            title,
            slides,
        });
    }
    /**
     * Generate enhanced slide content with richer AI prompts
     */
    async generateEnhancedSlideContent(agent, topic, presentationTitle, context, slideNumber, totalSlides) {
        const bedrock = (0, AWSBedrockService_1.getBedrockService)();
        const enhancedPrompt = `Generate comprehensive content for slide ${slideNumber} of ${totalSlides} in a professional business presentation.

Presentation Title: ${presentationTitle}
Slide Topic: ${topic}
Context: ${context}

Requirements:
- Create a compelling slide title (6-10 words)
- Generate 4-6 detailed bullet points (each 15-25 words)
- Include specific examples, metrics, or actionable insights
- Ensure content flows logically from previous slides
- Use professional business language
- Make content substantial and valuable (not generic)

Format as JSON:
{
  "title": "Compelling slide title",
  "bullets": [
    "Detailed bullet point with specific insights and examples",
    "Another substantial point with metrics or actionable advice",
    "Third point building on the topic with concrete details",
    "Fourth point providing valuable business insights"
  ],
  "notes": "Detailed speaker notes with additional context and talking points"
}`;
        try {
            const response = await bedrock.invoke({
                prompt: enhancedPrompt,
                maxTokens: 800,
                temperature: 0.7
            });
            const data = JSON.parse(response.completion);
            console.log(`[Enhanced AI] Generated ${data.bullets.length} detailed bullets for: ${data.title}`);
            return {
                type: 'content',
                title: data.title,
                content: [{
                        type: 'bullets',
                        items: data.bullets.map((text) => ({ text }))
                    }],
                notes: data.notes
            };
        }
        catch (error) {
            console.error('Enhanced slide generation failed:', error);
            // Fallback to basic generation
            return agent.generateSlideContent(topic, 'content');
        }
    }
    /**
     * Generate visual enhancements using Visual Design Agent
     */
    async generateVisualEnhancements(visualAgent, // Use any to avoid import issues
    slide, topic) {
        try {
            // Create design elements from slide content
            const elements = [
                {
                    id: 'slide-title',
                    type: 'text',
                    content: slide.title,
                    fontSize: 32,
                    fontWeight: 'bold',
                    foreground: '#232F3E'
                },
                {
                    id: 'slide-content',
                    type: 'text',
                    content: slide.content?.[0]?.items?.map((item) => item.text).join(' ') || '',
                    fontSize: 16,
                    foreground: '#000000'
                }
            ];
            // Get AI-powered design analysis and recommendations
            const analysis = await visualAgent.analyzeDesign(elements);
            console.log(`[Visual Enhancement] Design score: ${analysis.score}/100 for topic: ${topic}`);
            // Apply visual enhancements based on recommendations
            const enhancements = {};
            if (analysis.recommendations.length > 0) {
                // Add visual elements based on AI recommendations
                enhancements.visualElements = analysis.recommendations.map(rec => ({
                    type: 'enhancement',
                    recommendation: rec.title,
                    description: rec.description,
                    impact: rec.impact
                }));
            }
            return enhancements;
        }
        catch (error) {
            console.warn('Visual enhancement failed:', error);
            return null;
        }
    }
    /**
     * Generate with template using orchestration
     */
    async generateWithTemplate(orchestrator, template, title, content, jobId, ws) {
        ws?.emitProgress(jobId, 40, 'Template Processing', 'Enhancing template with AI agents');
        const agent = new PowerPointAgent_1.PowerPointAgent();
        return agent.generateFromTemplate(template, title, content);
    }
    /**
     * Generate with explicit slides using visual enhancement
     */
    async generateWithExplicitSlides(orchestrator, title, slides, jobId, ws) {
        ws?.emitProgress(jobId, 40, 'Slide Enhancement', 'Enhancing provided slides with visual design');
        const agent = new PowerPointAgent_1.PowerPointAgent();
        return agent.generate({
            title,
            slides,
        });
    }
    /**
     * Generate Excel workbook
     */
    async generateExcel(req, res) {
        let { title, description, template, data, options } = req.body;
        // Get authenticated user
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        // Handle natural language content - pass to AI for intelligent generation
        if (data?.naturalLanguage && data?.useAI) {
            console.log('[AI] Will use Bedrock to generate intelligent Excel sheets from natural language');
            // Pass the text as content for AI generation
            data = {
                text: data.naturalLanguage
            };
        }
        // Create document in storage service
        const jobId = await this.storageService.createDocument('excel', title, user.userId, user.username, user.role, description);
        // Return job ID immediately
        res.json({
            success: true,
            data: {
                id: jobId,
                type: 'excel',
                title,
                description,
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                metadata: {},
                owner: {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
            },
            message: 'Excel generation started',
        });
        // Start generation asynchronously
        this.generateExcelAsync(jobId, title, template, data, options);
    }
    /**
     * Generate Excel asynchronously
     */
    async generateExcelAsync(jobId, title, template, data, options) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        const ws = (0, server_1.getWebSocketService)();
        try {
            job.status = 'in-progress';
            job.progress = 10;
            ws?.emitProgress(jobId, 10, 'Initializing', 'Starting Excel workbook generation');
            ws?.emitStatus(jobId, 'in-progress');
            const agent = new ExcelAgent_1.ExcelAgent();
            const filename = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.xlsx`;
            const filepath = path_1.default.join(this.outputDir, filename);
            job.progress = 30;
            ws?.emitProgress(jobId, 30, 'Processing', 'Creating workbook structure');
            if (template) {
                await agent.generateFromTemplate(template, title, data || {});
            }
            else if (data?.sheets && data.sheets.length > 0) {
                // User provided explicit sheets
                await agent.generate({
                    title,
                    sheets: data.sheets,
                });
            }
            else {
                // No template and no sheets - create intelligent sample data
                const sheetCount = options?.sheetCount || 2;
                console.log(`[AI] Generating ${sheetCount} intelligent Excel sheets for: ${title}`);
                // Create sample sheets with AI-generated structure
                const sheets = [];
                for (let i = 0; i < sheetCount; i++) {
                    job.progress = 30 + Math.floor((i / sheetCount) * 45);
                    ws?.emitProgress(jobId, job.progress, 'Generating', `Creating sheet ${i + 1} of ${sheetCount}`);
                    const sheetName = i === 0 ? 'Summary' : `Data ${i}`;
                    // Create sample data structure
                    const headers = ['Item', 'Value', 'Status', 'Date'];
                    const rows = Array.from({ length: 10 }, (_, rowIndex) => [
                        `Item ${rowIndex + 1}`,
                        Math.floor(Math.random() * 1000),
                        rowIndex % 2 === 0 ? 'Active' : 'Pending',
                        new Date().toLocaleDateString()
                    ]);
                    sheets.push({
                        name: sheetName,
                        data: [headers, ...rows],
                        formatting: {
                            headerRow: true,
                            freezeHeader: true,
                            autoFilter: true
                        },
                        charts: options?.includeCharts ? [{
                                type: 'column',
                                title: `${sheetName} Chart`,
                                dataRange: 'A1:B11',
                                position: { row: 0, col: 5 }
                            }] : undefined
                    });
                }
                await agent.generate({
                    title,
                    sheets,
                });
            }
            job.progress = 80;
            ws?.emitProgress(jobId, 80, 'Saving', 'Saving workbook file');
            await agent.save(filepath);
            job.progress = 100;
            job.status = 'complete';
            job.filename = filename;
            job.filepath = filepath;
            job.completedAt = new Date();
            ws?.emitProgress(jobId, 100, 'Complete', 'Excel workbook generated successfully');
            ws?.emitStatus(jobId, 'complete', {
                filename,
                downloadUrl: `/api/v1/generate/download/${jobId}`,
            });
            ws?.emitWorkflowNotification(jobId, 'success', 'Excel workbook generated successfully!');
        }
        catch (error) {
            job.status = 'failed';
            job.error = error.message;
            ws?.emitStatus(jobId, 'failed', undefined, error.message);
            ws?.emitWorkflowNotification(jobId, 'error', 'Excel generation failed: ' + error.message);
            console.error('Excel generation failed:', error);
        }
    }
    /**
     * Generate Word document
     */
    async generateWord(req, res) {
        let { title, description, template, content, options } = req.body;
        // Get authenticated user
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        // Handle natural language content - pass to AI for intelligent generation
        if (content?.naturalLanguage && content?.useAI) {
            console.log('[AI] Will use Bedrock to generate intelligent Word document from natural language');
            // Pass the text as content for AI generation
            content = {
                text: content.naturalLanguage
            };
        }
        // Create job with ownership
        const jobId = (0, uuid_1.v4)();
        const job = {
            id: jobId,
            type: 'word',
            status: 'pending',
            progress: 0,
            createdAt: new Date(),
            ownerId: user.userId,
            ownerUsername: user.username,
            ownerRole: user.role,
            title,
            description,
        };
        this.jobs.set(jobId, job);
        // Return job ID immediately
        res.json({
            success: true,
            data: {
                id: jobId,
                type: 'word',
                title,
                description,
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                metadata: {},
                owner: {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
            },
            message: 'Word generation started',
        });
        // Start generation asynchronously
        this.generateWordAsync(jobId, title, template, content, options);
    }
    /**
     * Generate Word asynchronously
     */
    async generateWordAsync(jobId, title, template, content, options) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        const ws = (0, server_1.getWebSocketService)();
        try {
            job.status = 'in-progress';
            job.progress = 10;
            ws?.emitProgress(jobId, 10, 'Initializing', 'Starting Word document generation');
            ws?.emitStatus(jobId, 'in-progress');
            const agent = new WordAgent_1.WordAgent();
            const filename = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.docx`;
            const filepath = path_1.default.join(this.outputDir, filename);
            job.progress = 30;
            ws?.emitProgress(jobId, 30, 'Processing', 'Creating document structure');
            if (template) {
                await agent.generateFromTemplate(template, title, content || {});
            }
            else if (content?.sections && content.sections.length > 0) {
                // User provided explicit sections
                await agent.generate({
                    title,
                    sections: content.sections,
                });
            }
            else {
                // No template and no sections - use AI to generate intelligent content
                const pageCount = options?.pageCount || 3;
                const contentText = content?.text || job.description || '';
                console.log(`[AI] Generating ${pageCount}-page intelligent document for: ${title}`);
                // Generate outline using AI
                job.progress = 40;
                ws?.emitProgress(jobId, 40, 'Generating', 'Creating document outline');
                const outline = await agent.generateOutline(title + ': ' + contentText, pageCount);
                // Generate content for each section
                const sections = [];
                for (let i = 0; i < outline.length; i++) {
                    try {
                        job.progress = 40 + Math.floor((i / outline.length) * 35);
                        ws?.emitProgress(jobId, job.progress, 'Generating', `Writing section ${i + 1} of ${outline.length}`);
                        const sectionContent = await agent.generateContent(`${outline[i]}: ${contentText}`, options?.tone || 'professional', options?.length || 'medium');
                        sections.push({
                            heading: outline[i],
                            content: [{
                                    type: 'paragraph',
                                    text: sectionContent
                                }]
                        });
                    }
                    catch (error) {
                        console.error(`Failed to generate section ${i + 1}:`, error);
                        // Fallback to basic content
                        sections.push({
                            heading: outline[i],
                            content: [{
                                    type: 'paragraph',
                                    text: contentText || `Content for ${outline[i]}`
                                }]
                        });
                    }
                }
                await agent.generate({
                    title,
                    sections,
                    tableOfContents: options?.includeTableOfContents,
                });
            }
            job.progress = 80;
            ws?.emitProgress(jobId, 80, 'Saving', 'Saving document file');
            await agent.save(filepath);
            job.progress = 100;
            job.status = 'complete';
            job.filename = filename;
            job.filepath = filepath;
            job.completedAt = new Date();
            ws?.emitProgress(jobId, 100, 'Complete', 'Word document generated successfully');
            ws?.emitStatus(jobId, 'complete', {
                filename,
                downloadUrl: `/api/v1/generate/download/${jobId}`,
            });
            ws?.emitWorkflowNotification(jobId, 'success', 'Word document generated successfully!');
        }
        catch (error) {
            job.status = 'failed';
            job.error = error.message;
            ws?.emitStatus(jobId, 'failed', undefined, error.message);
            ws?.emitWorkflowNotification(jobId, 'error', 'Word generation failed: ' + error.message);
            console.error('Word generation failed:', error);
        }
    }
    /**
     * Execute workflow
     */
    async executeWorkflow(req, res) {
        const { name, steps, projectId } = req.body;
        // Get authenticated user
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        // Create job with ownership
        const jobId = (0, uuid_1.v4)();
        const job = {
            id: jobId,
            type: 'workflow',
            status: 'pending',
            progress: 0,
            createdAt: new Date(),
            ownerId: user.userId,
            ownerUsername: user.username,
            ownerRole: user.role,
            title: name,
        };
        this.jobs.set(jobId, job);
        // Return job ID immediately
        res.json({
            success: true,
            data: {
                id: jobId,
                type: 'workflow',
                title: name,
                description: `Workflow: ${name}`,
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                metadata: {},
                owner: {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
            },
            message: 'Workflow execution started',
        });
        // Start workflow asynchronously
        this.executeWorkflowAsync(jobId, name, steps, projectId);
    }
    /**
     * Execute workflow asynchronously
     */
    async executeWorkflowAsync(jobId, name, steps, projectId) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        try {
            job.status = 'in-progress';
            job.progress = 10;
            const orchestrator = new AgentOrchestrator_1.AgentOrchestrator();
            // Create workflow
            const workflow = {
                id: jobId,
                name,
                description: `Workflow: ${name}`,
                steps,
                dependencies: [],
                context: projectId ? { projectId, projectName: name } : undefined,
                status: 'pending',
                createdAt: new Date(),
            };
            job.progress = 20;
            // Execute workflow
            await orchestrator.executeWorkflow(workflow);
            job.progress = 100;
            job.status = 'complete';
            job.completedAt = new Date();
        }
        catch (error) {
            job.status = 'failed';
            job.error = error.message;
            console.error('Workflow execution failed:', error);
        }
    }
    /**
     * Get generation status with access control
     */
    async getStatus(req, res) {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        const document = await this.storageService.getDocument(id);
        if (!document) {
            throw new error_handler_1.ApiError(404, 'Document not found');
        }
        // Check access permissions
        if (user.role !== 'admin' && document.ownerId !== user.userId) {
            throw new error_handler_1.ApiError(403, 'Access denied: You can only view your own documents');
        }
        res.json({
            id: document.id,
            type: document.type,
            title: document.title,
            description: document.description,
            status: document.status,
            progress: document.progress,
            filename: document.filename,
            error: document.error,
            createdAt: document.createdAt,
            completedAt: document.completedAt,
            owner: {
                id: document.ownerId,
                username: document.ownerUsername,
                role: document.ownerRole,
            },
        });
    }
    /**
     * Download generated document with access control using DocumentStorageService
     */
    async downloadDocument(req, res) {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        try {
            // Get file path from storage service (includes permission checks)
            const filePath = await this.storageService.getFilePath(id, user.userId, user.role);
            const document = await this.storageService.getDocument(id);
            if (!document) {
                throw new error_handler_1.ApiError(404, 'Document not found');
            }
            console.log(`[Download] User ${user.username} downloading: ${document.filename}`);
            // Send file with proper filename
            res.download(filePath, document.filename);
        }
        catch (error) {
            console.error('Download failed:', error);
            if (error.message.includes('not found')) {
                throw new error_handler_1.ApiError(404, 'Document not found');
            }
            else if (error.message.includes('Access denied')) {
                throw new error_handler_1.ApiError(403, error.message);
            }
            else {
                throw new error_handler_1.ApiError(500, 'Download failed: ' + error.message);
            }
        }
    }
    /**
     * List documents with role-based filtering using DocumentStorageService
     */
    async listDocuments(req, res) {
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        try {
            // Get documents from storage service with role-based filtering
            const documents = await this.storageService.listDocuments(user.userId, user.role, req.query.type, req.query.status, req.query.limit ? parseInt(req.query.limit) : undefined);
            // Map to response format
            const documentList = documents.map(doc => ({
                id: doc.id,
                type: doc.type,
                title: doc.title,
                description: doc.description,
                status: doc.status,
                progress: doc.progress,
                filename: doc.filename,
                fileSize: doc.fileSize,
                createdAt: doc.createdAt,
                completedAt: doc.completedAt,
                owner: {
                    id: doc.ownerId,
                    username: doc.ownerUsername,
                    role: doc.ownerRole,
                },
            }));
            res.json({
                success: true,
                data: documentList,
                message: `Found ${documentList.length} document(s)`,
            });
        }
        catch (error) {
            console.error('List documents failed:', error);
            throw new error_handler_1.ApiError(500, 'Failed to list documents: ' + error.message);
        }
    }
    /**
     * Delete generated document with access control using DocumentStorageService
     */
    async deleteDocument(req, res) {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        try {
            // Delete document using storage service (includes permission checks)
            await this.storageService.deleteDocument(id, user.userId, user.role);
            res.json({
                success: true,
                message: 'Document deleted successfully',
            });
        }
        catch (error) {
            console.error('Delete document failed:', error);
            if (error.message.includes('not found')) {
                throw new error_handler_1.ApiError(404, 'Document not found');
            }
            else if (error.message.includes('Access denied')) {
                throw new error_handler_1.ApiError(403, error.message);
            }
            else {
                throw new error_handler_1.ApiError(500, 'Delete failed: ' + error.message);
            }
        }
    }
    /**
     * Generate Process Map presentation
     */
    async generateProcessMap(req, res) {
        const { title, problemStatement, swimLanes, steps, options } = req.body;
        // Get authenticated user
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        // Create job with ownership
        const jobId = (0, uuid_1.v4)();
        const job = {
            id: jobId,
            type: 'powerpoint',
            status: 'pending',
            progress: 0,
            createdAt: new Date(),
            ownerId: user.userId,
            ownerUsername: user.username,
            ownerRole: user.role,
            title: `Process Map: ${title}`,
            description: problemStatement || 'Process improvement analysis',
        };
        this.jobs.set(jobId, job);
        // Return job ID immediately
        res.json({
            success: true,
            data: {
                id: jobId,
                type: 'powerpoint',
                title: job.title,
                description: job.description,
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                metadata: { processImprovementType: 'process-map' },
                owner: {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
            },
            message: 'Process Map generation started',
        });
        // Start generation asynchronously
        this.generateProcessMapAsync(jobId, title, problemStatement, swimLanes, steps, options);
    }
    /**
     * Generate Fishbone Diagram presentation
     */
    async generateFishboneDiagram(req, res) {
        const { title, problemStatement, categories, options } = req.body;
        // Get authenticated user
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        // Create job with ownership
        const jobId = (0, uuid_1.v4)();
        const job = {
            id: jobId,
            type: 'powerpoint',
            status: 'pending',
            progress: 0,
            createdAt: new Date(),
            ownerId: user.userId,
            ownerUsername: user.username,
            ownerRole: user.role,
            title: `Fishbone Analysis: ${title}`,
            description: problemStatement,
        };
        this.jobs.set(jobId, job);
        // Return job ID immediately
        res.json({
            success: true,
            data: {
                id: jobId,
                type: 'powerpoint',
                title: job.title,
                description: job.description,
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                metadata: { processImprovementType: 'fishbone-diagram' },
                owner: {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
            },
            message: 'Fishbone Diagram generation started',
        });
        // Start generation asynchronously
        this.generateFishboneDiagramAsync(jobId, title, problemStatement, categories, options);
    }
    /**
     * Generate 5 Whys Analysis presentation
     */
    async generateFiveWhys(req, res) {
        const { title, problemStatement, categories, options } = req.body;
        // Get authenticated user
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        // Create job with ownership
        const jobId = (0, uuid_1.v4)();
        const job = {
            id: jobId,
            type: 'powerpoint',
            status: 'pending',
            progress: 0,
            createdAt: new Date(),
            ownerId: user.userId,
            ownerUsername: user.username,
            ownerRole: user.role,
            title: `5 Whys Analysis: ${title}`,
            description: problemStatement,
        };
        this.jobs.set(jobId, job);
        // Return job ID immediately
        res.json({
            success: true,
            data: {
                id: jobId,
                type: 'powerpoint',
                title: job.title,
                description: job.description,
                status: 'pending',
                progress: 0,
                createdAt: new Date().toISOString(),
                metadata: { processImprovementType: '5-whys' },
                owner: {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
            },
            message: '5 Whys Analysis generation started',
        });
        // Start generation asynchronously
        this.generateFiveWhysAsync(jobId, title, problemStatement, categories, options);
    }
    /**
     * Generate Process Map asynchronously
     */
    async generateProcessMapAsync(jobId, title, problemStatement, swimLanes, steps, options) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        const ws = (0, server_1.getWebSocketService)();
        try {
            job.status = 'in-progress';
            job.progress = 20;
            ws?.emitProgress(jobId, 20, 'Initializing', 'Creating process map structure');
            ws?.emitStatus(jobId, 'in-progress');
            const agent = new PowerPointAgent_1.PowerPointAgent();
            job.progress = 40;
            ws?.emitProgress(jobId, 40, 'Processing', 'Generating process map template');
            // Import process improvement templates
            const { getProcessMapTemplate } = await Promise.resolve().then(() => __importStar(require('../../templates/process-improvement-templates')));
            // Use provided data or template
            const processMapOptions = swimLanes && steps ? {
                title,
                swimLanes,
                steps,
                decisions: options?.decisions || [],
                connectors: options?.connectors || []
            } : getProcessMapTemplate();
            // Update title if provided
            if (title) {
                processMapOptions.title = title;
            }
            job.progress = 70;
            ws?.emitProgress(jobId, 70, 'Generating', 'Creating process map presentation');
            // Generate the process map
            const result = await agent.generateProcessMap(processMapOptions);
            job.progress = 100;
            job.status = 'complete';
            job.filename = result.fileName;
            job.filepath = result.filePath;
            job.completedAt = new Date();
            ws?.emitProgress(jobId, 100, 'Complete', 'Process Map generated successfully');
            ws?.emitStatus(jobId, 'complete', {
                filename: result.fileName,
                downloadUrl: `/api/v1/generate/download/${jobId}`,
            });
            ws?.emitWorkflowNotification(jobId, 'success', 'Process Map generated successfully!');
        }
        catch (error) {
            job.status = 'failed';
            job.error = error.message;
            ws?.emitStatus(jobId, 'failed', undefined, error.message);
            ws?.emitWorkflowNotification(jobId, 'error', 'Process Map generation failed: ' + error.message);
            console.error('Process Map generation failed:', error);
        }
    }
    /**
     * Generate Fishbone Diagram asynchronously
     */
    async generateFishboneDiagramAsync(jobId, title, problemStatement, categories, options) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        const ws = (0, server_1.getWebSocketService)();
        try {
            job.status = 'in-progress';
            job.progress = 20;
            ws?.emitProgress(jobId, 20, 'Initializing', 'Creating fishbone diagram structure');
            ws?.emitStatus(jobId, 'in-progress');
            const agent = new PowerPointAgent_1.PowerPointAgent();
            job.progress = 40;
            ws?.emitProgress(jobId, 40, 'Processing', 'Generating fishbone diagram template');
            // Import process improvement templates
            const { getFishboneTemplate } = await Promise.resolve().then(() => __importStar(require('../../templates/process-improvement-templates')));
            // Use provided data or template
            const fishboneOptions = categories ? {
                problemStatement,
                title: title || 'Fishbone Diagram',
                categories
            } : {
                ...getFishboneTemplate(),
                problemStatement,
                title: title || 'Fishbone Diagram'
            };
            job.progress = 70;
            ws?.emitProgress(jobId, 70, 'Generating', 'Creating fishbone diagram presentation');
            // Generate the fishbone diagram
            const result = await agent.generateFishboneDiagram(fishboneOptions);
            job.progress = 100;
            job.status = 'complete';
            job.filename = result.fileName;
            job.filepath = result.filePath;
            job.completedAt = new Date();
            ws?.emitProgress(jobId, 100, 'Complete', 'Fishbone Diagram generated successfully');
            ws?.emitStatus(jobId, 'complete', {
                filename: result.fileName,
                downloadUrl: `/api/v1/generate/download/${jobId}`,
            });
            ws?.emitWorkflowNotification(jobId, 'success', 'Fishbone Diagram generated successfully!');
        }
        catch (error) {
            job.status = 'failed';
            job.error = error.message;
            ws?.emitStatus(jobId, 'failed', undefined, error.message);
            ws?.emitWorkflowNotification(jobId, 'error', 'Fishbone Diagram generation failed: ' + error.message);
            console.error('Fishbone Diagram generation failed:', error);
        }
    }
    /**
     * Generate 5 Whys Analysis asynchronously
     */
    async generateFiveWhysAsync(jobId, title, problemStatement, categories, options) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        const ws = (0, server_1.getWebSocketService)();
        try {
            job.status = 'in-progress';
            job.progress = 20;
            ws?.emitProgress(jobId, 20, 'Initializing', 'Creating 5 Whys analysis structure');
            ws?.emitStatus(jobId, 'in-progress');
            const agent = new PowerPointAgent_1.PowerPointAgent();
            job.progress = 40;
            ws?.emitProgress(jobId, 40, 'Processing', 'Generating 5 Whys template');
            // Import process improvement templates
            const { getFiveWhysTemplate } = await Promise.resolve().then(() => __importStar(require('../../templates/process-improvement-templates')));
            // Use provided data or template
            const fiveWhysOptions = categories ? {
                problemStatement,
                format: 'powerpoint',
                categories
            } : {
                ...getFiveWhysTemplate(),
                problemStatement
            };
            job.progress = 70;
            ws?.emitProgress(jobId, 70, 'Generating', 'Creating 5 Whys analysis presentation');
            // Generate 5 Whys as PowerPoint (for now, we'll create a basic presentation)
            // TODO: Implement generateFiveWhys method in PowerPointAgent
            const slides = [
                {
                    type: 'title',
                    title: `5 Whys Analysis: ${title}`,
                    subtitle: problemStatement
                },
                {
                    type: 'content',
                    title: '5 Whys Analysis Framework',
                    content: [{
                            type: 'text',
                            text: 'The 5 Whys technique helps identify root causes by asking "why" five times for each category.'
                        }]
                }
            ];
            // Add slides for each category
            fiveWhysOptions.categories.forEach(category => {
                slides.push({
                    type: 'content',
                    title: `${category.name} Analysis`,
                    content: [{
                            type: 'bullets',
                            items: category.whyLevels.map(level => ({
                                text: `Why ${level.level}: ${level.question}`,
                                level: 0
                            }))
                        }]
                });
            });
            const result = await agent.generate({
                title: `5 Whys Analysis: ${title}`,
                slides
            });
            job.progress = 100;
            job.status = 'complete';
            job.filename = result.fileName;
            job.filepath = result.filePath;
            job.completedAt = new Date();
            ws?.emitProgress(jobId, 100, 'Complete', '5 Whys Analysis generated successfully');
            ws?.emitStatus(jobId, 'complete', {
                filename: result.fileName,
                downloadUrl: `/api/v1/generate/download/${jobId}`,
            });
            ws?.emitWorkflowNotification(jobId, 'success', '5 Whys Analysis generated successfully!');
        }
        catch (error) {
            job.status = 'failed';
            job.error = error.message;
            ws?.emitStatus(jobId, 'failed', undefined, error.message);
            ws?.emitWorkflowNotification(jobId, 'error', '5 Whys Analysis generation failed: ' + error.message);
            console.error('5 Whys Analysis generation failed:', error);
        }
    }
    /**
     * List recent files (fallback when job tracking fails)
     */
    async listRecentFiles(req, res) {
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        try {
            const outputDirs = [
                { path: this.outputDir, type: 'mixed' },
                { path: path_1.default.join(this.outputDir, 'powerpoint'), type: 'powerpoint' },
                { path: path_1.default.join(this.outputDir, 'excel'), type: 'excel' },
                { path: path_1.default.join(this.outputDir, 'word'), type: 'word' }
            ];
            const recentFiles = [];
            for (const dir of outputDirs) {
                if (!fs.existsSync(dir.path))
                    continue;
                const files = await fsPromises.readdir(dir.path);
                for (const file of files) {
                    if (!file.endsWith('.pptx') && !file.endsWith('.xlsx') && !file.endsWith('.docx'))
                        continue;
                    const filePath = path_1.default.join(dir.path, file);
                    const stats = await fsPromises.stat(filePath);
                    // Only show files from last 7 days
                    const isRecent = Date.now() - stats.mtime.getTime() < 7 * 24 * 60 * 60 * 1000;
                    if (isRecent) {
                        recentFiles.push({
                            filename: file,
                            type: dir.type,
                            size: stats.size,
                            created: stats.mtime,
                            downloadUrl: `/api/v1/generate/files/download/${encodeURIComponent(file)}`
                        });
                    }
                }
            }
            // Sort by creation date (newest first)
            recentFiles.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
            res.json({
                success: true,
                data: recentFiles.slice(0, 20), // Limit to 20 most recent
                message: `Found ${recentFiles.length} recent files`
            });
        }
        catch (error) {
            console.error('Failed to list recent files:', error);
            throw new error_handler_1.ApiError(500, 'Failed to list recent files');
        }
    }
    /**
     * Download file by filename (fallback method)
     */
    async downloadByFilename(req, res) {
        const { filename } = req.params;
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        try {
            const outputDirs = [
                this.outputDir,
                path_1.default.join(this.outputDir, 'powerpoint'),
                path_1.default.join(this.outputDir, 'excel'),
                path_1.default.join(this.outputDir, 'word')
            ];
            let foundFile = null;
            for (const dir of outputDirs) {
                const filePath = path_1.default.join(dir, filename);
                if (fs.existsSync(filePath)) {
                    foundFile = filePath;
                    break;
                }
            }
            if (!foundFile) {
                throw new error_handler_1.ApiError(404, 'File not found');
            }
            // Check if file is recent (within 7 days) for security
            const stats = await fsPromises.stat(foundFile);
            const isRecent = Date.now() - stats.mtime.getTime() < 7 * 24 * 60 * 60 * 1000;
            if (!isRecent && user.role !== 'admin') {
                throw new error_handler_1.ApiError(403, 'Access denied: File is too old');
            }
            console.log(`Downloading file by filename: ${foundFile}`);
            res.download(foundFile, filename);
        }
        catch (error) {
            console.error('Download by filename failed:', error);
            if (error instanceof error_handler_1.ApiError) {
                throw error;
            }
            throw new error_handler_1.ApiError(500, 'Download failed');
        }
    }
    /**
     * Get theme suggestions for presentation
     */
    async getThemeSuggestions(req, res) {
        const { title, content } = req.body;
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        try {
            // Import DynamicThemeService
            const { DynamicThemeService } = await Promise.resolve().then(() => __importStar(require('../../services/DynamicThemeService')));
            const themeService = new DynamicThemeService();
            // Generate theme suggestions
            const suggestions = await themeService.generateThemeSuggestions(content || '', title || 'Presentation');
            res.json({
                success: true,
                data: {
                    suggestions,
                    history: themeService.getThemeHistory().slice(0, 5) // Last 5 themes
                },
                message: `Generated ${suggestions.length} theme suggestions`
            });
        }
        catch (error) {
            console.error('Theme suggestions failed:', error);
            throw new error_handler_1.ApiError(500, 'Failed to generate theme suggestions: ' + error.message);
        }
    }
    /**
     * Get theme history
     */
    async getThemeHistory(req, res) {
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        try {
            // Import DynamicThemeService
            const { DynamicThemeService } = await Promise.resolve().then(() => __importStar(require('../../services/DynamicThemeService')));
            const themeService = new DynamicThemeService();
            const history = themeService.getThemeHistory();
            res.json({
                success: true,
                data: history,
                message: `Found ${history.length} themes in history`
            });
        }
        catch (error) {
            console.error('Theme history failed:', error);
            throw new error_handler_1.ApiError(500, 'Failed to get theme history: ' + error.message);
        }
    }
    /**
     * Rate a theme
     */
    async rateTheme(req, res) {
        const { themeId, rating } = req.body;
        const user = req.user;
        if (!user) {
            throw new error_handler_1.ApiError(401, 'Authentication required');
        }
        if (!themeId || typeof rating !== 'number' || rating < 1 || rating > 5) {
            throw new error_handler_1.ApiError(400, 'Valid theme ID and rating (1-5) required');
        }
        try {
            // Import DynamicThemeService
            const { DynamicThemeService } = await Promise.resolve().then(() => __importStar(require('../../services/DynamicThemeService')));
            const themeService = new DynamicThemeService();
            themeService.rateTheme(themeId, rating);
            res.json({
                success: true,
                message: 'Theme rated successfully'
            });
        }
        catch (error) {
            console.error('Theme rating failed:', error);
            throw new error_handler_1.ApiError(500, 'Failed to rate theme: ' + error.message);
        }
    }
    /**
     * Generate slide topics using Bedrock AI (no fallback)
     */
    async generateSlideTopics(title, content, count) {
        console.log(`[AI] Attempting Bedrock for slide topics: ${title}`);
        const bedrock = (0, AWSBedrockService_1.getBedrockService)();
        const prompt = `Generate ${count} slide topics for a PowerPoint presentation.

Presentation Title: ${title}
Content Summary: ${content || 'General business presentation'}

Create ${count} specific, actionable slide topics that would make a compelling presentation.
Each topic should be concise (3-7 words) and focused.

Return ONLY a JSON array of strings, nothing else:
["Topic 1", "Topic 2", "Topic 3", ...]`;
        console.log(`[AI] Bedrock prompt:`, prompt);
        const response = await bedrock.invoke({
            prompt,
            maxTokens: 300,
            temperature: 0.7
        });
        console.log(`[AI] Bedrock response:`, response);
        // Parse the response
        const topics = JSON.parse(response.completion);
        if (!Array.isArray(topics) || topics.length === 0) {
            throw new Error(`Invalid response format from Bedrock: ${response.completion}`);
        }
        console.log(`[AI] Bedrock generated topics:`, topics);
        return topics.slice(0, count);
    }
}
exports.GenerateController = GenerateController;
//# sourceMappingURL=generate.controller.js.map