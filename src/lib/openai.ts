import { type CorrectionResult } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function correctTextWithOpenAI(input: string): Promise<CorrectionResult> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  try {
    console.log('Using OpenAI API for RectifAI correction...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are RectifAI - an advanced text correction system. Fix all grammar, spelling, punctuation, clarity, and style issues while preserving the original meaning and tone. Respond with ONLY the corrected text, no explanations.`
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.3,
        max_tokens: Math.min(input.length * 2, 1000)
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const correctedText = data.choices[0]?.message?.content?.trim() || input;
    const changes = detectChanges(input, correctedText);
    const confidence = calculateConfidence(input, correctedText, changes);

    console.log('OpenAI correction completed');

    return {
      corrected: correctedText,
      confidence,
      changes: {
        total: countDifferences(input, correctedText),
        types: changes
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function detectChanges(original: string, corrected: string): string[] {
  const changes: string[] = [];
  
  if (original !== corrected) {
    changes.push('AI enhancement');
    
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
  }
  
  return changes.length > 0 ? changes : ['text enhancement'];
}

function calculateConfidence(original: string, corrected: string, changes: string[]): number {
  if (original === corrected) return 0.95;
  
  const changeRatio = Math.abs(original.length - corrected.length) / original.length;
  let confidence = 0.88;
  
  if (changeRatio < 0.1) confidence = 0.92;
  if (changeRatio < 0.05) confidence = 0.94;
  if (changes.length >= 2) confidence += 0.02;
  
  return Math.max(0.80, Math.min(0.96, confidence));
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