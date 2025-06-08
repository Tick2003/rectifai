import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  highlighted = false
}) => {
  return (
    <div 
      className={`
        bg-gray-900 border border-gray-800 rounded-xl p-6
        ${highlighted ? 'shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'shadow-[0_0_15px_rgba(0,0,0,0.3)]'} 
        transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;