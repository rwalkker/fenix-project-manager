// FENIX Project Manager - Readability Service
// Calculate readability scores and suggest improvements
// Created: January 6, 2026

/**
 * Readability Score
 */
export interface ReadabilityScore {
  fleschKincaid: number; // Grade level
  fleschReadingEase: number; // 0-100 (higher = easier)
  gradeLevel: string; // e.g., "8th grade", "College"
  difficulty: 'very-easy' | 'easy' | 'moderate' | 'difficult' | 'very-difficult';
  averageSentenceLength: number;
  averageWordLength: number;
  complexWordPercentage: number;
}

/**
 * Readability Improvement
 */
export interface ReadabilityImprovement {
  type: 'sentence-length' | 'word-choice' | 'structure' | 'clarity';
  severity: 'high' | 'medium' | 'low';
  location: string; // Sentence or phrase
  issue: string;
  suggestion: string;
}

/**
 * Simplification Options
 */
export interface SimplificationOptions {
  targetGradeLevel: number;
  preserveTechnicalTerms: boolean;
  maxSentenceLength?: number;
}

/**
 * Readability Analysis Result
 */
export interface ReadabilityAnalysisResult {
  score: ReadabilityScore;
  improvements: ReadabilityImprovement[];
  complexSentences: string[];
  complexWords: string[];
  summary: string;
}

/**
 * Readability Service
 * Calculates readability scores and suggests improvements
 */
export class ReadabilityService {
  /**
   * Calculate readability score
   */
  async calculateScore(content: string): Promise<ReadabilityScore> {
    const sentences = this.splitIntoSentences(content);
    const words = this.splitIntoWords(content);
    const syllables = this.countTotalSyllables(words);

    const totalSentences = sentences.length;
    const totalWords = words.length;
    const totalSyllables = syllables;

    // Flesch Reading Ease: 206.835 - 1.015(words/sentences) - 84.6(syllables/words)
    const avgWordsPerSentence = totalWords / totalSentences;
    const avgSyllablesPerWord = totalSyllables / totalWords;
    const fleschReadingEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    // Flesch-Kincaid Grade Level: 0.39(words/sentences) + 11.8(syllables/words) - 15.59
    const fleschKincaid = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;

    // Calculate complex word percentage
    const complexWords = words.filter(w => this.isComplexWord(w));
    const complexWordPercentage = (complexWords.length / totalWords) * 100;

    // Average word length
    const totalChars = words.reduce((sum, word) => sum + word.length, 0);
    const averageWordLength = totalChars / totalWords;

    return {
      fleschKincaid: Math.max(0, fleschKincaid),
      fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
      gradeLevel: this.getGradeLevel(fleschKincaid),
      difficulty: this.getDifficulty(fleschReadingEase),
      averageSentenceLength: avgWordsPerSentence,
      averageWordLength,
      complexWordPercentage
    };
  }

  /**
   * Suggest improvements
   */
  async suggestImprovements(content: string): Promise<ReadabilityImprovement[]> {
    const improvements: ReadabilityImprovement[] = [];
    const sentences = this.splitIntoSentences(content);

    // Check sentence length
    sentences.forEach(sentence => {
      const wordCount = this.splitIntoWords(sentence).length;
      if (wordCount > 25) {
        improvements.push({
          type: 'sentence-length',
          severity: wordCount > 35 ? 'high' : 'medium',
          location: this.truncate(sentence, 50),
          issue: `Sentence is too long (${wordCount} words)`,
          suggestion: 'Break into shorter sentences (aim for 15-20 words)'
        });
      }
    });

    // Check for complex words
    const words = this.splitIntoWords(content);
    const complexWords = words.filter(w => this.isComplexWord(w));
    const uniqueComplexWords = [...new Set(complexWords)];

    uniqueComplexWords.slice(0, 5).forEach(word => {
      const simpler = this.suggestSimplerWord(word);
      if (simpler) {
        improvements.push({
          type: 'word-choice',
          severity: 'low',
          location: word,
          issue: `Complex word: "${word}"`,
          suggestion: `Consider simpler alternative: "${simpler}"`
        });
      }
    });

    // Check for passive voice
    const passiveSentences = sentences.filter(s => this.hasPassiveVoice(s));
    passiveSentences.slice(0, 3).forEach(sentence => {
      improvements.push({
        type: 'structure',
        severity: 'medium',
        location: this.truncate(sentence, 50),
        issue: 'Passive voice detected',
        suggestion: 'Consider using active voice for clarity'
      });
    });

    // Check for unclear phrases
    const unclearPhrases = this.findUnclearPhrases(content);
    unclearPhrases.forEach(phrase => {
      improvements.push({
        type: 'clarity',
        severity: 'medium',
        location: phrase,
        issue: 'Potentially unclear phrase',
        suggestion: 'Consider rephrasing for clarity'
      });
    });

    return improvements;
  }

  /**
   * Simplify content
   */
  async simplifyContent(content: string, options: SimplificationOptions): Promise<string> {
    const { preserveTechnicalTerms, maxSentenceLength = 20 } = options;
    // targetGradeLevel is available in options but not used in this implementation

    let simplified = content;
    const sentences = this.splitIntoSentences(content);

    // Simplify each sentence
    const simplifiedSentences = sentences.map(sentence => {
      let result = sentence;

      // Break long sentences
      const wordCount = this.splitIntoWords(sentence).length;
      if (wordCount > maxSentenceLength) {
        result = this.breakLongSentence(sentence);
      }

      // Replace complex words
      if (!preserveTechnicalTerms) {
        result = this.replaceComplexWords(result);
      }

      return result;
    });

    simplified = simplifiedSentences.join(' ');

    return simplified;
  }

