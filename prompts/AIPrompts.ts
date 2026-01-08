// FENIX Project Manager - AI Prompts
// Enhanced AI prompts for design, content, and accessibility
// Created: January 6, 2026

/**
 * Design Critique Prompts
 */
export const DesignCritiquePrompts = {
  /**
   * Analyze overall design quality
   */
  analyzeDesign: (designDescription: string) => `
Analyze this design and provide a comprehensive critique:

Design Description:
${designDescription}

Provide analysis in the following areas:
1. Visual Hierarchy - Is the hierarchy clear and effective?
2. Color Usage - Are colors used appropriately and accessibly?
3. Typography - Is the typography readable and well-chosen?
4. Layout - Is the layout balanced and organized?
5. Consistency - Are design elements consistent?
6. Accessibility - Does it meet WCAG 2.1 AA standards?

Format response as JSON:
{
  "overallScore": 0-100,
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "accessibility": {
    "score": 0-100,
    "issues": ["issue 1", "issue 2", ...]
  }
}`,

  /**
   * Suggest design improvements
   */
  suggestImprovements: (currentDesign: string, goals: string[]) => `
Suggest specific improvements for this design:

Current Design:
${currentDesign}

Goals:
${goals.join('\n')}

Provide 5-7 specific, actionable improvements that will help achieve these goals.
Focus on practical changes that can be implemented immediately.

Format as JSON array:
[
  {
    "improvement": "Description of improvement",
    "rationale": "Why this will help",
    "priority": "high|medium|low",
    "effort": "low|medium|high"
  }
]`,

  /**
   * Compare design alternatives
   */
  compareDesigns: (design1: string, design2: string, criteria: string[]) => `
Compare these two design alternatives:

Design A:
${design1}

Design B:
${design2}

Evaluation Criteria:
${criteria.join('\n')}

Provide a detailed comparison and recommendation.

Format as JSON:
{
  "winner": "A|B|tie",
  "comparison": {
    "criterion1": { "designA": "score/notes", "designB": "score/notes" },
    ...
  },
  "recommendation": "Which design to choose and why",
  "hybridSuggestion": "How to combine best of both"
}`
};

/**
 * Layout Generation Prompts
 */
export const LayoutGenerationPrompts = {
  /**
   * Generate layout suggestions
   */
  generateLayout: (contentType: string, requirements: string[]) => `
Generate layout suggestions for this content:

Content Type: ${contentType}

Requirements:
${requirements.join('\n')}

Provide 3 different layout options with varying approaches.
Consider: grid systems, visual hierarchy, white space, and responsive design.

Format as JSON:
[
  {
    "name": "Layout Option Name",
    "description": "Brief description",
    "structure": "Detailed structure description",
    "gridSystem": "Grid configuration",
    "strengths": ["strength 1", "strength 2"],
    "bestFor": "When to use this layout"
  }
]`,

  /**
   * Optimize existing layout
   */
  optimizeLayout: (currentLayout: string, issues: string[]) => `
Optimize this layout to address the identified issues:

Current Layout:
${currentLayout}

Issues to Address:
${issues.join('\n')}

Provide specific layout modifications that will resolve these issues while maintaining design integrity.

Format as JSON:
{
  "modifications": [
    {
      "element": "Element to modify",
      "change": "Specific change to make",
      "reason": "Why this helps"
    }
  ],
  "expectedImpact": "Overall impact of changes"
}`,

  /**
   * Generate responsive layout
   */
  generateResponsiveLayout: (desktopLayout: string, breakpoints: string[]) => `
Create responsive layout variations for these breakpoints:

Desktop Layout:
${desktopLayout}

Breakpoints:
${breakpoints.join('\n')}

Provide layout adaptations for each breakpoint that maintain usability and visual appeal.

Format as JSON:
{
  "breakpoints": {
    "mobile": { "layout": "...", "changes": ["..."] },
    "tablet": { "layout": "...", "changes": ["..."] },
    "desktop": { "layout": "...", "changes": ["..."] }
  }
}`
};

/**
 * Content Optimization Prompts
 */
