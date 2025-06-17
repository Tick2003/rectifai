import { type CorrectionResult } from '../types';
import { correctTextWithClaude } from './claude';
import { correctTextWithGemini } from './gemini';

const API_URL = import.meta.env.VITE_CLOUD_RUN_URL;

export async function correctText(input: string): Promise<CorrectionResult> {
  console.log('Starting Claude Sonnet 4 correction process...');
  
  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  // Try Claude Sonnet 4 first (primary AI)
  try {
    console.log('Attempting Claude Sonnet 4 correction...');
    const claudeResult = await correctTextWithClaude(input);
    console.log('Claude Sonnet 4 correction successful!');
    return claudeResult;
  } catch (claudeError) {
    console.error('Claude Sonnet 4 failed:', claudeError);
    console.log('Trying Gemini API fallback...');
    
    // Fallback to Gemini API
    try {
      const geminiResult = await correctTextWithGemini(input);
      console.log('Gemini API correction successful (fallback)');
      
      return {
        corrected: geminiResult.corrected,
        confidence: geminiResult.confidence,
        changes: {
          total: countDifferences(input, geminiResult.corrected),
          types: geminiResult.changes
        }
      };
    } catch (geminiError) {
      console.error('Gemini API failed:', geminiError);
      console.log('Trying Cloud Run API fallback...');
      
      // Fallback to Cloud Run API
      if (API_URL) {
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Origin': window.location.origin
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({ input }),
          });

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          const data = await response.json();
          console.log('Cloud Run API correction successful');
          
          return {
            corrected: data.corrected,
            confidence: data.confidence || 0.9,
            changes: {
              total: countDifferences(input, data.corrected),
              types: data.changes || ['grammar', 'spelling']
            }
          };
        } catch (apiError) {
          console.error('Cloud Run API failed:', apiError);
          console.log('Using basic correction fallback...');
        }
      }
      
      // Final fallback to basic correction
      console.log('Using basic correction logic...');
      return basicCorrection(input);
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

function basicCorrection(input: string): CorrectionResult {
  let corrected = input;
  const changes = new Set<string>();
  
  // Basic corrections (fallback)
  if (/[a-z]/.test(corrected.charAt(0))) {
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    changes.add('capitalization');
  }
  
  if (corrected !== corrected.replace(/\s+/g, ' ').trim()) {
    corrected = corrected.replace(/\s+/g, ' ').trim();
    changes.add('spacing');
  }
  
  if (/[.,!?]{2,}/.test(corrected)) {
    corrected = corrected.replace(/\.{2,}/g, '.').replace(/\!{2,}/g, '!').replace(/\?{2,}/g, '?');
    changes.add('punctuation');
  }
  
  // Fix common spelling mistakes
  const commonFixes = {
    'teh': 'the',
    'recieve': 'receive',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'neccessary': 'necessary',
    'accomodate': 'accommodate',
    'begining': 'beginning',
    'beleive': 'believe',
    'calender': 'calendar',
    'grammer': 'grammar',
    'alot': 'a lot',
    'cant': "can't",
    'wont': "won't",
    'shouldnt': "shouldn't",
    'couldnt': "couldn't",
    'wouldnt': "wouldn't",
    'algoritms': 'algorithms',
    'powerfull': 'powerful',
    'effectivly': 'effectively'
  };
  
  Object.entries(commonFixes).forEach(([wrong, right]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    if (regex.test(corrected)) {
      corrected = corrected.replace(regex, right);
      changes.add('spelling');
    }
  });
  
  // Fix common grammar issues
  corrected = corrected.replace(/\bi\b/g, 'I'); // Always capitalize "I"
  corrected = corrected.replace(/\. +([a-z])/g, (match, letter) => '. ' + letter.toUpperCase()); // Capitalize after periods
  
  // Fix common contractions and grammar
  corrected = corrected.replace(/\bshould of\b/gi, 'should have');
  corrected = corrected.replace(/\bcould of\b/gi, 'could have');
  corrected = corrected.replace(/\bwould of\b/gi, 'would have');
  
  if (corrected !== input) {
    changes.add('grammar');
  }
  
  return {
    corrected,
    confidence: 0.7, // Medium confidence for basic corrections
    changes: {
      total: countDifferences(input, corrected),
      types: Array.from(changes)
    }
  };
}