// FENIX Project Manager - PowerPoint Agent
// Comprehensive PowerPoint generation with AI enhancement
// Created: January 6, 2026

import PptxGenJS from 'pptxgenjs';
import * as fs from 'fs';
import * as path from 'path';
import type {
  PowerPointOptions,
  SlideDefinition,
  SlideContent,
  PowerPointGenerationResult,
  PowerPointTheme,
  ChartContent,
  TableContent,
  ImageContent,
  BulletListContent,
  TextContent,
  QuoteContent,
  PresentationValidationResult,
  AttachedFile
} from '../models/powerpoint-types';
import { AMAZON_POWERPOINT_THEME } from '../models/powerpoint-types';
import { getBedrockService } from '../services/AWSBedrockService';
import { AccessibilityValidationService } from '../services/AccessibilityValidationService';
import { SmartLayoutService } from '../services/SmartLayoutService';
import { ValidationService } from '../services/ValidationService';
import { DynamicThemeService, type DynamicThemeConfig } from '../services/DynamicThemeService';

/**
 * PowerPoint Agent
 * Generates professional PowerPoint presentations with AI enhancement
 */
export class PowerPointAgent {
  private theme: PowerPointTheme;
  private outputDir: string;
  private bedrock: ReturnType<typeof getBedrockService>;
  private accessibilityService: AccessibilityValidationService;
  private layoutService: SmartLayoutService;
  private validationService: ValidationService;
  private dynamicThemeService: DynamicThemeService;
  private currentDynamicTheme?: DynamicThemeConfig;

