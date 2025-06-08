import React from 'react';
import { AlertCircle, Zap, CheckCircle, Brain, Globe, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <AlertCircle className="w-7 h-7 text-red-400" />,
      title: "AI Output Has Issues",
      description: "Grammar, logic, facts, style, tone, structure, clarity, or any other problems across any domain.",
      color: "from-red-500/10 to-transparent",
      examples: ["Grammar errors", "Factual mistakes", "Poor structure", "Wrong tone"]
    },
    {
      icon: <Brain className="w-7 h-7 text-blue-400" />,
      title: "RectifAI Analyzes Everything",
      description: "Our universal AI scans for all possible improvements across language, logic, facts, style, and context.",
      color: "from-blue-500/10 to-transparent",
      examples: ["Language analysis", "Fact checking", "Style optimization", "Context awareness"]
    },
    {
      icon: <CheckCircle className="w-7 h-7 text-green-400" />,
      title: "Perfect Results — Universally",
      description: "Get flawless output with every aspect improved: accuracy, clarity, professionalism, and impact.",
      color: "from-green-500/10 to-transparent",
      examples: ["Perfect grammar", "Accurate facts", "Professional tone", "Clear structure"]
    }
  ];

  const correctionTypes = [
    { icon: <Sparkles className="w-4 h-4 text-purple-400" />, name: "Language & Style", count: "15+" },
    { icon: <Brain className="w-4 h-4 text-blue-400" />, name: "Logic & Facts", count: "12+" },
    { icon: <Globe className="w-4 h-4 text-green-400" />, name: "Context & Culture", count: "8+" },
    { icon: <Zap className="w-4 h-4 text-orange-400" />, name: "Professional & Technical", count: "20+" }
  ];

  const universalCoverageItems = [
    { name: "Grammar & Spelling", color: "blue" },
    { name: "Logic & Reasoning", color: "purple" },
    { name: "Facts & Accuracy", color: "green" },
    { name: "Style & Tone", color: "orange" },
    { name: "Structure & Flow", color: "cyan" },
    { name: "Clarity & Readability", color: "pink" },
    { name: "Professional Standards", color: "yellow" },
    { name: "Cultural Context", color: "red" }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-4">
            Universal AI Correction Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm">
            Experience comprehensive AI error correction that fixes everything in three intelligent steps
          </p>
          
          {/* Correction Types Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {correctionTypes.map((type, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center justify-center mb-2">
                  {type.icon}
                </div>
                <p className="text-gray-300 text-xs font-medium">{type.name}</p>
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
                <div className="flex justify-center mb-6">{step.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-center mb-6 text-sm">
                  {step.description}
                </p>
                
                {/* Examples */}
                <div className="mt-auto">
                  <p className="text-gray-500 text-xs mb-3 text-center">Examples:</p>
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
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Universal Coverage
              </span>
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              RectifAI fixes everything across all domains, languages, and contexts
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {universalCoverageItems.map((area, index) => (
                <div 
                  key={index} 
                  className={`
                    group relative text-gray-300 bg-gray-800/30 rounded-lg py-3 px-4 
                    transition-all duration-300 cursor-pointer overflow-hidden
                    hover:scale-105 hover:shadow-lg hover:bg-gray-700/50
                    hover:text-white hover:border-${area.color}-400/50
                    border border-transparent
                  `}
                >
                  {/* Lightning Effect Background */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 pointer-events-none
                    bg-gradient-to-r from-${area.color}-500/10 via-${area.color}-400/20 to-${area.color}-500/10
                  `} />
                  
                  {/* Lightning Bolt Animation */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    transition-all duration-500 pointer-events-none
                  `}>
                    {/* Lightning Path 1 */}
                    <div className={`
                      absolute top-0 left-1/4 w-0.5 h-full 
                      bg-gradient-to-b from-transparent via-${area.color}-400 to-transparent
                      transform -skew-x-12 animate-pulse
                      group-hover:animate-none
                    `} 
                    style={{
                      animation: 'lightning 0.6s ease-in-out',
                      animationDelay: '0.1s'
                    }} />
                    
                    {/* Lightning Path 2 */}
                    <div className={`
                      absolute top-0 right-1/3 w-0.5 h-full 
                      bg-gradient-to-b from-transparent via-${area.color}-300 to-transparent
                      transform skew-x-12 animate-pulse
                      group-hover:animate-none
                    `}
                    style={{
                      animation: 'lightning 0.6s ease-in-out',
                      animationDelay: '0.3s'
                    }} />
                    
                    {/* Electric Sparks */}
                    <div className={`
                      absolute top-1/4 left-1/2 w-1 h-1 
                      bg-${area.color}-400 rounded-full
                      transform -translate-x-1/2 -translate-y-1/2
                    `}
                    style={{
                      boxShadow: `0 0 10px var(--tw-${area.color}-400), 0 0 20px var(--tw-${area.color}-400)`,
                      animation: 'spark 0.8s ease-in-out infinite',
                      animationDelay: '0.2s'
                    }} />
                    
                    <div className={`
                      absolute bottom-1/4 right-1/4 w-1 h-1 
                      bg-${area.color}-300 rounded-full
                    `}
                    style={{
                      boxShadow: `0 0 8px var(--tw-${area.color}-300), 0 0 16px var(--tw-${area.color}-300)`,
                      animation: 'spark 0.8s ease-in-out infinite',
                      animationDelay: '0.5s'
                    }} />
                  </div>
                  
                  {/* Glow Effect */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none
                    bg-gradient-to-r from-transparent via-${area.color}-400/5 to-transparent
                    blur-sm
                  `} />
                  
                  {/* Text Content */}
                  <span className="relative z-10 font-medium text-xs">
                    {area.name}
                  </span>
                  
                  {/* Electric Border Effect */}
                  <div className={`
                    absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none
                    border border-${area.color}-400/30
                  `}
                  style={{
                    boxShadow: `inset 0 0 20px var(--tw-${area.color}-400-10), 0 0 20px var(--tw-${area.color}-400-20)`
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes lightning {
          0% { opacity: 0; transform: scaleY(0) skew(-12deg); }
          10% { opacity: 1; transform: scaleY(0.3) skew(-12deg); }
          20% { opacity: 0.8; transform: scaleY(0.7) skew(-12deg); }
          30% { opacity: 1; transform: scaleY(1) skew(-12deg); }
          40% { opacity: 0.9; transform: scaleY(0.8) skew(-12deg); }
          50% { opacity: 1; transform: scaleY(1) skew(-12deg); }
          60% { opacity: 0.7; transform: scaleY(0.9) skew(-12deg); }
          70% { opacity: 1; transform: scaleY(1) skew(-12deg); }
          80% { opacity: 0.8; transform: scaleY(0.6) skew(-12deg); }
          90% { opacity: 0.4; transform: scaleY(0.3) skew(-12deg); }
          100% { opacity: 0; transform: scaleY(0) skew(-12deg); }
        }
        
        @keyframes spark {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;