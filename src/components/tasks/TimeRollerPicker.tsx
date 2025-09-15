import React, { useState, useEffect, useRef } from 'react';

interface TimeRollerPickerProps {
  value: { hour: number; minute: number };
  onChange: (time: { hour: number; minute: number }) => void;
  className?: string;
}

const TimeRollerPicker: React.FC<TimeRollerPickerProps> = ({ value, onChange, className = '' }) => {
  const [selectedHour, setSelectedHour] = useState(value.hour);
  const [selectedMinute, setSelectedMinute] = useState(value.minute);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);
  const hourScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const minuteScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Generate arrays for hours (00-23) and minutes (00-59)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const ITEM_HEIGHT = 40; // Height of each item in pixels

  useEffect(() => {
    setSelectedHour(value.hour);
    setSelectedMinute(value.minute);
  }, [value]);

  useEffect(() => {
    onChange({ hour: selectedHour, minute: selectedMinute });
  }, [selectedHour, selectedMinute, onChange]);

  const scrollToItem = (container: HTMLDivElement, index: number, smooth = true) => {
    const scrollTop = index * ITEM_HEIGHT;
    container.scrollTo({
      top: scrollTop,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  const handleScroll = (type: 'hour' | 'minute') => {
    const container = type === 'hour' ? hourScrollRef.current : minuteScrollRef.current;
    const timeout = type === 'hour' ? hourScrollTimeout : minuteScrollTimeout;
    
    if (!container) return;

    // Clear existing timeout
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Set new timeout for snap-to-value effect
    timeout.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const maxIndex = type === 'hour' ? 23 : 59;
      const clampedIndex = Math.max(0, Math.min(index, maxIndex));
      
      // Snap to the nearest value
      scrollToItem(container, clampedIndex, true);
      
      // Update selected value
      if (type === 'hour') {
        setSelectedHour(clampedIndex);
      } else {
        setSelectedMinute(clampedIndex);
      }
    }, 150); // Delay for snap effect
  };

  const initializeScroll = (type: 'hour' | 'minute') => {
    const container = type === 'hour' ? hourScrollRef.current : minuteScrollRef.current;
    const initialValue = type === 'hour' ? selectedHour : selectedMinute;
    
    if (container) {
      // Set initial scroll position without animation
      setTimeout(() => {
        scrollToItem(container, initialValue, false);
      }, 0);
    }
  };

  useEffect(() => {
    initializeScroll('hour');
    initializeScroll('minute');
  }, []);

  const renderColumn = (items: number[], type: 'hour' | 'minute') => {
    const selectedValue = type === 'hour' ? selectedHour : selectedMinute;
    const scrollRef = type === 'hour' ? hourScrollRef : minuteScrollRef;
    
    return (
      <div className="relative flex-1">
        {/* Selector highlight */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-10 bg-blue-50 border-t-2 border-b-2 border-blue-200 pointer-events-none z-10"></div>
        
        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="h-32 overflow-y-auto scrollbar-hide relative"
          onScroll={() => handleScroll(type)}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Padding top */}
          <div style={{ height: ITEM_HEIGHT }}></div>
          
          {/* Items */}
          {items.map((item) => (
            <div
              key={item}
              className={`h-10 flex items-center justify-center text-lg font-medium transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                item === selectedValue ? 'text-blue-600 font-bold' : 'text-gray-600'
              }`}
              onClick={() => {
                if (type === 'hour') {
                  setSelectedHour(item);
                  scrollToItem(hourScrollRef.current!, item, true);
                } else {
                  setSelectedMinute(item);
                  scrollToItem(minuteScrollRef.current!, item, true);
                }
              }}
            >
              {item.toString().padStart(2, '0')}
            </div>
          ))}
          
          {/* Padding bottom */}
          <div style={{ height: ITEM_HEIGHT }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Hour column */}
      <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-gray-700 mb-2">Giờ</label>
        {renderColumn(hours, 'hour')}
      </div>
      
      {/* Separator */}
      <div className="text-2xl font-bold text-gray-400 pt-6">:</div>
      
      {/* Minute column */}
      <div className="flex flex-col items-center">
        <label className="text-sm font-medium text-gray-700 mb-2">Phút</label>
        {renderColumn(minutes, 'minute')}
      </div>
    </div>
  );
};

export default TimeRollerPicker;

// CSS to hide scrollbar
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);