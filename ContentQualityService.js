"use strict";
// FENIX Project Manager - Content Quality Service
// Document quality analysis with readability, style, and sentiment checking
// Created: January 6, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentQualityService = void 0;
const write_good_1 = __importDefault(require("write-good"));
const sentiment_1 = __importDefault(require("sentiment"));
const natural_1 = __importDefault(require("natural"));
const { WordTokenizer, TfIdf } = natural_1.default;
/**
 * Content Quality Service
 * Provides comprehensive document quality analysis
 */
class ContentQualityService {
    sentiment;
    tokenizer; // WordTokenizer from natural
    tfidf; // TfIdf from natural
    constructor() {
        this.sentiment = new sentiment_1.default();
        this.tokenizer = new WordTokenizer();
        this.tfidf = new TfIdf();
    }
    /**
     * Analyze document content quality
     */
    analyzeContent(text) {
        if (!text || text.trim().length === 0) {
            return this.getEmptyReport();
        }
        // Calculate statistics
        const statistics = this.calculateStatistics(text);
        // Readability analysis
        const readability = this.analyzeReadability(text, statistics);
        // Style analysis
        const style = this.analyzeStyle(text);
        // Sentiment analysis
        const sentimentResult = this.sentiment.analyze(text);
        const sentiment = {
            score: sentimentResult.score,
            comparative: sentimentResult.comparative,
            tone: this.interpretSentiment(sentimentResult.comparative),
            tokens: {
                positive: sentimentResult.positive,
                negative: sentimentResult.negative
            }
        };
        // Keyword extraction
        const keywords = this.extractKeywords(text);
        // Generate suggestions
        const suggestions = this.generateSuggestions(readability, style, sentiment, statistics);
        // Calculate overall score
        const overallScore = this.calculateOverallScore(readability, style, sentiment);
        return {
            readability,
            style,
            sentiment,
            keywords,
            statistics,
            suggestions,
            overallScore
        };
    }
    /**
     * Calculate text statistics
     */
    calculateStatistics(text) {
        const words = text.match(/\b\w+\b/g) || [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            avgWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
            avgSentencesPerParagraph: paragraphs.length > 0 ? sentences.length / paragraphs.length : 0
        };
    }
    /**
     * Analyze readability using Flesch Reading Ease
     */
    analyzeReadability(text, stats) {
        const { wordCount, sentenceCount } = stats;
        if (sentenceCount === 0 || wordCount === 0) {
            return {
                score: 0,
                grade: 0,
                interpretation: 'Insufficient text for analysis'
            };
        }
        // Count syllables (simplified)
        const syllables = this.countSyllables(text);
        // Flesch Reading Ease: 206.835 - 1.015(words/sentences) - 84.6(syllables/words)
        const avgWordsPerSentence = wordCount / sentenceCount;
        const avgSyllablesPerWord = syllables / wordCount;
        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        const score = Math.max(0, Math.min(100, fleschScore));
        // Flesch-Kincaid Grade Level: 0.39(words/sentences) + 11.8(syllables/words) - 15.59
        const grade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
        return {
            score: Math.round(score),
            grade: Math.max(0, Math.round(grade)),
            interpretation: this.interpretReadability(score)
        };
    }
    /**
     * Count syllables in text (simplified algorithm)
     */
    countSyllables(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        let syllableCount = 0;
        for (const word of words) {
            // Count vowel groups
            const vowelGroups = word.match(/[aeiouy]+/g);
            if (vowelGroups) {
                syllableCount += vowelGroups.length;
                // Adjust for silent 'e'
                if (word.endsWith('e') && vowelGroups.length > 1) {
                    syllableCount--;
                }
            }
            else {
                // Every word has at least one syllable
                syllableCount++;
            }
        }
        return syllableCount;
    }
    /**
     * Interpret readability score
     */
    interpretReadability(score) {
        if (score >= 90)
            return 'Very easy to read (5th grade level)';
        if (score >= 80)
            return 'Easy to read (6th grade level)';
        if (score >= 70)
            return 'Fairly easy to read (7th grade level)';
        if (score >= 60)
            return 'Standard (8th-9th grade level)';
        if (score >= 50)
            return 'Fairly difficult (10th-12th grade level)';
        if (score >= 30)
            return 'Difficult (college level)';
        return 'Very difficult (college graduate level)';
    }
    /**
     * Analyze writing style
     */
    analyzeStyle(text) {
        const suggestions = (0, write_good_1.default)(text);
        const wordCount = (text.match(/\b\w+\b/g) || []).length;
        // Score: 100 - (issues per 100 words * 10)
        const issuesPerHundredWords = wordCount > 0 ? (suggestions.length / wordCount) * 100 : 0;
        const score = Math.max(0, Math.round(100 - (issuesPerHundredWords * 10)));
        return {
            issues: suggestions,
            score
        };
    }
    /**
     * Interpret sentiment score
     */
    interpretSentiment(comparative) {
        if (comparative > 0.1)
            return 'positive';
        if (comparative < -0.1)
            return 'negative';
        return 'neutral';
    }
    /**
     * Extract keywords using TF-IDF
     */
    extractKeywords(text, limit = 10) {
        // Clear previous documents
        this.tfidf = new TfIdf();
        this.tfidf.addDocument(text);
        const keywords = [];
        this.tfidf.listTerms(0).forEach((item) => {
            // Filter out very short words and common words
            if (item.term.length > 3 && item.tfidf > 0.1) {
                keywords.push({ term: item.term, score: item.tfidf });
            }
        });
        return keywords
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(k => k.term);
    }
    /**
     * Generate improvement suggestions
     */
    generateSuggestions(readability, style, sentiment, statistics) {
        const suggestions = [];
        // Readability suggestions
        if (readability.score < 50) {
            suggestions.push('Consider simplifying language for better readability');
            suggestions.push('Break long sentences into shorter ones');
        }
        if (statistics.avgWordsPerSentence > 25) {
            suggestions.push(`Average sentence length (${Math.round(statistics.avgWordsPerSentence)} words) is high - aim for 15-20 words`);
        }
        // Style suggestions
        if (style.score < 70) {
            suggestions.push('Review style suggestions to improve writing quality');
            // Categorize style issues
            const passiveVoice = style.issues.filter(i => i.reason.includes('passive voice')).length;
            const weaselWords = style.issues.filter(i => i.reason.includes('weasel word')).length;
            const adverbs = style.issues.filter(i => i.reason.includes('adverb')).length;
            if (passiveVoice > 0) {
                suggestions.push(`Reduce passive voice usage (${passiveVoice} instances found)`);
            }
            if (weaselWords > 0) {
                suggestions.push(`Replace vague words with specific terms (${weaselWords} instances found)`);
            }
            if (adverbs > 0) {
                suggestions.push(`Consider removing unnecessary adverbs (${adverbs} instances found)`);
            }
        }
        // Sentiment suggestions
        if (sentiment.tone === 'negative' && sentiment.score < -5) {
            suggestions.push('Content has negative tone - consider more positive framing');
        }
        // Length suggestions
        if (statistics.wordCount < 50) {
            suggestions.push('Content is very short - consider adding more detail');
        }
        else if (statistics.wordCount > 1000) {
            suggestions.push('Content is lengthy - consider breaking into sections or multiple documents');
        }
        // Paragraph suggestions
        if (statistics.avgSentencesPerParagraph > 10) {
            suggestions.push('Paragraphs are long - break them into smaller chunks for better readability');
        }
        return suggestions;
    }
    /**
     * Calculate overall quality score
     */
    calculateOverallScore(readability, style, sentiment) {
        // Weight: readability 40%, style 40%, sentiment 20%
        const readabilityScore = readability.score;
        const styleScore = style.score;
        // Sentiment score: neutral is best (100), very positive or negative is lower
        const sentimentScore = 100 - (Math.abs(sentiment.comparative) * 50);
        const overall = (readabilityScore * 0.4) + (styleScore * 0.4) + (sentimentScore * 0.2);
        return Math.round(Math.max(0, Math.min(100, overall)));
    }
    /**
     * Get empty report for invalid input
     */
    getEmptyReport() {
        return {
            readability: {
                score: 0,
                grade: 0,
                interpretation: 'No content to analyze'
            },
            style: {
                issues: [],
                score: 0
            },
            sentiment: {
                score: 0,
                comparative: 0,
                tone: 'neutral',
                tokens: {
                    positive: [],
                    negative: []
                }
            },
            keywords: [],
            statistics: {
                wordCount: 0,
                sentenceCount: 0,
                paragraphCount: 0,
                avgWordsPerSentence: 0,
                avgSentencesPerParagraph: 0
            },
            suggestions: ['Add content to analyze'],
            overallScore: 0
        };
    }
    /**
     * Compare two documents
     */
    compareDocuments(text1, text2) {
        const report1 = this.analyzeContent(text1);
        const report2 = this.analyzeContent(text2);
        const readabilityDiff = Math.abs(report1.readability.score - report2.readability.score);
        const styleDiff = Math.abs(report1.style.score - report2.style.score);
        const sentimentDiff = Math.abs(report1.sentiment.comparative - report2.sentiment.comparative) * 100;
        const avgDiff = (readabilityDiff + styleDiff + sentimentDiff) / 3;
        const similarity = Math.max(0, 100 - avgDiff);
        let recommendation;
        if (similarity >= 90) {
            recommendation = 'Documents are very similar in quality and tone';
        }
        else if (similarity >= 70) {
            recommendation = 'Documents have similar quality with minor differences';
        }
        else if (similarity >= 50) {
            recommendation = 'Documents have moderate differences - review for consistency';
        }
        else {
            recommendation = 'Documents are significantly different - consider standardizing';
        }
        return {
            similarity: Math.round(similarity),
            differences: {
                readability: Math.round(readabilityDiff),
                style: Math.round(styleDiff),
                sentiment: Math.round(sentimentDiff)
            },
            recommendation
        };
    }
}
exports.ContentQualityService = ContentQualityService;
//# sourceMappingURL=ContentQualityService.js.map