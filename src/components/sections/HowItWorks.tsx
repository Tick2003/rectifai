import React from 'react';
import { AlertCircle, Zap, CheckCircle, Brain, Globe, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <AlertCircle className="w-8 h-8 text-red-400" />,
      title: "AI Output Has Issues",
      description: "Grammar, logic, facts, style, tone, structure, clarity, or any other problems across any domain.",
      color: "from-red-500/10 to-transparent",
      examples: ["Grammar errors", "Factual mistakes", "Poor structure", "Wrong tone"]
    },
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "RectifAI Analyzes Everything",
      description: "Our universal AI scans for all possible improvements across language, logic, facts, style, and context.",
      color: "from-blue-500/10 to-transparent",
      examples: ["Language analysis", "Fact checking", "Style optimization", "Context awareness"]
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      title: "Perfect Results — Universally",
      description: "Get flawless output with every aspect improved: accuracy, clarity, professionalism, and impact.",
      color: "from-green-500/10 to-transparent",
      examples: ["Perfect grammar", "Accurate facts", "Professional tone", "Clear structure"]
    }
  ];

  const correctionTypes = [
    { icon: <Sparkles className="w-5 h-5 text-purple-400" />, name: "Language & Style", count: "15+" },
    { icon: <Brain className="w-5 h-5 text-blue-400" />, name: "Logic & Facts", count: "12+" },
    { icon: <Globe className="w-5 h-5 text-green-400" />, name: "Context & Culture", count: "8+" },
    { icon: <Zap className="w-5 h-5 text-orange-400" />, name: "Professional & Technical", count: "20+" }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Universal AI Correction Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Experience comprehensive AI error correction that fixes everything in three intelligent steps
          </p>
          
          {/* Correction Types Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {correctionTypes.map((type, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center justify-center mb-2">
                  {type.icon}
                </div>
                <p className="text-gray-300 text-sm font-medium">{type.name}</p>
                <p className="text-gray-500 text-xs">{type.count} fixes</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`absolute inset-0 bg-gradient-radial ${step.color} opacity-20 blur-xl -z-10`} />
              <Card 
                className="h-full flex flex-col p-8"
                highlighted={index === 1}
              >
                <div className="text-center mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-center mb-6">
                  {step.description}
                </p>
                
                {/* Examples */}
                <div className="mt-auto">
                  <p className="text-gray-500 text-sm mb-3 text-center">Examples:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {step.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="bg-gray-800/50 rounded px-2 py-1 text-xs text-gray-400 text-center">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute -right-12 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-gray-600 to-transparent" />
                    <div className="w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent absolute right-0 top-1/2 transform -translate-y-1/2" />
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
        
        {/* Universal Coverage */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Universal Coverage
              </span>
            </h3>
            <p className="text-gray-400 mb-6">
              RectifAI fixes everything across all domains, languages, and contexts
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "Grammar & Spelling", "Logic & Reasoning", "Facts & Accuracy", "Style & Tone",
                "Structure & Flow", "Clarity & Readability", "Professional Standards", "Cultural Context"
              ].map((area, index) => (
                <div key={index} className="text-gray-300 bg-gray-800/30 rounded-lg py-2 px-3">
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;