  constructor(theme?: PowerPointTheme) {
    this.theme = theme || AMAZON_POWERPOINT_THEME;
    this.outputDir = process.env.STORAGE_PATH || './output/powerpoint';
    this.bedrock = getBedrockService();
    this.accessibilityService = new AccessibilityValidationService();
    this.layoutService = new SmartLayoutService();
    this.validationService = new ValidationService();
    this.dynamicThemeService = new DynamicThemeService();

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate PowerPoint presentation with dynamic AI-powered theming
   */
  async generate(options: PowerPointOptions): Promise<PowerPointGenerationResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      // Validate options
      this.validateOptions(options);

      // Process attached files for AI context
      let fileContext = '';
      if (options.attachedFiles && options.attachedFiles.length > 0) {
        console.log(`📎 Processing ${options.attachedFiles.length} attached files...`);
        fileContext = await this.processAttachedFiles(options.attachedFiles);
        console.log('📎 Files processed for AI analysis');
      }

      // Generate dynamic theme if not provided
      if (!options.theme || options.theme === AMAZON_POWERPOINT_THEME) {
        console.log('🎨 Generating dynamic AI-powered theme...');
        await this.generateDynamicTheme(options);
      }

      // Create presentation
      const pptx = new PptxGenJS();

      // Set metadata
      pptx.author = options.author || 'FENIX Project Manager';
      pptx.title = options.title;
      pptx.subject = options.subject || '';
      pptx.company = options.company || 'Amazon';

      // Apply dynamic theme (no master slide configuration)
      this.applyDynamicTheme(pptx, this.currentDynamicTheme || this.dynamicThemeService.getThemeHistory()[0]);

      // Generate slides with dynamic theming
      console.log(`[PowerPoint] Processing ${options.slides.length} slides with dynamic theming...`);
      for (let i = 0; i < options.slides.length; i++) {
        const slideDefinition = options.slides[i];
        console.log(`[PowerPoint] Creating slide ${i + 1}:`, {
          type: slideDefinition.type,
          title: slideDefinition.title,
          contentCount: slideDefinition.content?.length || 0,
          hasNotes: !!slideDefinition.notes,
          dynamicTheme: this.currentDynamicTheme?.name || 'Default'
        });
        
        try {
          await this.createDynamicSlide(pptx, slideDefinition, i + 1, options.attachedFiles);
          console.log(`[PowerPoint] ✅ Slide ${i + 1} created with dynamic theming`);
        } catch (error: any) {
          warnings.push(`Slide ${i + 1}: ${error.message}`);
          console.error(`[PowerPoint] ❌ Error creating slide ${i + 1}:`, error);
        }
      }

      // Generate filename
      const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pptx`;
      const filePath = path.join(this.outputDir, fileName);

      // Write file
      await pptx.writeFile({ fileName: filePath });

      // Get file size
      const stats = fs.statSync(filePath);

      return {
        success: true,
        filePath,
        fileName,
        fileSize: stats.size,
        slideCount: options.slides.length,
        generationTime: Date.now() - startTime,
        warnings: warnings.length > 0 ? warnings : undefined
      };

    } catch (error: any) {
      console.error('PowerPoint generation error:', error);
      return {
        success: false,
        filePath: '',
        fileName: '',
        fileSize: 0,
        slideCount: 0,
        generationTime: Date.now() - startTime,
        error: error.message,
        warnings
      };
    }
  }

  /**
   * Validate presentation options
   */
  private validateOptions(options: PowerPointOptions): void {
    if (!options.title) {
      throw new Error('Presentation title is required');
    }

    if (!options.slides || options.slides.length === 0) {
      throw new Error('At least one slide is required');
    }

    // Validate each slide
    options.slides.forEach((slide, index) => {
      if (!slide.type) {
        throw new Error(`Slide ${index + 1}: Slide type is required`);
      }
    });
  }

  /**
   * Generate dynamic theme based on presentation content
   */
  private async generateDynamicTheme(options: PowerPointOptions): Promise<void> {
    try {
      // Analyze presentation content to determine theme requirements
      const contentText = this.extractContentText(options.slides);
      const title = options.title;

      console.log('🎨 Analyzing content for dynamic theme generation...');
      
      // Get theme suggestions from AI
      const suggestions = await this.dynamicThemeService.generateThemeSuggestions(contentText, title);
      
      if (suggestions.length > 0) {
        console.log(`🎨 Generated ${suggestions.length} theme suggestions`);
        
        // Use the first (best) suggestion
        const selectedSuggestion = suggestions[0];
        console.log(`🎨 Selected theme approach:`, selectedSuggestion);
        
        // Generate dynamic theme
        this.currentDynamicTheme = await this.dynamicThemeService.generateDynamicTheme(selectedSuggestion);
        
        // Convert to PowerPoint theme format
        this.theme = this.dynamicThemeService.convertToPowerPointTheme(this.currentDynamicTheme);
        
        console.log(`✨ Dynamic theme applied: ${this.currentDynamicTheme.name}`);
        console.log(`   Colors: ${JSON.stringify(this.currentDynamicTheme.colors)}`);
        console.log(`   Visual Style: ${JSON.stringify(this.currentDynamicTheme.visualElements)}`);
      }
    } catch (error) {
      console.warn('Dynamic theme generation failed, using default:', error);
      // Keep existing theme as fallback
    }
  }

  /**
   * Extract text content from slides for theme analysis
   */
  private extractContentText(slides: SlideDefinition[]): string {
    let text = '';
    
    slides.forEach(slide => {
      if (slide.title) text += slide.title + ' ';
      if (slide.subtitle) text += slide.subtitle + ' ';
      
      slide.content?.forEach(content => {
        if (content.type === 'text') {
          text += (content as TextContent).text + ' ';
        } else if (content.type === 'bullets') {
          (content as BulletListContent).items.forEach(item => {
            text += item.text + ' ';
          });
        }
      });
    });
    
    return text.trim();
  }

  /**
   * Apply dynamic theme without master slide configuration
   */
  private applyDynamicTheme(pptx: PptxGenJS, dynamicTheme?: DynamicThemeConfig): void {
    console.log('🎨 Applying dynamic theme without master slide configuration...');
    
    // Set default layout
    pptx.defineLayout({
      name: 'CUSTOM',
      width: 10,
      height: 5.625
    });
    pptx.layout = 'CUSTOM';

    if (dynamicTheme) {
      console.log(`   Theme: ${dynamicTheme.name}`);
      console.log(`   Primary: ${dynamicTheme.colors.primary}`);
      console.log(`   Secondary: ${dynamicTheme.colors.secondary}`);
      console.log(`   Background: ${dynamicTheme.colors.background}`);
      console.log(`   Visual Style: ${dynamicTheme.visualElements.backgroundStyle}`);
    }
    
    // No master slide configuration - each slide will be themed individually
  }

  /**
   * Create a slide with dynamic theming (no master slide configuration)
   */
  private async createDynamicSlide(
    pptx: PptxGenJS,
    slideDefinition: SlideDefinition,
    slideNumber: number,
    attachedFiles?: AttachedFile[]
  ): Promise<void> {
    const slide = pptx.addSlide();
    const dynamicTheme = this.currentDynamicTheme;

    // Apply dynamic background based on theme configuration
    if (slideDefinition.background) {
      this.applyBackground(slide, slideDefinition.background);
    } else if (dynamicTheme) {
      this.applyDynamicBackground(slide, slideDefinition.type, dynamicTheme);
    } else {
      // Fallback to theme background
      slide.background = { color: this.theme.colors.background.replace('#', '') };
    }

    // Create slide based on type with dynamic theming
    switch (slideDefinition.type) {
      case 'title':
        this.createDynamicTitleSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'section':
        this.createDynamicSectionSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'content':
        this.createDynamicContentSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'two-column':
        this.createDynamicTwoColumnSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'chart':
        this.createDynamicChartSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'table':
        this.createDynamicTableSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'quote':
        this.createDynamicQuoteSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'agenda':
        this.createDynamicAgendaSlide(slide, slideDefinition, dynamicTheme);
        break;
      case 'thank-you':
        this.createDynamicThankYouSlide(slide, slideDefinition, dynamicTheme);
        break;
      default:
        this.createDynamicContentSlide(slide, slideDefinition, dynamicTheme);
    }

    // Add speaker notes
    if (slideDefinition.notes) {
      slide.addNotes(slideDefinition.notes);
    }

    // Add dynamic widgets and visual elements
    this.addDynamicVisualElements(slide, slideDefinition.type, dynamicTheme, slideNumber);
  }

  /**
   * Apply dynamic background based on theme configuration
   */
  private applyDynamicBackground(slide: PptxGenJS.Slide, slideType: string, dynamicTheme: DynamicThemeConfig): void {
    const bgStyle = dynamicTheme.visualElements.backgroundStyle;
    
    switch (bgStyle) {
      case 'gradient':
        if (dynamicTheme.colors.gradient && dynamicTheme.colors.gradient.length >= 2) {
          // Create gradient effect using overlapping shapes
          slide.addShape('rect', {
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
            fill: { color: dynamicTheme.colors.background.replace('#', '') }
          });
          
          // Add gradient overlay
          slide.addShape('rect', {
            x: 0,
            y: '70%',
            w: '100%',
            h: '30%',
            fill: { 
              color: dynamicTheme.colors.gradient[0].replace('#', ''),
              transparency: 85
            }
          });
        }
        break;
        
      case 'pattern':
        // Add subtle pattern using shapes
        slide.background = { color: dynamicTheme.colors.background.replace('#', '') };
        this.addPatternElements(slide, dynamicTheme);
        break;
        
      case 'geometric':
        // Add geometric background elements
        slide.background = { color: dynamicTheme.colors.background.replace('#', '') };
        this.addGeometricElements(slide, dynamicTheme);
        break;
        
      default:
        slide.background = { color: dynamicTheme.colors.background.replace('#', '') };
    }
  }

  /**
   * Add pattern elements for pattern background style
   */
  private addPatternElements(slide: PptxGenJS.Slide, dynamicTheme: DynamicThemeConfig): void {
    // Add subtle dot pattern
    for (let x = 1; x < 10; x += 2) {
      for (let y = 1; y < 6; y += 2) {
        slide.addShape('circle', {
          x: `${x * 10}%`,
          y: `${y * 16}%`,
          w: '0.5%',
          h: '0.5%',
          fill: { 
            color: dynamicTheme.colors.accent.replace('#', ''),
            transparency: 95
          }
        });
      }
    }
  }

  /**
   * Add geometric elements for geometric background style
   */
  private addGeometricElements(slide: PptxGenJS.Slide, dynamicTheme: DynamicThemeConfig): void {
    // Add corner triangles
    slide.addShape('triangle', {
      x: '85%',
      y: '5%',
      w: '10%',
      h: '15%',
      fill: { 
        color: dynamicTheme.colors.primary.replace('#', ''),
        transparency: 90
      }
    });
    
    slide.addShape('triangle', {
      x: '5%',
      y: '80%',
      w: '8%',
      h: '12%',
      fill: { 
        color: dynamicTheme.colors.secondary.replace('#', ''),
        transparency: 92
      }
    });
  }

  /**
   * Add dynamic visual elements and widgets
   */
  private addDynamicVisualElements(
    slide: PptxGenJS.Slide, 
    slideType: string, 
    dynamicTheme?: DynamicThemeConfig,
    slideNumber?: number
  ): void {
    if (!dynamicTheme) return;
    
    console.log(`🎨 Adding dynamic visual elements for ${slideType} slide`);
    
    const accentStyle = dynamicTheme.visualElements.accentStyle;
    
    // Add accent elements based on style
    switch (accentStyle) {
      case 'bold':
        this.addBoldAccents(slide, slideType, dynamicTheme);
        break;
      case 'creative':
        this.addCreativeAccents(slide, slideType, dynamicTheme);
        break;
      case 'minimal':
        this.addMinimalAccents(slide, slideType, dynamicTheme);
        break;
      default:
        this.addCorporateAccents(slide, slideType, dynamicTheme);
    }
    
    // Add widgets if configured
    if (dynamicTheme.widgets && dynamicTheme.widgets.length > 0) {
      this.addDynamicWidgets(slide, dynamicTheme.widgets, slideType);
    }
    
    // Add slide number (simple, no master slide)
    if (slideNumber) {
      slide.addText(slideNumber.toString(), {
        x: '92%',
        y: '90%',
        w: '6%',
        h: '8%',
        fontSize: 10,
        color: dynamicTheme.colors.text.replace('#', ''),
        align: 'center',
        fontFace: dynamicTheme.fonts.body
      });
    }
  }

  /**
   * Add bold accent elements
   */
  private addBoldAccents(slide: PptxGenJS.Slide, slideType: string, dynamicTheme: DynamicThemeConfig): void {
    if (slideType === 'content' || slideType === 'two-column') {
      // Bold header bar
      slide.addShape('rect', {
        x: 0,
        y: 0,
        w: '100%',
        h: '3%',
        fill: { color: dynamicTheme.colors.primary.replace('#', '') }
      });
    }
    
    // Bold side accent
    slide.addShape('rect', {
      x: 0,
      y: 0,
      w: '2%',
      h: '100%',
      fill: { color: dynamicTheme.colors.accent.replace('#', '') }
    });
  }

  /**
   * Add creative accent elements
   */
  private addCreativeAccents(slide: PptxGenJS.Slide, slideType: string, dynamicTheme: DynamicThemeConfig): void {
    // Creative curved elements using circles
    slide.addShape('circle', {
      x: '80%',
      y: '10%',
      w: '15%',
      h: '15%',
      fill: { 
        color: dynamicTheme.colors.primary.replace('#', ''),
        transparency: 85
      }
    });
    
    slide.addShape('circle', {
      x: '5%',
      y: '70%',
      w: '12%',
      h: '12%',
      fill: { 
        color: dynamicTheme.colors.secondary.replace('#', ''),
        transparency: 90
      }
    });
  }

  /**
   * Add minimal accent elements
   */
  private addMinimalAccents(slide: PptxGenJS.Slide, slideType: string, dynamicTheme: DynamicThemeConfig): void {
    // Minimal line accent
    slide.addShape('rect', {
      x: '5%',
      y: '15%',
      w: '90%',
      h: '0.2%',
      fill: { color: dynamicTheme.colors.accent.replace('#', '') }
    });
  }

  /**
   * Add corporate accent elements
   */
  private addCorporateAccents(slide: PptxGenJS.Slide, slideType: string, dynamicTheme: DynamicThemeConfig): void {
    // Corporate corner element
    slide.addShape('rect', {
      x: '90%',
      y: '5%',
      w: '8%',
      h: '0.5%',
      fill: { color: dynamicTheme.colors.primary.replace('#', '') }
    });
  }

  /**
   * Add dynamic widgets to slide
   */
  private addDynamicWidgets(slide: PptxGenJS.Slide, widgets: any[], slideType: string): void {
    widgets.forEach(widget => {
      if (widget.position === 'content' || widget.position === 'overlay') {
        this.addWidget(slide, widget, slideType);
      }
    });
  }

  /**
   * Add individual widget to slide
   */
  private addWidget(slide: PptxGenJS.Slide, widget: any, slideType: string): void {
    switch (widget.type) {
      case 'progress-bar':
        this.addProgressBarWidget(slide, widget);
        break;
      case 'metric-card':
        this.addMetricCardWidget(slide, widget);
        break;
      case 'callout':
        this.addCalloutWidget(slide, widget);
        break;
      // Add more widget types as needed
    }
  }

  /**
   * Add progress bar widget
   */
  private addProgressBarWidget(slide: PptxGenJS.Slide, widget: any): void {
    const dynamicTheme = this.currentDynamicTheme;
    if (!dynamicTheme) return;
    
    // Progress bar background
    slide.addShape('rect', {
      x: '70%',
      y: '85%',
      w: '25%',
      h: '2%',
      fill: { color: 'E0E0E0' }
    });
    
    // Progress bar fill (example: 75% progress)
    slide.addShape('rect', {
      x: '70%',
      y: '85%',
      w: '18.75%', // 75% of 25%
      h: '2%',
      fill: { color: dynamicTheme.colors.primary.replace('#', '') }
    });
  }

  /**
   * Add metric card widget
   */
  private addMetricCardWidget(slide: PptxGenJS.Slide, widget: any): void {
    const dynamicTheme = this.currentDynamicTheme;
    if (!dynamicTheme) return;
    
    // Metric card background
    slide.addShape('rect', {
      x: '75%',
      y: '75%',
      w: '20%',
      h: '15%',
      fill: { 
        color: dynamicTheme.colors.accent.replace('#', ''),
        transparency: 90
      }
    });
    
    // Metric text (example)
    slide.addText('85%', {
      x: '75%',
      y: '77%',
      w: '20%',
      h: '6%',
      fontSize: 18,
      bold: true,
      color: dynamicTheme.colors.text.replace('#', ''),
      align: 'center',
      fontFace: dynamicTheme.fonts.title
    });
    
    slide.addText('Success Rate', {
      x: '75%',
      y: '83%',
      w: '20%',
      h: '4%',
      fontSize: 10,
      color: dynamicTheme.colors.text.replace('#', ''),
      align: 'center',
      fontFace: dynamicTheme.fonts.body
    });
  }

  /**
   * Add callout widget
   */
  private addCalloutWidget(slide: PptxGenJS.Slide, widget: any): void {
    const dynamicTheme = this.currentDynamicTheme;
    if (!dynamicTheme) return;
    
    // Callout box
    slide.addShape('rect', {
      x: '65%',
      y: '20%',
      w: '30%',
      h: '15%',
      fill: { 
        color: dynamicTheme.colors.primary.replace('#', ''),
        transparency: 85
      }
    });
    
    // Callout text (example)
    slide.addText('Key Insight', {
      x: '67%',
      y: '22%',
      w: '26%',
      h: '11%',
      fontSize: 12,
      bold: true,
      color: dynamicTheme.colors.text.replace('#', ''),
      align: 'center',
      valign: 'middle',
      fontFace: dynamicTheme.fonts.body
    });
  }

  /**
   * Create dynamic title slide with AI-powered theming
   */
  private createDynamicTitleSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    console.log('🎯 Creating dynamic title slide with AI-powered theming');
    
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Add dynamic background elements based on theme
    if (theme?.visualElements.backgroundStyle === 'gradient' && theme.colors.gradient) {
      slide.addShape('rect', {
        x: 0,
        y: '40%',
        w: '100%',
        h: '60%',
        fill: { 
          color: theme.colors.gradient[0].replace('#', ''),
          transparency: 85
        }
      });
    }
    
    // Dynamic accent line with theme colors
    slide.addShape('rect', {
      x: '10%',
      y: '45%',
      w: '80%',
      h: '1%',
      fill: { color: colors.primary.replace('#', '') }
    });
    
    // Main title with dynamic positioning and styling
    if (definition.title) {
      slide.addText(definition.title, {
        x: '10%',
        y: '20%',
        w: '80%',
        h: '20%',
        fontSize: 44,
        bold: true,
        color: colors.secondary.replace('#', ''),
        align: 'center',
        fontFace: fonts.title
      });
    }

    // Subtitle with dynamic styling
    if (definition.subtitle) {
      slide.addText(definition.subtitle, {
        x: '10%',
        y: '47%',
        w: '80%',
        h: '12%',
        fontSize: 24,
        color: colors.text.replace('#', ''),
        align: 'center',
        fontFace: fonts.body
      });
    }
    
    console.log(`   Applied dynamic title theme: ${theme?.name || 'Default'}`);
  }

  /**
   * Create dynamic section slide with AI-powered theming
   */
  private createDynamicSectionSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    console.log('🎯 Creating dynamic section slide with AI-powered theming');
    
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Dynamic section background based on theme style
    const bgStyle = theme?.visualElements.backgroundStyle || 'solid';
    
    if (bgStyle === 'geometric') {
      // Geometric section design
      slide.addShape('triangle', {
        x: 0,
        y: '30%',
        w: '100%',
        h: '40%',
        fill: { color: colors.primary.replace('#', '') }
      });
    } else {
      // Traditional section bar
      slide.addShape('rect', {
        x: 0,
        y: '35%',
        w: '100%',
        h: '30%',
        fill: { color: colors.primary.replace('#', '') }
      });
    }
    
    // Dynamic accent elements
    slide.addShape('rect', {
      x: 0,
      y: '32%',
      w: '100%',
      h: '1%',
      fill: { color: colors.secondary.replace('#', '') }
    });
    
    slide.addShape('rect', {
      x: 0,
      y: '67%',
      w: '100%',
      h: '1%',
      fill: { color: colors.secondary.replace('#', '') }
    });

    // Section title with dynamic styling
    if (definition.title) {
      slide.addText(definition.title, {
        x: '10%',
        y: '42%',
        w: '80%',
        h: '16%',
        fontSize: 36,
        bold: true,
        color: 'FFFFFF', // White text on colored background
        align: 'center',
        fontFace: fonts.title
      });
    }
    
    console.log(`   Applied dynamic section theme: ${theme?.name || 'Default'}`);
  }

  /**
   * Create dynamic content slide with AI-powered theming
   */
  private createDynamicContentSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    console.log('🎯 Creating dynamic content slide with AI-powered theming');
    
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Title with dynamic theming
    if (definition.title) {
      slide.addText(definition.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        bold: true,
        color: colors.secondary.replace('#', ''),
        fontFace: fonts.title
      });
    }

    // Content with dynamic theming
    if (definition.content) {
      let yOffset = 18;
      for (const content of definition.content) {
        yOffset = this.addDynamicContent(slide, content, yOffset, theme);
      }
    }
    
    console.log(`   Applied dynamic content theme: ${theme?.name || 'Default'}`);
  }

  /**
   * Create dynamic two-column slide
   */
  private createDynamicTwoColumnSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Title
    if (definition.title) {
      slide.addText(definition.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        bold: true,
        color: colors.secondary.replace('#', ''),
        fontFace: fonts.title
      });
    }

    // Column separator (dynamic styling)
    slide.addShape('rect', {
      x: '50%',
      y: '18%',
      w: '0.2%',
      h: '70%',
      fill: { color: colors.accent.replace('#', '') }
    });

    // Divide content into two columns
    if (definition.content) {
      const midpoint = Math.ceil(definition.content.length / 2);
      const leftContent = definition.content.slice(0, midpoint);
      const rightContent = definition.content.slice(midpoint);

      // Left column
      let yOffset = 18;
      for (const content of leftContent) {
        yOffset = this.addDynamicContent(slide, content, yOffset, theme, '5%', '42%');
      }

      // Right column
      yOffset = 18;
      for (const content of rightContent) {
        yOffset = this.addDynamicContent(slide, content, yOffset, theme, '53%', '42%');
      }
    }
  }

  /**
   * Create dynamic chart slide
   */
  private createDynamicChartSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Title
    if (definition.title) {
      slide.addText(definition.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        bold: true,
        color: colors.secondary.replace('#', ''),
        fontFace: fonts.title
      });
    }

    // Find chart content
    const chartContent = definition.content?.find(c => c.type === 'chart') as ChartContent;
    if (chartContent) {
      this.addDynamicChart(slide, chartContent, 18, theme);
    }
  }

  /**
   * Create dynamic table slide
   */
  private createDynamicTableSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Title
    if (definition.title) {
      slide.addText(definition.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        bold: true,
        color: colors.secondary.replace('#', ''),
        fontFace: fonts.title
      });
    }

    // Find table content
    const tableContent = definition.content?.find(c => c.type === 'table') as TableContent;
    if (tableContent) {
      this.addDynamicTable(slide, tableContent, 18, theme);
    }
  }

  /**
   * Create dynamic quote slide
   */
  private createDynamicQuoteSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    const quoteContent = definition.content?.find(c => c.type === 'quote') as QuoteContent;
    if (quoteContent) {
      // Quote background accent
      slide.addShape('rect', {
        x: '10%',
        y: '25%',
        w: '80%',
        h: '50%',
        fill: { 
          color: colors.accent.replace('#', ''),
          transparency: 90
        }
      });
      
      // Quote text
      slide.addText(`"${quoteContent.text}"`, {
        x: '15%',
        y: '30%',
        w: '70%',
        h: '30%',
        fontSize: 28,
        italic: true,
        color: colors.text.replace('#', ''),
        align: 'center',
        fontFace: fonts.body
      });

      // Author
      if (quoteContent.author) {
        slide.addText(`— ${quoteContent.author}`, {
          x: '15%',
          y: '62%',
          w: '70%',
          h: '8%',
          fontSize: 20,
          color: colors.secondary.replace('#', ''),
          align: 'right',
          fontFace: fonts.body
        });
      }
    }
  }

  /**
   * Create dynamic agenda slide
   */
  private createDynamicAgendaSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Title
    slide.addText('Agenda', {
      x: '5%',
      y: '5%',
      w: '90%',
      h: '10%',
      fontSize: 32,
      bold: true,
      color: colors.secondary.replace('#', ''),
      fontFace: fonts.title
    });

    // Agenda items
    const bulletContent = definition.content?.find(c => c.type === 'bullets') as BulletListContent;
    if (bulletContent) {
      this.addDynamicBullets(slide, bulletContent, 18, theme);
    }
  }

  /**
   * Create dynamic thank you slide
   */
  private createDynamicThankYouSlide(slide: PptxGenJS.Slide, definition: SlideDefinition, dynamicTheme?: DynamicThemeConfig): void {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    // Thank you background accent
    slide.addShape('circle', {
      x: '20%',
      y: '20%',
      w: '60%',
      h: '60%',
      fill: { 
        color: colors.primary.replace('#', ''),
        transparency: 85
      }
    });
    
    slide.addText('Thank You', {
      x: '10%',
      y: '40%',
      w: '80%',
      h: '20%',
      fontSize: 48,
      bold: true,
      color: colors.primary.replace('#', ''),
      align: 'center',
      fontFace: fonts.title
    });

    if (definition.subtitle) {
      slide.addText(definition.subtitle, {
        x: '10%',
        y: '62%',
        w: '80%',
        h: '10%',
        fontSize: 20,
        color: colors.text.replace('#', ''),
        align: 'center',
        fontFace: fonts.body
      });
    }
  }

  /**
   * Add dynamic content to slide with theming
   */
  private addDynamicContent(
    slide: PptxGenJS.Slide,
    content: SlideContent,
    yOffset: number,
    dynamicTheme?: DynamicThemeConfig,
    xPos: string = '5%',
    width: string = '90%'
  ): number {
    switch (content.type) {
      case 'text':
        return this.addDynamicText(slide, content as TextContent, yOffset, dynamicTheme, xPos, width);
      case 'bullets':
        return this.addDynamicBullets(slide, content as BulletListContent, yOffset, dynamicTheme, xPos, width);
      case 'image':
        return this.addImage(slide, content as ImageContent, yOffset);
      case 'chart':
        return this.addDynamicChart(slide, content as ChartContent, yOffset, dynamicTheme);
      case 'table':
        return this.addDynamicTable(slide, content as TableContent, yOffset, dynamicTheme);
      default:
        return yOffset;
    }
  }

  /**
   * Add dynamic text content with theming
   */
  private addDynamicText(
    slide: PptxGenJS.Slide,
    content: TextContent,
    yOffset: number,
    dynamicTheme?: DynamicThemeConfig,
    xPos: string = '5%',
    width: string = '90%'
  ): number {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    slide.addText(content.text, {
      x: xPos as any,
      y: `${yOffset}%` as any,
      w: width as any,
      h: '8%' as any,
      fontSize: content.style?.size || 18,
      color: (content.style?.color || colors.text).replace('#', ''),
      bold: content.style?.bold,
      italic: content.style?.italic,
      fontFace: fonts.body
    });

    return yOffset + 10;
  }

  /**
   * Add dynamic bullet list with theming
   */
  private addDynamicBullets(
    slide: PptxGenJS.Slide,
    content: BulletListContent,
    yOffset: number,
    dynamicTheme?: DynamicThemeConfig,
    xPos: string = '5%',
    width: string = '90%'
  ): number {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    const fonts = theme?.fonts || this.theme.fonts;
    
    console.log(`🎯 Adding ${content.items.length} bullet points with dynamic theming`);
    
    const bullets = content.items.map(item => ({
      text: item.text,
      options: {
        bullet: true,
        indentLevel: item.level || 0
      }
    }));

    slide.addText(bullets, {
      x: xPos as any,
      y: `${yOffset}%` as any,
      w: width as any,
      h: `${Math.min(60, bullets.length * 8)}%` as any,
      fontSize: 16,
      color: colors.text.replace('#', ''),
      fontFace: fonts.body
    });

    console.log(`   Applied dynamic bullet color: ${colors.text}`);

    return yOffset + Math.min(60, bullets.length * 8) + 2;
  }

  /**
   * Add dynamic chart with theming
   */
  private addDynamicChart(slide: PptxGenJS.Slide, content: ChartContent, yOffset: number, dynamicTheme?: DynamicThemeConfig): number {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const chartColors = theme?.dataVisualization.chartColors || [
      this.theme.colors.primary,
      this.theme.colors.secondary,
      this.theme.colors.accent
    ];

    const chartData = content.data.datasets.map((dataset, index) => ({
      name: dataset.name,
      labels: content.data.labels,
      values: dataset.values,
      color: chartColors[index % chartColors.length]?.replace('#', '')
    }));

    slide.addChart(this.getChartType(content.chartType), chartData, {
      x: '10%',
      y: `${yOffset}%`,
      w: '80%',
      h: '65%',
      showTitle: !!content.title,
      title: content.title,
      showLegend: content.options?.showLegend !== false,
      showLabel: content.options?.showDataLabels,
      chartColors: chartColors.map(c => c.replace('#', ''))
    });

    return yOffset + 70;
  }

  /**
   * Add dynamic table with theming
   */
  private addDynamicTable(slide: PptxGenJS.Slide, content: TableContent, yOffset: number, dynamicTheme?: DynamicThemeConfig): number {
    const theme = dynamicTheme || this.currentDynamicTheme;
    const colors = theme?.colors || this.theme.colors;
    
    const rows = [
      content.headers.map(h => ({ 
        text: h, 
        options: { 
          bold: true, 
          fill: colors.primary.replace('#', ''), 
          color: '#FFFFFF' 
        } 
      })),
      ...content.rows.map(row => row.map(cell => ({ text: cell })))
    ];

    slide.addTable(rows, {
      x: '5%',
      y: `${yOffset}%`,
      w: '90%',
      h: `${Math.min(60, rows.length * 6)}%`,
      fontSize: 14,
      border: { pt: 1, color: colors.secondary.replace('#', '') }
    });

    return yOffset + Math.min(60, rows.length * 6) + 2;
  }

  /**
   * Create two-column slide
   */
  private createTwoColumnSlide(slide: PptxGenJS.Slide, definition: SlideDefinition): void {
    // Title
    if (definition.title) {
      slide.addText(definition.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        bold: true,
        color: this.theme.colors.secondary.replace('#', ''), // Remove # for PptxGenJS
        fontFace: 'Arial' // Use Arial as fallback
      });
    }

    // Divide content into two columns
    if (definition.content) {
      const midpoint = Math.ceil(definition.content.length / 2);
      const leftContent = definition.content.slice(0, midpoint);
      const rightContent = definition.content.slice(midpoint);

      // Left column
      let yOffset = 18;
      for (const content of leftContent) {
        yOffset = this.addContent(slide, content, yOffset, '5%', '42%');
      }

      // Right column
      yOffset = 18;
      for (const content of rightContent) {
        yOffset = this.addContent(slide, content, yOffset, '53%', '42%');
      }
    }
  }

  /**
   * Create chart slide
   */
  private createChartSlide(slide: PptxGenJS.Slide, definition: SlideDefinition): void {
    // Title
    if (definition.title) {
      slide.addText(definition.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        bold: true,
        color: this.theme.colors.secondary.replace('#', ''), // Remove # for PptxGenJS
        fontFace: 'Arial' // Use Arial as fallback
      });
    }

    // Find chart content
    const chartContent = definition.content?.find(c => c.type === 'chart') as ChartContent;
    if (chartContent) {
      this.addChart(slide, chartContent, 18);
    }
  }

  /**
   * Create table slide
   */
  private createTableSlide(slide: PptxGenJS.Slide, definition: SlideDefinition): void {
    // Title
    if (definition.title) {
      slide.addText(definition.title, {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        bold: true,
        color: this.theme.colors.secondary.replace('#', ''), // Remove # for PptxGenJS
        fontFace: 'Arial' // Use Arial as fallback
      });
    }

    // Find table content
    const tableContent = definition.content?.find(c => c.type === 'table') as TableContent;
    if (tableContent) {
      this.addTable(slide, tableContent, 18);
    }
  }

  /**
   * Create quote slide
   */
  private createQuoteSlide(slide: PptxGenJS.Slide, definition: SlideDefinition): void {
    const quoteContent = definition.content?.find(c => c.type === 'quote') as QuoteContent;
    if (quoteContent) {
      // Quote text
      slide.addText(`"${quoteContent.text}"`, {
        x: '15%',
        y: '30%',
        w: '70%',
        h: '30%',
        fontSize: 28,
        italic: true,
        color: this.theme.colors.text.replace('#', ''), // Remove # for PptxGenJS
        align: 'center',
        fontFace: 'Arial' // Use Arial as fallback
      });

      // Author
      if (quoteContent.author) {
        slide.addText(`— ${quoteContent.author}`, {
          x: '15%',
          y: '62%',
          w: '70%',
          h: '8%',
          fontSize: 20,
          color: this.theme.colors.secondary.replace('#', ''), // Remove # for PptxGenJS
          align: 'right',
          fontFace: 'Arial' // Use Arial as fallback
        });
      }
    }
  }

  /**
   * Create agenda slide
   */
  private createAgendaSlide(slide: PptxGenJS.Slide, definition: SlideDefinition): void {
    // Title
    slide.addText('Agenda', {
      x: '5%',
      y: '5%',
      w: '90%',
      h: '10%',
      fontSize: 32,
      bold: true,
      color: this.theme.colors.secondary.replace('#', ''), // Remove # for PptxGenJS
      fontFace: 'Arial' // Use Arial as fallback
    });

    // Agenda items
    const bulletContent = definition.content?.find(c => c.type === 'bullets') as BulletListContent;
    if (bulletContent) {
      this.addBullets(slide, bulletContent, 18);
    }
  }

  /**
   * Create thank you slide
   */
  private createThankYouSlide(slide: PptxGenJS.Slide, definition: SlideDefinition): void {
    slide.addText('Thank You', {
      x: '10%',
      y: '40%',
      w: '80%',
      h: '20%',
      fontSize: 48,
      bold: true,
      color: this.theme.colors.primary.replace('#', ''), // Remove # for PptxGenJS
      align: 'center',
      fontFace: 'Arial' // Use Arial as fallback
    });

    if (definition.subtitle) {
      slide.addText(definition.subtitle, {
        x: '10%',
        y: '62%',
        w: '80%',
        h: '10%',
        fontSize: 20,
        color: this.theme.colors.text.replace('#', ''), // Remove # for PptxGenJS
        align: 'center',
        fontFace: 'Arial' // Use Arial as fallback
      });
    }
  }

  /**
   * Add content to slide
   */
  private addContent(
    slide: PptxGenJS.Slide,
    content: SlideContent,
    yOffset: number,
    xPos: string = '5%',
    width: string = '90%'
  ): number {
    switch (content.type) {
      case 'text':
        return this.addText(slide, content as TextContent, yOffset, xPos, width);
      case 'bullets':
        return this.addBullets(slide, content as BulletListContent, yOffset, xPos, width);
      case 'image':
        return this.addImage(slide, content as ImageContent, yOffset);
      case 'chart':
        return this.addChart(slide, content as ChartContent, yOffset);
      case 'table':
        return this.addTable(slide, content as TableContent, yOffset);
      default:
        return yOffset;
    }
  }

  /**
   * Add text content with enhanced styling
   */
  private addText(
    slide: PptxGenJS.Slide,
    content: TextContent,
    yOffset: number,
    xPos: string = '5%',
    width: string = '90%'
  ): number {
    slide.addText(content.text, {
      x: xPos as any,
      y: `${yOffset}%` as any,
      w: width as any,
      h: '8%' as any,
      fontSize: content.style?.size || 18,
      color: (content.style?.color || this.theme.colors.text).replace('#', ''), // Remove # for PptxGenJS
      bold: content.style?.bold,
      italic: content.style?.italic,
      fontFace: 'Arial' // Use Arial as fallback instead of theme font
    });

    return yOffset + 10;
  }

  /**
   * Add bullet list with enhanced styling
   */
  private addBullets(
    slide: PptxGenJS.Slide,
    content: BulletListContent,
    yOffset: number,
    xPos: string = '5%',
    width: string = '90%'
  ): number {
    console.log(`🎯 Adding ${content.items.length} bullet points with enhanced colors`);
    
    const bullets = content.items.map(item => ({
      text: item.text,
      options: {
        bullet: true,
        indentLevel: item.level || 0
      }
    }));

    console.log(`   Bullet items:`, bullets.map(b => b.text.substring(0, 50) + '...'));

    slide.addText(bullets, {
      x: xPos as any,
      y: `${yOffset}%` as any,
      w: width as any,
      h: `${Math.min(60, bullets.length * 8)}%` as any,
      fontSize: 16,
      color: this.theme.colors.text.replace('#', ''), // Remove # for PptxGenJS
      fontFace: 'Arial' // Use Arial as fallback instead of theme font
    });

    console.log(`   Bullet color applied: ${this.theme.colors.text} -> ${this.theme.colors.text.replace('#', '')}`);

    return yOffset + Math.min(60, bullets.length * 8) + 2;
  }

  /**
   * Add image
   */
  private addImage(slide: PptxGenJS.Slide, content: ImageContent, yOffset: number): number {
    try {
      slide.addImage({
        path: content.path,
        x: (content.position?.x || '20%') as any,
        y: (content.position?.y || `${yOffset}%`) as any,
        w: (content.size?.width || '60%') as any,
        h: (content.size?.height || '40%') as any
      });

      return yOffset + 45;
    } catch (error) {
      console.error('Failed to add image:', error);
      return yOffset;
    }
  }

  /**
   * Add chart
   */
  private addChart(slide: PptxGenJS.Slide, content: ChartContent, yOffset: number): number {
    const chartData = content.data.datasets.map(dataset => ({
      name: dataset.name,
      labels: content.data.labels,
      values: dataset.values
    }));

    slide.addChart(this.getChartType(content.chartType), chartData, {
      x: '10%',
      y: `${yOffset}%`,
      w: '80%',
      h: '65%',
      showTitle: !!content.title,
      title: content.title,
      showLegend: content.options?.showLegend !== false,
      showLabel: content.options?.showDataLabels
    });

    return yOffset + 70;
  }

  /**
   * Get PptxGenJS chart type
   */
  private getChartType(type: string): any {
    const types: Record<string, any> = {
      bar: 'bar',
      column: 'bar',
      line: 'line',
      pie: 'pie',
      doughnut: 'doughnut',
      area: 'area'
    };
    return types[type] || 'bar';
  }

  /**
   * Add table
   */
  private addTable(slide: PptxGenJS.Slide, content: TableContent, yOffset: number): number {
    const rows = [
      content.headers.map(h => ({ text: h, options: { bold: true, fill: this.theme.colors.primary, color: '#FFFFFF' } })),
      ...content.rows.map(row => row.map(cell => ({ text: cell })))
    ];

    slide.addTable(rows, {
      x: '5%',
      y: `${yOffset}%`,
      w: '90%',
      h: `${Math.min(60, rows.length * 6)}%`,
      fontSize: 14,
      border: { pt: 1, color: this.theme.colors.secondary.replace('#', '') } // Remove # for PptxGenJS
    });

    return yOffset + Math.min(60, rows.length * 6) + 2;
  }

  /**
   * Apply background
   */
  private applyBackground(slide: PptxGenJS.Slide, background: any): void {
    if (background.type === 'solid') {
      slide.background = { color: background.color };
    } else if (background.type === 'image' && background.image) {
      slide.background = { path: background.image };
    }
  }

  /**
   * Process attached files and extract content for AI analysis
   */
  async processAttachedFiles(attachedFiles: AttachedFile[]): Promise<string> {
    if (!attachedFiles || attachedFiles.length === 0) {
      return '';
    }

    const fileAnalysisService = new (await import('../services/FileAnalysisService')).FileAnalysisService();
    let fileContent = '\n\n=== ATTACHED FILES CONTENT ===\n';

    for (const file of attachedFiles) {
      try {
        // Get file metadata path
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const metadataPath = path.join(uploadsDir, `${file.id}.json`);
        
        if (fs.existsSync(metadataPath)) {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          
          // Get file content for AI (text files only)
          const content = await fileAnalysisService.getFileContentForAI(metadata.path, metadata.originalName);
          
          fileContent += `\n--- ${file.name} ---\n`;
          fileContent += `Analysis: ${file.analysis}\n`;
          
          if (content) {
            fileContent += `Content:\n${content}\n`;
          } else {
            fileContent += `[Binary file - content not readable, use analysis above]\n`;
          }
        }
      } catch (error) {
        console.error(`[PowerPoint] Failed to process file ${file.name}:`, error);
        fileContent += `\n--- ${file.name} ---\n`;
        fileContent += `Analysis: ${file.analysis}\n`;
        fileContent += `[Error reading file content]\n`;
      }
    }

    fileContent += '\n=== END ATTACHED FILES ===\n';
    return fileContent;
  }

  /**
   * AI: Generate slide content with enhanced visuals and file context
   */
  async generateSlideContent(topic: string, slideType: string, attachedFiles?: AttachedFile[]): Promise<SlideDefinition> {
    // Build file context if files are attached
    let fileContext = '';
    if (attachedFiles && attachedFiles.length > 0) {
      fileContext = `\n\nAttached Files Context:
${attachedFiles.map(file => `- ${file.name}: ${file.analysis}`).join('\n')}

Please incorporate relevant information from these files into the slide content.`;
    }

    const prompt = `Generate comprehensive content for a PowerPoint slide:

Topic: ${topic}
Slide Type: ${slideType}${fileContext}

Create professional business content with:
- Compelling title (6-10 words)
- 4-6 detailed bullet points (each 15-25 words with specific insights)
- Include metrics, examples, or actionable recommendations where relevant
- If files are attached, reference their data/content appropriately
- Speaker notes with additional context

Format as JSON:
{
  "title": "...",
  "bullets": ["...", "..."],
  "notes": "...",
  "suggestedVisuals": ["chart", "diagram", "infographic"], // optional visual suggestions
  "fileReferences": ["filename1", "filename2"] // files referenced in content
}`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 600,
        temperature: 0.7
      });

      const data = JSON.parse(response.completion);

      console.log(`[AI Enhanced] Generated slide: ${data.title}`);
      console.log(`   Bullets: ${data.bullets.length}`);
      console.log(`   Visuals suggested: ${data.suggestedVisuals?.length || 0}`);
      if (data.fileReferences?.length > 0) {
        console.log(`   Files referenced: ${data.fileReferences.join(', ')}`);
      }

      return {
        type: 'content',
        title: data.title,
        content: [{
          type: 'bullets',
          items: data.bullets.map((text: string) => ({ text }))
        }],
        notes: data.notes,
        metadata: {
          suggestedVisuals: data.suggestedVisuals || [],
          fileReferences: data.fileReferences || [],
          attachedFiles: attachedFiles || []
        }
      };
    } catch (error) {
      console.error('Failed to generate slide content:', error);
      throw error;
    }
  }

  /**
   * AI: Generate sample data and charts for presentations
   */
  async generateSampleChart(topic: string, chartType: string = 'column'): Promise<ChartContent> {
    const prompt = `Generate sample data for a business chart about: ${topic}

Create realistic business data with:
- 4-6 data categories/labels
- Corresponding numerical values (realistic business metrics)
- Chart title
- Brief description of what the data represents

Format as JSON:
{
  "title": "Chart title",
  "description": "What this data represents",
  "labels": ["Category 1", "Category 2", "Category 3", "Category 4"],
  "values": [45, 67, 23, 89],
  "unit": "%" or "$M" or "units" etc.
}`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 400,
        temperature: 0.8
      });

      const data = JSON.parse(response.completion);

      console.log(`[AI Chart] Generated chart: ${data.title} with ${data.labels.length} data points`);

      return {
        type: 'chart',
        chartType: chartType as any, // Use any to avoid ChartType import issues
        title: data.title,
        data: {
          labels: data.labels,
          datasets: [{
            name: data.description,
            values: data.values
          }]
        },
        options: {
          showLegend: true,
          showDataLabels: true,
          title: data.title
        }
      };
    } catch (error) {
      console.error('Failed to generate chart data:', error);
      // Return fallback chart
      return {
        type: 'chart',
        chartType: 'column',
        title: `${topic} Analysis`,
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            name: 'Performance',
            values: [25, 45, 35, 55]
          }]
        },
        options: {
          showLegend: true,
          showDataLabels: true
        }
      };
    }
  }

  /**
   * AI: Optimize presentation
   */
  async optimizePresentation(slides: SlideDefinition[]): Promise<string[]> {
    const prompt = `Review this presentation structure and suggest improvements:

Slides: ${JSON.stringify(slides.map(s => ({ type: s.type, title: s.title })), null, 2)}

Provide 3-5 specific suggestions for improvement.
Format as JSON array: ["suggestion 1", "suggestion 2", ...]`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 400,
        temperature: 0.7
      });

      return JSON.parse(response.completion);
    } catch (error) {
      console.error('Failed to optimize presentation:', error);
      return [];
    }
  }

  /**
   * Generate from template using the comprehensive template system
   */
  async generateFromTemplate(templateId: string, title: string, data: any): Promise<PowerPointGenerationResult> {
    console.log(`🎨 Generating PowerPoint from template: ${templateId}`);
    
    try {
      // Import the template system
      const { getPowerPointTemplate } = await import('../templates/powerpoint-templates');
      
      // Get the template
      const templateOptions = getPowerPointTemplate(templateId as any, {
        ...data,
        projectName: title,
        title: title
      });
      
      console.log(`   Template loaded: ${templateOptions.slides.length} slides`);
      console.log(`   Theme: ${templateOptions.theme?.name || 'Default'}`);
      
      // Use the template's theme if available
      if (templateOptions.theme) {
        this.theme = templateOptions.theme;
      }
      
      // Generate using the template
      return this.generate(templateOptions);
      
    } catch (error) {
      console.error(`Failed to load template ${templateId}:`, error);
      
      // Fallback to basic generation
      const options: PowerPointOptions = {
        title,
        author: data.author || 'FENIX Project Manager',
        subject: data.subject || title,
        company: data.company || 'Amazon',
        slides: data.slides || [
          {
            type: 'title',
            title: title,
            subtitle: data.description || 'Generated Presentation'
          }
        ],
        theme: this.theme
      };
      
      return this.generate(options);
    }
  }

  /**
   * Save presentation to file
   */
  async save(filePath: string): Promise<void> {
    // This method is called after generate() which already saves the file
    // For now, this is a no-op as the file is saved in generate()
    // In the future, we could separate generation from saving
    console.log(`Presentation would be saved to: ${filePath}`);
  }

  /**
   * Validate presentation
   */
  validatePresentation(options: PowerPointOptions): PresentationValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];
    const suggestions: string[] = [];

    // Check slide count
    if (options.slides.length < 3) {
      warnings.push({
        slide: 0,
        type: 'structure',
        message: 'Presentation has fewer than 3 slides',
        recommendation: 'Consider adding more content'
      });
    }

    // Check for title slide
    if (options.slides[0]?.type !== 'title') {
      warnings.push({
        slide: 1,
        type: 'structure',
        message: 'First slide is not a title slide',
        recommendation: 'Start with a title slide'
      });
    }

    // Validate each slide
    options.slides.forEach((slide, index) => {
      if (!slide.title && slide.type !== 'title' && slide.type !== 'thank-you') {
        warnings.push({
          slide: index + 1,
          type: 'content',
          message: 'Slide missing title',
          recommendation: 'Add a descriptive title'
        });
      }

      // Check for images without alt text
      if (slide.content) {
        slide.content.forEach(content => {
          if (content.type === 'image' && !(content as ImageContent).altText) {
            errors.push({
              slide: index + 1,
              type: 'accessibility',
              message: 'Image missing alt text',
              severity: 'high' as const
            });
          }
        });
      }
    });

    const accessibilityScore = Math.max(0, 100 - (errors.length * 20 + warnings.length * 5));
    const readabilityScore = 85; // Simplified calculation

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      accessibilityScore,
      readabilityScore
    };
  }

  /**
   * Generate presentation (orchestrator compatibility method)
   * Wrapper around generate() for AgentOrchestrator
   */
  async generatePresentation(inputs: any): Promise<any> {
    // Convert inputs to PowerPointOptions format
    const options: PowerPointOptions = {
      title: inputs.title || 'Presentation',
      author: inputs.author,
      subject: inputs.subject,
      company: inputs.company,
      slides: inputs.slides || [],
      theme: inputs.theme
    };

    const result = await this.generate(options);
    
    return {
      filePath: result.filePath,
      fileName: result.fileName,
      slideCount: result.slideCount,
      success: result.success,
      warnings: result.warnings
    };
  }

  /**
   * Generate process map presentation
   */
  async generateProcessMap(options: import('../models/process-improvement-types').ProcessMapOptions): Promise<PowerPointGenerationResult> {
    const pres = new PptxGenJS();
    
    // Apply theme
    this.applyTheme(pres, this.theme);
    
    // Create title slide
    const titleSlide = pres.addSlide();
    titleSlide.addText(options.title, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1,
      fontSize: 44,
      bold: true,
      color: this.theme.colors.primary,
      align: 'center'
    });
    
    // Create process map slide
    const mapSlide = pres.addSlide();
    
    // Calculate swim lane dimensions
    const laneHeight = 5.5 / options.swimLanes.length;
    const startY = 1;
    
    // Draw swim lanes
    options.swimLanes.forEach((lane, index) => {
      const y = startY + (index * laneHeight);
      
      // Lane background
      mapSlide.addShape(pres.ShapeType.rect, {
        x: 0.5,
        y,
        w: 9,
        h: laneHeight,
        fill: { color: lane.color || this.theme.colors.secondary, transparency: 90 },
        line: { color: this.theme.colors.text, width: 1 }
      });
      
      // Lane label
      mapSlide.addText(lane.name, {
        x: 0.6,
        y: y + 0.1,
        w: 1.5,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: this.theme.colors.text
      });
    });
    
    // Draw process steps
    options.steps.forEach(step => {
      const shape = step.type === 'start' || step.type === 'end' 
        ? pres.ShapeType.ellipse 
        : pres.ShapeType.rect;
      
      const x = step.position.x / 100;
      const y = step.position.y / 100;
      
      mapSlide.addShape(shape, {
        x,
        y,
        w: 1.2,
        h: 0.6,
        fill: { color: this.theme.colors.primary },
        line: { color: this.theme.colors.text, width: 2 }
      });
      
      mapSlide.addText(step.text, {
        x,
        y,
        w: 1.2,
        h: 0.6,
        fontSize: 10,
        align: 'center',
        valign: 'middle',
        color: '#FFFFFF'
      });
    });
    
    // Draw decision points (diamonds)
    options.decisions.forEach(decision => {
      const x = decision.position.x / 100;
      const y = decision.position.y / 100;
      
      mapSlide.addShape(pres.ShapeType.diamond, {
        x,
        y,
        w: 1.2,
        h: 0.8,
        fill: { color: '#FFA500' },
        line: { color: this.theme.colors.text, width: 2 }
      });
      
      mapSlide.addText(decision.question, {
        x,
        y,
        w: 1.2,
        h: 0.8,
        fontSize: 9,
        align: 'center',
        valign: 'middle',
        color: '#000000'
      });
    });
    
    // Draw connectors (simplified - just lines)
    options.connectors.forEach(connector => {
      // Find from and to positions
      const fromStep = options.steps.find(s => s.id === connector.fromId);
      const toStep = options.steps.find(s => s.id === connector.toId);
      const fromDecision = options.decisions.find(d => d.id === connector.fromId);
      const toDecision = options.decisions.find(d => d.id === connector.toId);
      
      const from = fromStep || fromDecision;
      const to = toStep || toDecision;
      
      if (from && to) {
        const x1 = from.position.x / 100 + 0.6;
        const y1 = from.position.y / 100 + 0.3;
        const x2 = to.position.x / 100;
        const y2 = to.position.y / 100 + 0.3;
        
        mapSlide.addShape(pres.ShapeType.line, {
          x: x1,
          y: y1,
          w: x2 - x1,
          h: y2 - y1,
          line: { color: this.theme.colors.text, width: 2, endArrowType: 'arrow' }
        });
        
        if (connector.label) {
          mapSlide.addText(connector.label, {
            x: (x1 + x2) / 2 - 0.2,
            y: (y1 + y2) / 2 - 0.1,
            w: 0.4,
            h: 0.2,
            fontSize: 8,
            color: this.theme.colors.text
          });
        }
      }
    });
    
    // Save presentation
    const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pptx`;
    const filePath = path.join(this.outputDir, fileName);
    await pres.writeFile({ fileName: filePath });
    
    const stats = fs.statSync(filePath);
    
    return {
      success: true,
      filePath,
      fileName,
      fileSize: stats.size,
      slideCount: 2,
      generationTime: Date.now()
    };
  }

