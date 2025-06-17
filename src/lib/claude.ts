import { type CorrectionResult } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function correctTextWithClaude(input: string): Promise<CorrectionResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration missing');
  }

  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  try {
    console.log('Calling Claude Sonnet 4 via Supabase Edge Function...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/claude-correction`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude Sonnet 4 correction API error:', errorData);
      throw new Error(`Claude Sonnet 4 API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    console.log('Claude Sonnet 4 correction successful');
    
    return {
      corrected: data.corrected,
      confidence: data.confidence,
      changes: {
        total: countDifferences(input, data.corrected),
        types: data.changes
      }
    };
  } catch (error) {
    console.error('Claude Sonnet 4 correction error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Claude Sonnet 4 API key not configured. Please set up your Claude API key.');
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error('Claude Sonnet 4 API quota exceeded. Please try again later.');
      } else {
        throw new Error(`Claude Sonnet 4 API error: ${error.message}`);
      }
    }
    
    throw new Error('Failed to process text with Claude Sonnet 4');
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