import { correctTextWithPerplexity } from './perplexity';
import { correctTextWithGemini } from './gemini';
import { correctTextWithHuggingFace } from './huggingface';
import { correctTextWithOpenAI } from './openai';
import { correctTextWithFallback } from './fallbackCorrection';
import { type CorrectionResult } from '../types';

export async function correctText(input: string): Promise<CorrectionResult> {
  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  console.log('Starting RectifAI correction process...');

  // Check which APIs are available
  const hasPerplexityKey = !!import.meta.env.VITE_PERPLEXITY_API_KEY;
  const hasOpenAIKey = !!import.meta.env.VITE_OPENAI_API_KEY;
  const hasHuggingFaceKey = !!import.meta.env.VITE_HUGGINGFACE_API_KEY;
  const hasGeminiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  console.log('Available APIs:', {
    perplexity: hasPerplexityKey,
    openai: hasOpenAIKey,
    huggingface: hasHuggingFaceKey,
    gemini: hasGeminiKey
  });

  // If no APIs are configured, use fallback immediately
  if (!hasPerplexityKey && !hasOpenAIKey && !hasHuggingFaceKey && !hasGeminiKey) {
    console.log('No AI APIs configured, using RectifAI fallback system...');
    return await correctTextWithFallback(input);
  }

  // Try Perplexity first (premium quality)
  if (hasPerplexityKey) {
    try {
      console.log('Attempting RectifAI Perplexity correction...');
      return await correctTextWithPerplexity(input);
    } catch (error) {
      console.log('RectifAI Perplexity failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  // Try OpenAI (good quality, has free tier)
  if (hasOpenAIKey) {
    try {
      console.log('Attempting OpenAI GPT-3.5 correction...');
      return await correctTextWithOpenAI(input);
    } catch (error) {
      console.log('OpenAI API failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  // Try Hugging Face (free with API key)
  if (hasHuggingFaceKey) {
    try {
      console.log('Attempting Hugging Face correction...');
      return await correctTextWithHuggingFace(input);
    } catch (error) {
      console.log('Hugging Face API failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  // Try Gemini (free tier available)
  if (hasGeminiKey) {
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
    } catch (error) {
      console.log('Gemini API failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  // Use fallback correction as last resort
  console.log('All AI APIs failed or unavailable, using RectifAI fallback system...');
  return await correctTextWithFallback(input);
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