  /**
   * Generate fishbone diagram presentation
   */
  async generateFishboneDiagram(options: import('../models/process-improvement-types').FishboneDiagramOptions): Promise<PowerPointGenerationResult> {
    const pres = new PptxGenJS();
    
    // Apply theme
    this.applyTheme(pres, this.theme);
    
    // Create title slide
    const titleSlide = pres.addSlide();
    titleSlide.addText('Fishbone Diagram', {
      x: 0.5,
      y: 2,
      w: 9,
      h: 0.8,
      fontSize: 44,
      bold: true,
      color: this.theme.colors.primary,
      align: 'center'
    });
    
    titleSlide.addText(options.problemStatement, {
      x: 0.5,
      y: 3,
      w: 9,
      h: 0.6,
      fontSize: 24,
      color: this.theme.colors.text,
      align: 'center'
    });
    
    // Create fishbone diagram slide
    const diagramSlide = pres.addSlide();
    
    // Draw main spine (horizontal line)
    const spineY = 2.8;
    const spineStartX = 1;
    const spineEndX = 8.5;
    
    diagramSlide.addShape(pres.ShapeType.line, {
      x: spineStartX,
      y: spineY,
      w: spineEndX - spineStartX,
      h: 0,
      line: { color: this.theme.colors.text, width: 3 }
    });
    
    // Draw head (problem statement box)
    diagramSlide.addShape(pres.ShapeType.rect, {
      x: spineEndX,
      y: spineY - 0.4,
      w: 1.2,
      h: 0.8,
      fill: { color: this.theme.colors.primary },
      line: { color: this.theme.colors.text, width: 2 }
    });
    
    diagramSlide.addText('Problem', {
      x: spineEndX,
      y: spineY - 0.4,
      w: 1.2,
      h: 0.8,
      fontSize: 10,
      bold: true,
      color: '#FFFFFF',
      align: 'center',
      valign: 'middle'
    });
    
    // Calculate category positions
    const topCategories = options.categories.filter(c => c.position === 'top');
    const bottomCategories = options.categories.filter(c => c.position === 'bottom');
    
    const categorySpacing = (spineEndX - spineStartX - 1) / Math.max(topCategories.length, bottomCategories.length);
    
    // Draw top categories
    topCategories.forEach((category, index) => {
      const x = spineStartX + 1 + (index * categorySpacing);
      const y = spineY - 1.2;
      
      // Category bone (angled line)
      diagramSlide.addShape(pres.ShapeType.line, {
        x,
        y: spineY,
        w: 0.8,
        h: -1,
        line: { color: this.theme.colors.secondary, width: 2 }
      });
      
      // Category label
      diagramSlide.addText(category.name, {
        x: x - 0.3,
        y: y - 0.2,
        w: 1.4,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: this.theme.colors.secondary,
        align: 'center'
      });
      
      // Draw causes
      category.causes.forEach((cause, causeIndex) => {
        const causeY = y + 0.3 + (causeIndex * 0.25);
        diagramSlide.addText(`• ${cause.text}`, {
          x: x - 0.5,
          y: causeY,
          w: 1.8,
          h: 0.2,
          fontSize: 9,
          color: this.theme.colors.text
        });
        
        // Draw sub-causes if present
        if (cause.subCauses && cause.subCauses.length > 0) {
          cause.subCauses.forEach((subCause, subIndex) => {
            diagramSlide.addText(`  - ${subCause}`, {
              x: x - 0.4,
              y: causeY + 0.15 + (subIndex * 0.15),
              w: 1.6,
              h: 0.15,
              fontSize: 8,
              color: this.theme.colors.text,
              italic: true
            });
          });
        }
      });
    });
    
    // Draw bottom categories
    bottomCategories.forEach((category, index) => {
      const x = spineStartX + 1 + (index * categorySpacing);
      const y = spineY + 1.2;
      
      // Category bone (angled line)
      diagramSlide.addShape(pres.ShapeType.line, {
        x,
        y: spineY,
        w: 0.8,
        h: 1,
        line: { color: this.theme.colors.secondary, width: 2 }
      });
      
      // Category label
      diagramSlide.addText(category.name, {
        x: x - 0.3,
        y: y + 0.2,
        w: 1.4,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: this.theme.colors.secondary,
        align: 'center'
      });
      
      // Draw causes
      category.causes.forEach((cause, causeIndex) => {
        const causeY = y + 0.7 + (causeIndex * 0.25);
        diagramSlide.addText(`• ${cause.text}`, {
          x: x - 0.5,
          y: causeY,
          w: 1.8,
          h: 0.2,
          fontSize: 9,
          color: this.theme.colors.text
        });
        
        // Draw sub-causes if present
        if (cause.subCauses && cause.subCauses.length > 0) {
          cause.subCauses.forEach((subCause, subIndex) => {
            diagramSlide.addText(`  - ${subCause}`, {
              x: x - 0.4,
              y: causeY + 0.15 + (subIndex * 0.15),
              w: 1.6,
              h: 0.15,
              fontSize: 8,
              color: this.theme.colors.text,
              italic: true
            });
          });
        }
      });
    });
    
    // Save presentation
    const fileName = `Fishbone_${options.problemStatement.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}_${Date.now()}.pptx`;
    const filePath = path.join(this.outputDir, fileName);
    await pres.writeFile({ fileName: filePath });
    
    const stats = fs.statSync(filePath);
    
    return {
      success: true,
      filePath,
      fileName,
      fileSize: stats.size,
      slideCount: 2,
      generationTime: Date.now()
    };
  }
}

/**
 * Create PowerPoint agent instance
 */
export function createPowerPointAgent(theme?: PowerPointTheme): PowerPointAgent {
  return new PowerPointAgent(theme);
}
