import { type CorrectionResult } from '../types';

// Simple rule-based text correction system as fallback
export async function correctTextWithFallback(input: string): Promise<CorrectionResult> {
  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  console.log('Using fallback correction system...');
  
  let corrected = input;
  const changes: string[] = [];
  
  // Basic grammar and spelling corrections
  const corrections = [
    // Common spelling mistakes
    { pattern: /\bteh\b/gi, replacement: 'the', type: 'spelling' },
    { pattern: /\brecieve\b/gi, replacement: 'receive', type: 'spelling' },
    { pattern: /\bseperate\b/gi, replacement: 'separate', type: 'spelling' },
    { pattern: /\bdefinately\b/gi, replacement: 'definitely', type: 'spelling' },
    { pattern: /\boccured\b/gi, replacement: 'occurred', type: 'spelling' },
    { pattern: /\baccommodate\b/gi, replacement: 'accommodate', type: 'spelling' },
    { pattern: /\bneccessary\b/gi, replacement: 'necessary', type: 'spelling' },
    { pattern: /\bexistance\b/gi, replacement: 'existence', type: 'spelling' },
    { pattern: /\bbeginning\b/gi, replacement: 'beginning', type: 'spelling' },
    { pattern: /\benvironment\b/gi, replacement: 'environment', type: 'spelling' },
    
    // Grammar improvements
    { pattern: /\bi\b/g, replacement: 'I', type: 'capitalization' },
    { pattern: /\byour\s+welcome\b/gi, replacement: "you're welcome", type: 'grammar' },
    { pattern: /\bits\s+/gi, replacement: "it's ", type: 'grammar' },
    { pattern: /\btheir\s+going\b/gi, replacement: "they're going", type: 'grammar' },
    { pattern: /\bwould\s+of\b/gi, replacement: 'would have', type: 'grammar' },
    { pattern: /\bcould\s+of\b/gi, replacement: 'could have', type: 'grammar' },
    { pattern: /\bshould\s+of\b/gi, replacement: 'should have', type: 'grammar' },
    
    // Punctuation improvements
    { pattern: /\s+,/g, replacement: ',', type: 'punctuation' },
    { pattern: /\s+\./g, replacement: '.', type: 'punctuation' },
    { pattern: /\s+!/g, replacement: '!', type: 'punctuation' },
    { pattern: /\s+\?/g, replacement: '?', type: 'punctuation' },
    { pattern: /,\s*,/g, replacement: ',', type: 'punctuation' },
    { pattern: /\.\s*\./g, replacement: '.', type: 'punctuation' },
    
    // Spacing improvements
    { pattern: /\s{2,}/g, replacement: ' ', type: 'formatting' },
    { pattern: /\n{3,}/g, replacement: '\n\n', type: 'formatting' },
  ];
  
  // Apply corrections
  corrections.forEach(({ pattern, replacement, type }) => {
    const originalCorrected = corrected;
    corrected = corrected.replace(pattern, replacement);
    if (originalCorrected !== corrected && !changes.includes(type)) {
      changes.push(type);
    }
  });
  
  // Capitalize first letter of sentences
  corrected = corrected.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, letter) => {
    if (!changes.includes('capitalization')) {
      changes.push('capitalization');
    }
    return prefix + letter.toUpperCase();
  });
  
  // Trim whitespace
  const trimmed = corrected.trim();
  if (trimmed !== corrected) {
    corrected = trimmed;
    if (!changes.includes('formatting')) {
      changes.push('formatting');
    }
  }
  
  // Calculate confidence based on changes made
  const changeCount = changes.length;
  const confidence = changeCount > 0 ? Math.min(0.85, 0.6 + (changeCount * 0.05)) : 0.95;
  
  console.log('Fallback correction completed');
  
  return {
    corrected,
    confidence,
    changes: {
      total: countDifferences(input, corrected),
      types: changes.length > 0 ? changes : ['basic enhancement']
    }
  };
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