import React, { useState } from 'react';
import Button from '../ui/Button';
import { Ghost, AlertCircle, CheckCircle2, Brain, Zap, Globe, AlertTriangle, Cpu } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { correctText } from '../../lib/correctionLogic';
import type { CorrectionResult } from '../../types';

const InputSimulator: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exampleInputs = [
    "i am using an Ai assistant but it makes mistakes sometimes... i cant seem to get it to format things correctly!!! its quite frustrating and the grammer is bad to.",
    "The company should of hired more people because there performance was declining and they needed to improve there customer service department.",
    "Machine learning algoritms can be very powerfull for solving complex problems but they require alot of data and computational resources to train effectivly.",
    "We need to implement a new strategy that will help us achieve our goals and objectives while maintaining high quality standards and ensuring customer satisfaction."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setOutput('');
    setCorrectionResult(null);
    setError(null);
  };

  const loadExample = (example: string) => {
    setInput(example);
    setOutput('');
    setCorrectionResult(null);
    setError(null);
  };

  const simulateRectification = async () => {
    if (!input.trim()) {
      setError('Please enter some text to correct');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Starting RectifAI correction process...');
      
      // Step 1: Process the universal correction with RectifAI
      const result = await correctText(input);
      console.log('RectifAI correction completed:', result);
      
      // Step 2: Save input to Supabase (if available)
      try {
        const { data: submission, error: submissionError } = await supabase
          .from('submissions')
          .insert([
            {
              input_type: 'text',
              input_content: input,
              status: 'completed'
            }
          ])
          .select()
          .single();

        if (!submissionError && submission) {
          // Step 3: Save correction
          await supabase
            .from('corrections')
            .insert([
              {
                submission_id: submission.id,
                corrected_content: result.corrected,
                verified: result.confidence > 0.8
              }
            ]);
        }
      } catch (dbError) {
        console.log('Database save failed (non-critical):', dbError);
        // Continue with the correction even if database save fails
      }

      // Step 4: Update UI
      setOutput(result.corrected);
      setCorrectionResult(result);
      console.log('RectifAI UI updated successfully!');
    } catch (error) {
      console.error('Error processing RectifAI correction:', error);
      
      let errorMessage = 'An error occurred while processing your request.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'RectifAI API configuration issue. Using fallback system.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'RectifAI API quota exceeded. Using fallback system.';
        } else if (error.message.includes('safety')) {
          errorMessage = 'Content blocked by RectifAI safety filters. Please try different text.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check API configuration status
  const hasClaudeKey = !!import.meta.env.CLAUDE_API_KEY;
  const hasOpenAIKey = !!import.meta.env.VITE_OPENAI_API_KEY;
  const hasHuggingFaceKey = !!import.meta.env.VITE_HUGGINGFACE_API_KEY;
  const hasGeminiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
  const hasAnyAPI = hasClaudeKey || hasOpenAIKey || hasHuggingFaceKey || hasGeminiKey;

  return (
    <section id="simulator" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-4">
            Try RectifAI Universal Correction
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm">
            Experience advanced AI correction that fixes everything - grammar, logic, facts, style, tone, structure, and more.
          </p>
          
          {/* RectifAI Status Indicator */}
          <div className={`mb-6 border rounded-lg p-4 max-w-2xl mx-auto ${
            hasAnyAPI 
              ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' 
              : 'bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-orange-500/30'
          }`}>
            <div className={`flex items-center justify-center ${hasAnyAPI ? 'text-blue-300' : 'text-orange-300'}`}>
              {hasAnyAPI ? <Brain size={16} className="mr-2" /> : <Cpu size={16} className="mr-2" />}
              <span className="text-sm">
                {hasAnyAPI 
                  ? 'Powered by RectifAI - Advanced AI Correction Engine' 
                  : 'RectifAI Fallback Mode - Enhanced Rule-Based Correction'
                }
              </span>
            </div>
            {!hasAnyAPI && (
              <p className="text-xs text-orange-400 mt-2">
                Add API keys for premium AI correction (OpenAI, Hugging Face, or Gemini)
              </p>
            )}
          </div>
          
          {/* Advanced Correction Capabilities */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="group relative flex items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-blue-400/20 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-blue-500/10 via-blue-400/20 to-blue-500/10" />
              
              {/* Electric border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-blue-400/30" style={{ boxShadow: 'inset 0 0 15px rgba(59, 130, 246, 0.1), 0 0 15px rgba(59, 130, 246, 0.1)' }} />
              
              <Brain size={14} className="text-blue-400 mr-2 transition-all duration-300 group-hover:scale-110 relative z-10" />
              <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 relative z-10">Advanced Logic & Facts</span>
            </div>
            <div className="group relative flex items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-purple-500/10 via-purple-400/20 to-purple-500/10" />
              
              {/* Electric border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-purple-400/30" style={{ boxShadow: 'inset 0 0 15px rgba(147, 51, 234, 0.1), 0 0 15px rgba(147, 51, 234, 0.1)' }} />
              
              <Zap size={14} className="text-purple-400 mr-2 transition-all duration-300 group-hover:scale-110 relative z-10" />
              <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 relative z-10">Superior Style & Tone</span>
            </div>
            <div className="group relative flex items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-green-400/20 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10" />
              
              {/* Electric border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-green-400/30" style={{ boxShadow: 'inset 0 0 15px rgba(34, 197, 94, 0.1), 0 0 15px rgba(34, 197, 94, 0.1)' }} />
              
              <Globe size={14} className="text-green-400 mr-2 transition-all duration-300 group-hover:scale-110 relative z-10" />
              <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 relative z-10">Global Context & Culture</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto bg-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
          {/* Example Inputs */}
          <div className="mb-6">
            <p className="text-gray-400 text-xs mb-3">Try these examples or paste your own content for RectifAI correction:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleInputs.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="group relative text-left bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-gray-400 text-xs transition-all duration-300 hover:bg-gray-800/50 hover:text-gray-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5 overflow-hidden"
                >
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
                  
                  {/* Light border effect */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/10" />
                  
                  <span className="relative z-10">{example.substring(0, 80)}...</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="input" className="text-gray-300 font-medium text-sm">
                  Paste Any Content Here
                </label>
                {!input && (
                  <span className="text-gray-500 text-xs">
                    Any content, any domain, any language
                  </span>
                )}
              </div>
              <textarea
                id="input"
                className="w-full h-80 bg-gray-900 border border-gray-800 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm"
                placeholder="Paste any content here - writing, code, business documents, creative content, technical documentation, or anything else. RectifAI will fix everything that needs improvement with superior intelligence."
                value={input}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <label htmlFor="output" className="text-gray-300 font-medium text-sm">
                    RectifAI Perfected Output
                  </label>
                  {output && (
                    <div className="relative ml-2">
                      <button
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        aria-label="Show RectifAI correction info"
                      >
                        <Ghost size={14} />
                      </button>
                      {showTooltip && correctionResult && (
                        <div className="absolute left-full ml-2 top-0 w-72 bg-gray-900 border border-gray-700 rounded-md p-4 text-xs text-gray-300 z-10">
                          <div className="mb-3">
                            <span className="font-medium">RectifAI Confidence: </span>
                            <span className="text-blue-400">{Math.round(correctionResult.confidence * 100)}%</span>
                          </div>
                          <div className="mb-3">
                            <span className="font-medium">Total Improvements: </span>
                            <span className="text-green-400">{correctionResult.changes.total}</span>
                          </div>
                          <div>
                            <span className="font-medium">RectifAI Enhancements: </span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {correctionResult.changes.types.map((type, index) => (
                                <span key={index} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full h-80 bg-gray-900 border border-gray-800 rounded-lg p-4 text-white resize-none overflow-auto relative text-sm">
                {!output && !isProcessing && !error && (
                  <div className="text-gray-500 flex items-start">
                    <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="mb-2 text-xs">RectifAI perfected output will appear here</p>
                      <p className="text-xs">
                        {hasAnyAPI 
                          ? 'Advanced AI Fixes: Grammar, Logic, Facts, Style, Tone, Structure, Clarity, Professional Enhancement, and more'
                          : 'Enhanced Rule-Based Fixes: Grammar, Spelling, Punctuation, Style, Professional Language, and Structure'
                        }
                      </p>
                    </div>
                  </div>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 border-t-2 border-b-2 border-blue-400 rounded-full animate-spin mb-3"></div>
                      <span className="text-gray-400 text-xs text-center">
                        RectifAI analyzing and perfecting everything...<br />
                        <span className="text-xs text-gray-500">
                          {hasAnyAPI 
                            ? 'Advanced Grammar • Superior Logic • Verified Facts • Professional Style • Cultural Context'
                            : 'Enhanced Grammar • Spelling Correction • Professional Language • Structure Optimization'
                          }
                        </span>
                      </span>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-red-400 flex items-start">
                    <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1 text-xs">RectifAI Error:</p>
                      <p className="text-xs">{error}</p>
                      {error.includes('API') && (
                        <p className="text-xs text-gray-500 mt-2">
                          Check your RectifAI API configuration or use fallback mode
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {output && !isProcessing && !error && (
                  <div className="space-y-4">
                    <div className="leading-relaxed text-sm">{output}</div>
                    <div className="border-t border-gray-800 pt-3">
                      <div className="flex items-center text-xs text-blue-400 mb-2">
                        <CheckCircle2 size={12} className="mr-1.5" />
                        {hasAnyAPI ? 'Universally Perfected by RectifAI' : 'Enhanced by RectifAI Fallback System'}
                      </div>
                      {correctionResult && (
                        <div className="flex flex-wrap gap-2">
                          {correctionResult.changes.types.map((type, index) => (
                            <span key={index} className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={simulateRectification}
              disabled={!input.trim() || isProcessing}
              className="px-12 py-3 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isProcessing ? 'RectifAI Perfecting Everything...' : 'Fix Everything with RectifAI'}
            </Button>
          </div>
          
          {/* RectifAI Universal Correction Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              {hasAnyAPI 
                ? 'RectifAI analyzes and perfects: Language • Logic • Facts • Style • Tone • Structure • Clarity • Context • Culture • Professionalism • Technical Accuracy'
                : 'RectifAI Fallback enhances: Grammar • Spelling • Punctuation • Professional Language • Structure • Formatting • Clarity'
              }
            </p>
            <p className="text-blue-400 text-xs mt-2">
              {hasAnyAPI 
                ? 'Powered by Advanced AI - The most sophisticated correction system'
                : 'Enhanced Rule-Based System - Reliable correction without API dependencies'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputSimulator;