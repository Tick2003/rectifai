import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { ArrowRight, Zap, Globe, Brain, Sparkles, X } from 'lucide-react';

const Hero: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const words = ['Everything', 'Grammar', 'Logic', 'Facts', 'Style', 'Tone', 'Structure', 'Clarity', 'Context'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Pause before deleting
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentWordIndex, words]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const scrollToSimulator = () => {
    const simulatorSection = document.getElementById('simulator');
    if (simulatorSection) {
      simulatorSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const correctionTypes = [
    {
      id: 'logic',
      icon: Brain,
      name: 'Logic',
      color: 'blue',
      title: 'Advanced Logic & Reasoning Correction',
      description: 'Claude Sonnet 4 analyzes and fixes logical inconsistencies, argument structure, and reasoning flow with superior AI understanding.',
      features: [
        'Identifies complex logical fallacies and contradictions',
        'Improves sophisticated argument structure and flow',
        'Ensures advanced factual accuracy and consistency',
        'Fixes missing context and information gaps intelligently',
        'Validates complex cause-and-effect relationships',
        'Enhances critical thinking presentation with Claude Sonnet 4'
      ],
      examples: [
        'Before: "All birds can fly, penguins are birds, so penguins can fly."',
        'After: "Most birds can fly, but penguins are flightless birds adapted for swimming."'
      ]
    },
    {
      id: 'style',
      icon: Sparkles,
      name: 'Style',
      color: 'purple',
      title: 'Superior Style & Tone Enhancement',
      description: 'Advanced style optimization powered by Claude Sonnet 4 that adapts tone, voice, and presentation for maximum impact.',
      features: [
        'Intelligently adjusts tone for target audience',
        'Enhances sophisticated writing voice and personality',
        'Optimizes advanced word choice and vocabulary',
        'Perfects sentence structure and rhythm with AI',
        'Ensures consistent professional style throughout',
        'Adapts formality level with Claude Sonnet 4 precision'
      ],
      examples: [
        'Before: "The thing is really good and works well for stuff."',
        'After: "This solution delivers exceptional performance and versatility for diverse applications."'
      ]
    },
    {
      id: 'facts',
      icon: Zap,
      name: 'Facts',
      color: 'green',
      title: 'Advanced Factual Accuracy Verification',
      description: 'Comprehensive fact-checking and accuracy enhancement powered by Claude Sonnet 4 across all domains and subjects.',
      features: [
        'Verifies complex statistical data and numbers',
        'Corrects historical dates and events with precision',
        'Validates advanced scientific claims and terminology',
        'Checks geographical information with Claude Sonnet 4',
        'Ensures technical accuracy across all domains',
        'Cross-references current information intelligently'
      ],
      examples: [
        'Before: "The Great Wall of China is visible from space with the naked eye."',
        'After: "The Great Wall of China is not visible from space with the naked eye, contrary to popular belief."'
      ]
    },
    {
      id: 'context',
      icon: Globe,
      name: 'Context',
      color: 'orange',
      title: 'Global Contextual & Cultural Awareness',
      description: 'Intelligent context analysis powered by Claude Sonnet 4 that ensures cultural sensitivity and situational appropriateness.',
      features: [
        'Adapts content for diverse cultural contexts',
        'Ensures appropriate regional language variations',
        'Considers complex audience demographics',
        'Adjusts for industry-specific norms with AI',
        'Maintains sophisticated situational awareness',
        'Respects cultural sensitivities with Claude Sonnet 4'
      ],
      examples: [
        'Before: "This is a no-brainer for any company."',
        'After: "This represents a clear strategic advantage for forward-thinking organizations."'
      ]
    }
  ];

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-400',
        text: 'text-blue-400',
        border: 'border-blue-400',
        hover: 'hover:bg-blue-400/10 hover:border-blue-400'
      },
      purple: {
        bg: 'bg-purple-400',
        text: 'text-purple-400',
        border: 'border-purple-400',
        hover: 'hover:bg-purple-400/10 hover:border-purple-400'
      },
      green: {
        bg: 'bg-green-400',
        text: 'text-green-400',
        border: 'border-green-400',
        hover: 'hover:bg-green-400/10 hover:border-green-400'
      },
      orange: {
        bg: 'bg-orange-400',
        text: 'text-orange-400',
        border: 'border-orange-400',
        hover: 'hover:bg-orange-400/10 hover:border-orange-400'
      }
    };
    return colorMap[color as keyof typeof colorMap]?.[variant] || '';
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-gray-800/80 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm border border-gray-700">
            <Brain size={14} className="text-blue-400 mr-2" />
            <span className="text-gray-300 text-xs">Powered by Claude Sonnet 4 AI</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
            When AI Fails <span className="text-red-400">Anything</span>, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400">
              Claude Sonnet 4 Fixes{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
                  {displayText}
                </span>
                <span 
                  className={`inline-block w-1 bg-white ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
                  style={{ 
                    height: '0.5em',
                    verticalAlign: 'baseline',
                    marginBottom: '0.1em'
                  }}
                />
              </span>
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            The world's most comprehensive AI correction system powered by Claude Sonnet 4. We fix grammar, logic, facts, 
            style, tone, structure, clarity, professionalism, and everything else across all domains.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
            {correctionTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedBadge(type.id)}
                  className={`
                    group relative flex items-center justify-center bg-gray-900/50 rounded-lg p-3 border border-gray-800
                    transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden
                    ${getColorClasses(type.color, 'hover')}
                    hover:shadow-lg hover:shadow-${type.color}-400/20
                  `}
                >
                  {/* Glow effect background */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 pointer-events-none
                    bg-gradient-to-r from-${type.color}-500/10 via-${type.color}-400/20 to-${type.color}-500/10
                    blur-sm
                  `} />
                  
                  {/* Light pulse effect */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    transition-all duration-500 pointer-events-none
                    bg-gradient-to-br from-${type.color}-400/5 via-transparent to-${type.color}-400/5
                    animate-pulse
                  `} />
                  
                  {/* Electric border effect */}
                  <div className={`
                    absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none
                    border border-${type.color}-400/30
                  `}
                  style={{
                    boxShadow: `inset 0 0 15px var(--tw-${type.color}-400-10), 0 0 15px var(--tw-${type.color}-400-20)`
                  }} />
                  
                  <IconComponent 
                    size={18} 
                    className={`${getColorClasses(type.color, 'text')} mr-2 transition-all duration-300 group-hover:scale-110 relative z-10`} 
                  />
                  <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 relative z-10">
                    {type.name}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={scrollToSimulator}
            >
              <span>Fix Everything with Claude Sonnet 4</span>
              <ArrowRight size={16} className="ml-2 inline transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={scrollToSimulator}
            >
              See Claude Sonnet 4 Correction
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Content', desc: 'Writing & Communication' },
              { name: 'Code', desc: 'Programming & Technical' },
              { name: 'Business', desc: 'Professional & Corporate' },
              { name: 'Creative', desc: 'Art & Storytelling' }
            ].map((domain) => (
              <div key={domain.name} className="flex flex-col items-center">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Claude Sonnet 4 Fixes</p>
                <p className="text-gray-300 font-medium text-sm">{domain.name}</p>
                <p className="text-gray-500 text-xs mt-1">{domain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Badge Details */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const badge = correctionTypes.find(type => type.id === selectedBadge);
              if (!badge) return null;
              
              const IconComponent = badge.icon;
              
              return (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${getColorClasses(badge.color, 'bg')}/20 border ${getColorClasses(badge.color, 'border')}/30 mr-4`}>
                        <IconComponent size={22} className={getColorClasses(badge.color, 'text')} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{badge.title}</h3>
                        <p className="text-xs text-blue-400 mt-1">Claude Sonnet 4 Powered</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBadge(null)}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    {badge.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-white mb-4">Claude Sonnet 4 Capabilities:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {badge.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className={`w-2 h-2 rounded-full ${getColorClasses(badge.color, 'bg')} mt-2 mr-3 flex-shrink-0`} />
                          <span className="text-gray-300 text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="mb-6">
                    <h4 className="text-base font-semibold text-white mb-4">Claude Sonnet 4 Example Correction:</h4>
                    <div className="space-y-4">
                      {badge.examples.map((example, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <p className="text-gray-300 text-xs leading-relaxed">{example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center">
                    <Button
                      onClick={() => {
                        setSelectedBadge(null);
                        scrollToSimulator();
                      }}
                      className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <span>Try {badge.name} Correction with Claude Sonnet 4</span>
                      <ArrowRight size={14} className="ml-2 inline transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;