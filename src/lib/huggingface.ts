import { type CorrectionResult } from '../types';

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models';

// Free Hugging Face models for text correction
const MODELS = {
  grammar: 'grammarly/coedit-large',
  paraphrase: 'tuner007/pegasus_paraphrase',
  spelling: 'oliverguhr/spelling-correction-english-base'
};

export async function correctTextWithHuggingFace(input: string): Promise<CorrectionResult> {
  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  try {
    console.log('Using Hugging Face API for RectifAI correction...');
    
    // Use the grammar correction model
    const response = await fetch(`${HF_API_URL}/${MODELS.grammar}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Fix grammar and improve this text: ${input}`,
        parameters: {
          max_length: Math.min(input.length * 2, 512),
          temperature: 0.3,
          do_sample: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    let correctedText = input;
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      correctedText = data[0].generated_text.replace(/^Fix grammar and improve this text:\s*/i, '').trim();
    } else if (data.generated_text) {
      correctedText = data.generated_text.replace(/^Fix grammar and improve this text:\s*/i, '').trim();
    }

    const changes = detectChanges(input, correctedText);
    const confidence = calculateConfidence(input, correctedText, changes);

    console.log('Hugging Face correction completed');

    return {
      corrected: correctedText,
      confidence,
      changes: {
        total: countDifferences(input, correctedText),
        types: changes
      }
    };
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw new Error(`Hugging Face API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function detectChanges(original: string, corrected: string): string[] {
  const changes: string[] = [];
  
  if (original !== corrected) {
    changes.push('grammar enhancement');
    
    // Check for specific improvements
    if (original.toLowerCase() !== corrected.toLowerCase()) {
      changes.push('language improvement');
    }
    
    const originalWords = original.split(/\s+/).length;
    const correctedWords = corrected.split(/\s+/).length;
    if (Math.abs(originalWords - correctedWords) > 0) {
      changes.push('structure optimization');
    }
    
    // Check for punctuation changes
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
  let confidence = 0.85;
  
  if (changeRatio < 0.1) confidence = 0.90;
  if (changeRatio < 0.05) confidence = 0.92;
  if (changes.length >= 2) confidence += 0.03;
  
  return Math.max(0.75, Math.min(0.95, confidence));
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