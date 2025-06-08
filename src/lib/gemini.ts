import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Using fallback correction logic.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function correctTextWithGemini(input: string): Promise<{
  corrected: string;
  confidence: number;
  changes: string[];
}> {
  if (!genAI) {
    throw new Error('Gemini API not configured - API key missing');
  }

  if (!input || input.trim().length === 0) {
    throw new Error('Input text is required');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    const prompt = `You are RectifAI - the world's most advanced universal AI correction system. Your mission is to fix EVERYTHING that's wrong with any content, across all domains and contexts.

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

INPUT TO CORRECT: "${input}"

Provide ONLY the corrected version that addresses ALL possible improvements while preserving the core message and intent. Make it perfect in every way possible.

RESPOND WITH ONLY THE CORRECTED TEXT - NO EXPLANATIONS, NO FORMATTING, JUST THE IMPROVED TEXT.`;

    console.log('Sending request to Gemini API...');
    
    const result = await model.generateContent(prompt);
    
    if (!result.response) {
      throw new Error('No response received from Gemini API');
    }

    const response = await result.response;
    const correctedText = response.text().trim();

    if (!correctedText) {
      throw new Error('Empty response from Gemini API');
    }

    console.log('Gemini API response received successfully');

    // Calculate confidence based on the comprehensiveness of changes
    const changes = detectUniversalChanges(input, correctedText);
    const confidence = calculateUniversalConfidence(input, correctedText, changes);

    return {
      corrected: correctedText,
      confidence,
      changes
    };
  } catch (error) {
    console.error('Gemini API error details:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your API key configuration.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('Gemini API quota exceeded. Please try again later.');
      } else if (error.message.includes('SAFETY')) {
        throw new Error('Content blocked by Gemini safety filters. Please try different text.');
      } else {
        throw new Error(`Gemini API error: ${error.message}`);
      }
    }
    
    throw new Error('Failed to process text with Gemini API');
  }
}

function detectUniversalChanges(original: string, corrected: string): string[] {
  const changes: string[] = [];
  
  // Grammar and spelling improvements
  const grammarPatterns = [
    { pattern: /\bi\b/g, replacement: /\bI\b/g, type: 'capitalization' },
    { pattern: /\bteh\b/gi, replacement: /\bthe\b/gi, type: 'spelling' },
    { pattern: /\brecieve\b/gi, replacement: /\breceive\b/gi, type: 'spelling' },
    { pattern: /\bseperate\b/gi, replacement: /\bseparate\b/gi, type: 'spelling' },
    { pattern: /\bdefinately\b/gi, replacement: /\bdefinitely\b/gi, type: 'spelling' }
  ];
  
  grammarPatterns.forEach(({ pattern, replacement, type }) => {
    if (pattern.test(original) && replacement.test(corrected)) {
      changes.push(type);
    }
  });
  
  // Language improvements
  if (original.toLowerCase() !== corrected.toLowerCase()) {
    changes.push('language enhancement');
  }
  
  // Structure and formatting
  const originalStructure = original.replace(/\w/g, '').replace(/\s/g, '');
  const correctedStructure = corrected.replace(/\w/g, '').replace(/\s/g, '');
  if (originalStructure !== correctedStructure) {
    changes.push('structure optimization');
  }
  
  // Length optimization (conciseness or expansion)
  const lengthDiff = Math.abs(original.length - corrected.length);
  if (lengthDiff > original.length * 0.1) {
    changes.push('content optimization');
  }
  
  // Capitalization and formatting
  if (original !== corrected && original.toLowerCase() === corrected.toLowerCase()) {
    changes.push('formatting enhancement');
  }
  
  // Professional tone improvements
  const professionalWords = ['utilize', 'implement', 'facilitate', 'optimize', 'enhance', 'ensure', 'provide', 'maintain'];
  const hasNewProfessionalWords = professionalWords.some(word => 
    !original.toLowerCase().includes(word) && corrected.toLowerCase().includes(word)
  );
  if (hasNewProfessionalWords) {
    changes.push('professional enhancement');
  }
  
  // Clarity improvements
  const originalSentences = original.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const correctedSentences = corrected.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (Math.abs(originalSentences - correctedSentences) > 0) {
    changes.push('clarity improvement');
  }
  
  // Punctuation improvements
  const originalPunctuation = (original.match(/[.!?,:;]/g) || []).length;
  const correctedPunctuation = (corrected.match(/[.!?,:;]/g) || []).length;
  if (originalPunctuation !== correctedPunctuation) {
    changes.push('punctuation');
  }
  
  return changes.length > 0 ? changes : ['universal enhancement'];
}

function calculateUniversalConfidence(original: string, corrected: string, changes: string[]): number {
  // Start with high confidence for universal correction
  let confidence = 0.95;
  
  // Adjust based on the scope of changes
  const changeRatio = Math.abs(original.length - corrected.length) / original.length;
  
  // Moderate changes indicate good correction
  if (changeRatio > 0.05 && changeRatio < 0.3) {
    confidence = 0.92; // High confidence for substantial improvements
  } else if (changeRatio > 0.3 && changeRatio < 0.6) {
    confidence = 0.85; // Good confidence for major improvements
  } else if (changeRatio > 0.6) {
    confidence = 0.75; // Lower confidence for major rewrites
  }
  
  // Boost confidence for multiple improvement types
  if (changes.length >= 3) {
    confidence += 0.03;
  } else if (changes.length >= 5) {
    confidence += 0.05;
  }
  
  // Ensure confidence is between 0.7 and 1.0 for universal correction
  return Math.max(0.7, Math.min(1.0, confidence));
}