export const ContentOptimizationPrompts = {
  /**
   * Optimize text for readability
   */
  optimizeText: (text: string, audience: string, purpose: string) => `
Optimize this text for maximum readability and impact:

Original Text:
${text}

Target Audience: ${audience}
Purpose: ${purpose}

Improve:
1. Clarity and conciseness
2. Active voice usage
3. Sentence structure
4. Word choice
5. Tone appropriateness

Format as JSON:
{
  "optimizedText": "Improved version",
  "changes": [
    { "original": "...", "improved": "...", "reason": "..." }
  ],
  "readabilityScore": {
    "before": 0-100,
    "after": 0-100
  }
}`,

  /**
   * Generate compelling headlines
   */
  generateHeadlines: (topic: string, tone: string, count: number) => `
Generate ${count} compelling headlines for this topic:

Topic: ${topic}
Tone: ${tone}

Create headlines that are:
- Clear and specific
- Engaging and memorable
- Appropriate length (6-12 words)
- Action-oriented when possible

Format as JSON array:
[
  {
    "headline": "Headline text",
    "rationale": "Why this works",
    "score": 0-100
  }
]`,

  /**
   * Improve bullet points
   */
  improveBulletPoints: (bullets: string[], context: string) => `
Improve these bullet points for clarity and impact:

Current Bullets:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Context: ${context}

Make them:
- Parallel in structure
- Concise and clear
- Action-oriented
- Consistent in tone

Format as JSON:
{
  "improved": ["bullet 1", "bullet 2", ...],
  "changes": ["explanation of changes made"]
}`,

  /**
   * Generate executive summary
   */
  generateExecutiveSummary: (fullContent: string, maxWords: number) => `
Create an executive summary from this content:

Full Content:
${fullContent}

Maximum Words: ${maxWords}

The summary should:
- Capture key points
- Be scannable
- Include actionable insights
- Maintain professional tone

Format as JSON:
{
  "summary": "Executive summary text",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "wordCount": number
}`
};

/**
 * Accessibility Analysis Prompts
 */
export const AccessibilityAnalysisPrompts = {
  /**
   * Analyze accessibility compliance
   */
  analyzeAccessibility: (designElements: string) => `
Analyze accessibility compliance for these design elements:

Design Elements:
${designElements}

Check against WCAG 2.1 AA standards:
1. Color contrast (4.5:1 for normal text, 3:1 for large text)
2. Text alternatives for images
3. Keyboard navigation
4. Focus indicators
5. Touch target sizes (44x44px minimum)
6. Heading hierarchy
7. Form labels
8. Error identification

Format as JSON:
{
  "overallCompliance": "AA|AAA|partial|non-compliant",
  "issues": [
    {
      "element": "Element with issue",
      "issue": "Description of issue",
      "wcagCriterion": "WCAG criterion violated",
      "severity": "critical|major|minor",
      "fix": "How to fix"
    }
  ],
  "score": 0-100
}`,

  /**
   * Generate alt text for images
   */
  generateAltText: (imageDescription: string, context: string) => `
Generate appropriate alt text for this image:

Image Description:
${imageDescription}

Context: ${context}

Alt text should be:
- Descriptive but concise (10-125 characters)
- Contextually relevant
- Not redundant with surrounding text
- Focused on content, not style

Format as JSON:
{
  "altText": "Generated alt text",
  "length": number,
  "rationale": "Why this alt text is appropriate"
}`,

  /**
   * Suggest accessibility improvements
   */
  suggestAccessibilityImprovements: (currentState: string, targetLevel: string) => `
Suggest accessibility improvements to reach ${targetLevel} compliance:

Current State:
${currentState}

Target: WCAG 2.1 ${targetLevel}

Provide prioritized improvements with implementation guidance.

Format as JSON:
{
  "improvements": [
    {
      "area": "Accessibility area",
      "current": "Current state",
      "target": "Target state",
      "steps": ["step 1", "step 2", ...],
      "priority": "high|medium|low",
      "impact": "Expected impact"
    }
  ]
}`
};

/**
 * Brand Compliance Prompts
 */
export const BrandCompliancePrompts = {
  /**
   * Check brand compliance
   */
  checkBrandCompliance: (design: string, brandGuidelines: string) => `
Check if this design complies with brand guidelines:

Design:
${design}

Brand Guidelines:
${brandGuidelines}

Evaluate:
1. Color usage (brand colors vs non-brand)
2. Typography (approved fonts)
3. Logo usage (placement, sizing, clear space)
4. Tone and voice
5. Visual style consistency

Format as JSON:
{
  "compliant": boolean,
  "score": 0-100,
  "violations": [
    {
      "guideline": "Guideline violated",
      "violation": "Description",
      "severity": "critical|major|minor",
      "fix": "How to fix"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`,

  /**
   * Suggest brand-compliant alternatives
   */
  suggestBrandAlternatives: (currentElement: string, brandGuidelines: string) => `
Suggest brand-compliant alternatives for this element:

Current Element:
${currentElement}

Brand Guidelines:
${brandGuidelines}

Provide 3-5 alternatives that maintain design intent while ensuring brand compliance.

Format as JSON:
[
  {
    "alternative": "Description of alternative",
    "compliance": "How it meets guidelines",
    "tradeoffs": "Any tradeoffs to consider"
  }
]`,

  /**
   * Generate brand-aligned content
   */
  generateBrandContent: (topic: string, brandVoice: string, contentType: string) => `
Generate content that aligns with brand voice:

Topic: ${topic}
Brand Voice: ${brandVoice}
Content Type: ${contentType}

Create content that:
- Reflects brand personality
- Uses appropriate tone
- Includes brand messaging
- Maintains consistency

Format as JSON:
{
  "content": "Generated content",
  "brandElements": ["element 1", "element 2", ...],
  "toneAnalysis": "How it reflects brand voice"
}`
};

