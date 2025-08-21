import { type CorrectionResult } from '../types';

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export async function correctTextWithPerplexity(input: string): Promise<CorrectionResult> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key not configured');
  }

  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  try {
    console.log('Using Perplexity API for RectifAI correction...');
    
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${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}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are RectifAI - the world's most advanced universal AI correction system. Your mission is to fix EVERYTHING that's wrong with any content, across all domains and contexts.

COMPREHENSIVE CORRECTION AREAS:
📝 Language & Communication:
- Grammar, spelling, punctuation, syntax
- Clarity, coherence, flow, readability
- Tone consistency, style improvements
- Word choice optimization, redundancy removal

🧠 Logic & Reasoning:
- Factual accuracy and consistency
- Logical flow and argument structure
- Missing context or information gaps
- Contradictions and inconsistencies

💼 Professional & Technical:
- Business communication standards
- Technical accuracy and terminology
- Industry-specific conventions
- Professional formatting and structure

🎨 Creative & Stylistic:
- Narrative flow and storytelling
- Creative expression enhancement
- Artistic and aesthetic improvements
- Emotional impact optimization

🌍 Cultural & Contextual:
- Cultural sensitivity and appropriateness
- Regional language variations
- Context-appropriate formality levels
- Audience-specific adaptations

CORRECTION PHILOSOPHY:
- Fix everything that can be improved
- Maintain original intent and voice
- Enhance clarity and effectiveness
- Ensure accuracy and professionalism
- Optimize for the intended audience
- Make content more impactful

Provide ONLY the corrected version that addresses ALL possible improvements while preserving the core message and intent. Make it perfect in every way possible.

RESPOND WITH ONLY THE CORRECTED TEXT - NO EXPLANATIONS, NO FORMATTING, JUST THE IMPROVED TEXT.`
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.3,
        max_tokens: Math.min(input.length * 2, 2000)
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error:', errorData);
      throw new Error(`Perplexity API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || data.error);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from Perplexity API');
    }

    const correctedText = data.choices[0].message.content.trim();
    const changes = detectChanges(input, correctedText);
    const confidence = calculateConfidence(input, correctedText, changes);

    console.log('Perplexity correction completed');

    return {
      corrected: correctedText,
      confidence,
      changes: {
        total: countDifferences(input, correctedText),
        types: changes
      }
    };
  } catch (error) {
    console.error('Perplexity API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Perplexity API key not configured. Please set up your Perplexity API key.');
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error('Perplexity API quota exceeded. Please try again later.');
      } else {
        throw new Error(`Perplexity API error: ${error.message}`);
      }
    }
    
    throw new Error('Failed to process text with Perplexity API');
  }
}

function detectChanges(original: string, corrected: string): string[] {
  const changes: string[] = [];
  
  if (original !== corrected) {
    changes.push('RectifAI enhancement');
    
    if (original.toLowerCase() !== corrected.toLowerCase()) {
      changes.push('language improvement');
    }
    
    const originalSentences = original.split(/[.!?]+/).length;
    const correctedSentences = corrected.split(/[.!?]+/).length;
    if (originalSentences !== correctedSentences) {
      changes.push('structure optimization');
    }
    
    const originalPunctuation = (original.match(/[.!?,:;]/g) || []).length;
    const correctedPunctuation = (corrected.match(/[.!?,:;]/g) || []).length;
    if (originalPunctuation !== correctedPunctuation) {
      changes.push('punctuation');
    }
    
    // Professional enhancement detection
    const professionalWords = ['utilize', 'implement', 'facilitate', 'optimize', 'enhance', 'ensure', 'provide', 'maintain'];
    const hasNewProfessionalWords = professionalWords.some(word => 
      !original.toLowerCase().includes(word) && corrected.toLowerCase().includes(word)
    );
    if (hasNewProfessionalWords) {
      changes.push('professional enhancement');
    }
  }
  
  return changes.length > 0 ? changes : ['universal enhancement'];
}

function calculateConfidence(original: string, corrected: string, changes: string[]): number {
  if (original === corrected) return 0.95;
  
  const changeRatio = Math.abs(original.length - corrected.length) / original.length;
  let confidence = 0.90;
  
  if (changeRatio < 0.1) confidence = 0.94;
  if (changeRatio < 0.05) confidence = 0.96;
  if (changes.length >= 2) confidence += 0.02;
  
  return Math.max(0.85, Math.min(0.98, confidence));
}

function countDifferences(str1: string, str2: string): number {
  const matrix = Array(str1.length + 1).fill(null).map(() => 
    Array(str2.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[str1.length][str2.length];
}