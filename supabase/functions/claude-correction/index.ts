import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CorrectionRequest {
  input: string;
}

interface CorrectionResponse {
  corrected: string;
  confidence: number;
  changes: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { input }: CorrectionRequest = await req.json()

    if (!input || input.trim().length === 0) {
      throw new Error('Input text is required')
    }

    // Get Claude API key from environment
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY')
    if (!claudeApiKey) {
      throw new Error('Claude API key not configured')
    }

    // Prepare the correction prompt for Claude Sonnet
    const prompt = `You are RectifAI - the world's most advanced universal AI correction system powered by Claude Sonnet. Your mission is to fix EVERYTHING that's wrong with any content, across all domains and contexts.

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

RESPOND WITH ONLY THE CORRECTED TEXT - NO EXPLANATIONS, NO FORMATTING, JUST THE IMPROVED TEXT.`

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Claude API error:', errorData)
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response from Claude API')
    }

    const correctedText = data.content[0].text.trim()

    // Analyze the changes made
    const changes = detectChanges(input, correctedText)
    const confidence = calculateConfidence(input, correctedText, changes)

    const result: CorrectionResponse = {
      corrected: correctedText,
      confidence,
      changes
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )

  } catch (error) {
    console.error('Error in claude-correction function:', error)
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        corrected: '',
        confidence: 0,
        changes: []
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})

function detectChanges(original: string, corrected: string): string[] {
  const changes: string[] = []
  
  // Grammar and spelling improvements
  if (original.toLowerCase() !== corrected.toLowerCase()) {
    changes.push('language enhancement')
  }
  
  // Structure and formatting
  const originalStructure = original.replace(/\w/g, '').replace(/\s/g, '')
  const correctedStructure = corrected.replace(/\w/g, '').replace(/\s/g, '')
  if (originalStructure !== correctedStructure) {
    changes.push('structure optimization')
  }
  
  // Length optimization
  const lengthDiff = Math.abs(original.length - corrected.length)
  if (lengthDiff > original.length * 0.1) {
    changes.push('content optimization')
  }
  
  // Capitalization and formatting
  if (original !== corrected && original.toLowerCase() === corrected.toLowerCase()) {
    changes.push('formatting enhancement')
  }
  
  // Professional tone improvements
  const professionalWords = ['utilize', 'implement', 'facilitate', 'optimize', 'enhance', 'ensure', 'provide', 'maintain']
  const hasNewProfessionalWords = professionalWords.some(word => 
    !original.toLowerCase().includes(word) && corrected.toLowerCase().includes(word)
  )
  if (hasNewProfessionalWords) {
    changes.push('professional enhancement')
  }
  
  // Clarity improvements
  const originalSentences = original.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const correctedSentences = corrected.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  if (Math.abs(originalSentences - correctedSentences) > 0) {
    changes.push('clarity improvement')
  }
  
  // Punctuation improvements
  const originalPunctuation = (original.match(/[.!?,:;]/g) || []).length
  const correctedPunctuation = (corrected.match(/[.!?,:;]/g) || []).length
  if (originalPunctuation !== correctedPunctuation) {
    changes.push('punctuation')
  }
  
  return changes.length > 0 ? changes : ['universal enhancement']
}

function calculateConfidence(original: string, corrected: string, changes: string[]): number {
  // Start with high confidence for Claude Sonnet
  let confidence = 0.95
  
  // Adjust based on the scope of changes
  const changeRatio = Math.abs(original.length - corrected.length) / original.length
  
  // Moderate changes indicate good correction
  if (changeRatio > 0.05 && changeRatio < 0.3) {
    confidence = 0.92
  } else if (changeRatio > 0.3 && changeRatio < 0.6) {
    confidence = 0.88
  } else if (changeRatio > 0.6) {
    confidence = 0.82
  }
  
  // Boost confidence for multiple improvement types
  if (changes.length >= 3) {
    confidence += 0.03
  } else if (changes.length >= 5) {
    confidence += 0.05
  }
  
  // Ensure confidence is between 0.75 and 1.0 for Claude
  return Math.max(0.75, Math.min(1.0, confidence))
}