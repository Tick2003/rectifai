import React, { useState } from 'react';
import Button from '../ui/Button';
import { Ghost, AlertCircle, CheckCircle2, Brain, Zap, Globe, AlertTriangle } from 'lucide-react';
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
      console.log('Starting Claude Sonnet correction process...');
      
      // Step 1: Process the universal correction with Claude Sonnet
      const result = await correctText(input);
      console.log('Correction completed:', result);
      
      // Step 2: Save input to Supabase
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

      if (submissionError) {
        console.error('Supabase submission error:', submissionError);
        throw submissionError;
      }

      // Step 3: Save correction
      const { error: correctionError } = await supabase
        .from('corrections')
        .insert([
          {
            submission_id: submission.id,
            corrected_content: result.corrected,
            verified: result.confidence > 0.8
          }
        ]);

      if (correctionError) {
        console.error('Supabase correction error:', correctionError);
        throw correctionError;
      }

      // Step 4: Update UI
      setOutput(result.corrected);
      setCorrectionResult(result);
      console.log('UI updated successfully');
    } catch (error) {
      console.error('Error processing correction:', error);
      
      let errorMessage = 'An error occurred while processing your request.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'AI API configuration issue. Please check your API keys.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else if (error.message.includes('safety')) {
          errorMessage = 'Content blocked by safety filters. Please try different text.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if Claude API is configured
  const isClaudeConfigured = !!import.meta.env.VITE_SUPABASE_URL;

  return (
    <section id="simulator" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-4">
            Try Universal RectifAI Now
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm">
            Experience comprehensive AI correction powered by Claude Sonnet that fixes everything - grammar, logic, facts, style, tone, structure, and more.
          </p>
          
          {/* AI Status Indicator */}
          <div className="mb-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center text-blue-400">
              <Brain size={14} className="mr-2" />
              <span className="text-xs">
                Powered by Claude Sonnet - Advanced AI Correction Engine
              </span>
            </div>
          </div>
          
          {/* Correction Capabilities */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="group relative flex items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-blue-400/20 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-blue-500/10 via-blue-400/20 to-blue-500/10" />
              
              {/* Electric border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-blue-400/30" style={{ boxShadow: 'inset 0 0 15px rgba(59, 130, 246, 0.1), 0 0 15px rgba(59, 130, 246, 0.1)' }} />
              
              <Brain size={14} className="text-blue-400 mr-2 transition-all duration-300 group-hover:scale-110 relative z-10" />
              <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 relative z-10">Logic & Facts</span>
            </div>
            <div className="group relative flex items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-purple-500/10 via-purple-400/20 to-purple-500/10" />
              
              {/* Electric border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-purple-400/30" style={{ boxShadow: 'inset 0 0 15px rgba(147, 51, 234, 0.1), 0 0 15px rgba(147, 51, 234, 0.1)' }} />
              
              <Zap size={14} className="text-purple-400 mr-2 transition-all duration-300 group-hover:scale-110 relative z-10" />
              <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 relative z-10">Style & Tone</span>
            </div>
            <div className="group relative flex items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-green-400/20 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10" />
              
              {/* Electric border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-green-400/30" style={{ boxShadow: 'inset 0 0 15px rgba(34, 197, 94, 0.1), 0 0 15px rgba(34, 197, 94, 0.1)' }} />
              
              <Globe size={14} className="text-green-400 mr-2 transition-all duration-300 group-hover:scale-110 relative z-10" />
              <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 relative z-10">Context & Culture</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto bg-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
          {/* Example Inputs */}
          <div className="mb-6">
            <p className="text-gray-400 text-xs mb-3">Try these examples or paste your own content:</p>
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
                  Paste Any AI Output Here
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
                placeholder="Paste any content here - writing, code, business documents, creative content, technical documentation, or anything else. RectifAI powered by Claude Sonnet will fix everything that needs improvement."
                value={input}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <label htmlFor="output" className="text-gray-300 font-medium text-sm">
                    Claude Sonnet Fixed Output
                  </label>
                  {output && (
                    <div className="relative ml-2">
                      <button
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        aria-label="Show correction info"
                      >
                        <Ghost size={14} />
                      </button>
                      {showTooltip && correctionResult && (
                        <div className="absolute left-full ml-2 top-0 w-72 bg-gray-900 border border-gray-700 rounded-md p-4 text-xs text-gray-300 z-10">
                          <div className="mb-3">
                            <span className="font-medium">Confidence Score: </span>
                            <span className="text-blue-400">{Math.round(correctionResult.confidence * 100)}%</span>
                          </div>
                          <div className="mb-3">
                            <span className="font-medium">Total Changes: </span>
                            <span className="text-green-400">{correctionResult.changes.total}</span>
                          </div>
                          <div>
                            <span className="font-medium">Improvements: </span>
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
                      <p className="mb-2 text-xs">Claude Sonnet corrected output will appear here</p>
                      <p className="text-xs">Fixes: Grammar, Logic, Facts, Style, Tone, Structure, Clarity, and more</p>
                    </div>
                  </div>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 border-t-2 border-b-2 border-blue-400 rounded-full animate-spin mb-3"></div>
                      <span className="text-gray-400 text-xs text-center">
                        Claude Sonnet analyzing and fixing everything...<br />
                        <span className="text-xs text-gray-500">Grammar • Logic • Facts • Style • Context</span>
                      </span>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-red-400 flex items-start">
                    <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1 text-xs">Error:</p>
                      <p className="text-xs">{error}</p>
                      {error.includes('API') && (
                        <p className="text-xs text-gray-500 mt-2">
                          Check your environment variables and API configuration
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
                        Universally Fixed by Claude Sonnet
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
              className="px-12 py-3 text-base"
            >
              {isProcessing ? 'Claude Sonnet Fixing Everything...' : 'RectifAI with Claude Sonnet'}
            </Button>
          </div>
          
          {/* Universal Correction Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              Claude Sonnet analyzes and improves: Language • Logic • Facts • Style • Tone • Structure • Clarity • Context • Culture • Professionalism
            </p>
            <p className="text-blue-400 text-xs mt-2">
              Powered by Claude 3.5 Sonnet - The most advanced AI correction system
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputSimulator;