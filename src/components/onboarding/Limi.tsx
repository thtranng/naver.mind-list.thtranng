import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type LimiState = 'idle' | 'happy' | 'pointing' | 'thinking' | 'talking';

export interface LimiPosition {
  x: number;
  y: number;
}

interface LimiProps {
  state?: LimiState;
  position?: LimiPosition;
  className?: string;
  onAnimationComplete?: () => void;
}

const Limi: React.FC<LimiProps> = ({ 
  state = 'idle', 
  position = { x: 50, y: 50 }, 
  className,
  onAnimationComplete 
}) => {
  const [currentState, setCurrentState] = useState<LimiState>(state);
  const [currentPosition, setCurrentPosition] = useState<LimiPosition>(position);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const getEyeStyle = () => {
    switch (currentState) {
      case 'happy':
        return 'animate-pulse';
      case 'thinking':
        return 'opacity-60';
      case 'talking':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  const getBodyAnimation = () => {
    switch (currentState) {
      case 'idle':
        return 'animate-float';
      case 'happy':
        return 'animate-spin-slow animate-glow';
      case 'pointing':
        return 'animate-point';
      case 'thinking':
        return 'animate-float-slow';
      case 'talking':
        return 'animate-talk';
      default:
        return 'animate-float';
    }
  };

  return (
    <div 
      className={cn(
        "fixed z-50 transition-all duration-1000 ease-in-out pointer-events-none",
        className
      )}
      style={{
        left: `${currentPosition.x}%`,
        top: `${currentPosition.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onTransitionEnd={onAnimationComplete}
    >
      {/* Limi Body - Glowing Orb */}
      <div className={cn(
        "relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500",
        "shadow-lg shadow-purple-500/50",
        getBodyAnimation()
      )}>
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 blur-md opacity-60 animate-pulse" />
        
        {/* Eyes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-2">
            {/* Left Eye */}
            <div className={cn(
              "w-2 h-2 bg-white rounded-full transition-all duration-300",
              currentState === 'happy' ? 'transform scale-x-150 -rotate-12' : '',
              currentState === 'thinking' ? 'transform scale-x-75' : '',
              getEyeStyle()
            )} />
            
            {/* Right Eye */}
            <div className={cn(
              "w-2 h-2 bg-white rounded-full transition-all duration-300",
              currentState === 'happy' ? 'transform scale-x-150 rotate-12' : '',
              currentState === 'thinking' ? 'transform scale-x-75' : '',
              getEyeStyle()
            )} />
          </div>
        </div>

        {/* Mouth (for talking state) */}
        {currentState === 'talking' && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
        )}

        {/* Pointing Indicator */}
        {currentState === 'pointing' && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent animate-pulse" />
          </div>
        )}
      </div>

      {/* Sparkle Effects for Happy State */}
      {currentState === 'happy' && (
        <>
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-200" />
          <div className="absolute -bottom-2 -right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-400" />
          <div className="absolute -bottom-1 -left-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-600" />
        </>
      )}
    </div>
  );
};

export default Limi;

// Custom CSS animations (add to global CSS or styled-components)
// @keyframes float {
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
// }
// 
// @keyframes float-slow {
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-5px); }
// }
// 
// @keyframes spin-slow {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }
// 
// @keyframes glow {
//   0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
//   50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.8); }
// }
// 
// @keyframes point {
//   0%, 100% { transform: translateX(0px); }
//   50% { transform: translateX(5px); }
// }
// 
// @keyframes talk {
//   0%, 100% { transform: scale(1); }
//   50% { transform: scale(1.05); }
// }
// 
// .animate-float { animation: float 3s ease-in-out infinite; }
// .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
// .animate-spin-slow { animation: spin-slow 3s linear infinite; }
// .animate-glow { animation: glow 2s ease-in-out infinite; }
// .animate-point { animation: point 1s ease-in-out infinite; }
// .animate-talk { animation: talk 0.5s ease-in-out infinite; }
// .animation-delay-200 { animation-delay: 0.2s; }
// .animation-delay-400 { animation-delay: 0.4s; }
// .animation-delay-600 { animation-delay: 0.6s; }