  /**
   * Analyze readability
   */
  async analyze(content: string): Promise<ReadabilityAnalysisResult> {
    const score = await this.calculateScore(content);
    const improvements = await this.suggestImprovements(content);

    const sentences = this.splitIntoSentences(content);
    const complexSentences = sentences
      .filter(s => this.splitIntoWords(s).length > 25)
      .slice(0, 5);

    const words = this.splitIntoWords(content);
    const complexWords = [...new Set(words.filter(w => this.isComplexWord(w)))].slice(0, 10);

    const summary = this.generateSummary(score, improvements.length);

    return {
      score,
      improvements,
      complexSentences,
      complexWords,
      summary
    };
  }

  /**
   * Optimize for target audience
   */
  async optimizeForAudience(content: string, audienceLevel: 'elementary' | 'high-school' | 'college' | 'expert'): Promise<string> {
    const targetGrades = {
      'elementary': 5,
      'high-school': 10,
      'college': 14,
      'expert': 16
    };

    return this.simplifyContent(content, {
      targetGradeLevel: targetGrades[audienceLevel],
      preserveTechnicalTerms: audienceLevel === 'expert',
      maxSentenceLength: audienceLevel === 'elementary' ? 15 : 20
    });
  }

  // Private helper methods

  private splitIntoSentences(content: string): string[] {
    return content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  private splitIntoWords(content: string): string[] {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    // Remove silent e
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    // Count vowel groups
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  private countTotalSyllables(words: string[]): number {
    return words.reduce((sum, word) => sum + this.countSyllables(word), 0);
  }

  private isComplexWord(word: string): boolean {
    // Words with 3+ syllables are considered complex
    return this.countSyllables(word) >= 3;
  }

  private getGradeLevel(score: number): string {
    if (score < 6) return '5th grade or below';
    if (score < 7) return '6th grade';
    if (score < 8) return '7th grade';
    if (score < 9) return '8th grade';
    if (score < 10) return '9th grade';
    if (score < 11) return '10th grade';
    if (score < 12) return '11th grade';
    if (score < 13) return '12th grade';
    if (score < 16) return 'College';
    return 'Graduate level';
  }

  private getDifficulty(score: number): ReadabilityScore['difficulty'] {
    if (score >= 90) return 'very-easy';
    if (score >= 70) return 'easy';
    if (score >= 50) return 'moderate';
    if (score >= 30) return 'difficult';
    return 'very-difficult';
  }

  private hasPassiveVoice(sentence: string): boolean {
    const lower = sentence.toLowerCase();
    const passiveIndicators = [
      'was ', 'were ', 'been ', 'being ',
      'is being', 'are being', 'was being', 'were being'
    ];
    return passiveIndicators.some(indicator => lower.includes(indicator));
  }

  private findUnclearPhrases(content: string): string[] {
    const unclear: string[] = [];

    const vagueWords = ['thing', 'stuff', 'very', 'really', 'quite', 'somewhat'];
    vagueWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches && matches.length > 2) {
        unclear.push(`Overuse of "${word}"`);
      }
    });

    return unclear.slice(0, 3);
  }

  private suggestSimplerWord(word: string): string | null {
    const simplifications: Record<string, string> = {
      'utilize': 'use',
      'implement': 'do',
      'facilitate': 'help',
      'demonstrate': 'show',
      'approximately': 'about',
      'sufficient': 'enough',
      'additional': 'more',
      'numerous': 'many',
      'terminate': 'end',
      'commence': 'start'
    };

    return simplifications[word.toLowerCase()] || null;
  }

  private breakLongSentence(sentence: string): string {
    // Simple approach: break at conjunctions
    const conjunctions = [' and ', ' but ', ' or ', ' so '];
    for (const conj of conjunctions) {
      if (sentence.includes(conj)) {
        const parts = sentence.split(conj);
        if (parts.length === 2) {
          return `${parts[0].trim()}. ${parts[1].trim()}`;
        }
      }
    }
    return sentence;
  }

  private replaceComplexWords(sentence: string): string {
    let result = sentence;
    const words = this.splitIntoWords(sentence);

    words.forEach(word => {
      if (this.isComplexWord(word)) {
        const simpler = this.suggestSimplerWord(word);
        if (simpler) {
          result = result.replace(new RegExp(`\\b${word}\\b`, 'gi'), simpler);
        }
      }
    });

    return result;
  }

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  private generateSummary(score: ReadabilityScore, improvementCount: number): string {
    const parts: string[] = [];

    parts.push(`Grade level: ${score.gradeLevel}`);
    parts.push(`Difficulty: ${score.difficulty}`);
    parts.push(`Reading ease: ${score.fleschReadingEase.toFixed(1)}/100`);

    if (improvementCount > 0) {
      parts.push(`${improvementCount} improvement${improvementCount > 1 ? 's' : ''} suggested`);
    } else {
      parts.push('Content is clear and readable');
    }

    return parts.join('. ') + '.';
  }
}
