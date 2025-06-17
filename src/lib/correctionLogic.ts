import { correctTextWithClaude } from './claude';
import { correctTextWithGemini } from './gemini';
import { correctTextWithFallback } from './fallbackCorrection';
import { type CorrectionResult } from '../types';

export async function correctText(input: string): Promise<CorrectionResult> {
  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  // Try Claude first (if API key is configured)
  try {
    console.log('Attempting RectifAI Claude Sonnet 4 correction...');
    return await correctTextWithClaude(input);
  } catch (error) {
    console.log('RectifAI Claude Sonnet 4 failed:', error instanceof Error ? error.message : 'Unknown error');
    
    // If Claude fails due to missing API key, try Gemini
    try {
      console.log('Attempting Gemini API correction...');
      const geminiResult = await correctTextWithGemini(input);
      return {
        corrected: geminiResult.corrected,
        confidence: geminiResult.confidence,
        changes: {
          total: countDifferences(input, geminiResult.corrected),
          types: geminiResult.changes
        }
      };
    } catch (geminiError) {
      console.log('RectifAI Gemini API failed:', geminiError instanceof Error ? geminiError.message : 'Unknown error');
      
      // If both APIs fail, use fallback correction
      console.log('Using fallback correction system...');
      return await correctTextWithFallback(input);
    }
  }
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