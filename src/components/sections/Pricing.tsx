import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out RectifAI",
      features: [
        "10 corrections per day",
        "Basic error detection",
        "Standard response time",
        "Community support"
      ]
    },
    {
      name: "Pro",
      price: "₹599",
      period: "per month",
      description: "For professionals who need reliable AI",
      features: [
        "Unlimited corrections",
        "Advanced error detection",
        "Faster response time",
        "Priority email support",
        "API access",
        "Custom integrations"
      ],
      highlighted: true
    },
    {
      name: "Elite",
      price: "₹1,499",
      period: "per month",
      description: "For enterprises requiring maximum accuracy",
      features: [
        "Everything in Pro",
        "Priority processing queue",
        "AI audit reports",
        "Custom model training",
        "24/7 dedicated support",
        "SLA guarantees"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your AI correction needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.highlighted && (
                <div className="absolute -inset-px bg-gradient-to-b from-blue-500 to-purple-500 rounded-xl blur opacity-20" />
              )}
              <Card 
                className="relative h-full flex flex-col p-8"
                highlighted={plan.highlighted}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
                
                <div className="flex-grow">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  variant={plan.highlighted ? "primary" : "secondary"}
                  fullWidth
                >
                  {plan.name === "Free" ? "Start Free Trial" : "Get Started"}
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;