/**
 * Color Palette Generation Prompts
 */
export const ColorPalettePrompts = {
  /**
   * Generate color palette from description
   */
  generatePalette: (description: string, mood: string) => `
Generate a color palette based on this description:

Description: ${description}
Mood: ${mood}

Create a palette with:
- Primary color (main brand color)
- Secondary color (supporting color)
- Accent colors (2-3 colors for highlights)
- Neutral colors (backgrounds, text)

Ensure WCAG 2.1 AA compliance for text/background combinations.

Format as JSON:
{
  "palette": {
    "primary": { "hex": "#XXXXXX", "name": "Color name", "usage": "When to use" },
    "secondary": { "hex": "#XXXXXX", "name": "Color name", "usage": "When to use" },
    "accent1": { "hex": "#XXXXXX", "name": "Color name", "usage": "When to use" },
    "accent2": { "hex": "#XXXXXX", "name": "Color name", "usage": "When to use" },
    "neutral": {
      "dark": "#XXXXXX",
      "medium": "#XXXXXX",
      "light": "#XXXXXX"
    }
  },
  "rationale": "Why these colors work together",
  "accessibility": "Contrast ratios and compliance notes"
}`,

  /**
   * Suggest color harmonies
   */
  suggestHarmonies: (baseColor: string) => `
Suggest color harmonies based on this base color:

Base Color: ${baseColor}

Provide:
1. Complementary harmony
2. Analogous harmony
3. Triadic harmony
4. Split-complementary harmony

For each, include hex codes and usage suggestions.

Format as JSON:
{
  "harmonies": {
    "complementary": { "colors": ["#XXXXXX", ...], "usage": "..." },
    "analogous": { "colors": ["#XXXXXX", ...], "usage": "..." },
    "triadic": { "colors": ["#XXXXXX", ...], "usage": "..." },
    "splitComplementary": { "colors": ["#XXXXXX", ...], "usage": "..." }
  }
}`
};

/**
 * Typography Pairing Prompts
 */
export const TypographyPairingPrompts = {
  /**
   * Suggest font pairings
   */
  suggestFontPairings: (primaryFont: string, purpose: string) => `
Suggest font pairings for this primary font:

Primary Font: ${primaryFont}
Purpose: ${purpose}

Suggest 3 complementary fonts for:
- Headings (if primary is for body)
- Body text (if primary is for headings)
- Accents/captions

Consider:
- Contrast and harmony
- Readability
- Professional appearance
- Web availability

Format as JSON:
[
  {
    "pairing": {
      "heading": "Font name",
      "body": "Font name",
      "accent": "Font name"
    },
    "rationale": "Why this pairing works",
    "mood": "Overall feeling",
    "bestFor": "Best use cases"
  }
]`
};

/**
 * Helper function to format prompts
 */
export function formatPrompt(template: string, variables: Record<string, string>): string {
  let formatted = template;
  Object.entries(variables).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
  });
  return formatted;
}

/**
 * Get all prompt categories
 */
export function getAllPromptCategories(): string[] {
  return [
    'Design Critique',
    'Layout Generation',
    'Content Optimization',
    'Accessibility Analysis',
    'Brand Compliance',
    'Color Palette',
    'Typography Pairing'
  ];
}

/**
 * Get prompts by category
 */
export function getPromptsByCategory(category: string): Record<string, Function> {
  const categories: Record<string, Record<string, Function>> = {
    'Design Critique': DesignCritiquePrompts,
    'Layout Generation': LayoutGenerationPrompts,
    'Content Optimization': ContentOptimizationPrompts,
    'Accessibility Analysis': AccessibilityAnalysisPrompts,
    'Brand Compliance': BrandCompliancePrompts,
    'Color Palette': ColorPalettePrompts,
    'Typography Pairing': TypographyPairingPrompts
  };

  return categories[category] || {};
}
