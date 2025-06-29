import { type CorrectionResult } from '../types';

// Enhanced rule-based text correction system as fallback
export async function correctTextWithFallback(input: string): Promise<CorrectionResult> {
  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  console.log('Using RectifAI enhanced fallback correction system...');
  
  let corrected = input;
  const changes: string[] = [];
  
  // Enhanced grammar and spelling corrections
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
    { pattern: /\balot\b/gi, replacement: 'a lot', type: 'spelling' },
    { pattern: /\beffectivly\b/gi, replacement: 'effectively', type: 'spelling' },
    { pattern: /\bpowerfull\b/gi, replacement: 'powerful', type: 'spelling' },
    { pattern: /\balgorithms?\b/gi, replacement: 'algorithms', type: 'spelling' },
    { pattern: /\bgrammer\b/gi, replacement: 'grammar', type: 'spelling' },
    
    // Grammar improvements
    { pattern: /\bi\b/g, replacement: 'I', type: 'capitalization' },
    { pattern: /\byour\s+welcome\b/gi, replacement: "you're welcome", type: 'grammar' },
    { pattern: /\bits\s+/gi, replacement: "it's ", type: 'grammar' },
    { pattern: /\btheir\s+going\b/gi, replacement: "they're going", type: 'grammar' },
    { pattern: /\bwould\s+of\b/gi, replacement: 'would have', type: 'grammar' },
    { pattern: /\bcould\s+of\b/gi, replacement: 'could have', type: 'grammar' },
    { pattern: /\bshould\s+of\b/gi, replacement: 'should have', type: 'grammar' },
    { pattern: /\bthere\s+performance\b/gi, replacement: 'their performance', type: 'grammar' },
    { pattern: /\bthere\s+customer\b/gi, replacement: 'their customer', type: 'grammar' },
    { pattern: /\bcant\b/gi, replacement: "can't", type: 'grammar' },
    { pattern: /\bdont\b/gi, replacement: "don't", type: 'grammar' },
    { pattern: /\bwont\b/gi, replacement: "won't", type: 'grammar' },
    { pattern: /\bisnt\b/gi, replacement: "isn't", type: 'grammar' },
    { pattern: /\barent\b/gi, replacement: "aren't", type: 'grammar' },
    
    // Punctuation improvements
    { pattern: /\s+,/g, replacement: ',', type: 'punctuation' },
    { pattern: /\s+\./g, replacement: '.', type: 'punctuation' },
    { pattern: /\s+!/g, replacement: '!', type: 'punctuation' },
    { pattern: /\s+\?/g, replacement: '?', type: 'punctuation' },
    { pattern: /,\s*,/g, replacement: ',', type: 'punctuation' },
    { pattern: /\.\s*\./g, replacement: '.', type: 'punctuation' },
    { pattern: /!!!+/g, replacement: '!', type: 'punctuation' },
    { pattern: /\?\?\?+/g, replacement: '?', type: 'punctuation' },
    { pattern: /\.\.\.+/g, replacement: '...', type: 'punctuation' },
    
    // Spacing improvements
    { pattern: /\s{2,}/g, replacement: ' ', type: 'formatting' },
    { pattern: /\n{3,}/g, replacement: '\n\n', type: 'formatting' },
    { pattern: /\t+/g, replacement: ' ', type: 'formatting' },
    
    // Professional language improvements
    { pattern: /\bvery\s+good\b/gi, replacement: 'excellent', type: 'professional enhancement' },
    { pattern: /\breally\s+good\b/gi, replacement: 'exceptional', type: 'professional enhancement' },
    { pattern: /\bworks\s+well\b/gi, replacement: 'performs effectively', type: 'professional enhancement' },
    { pattern: /\bstuff\b/gi, replacement: 'items', type: 'professional enhancement' },
    { pattern: /\bthing\b/gi, replacement: 'element', type: 'professional enhancement' },
    { pattern: /\bget\s+better\b/gi, replacement: 'improve', type: 'professional enhancement' },
    { pattern: /\bmake\s+sure\b/gi, replacement: 'ensure', type: 'professional enhancement' },
    { pattern: /\bhelp\s+with\b/gi, replacement: 'assist with', type: 'professional enhancement' },
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
  const originalForCapitalization = corrected;
  corrected = corrected.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, letter) => {
    return prefix + letter.toUpperCase();
  });
  if (originalForCapitalization !== corrected && !changes.includes('capitalization')) {
    changes.push('capitalization');
  }
  
  // Improve sentence structure by adding commas where needed
  const originalForCommas = corrected;
  corrected = corrected.replace(/\b(however|therefore|furthermore|moreover|consequently|nevertheless)\s+/gi, (match, word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ', ';
  });
  if (originalForCommas !== corrected && !changes.includes('structure improvement')) {
    changes.push('structure improvement');
  }
  
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
  const confidence = changeCount > 0 ? Math.min(0.92, 0.75 + (changeCount * 0.03)) : 0.95;
  
  console.log('RectifAI fallback correction completed with', changeCount, 'improvements');
  
  return {
    corrected,
    confidence,
    changes: {
      total: countDifferences(input, corrected),
      types: changes.length > 0 ? changes : ['RectifAI enhancement']
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