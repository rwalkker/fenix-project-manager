"use strict";
// FENIX Project Manager - Sentiment Analysis Service
// Analyze tone, sentiment, and emotional language in content
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentimentAnalysisService = void 0;
/**
 * Sentiment Analysis Service
 * Analyzes tone, sentiment, and emotional language in content
 */
class SentimentAnalysisService {
    positiveWords = new Set([
        'excellent', 'great', 'good', 'positive', 'success', 'achieve', 'improve',
        'benefit', 'advantage', 'opportunity', 'growth', 'innovation', 'effective',
        'efficient', 'outstanding', 'exceptional', 'superior', 'valuable'
    ]);
    negativeWords = new Set([
        'bad', 'poor', 'negative', 'fail', 'problem', 'issue', 'risk', 'concern',
        'challenge', 'difficult', 'weak', 'inferior', 'inadequate', 'insufficient',
        'disappointing', 'unfortunate', 'critical', 'severe'
    ]);
    emotionalWords = new Set([
        'love', 'hate', 'angry', 'happy', 'sad', 'excited', 'frustrated', 'worried',
        'anxious', 'thrilled', 'disappointed', 'delighted', 'upset', 'pleased'
    ]);
    /**
     * Analyze sentiment of content
     */
    async analyzeSentiment(content) {
        const words = this.tokenize(content);
        let positiveCount = 0;
        let negativeCount = 0;
        let totalWords = words.length;
        words.forEach(word => {
            const lower = word.toLowerCase();
            if (this.positiveWords.has(lower))
                positiveCount++;
            if (this.negativeWords.has(lower))
                negativeCount++;
        });
        const positive = positiveCount / totalWords;
        const negative = negativeCount / totalWords;
        const neutral = 1 - positive - negative;
        const score = positive - negative;
        const overall = this.determineSentiment(score);
        const confidence = Math.abs(score);
        return {
            overall,
            score,
            confidence: Math.min(confidence, 1.0),
            breakdown: {
                positive,
                neutral,
                negative
            }
        };
    }
    /**
     * Analyze tone of content
     */
    async analyzeTone(content) {
        const characteristics = [];
        const scores = {
            formal: this.calculateFormalityScore(content),
            casual: this.calculateCasualityScore(content),
            technical: this.calculateTechnicalScore(content),
            persuasive: this.calculatePersuasivenessScore(content),
            informative: this.calculateInformativenessScore(content),
            emotional: this.calculateEmotionalScore(content)
        };
        // Find primary and secondary tones
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const primary = sorted[0][0];
        const secondary = sorted[1][1] > 0.3 ? sorted[1][0] : undefined;
        // Add characteristics
        if (scores.formal > 0.6)
            characteristics.push('Professional language');
        if (scores.technical > 0.5)
            characteristics.push('Technical terminology');
        if (scores.persuasive > 0.5)
            characteristics.push('Persuasive elements');
        if (scores.emotional > 0.4)
            characteristics.push('Emotional language');
        return {
            primary,
            secondary,
            confidence: sorted[0][1],
            characteristics
        };
    }
    /**
     * Identify emotional language
     */
    async identifyEmotionalLanguage(content) {
        const words = this.tokenize(content);
        const emotionalWords = [];
        words.forEach(word => {
            if (this.emotionalWords.has(word.toLowerCase())) {
                emotionalWords.push(word);
            }
        });
        const intensity = emotionalWords.length / words.length;
        const emotions = this.categorizeEmotions(emotionalWords);
        return {
            hasEmotionalContent: emotionalWords.length > 0,
            emotionalWords,
            intensity: Math.min(intensity * 10, 1.0), // Scale up for visibility
            emotions
        };
    }
    /**
     * Perform complete sentiment analysis
     */
    async analyze(content, audienceType) {
        const sentiment = await this.analyzeSentiment(content);
        const tone = await this.analyzeTone(content);
        const emotionalLanguage = await this.identifyEmotionalLanguage(content);
        const suggestions = this.generateSuggestions(sentiment, tone, emotionalLanguage, audienceType);
        const appropriateForAudience = this.checkAudienceAppropriate(tone, sentiment, audienceType);
        return {
            sentiment,
            tone,
            emotionalLanguage,
            suggestions,
            appropriateForAudience
        };
    }
    /**
     * Suggest tone adjustments
     */
    async suggestToneAdjustments(content, options) {
        const currentTone = await this.analyzeTone(content);
        const suggestions = [];
        if (currentTone.primary !== options.targetTone) {
            suggestions.push(`Current tone is ${currentTone.primary}, target is ${options.targetTone}`);
            switch (options.targetTone) {
                case 'formal':
                    suggestions.push('Use more professional language');
                    suggestions.push('Avoid contractions and casual phrases');
                    suggestions.push('Use complete sentences and proper grammar');
                    break;
                case 'casual':
                    suggestions.push('Use more conversational language');
                    suggestions.push('Consider using contractions');
                    suggestions.push('Add personal touches');
                    break;
                case 'technical':
                    suggestions.push('Include more technical terminology');
                    suggestions.push('Add specific details and data');
                    suggestions.push('Use industry-standard terms');
                    break;
                case 'persuasive':
                    suggestions.push('Add compelling arguments');
                    suggestions.push('Include benefits and value propositions');
                    suggestions.push('Use action-oriented language');
                    break;
                case 'informative':
                    suggestions.push('Focus on facts and data');
                    suggestions.push('Provide clear explanations');
                    suggestions.push('Use objective language');
                    break;
                case 'emotional':
                    suggestions.push('Add emotional appeal');
                    suggestions.push('Use vivid language');
                    suggestions.push('Connect with reader feelings');
                    break;
            }
        }
        return suggestions;
    }
    /**
     * Flag potentially problematic language
     */
    async flagProblematicLanguage(content) {
        const flags = [];
        const lower = content.toLowerCase();
        // Check for overly negative language
        const sentiment = await this.analyzeSentiment(content);
        if (sentiment.score < -0.5) {
            flags.push('Content has very negative sentiment');
        }
        // Check for inappropriate emotional intensity
        const emotional = await this.identifyEmotionalLanguage(content);
        if (emotional.intensity > 0.7) {
            flags.push('Content has high emotional intensity');
        }
        // Check for absolute statements
        const absolutes = ['always', 'never', 'impossible', 'guaranteed', 'perfect'];
        absolutes.forEach(word => {
            if (lower.includes(word)) {
                flags.push(`Absolute statement detected: "${word}"`);
            }
        });
        // Check for jargon overload
        const tone = await this.analyzeTone(content);
        if (tone.primary === 'technical' && tone.confidence > 0.8) {
            flags.push('Content may be too technical for general audience');
        }
        return flags;
    }
    // Private helper methods
    tokenize(content) {
        return content
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2);
    }
    determineSentiment(score) {
        if (score > 0.1)
            return 'positive';
        if (score < -0.1)
            return 'negative';
        if (Math.abs(score) < 0.05)
            return 'neutral';
        return 'mixed';
    }
    calculateFormalityScore(content) {
        let score = 0.5;
        const lower = content.toLowerCase();
        // Formal indicators
        if (lower.includes('therefore') || lower.includes('furthermore'))
            score += 0.2;
        if (lower.includes('hereby') || lower.includes('pursuant'))
            score += 0.2;
        if (!lower.includes("'"))
            score += 0.1; // No contractions
        // Informal indicators
        if (lower.includes("'ll") || lower.includes("'ve"))
            score -= 0.2;
        if (lower.includes('gonna') || lower.includes('wanna'))
            score -= 0.3;
        return Math.max(0, Math.min(1, score));
    }
    calculateCasualityScore(content) {
        return 1 - this.calculateFormalityScore(content);
    }
    calculateTechnicalScore(content) {
        const technicalTerms = ['algorithm', 'implementation', 'architecture', 'framework',
            'protocol', 'interface', 'parameter', 'configuration'];
        const lower = content.toLowerCase();
        let count = 0;
        technicalTerms.forEach(term => {
            if (lower.includes(term))
                count++;
        });
        return Math.min(count / 5, 1.0);
    }
    calculatePersuasivenessScore(content) {
        const persuasiveWords = ['should', 'must', 'need', 'benefit', 'advantage', 'opportunity'];
        const lower = content.toLowerCase();
        let count = 0;
        persuasiveWords.forEach(word => {
            if (lower.includes(word))
                count++;
        });
        return Math.min(count / 4, 1.0);
    }
    calculateInformativenessScore(content) {
        let score = 0.5;
        // Check for data and facts
        if (/\d+/.test(content))
            score += 0.2;
        if (/%/.test(content))
            score += 0.1;
        if (content.includes('according to') || content.includes('research shows'))
            score += 0.2;
        return Math.min(score, 1.0);
    }
    calculateEmotionalScore(content) {
        const words = this.tokenize(content);
        let emotionalCount = 0;
        words.forEach(word => {
            if (this.emotionalWords.has(word))
                emotionalCount++;
        });
        return Math.min(emotionalCount / words.length * 10, 1.0);
    }
    categorizeEmotions(emotionalWords) {
        const emotions = { joy: 0, anger: 0, sadness: 0, fear: 0, surprise: 0 };
        emotionalWords.forEach(word => {
            const lower = word.toLowerCase();
            if (['happy', 'excited', 'delighted', 'pleased', 'love'].includes(lower))
                emotions.joy++;
            if (['angry', 'frustrated', 'hate', 'upset'].includes(lower))
                emotions.anger++;
            if (['sad', 'disappointed', 'unfortunate'].includes(lower))
                emotions.sadness++;
            if (['worried', 'anxious', 'concerned'].includes(lower))
                emotions.fear++;
            if (['surprised', 'amazed', 'shocked'].includes(lower))
                emotions.surprise++;
        });
        const total = emotionalWords.length || 1;
        return {
            joy: emotions.joy / total,
            anger: emotions.anger / total,
            sadness: emotions.sadness / total,
            fear: emotions.fear / total,
            surprise: emotions.surprise / total
        };
    }
    generateSuggestions(sentiment, tone, emotional, audienceType) {
        const suggestions = [];
        // Sentiment suggestions
        if (sentiment.overall === 'negative' && sentiment.score < -0.3) {
            suggestions.push('Consider balancing negative content with positive aspects');
        }
        // Tone suggestions
        if (tone.primary === 'emotional' && audienceType === 'executive') {
            suggestions.push('Consider using more formal, data-driven language for executive audience');
        }
        // Emotional language suggestions
        if (emotional.intensity > 0.5) {
            suggestions.push('High emotional intensity detected - ensure it aligns with your goals');
        }
        return suggestions;
    }
    checkAudienceAppropriate(tone, sentiment, audienceType) {
        if (!audienceType)
            return true;
        switch (audienceType) {
            case 'executive':
                return tone.primary === 'formal' || tone.primary === 'informative';
            case 'technical':
                return tone.primary === 'technical' || tone.primary === 'informative';
            case 'general':
                return tone.primary !== 'technical' && sentiment.overall !== 'negative';
            default:
                return true;
        }
    }
}
exports.SentimentAnalysisService = SentimentAnalysisService;
//# sourceMappingURL=SentimentAnalysisService.js.map