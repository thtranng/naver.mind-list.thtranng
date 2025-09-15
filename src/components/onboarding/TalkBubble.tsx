import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TalkBubbleProps {
  message: string;
  isVisible: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  onComplete?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

const TalkBubble: React.FC<TalkBubbleProps> = ({
  message,
  isVisible,
  position = 'top',
  className,
  onComplete,
  autoHide = true,
  hideDelay = 3000
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (isVisible && message) {
      setShowBubble(true);
      setIsTyping(true);
      setDisplayedText('');
      
      // Typing animation
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedText(message.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          
          // Auto hide after delay
          if (autoHide) {
            setTimeout(() => {
              setShowBubble(false);
              onComplete?.();
            }, hideDelay);
          }
        }
      }, 50); // Typing speed

      return () => clearInterval(typingInterval);
    } else {
      setShowBubble(false);
    }
  }, [isVisible, message, autoHide, hideDelay, onComplete]);

  const getBubblePosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
    }
  };

  const getArrowPosition = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-white border-t-8 border-x-transparent border-x-8 border-b-0';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-white border-b-8 border-x-transparent border-x-8 border-t-0';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-white border-l-8 border-y-transparent border-y-8 border-r-0';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-white border-r-8 border-y-transparent border-y-8 border-l-0';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-white border-t-8 border-x-transparent border-x-8 border-b-0';
    }
  };

  if (!showBubble) return null;

  return (
    <div className={cn(
      "absolute z-50 pointer-events-none",
      getBubblePosition(),
      className
    )}>
      {/* Speech Bubble */}
      <div className={cn(
        "relative bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs bubble-container",
        "transform transition-all duration-300 ease-out",
        showBubble ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      )}>
        {/* Message Text */}
        <p className="text-sm text-gray-800 leading-relaxed">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-1 h-4 bg-blue-500 ml-1 animate-pulse" />
          )}
        </p>
        
        {/* Arrow */}
        <div className={cn(
          "absolute w-0 h-0",
          getArrowPosition()
        )} />
      </div>
    </div>
  );
};

export default TalkBubble;