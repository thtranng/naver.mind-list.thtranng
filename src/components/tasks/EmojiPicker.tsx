import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

const EMOJI_LIST = [
  '👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉',
  '🔥', '💯', '👏', '🙌', '💪', '✨', '⭐', '🚀',
  '💡', '🎯', '✅', '❌', '⚡', '💎', '🏆', '🎊'
];

export function EmojiPicker({ onEmojiSelect, isOpen, onClose, position = 'bottom' }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className={`absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 ${
        position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
      }`}
      style={{ minWidth: '200px' }}
    >
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

interface EmojiReactionProps {
  emoji: string;
  count: number;
  isReacted: boolean;
  onClick: () => void;
}

export function EmojiReaction({ emoji, count, isReacted, onClick }: EmojiReactionProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
        isReacted 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
      }`}
    >
      <span>{emoji}</span>
      <span className="font-medium">{count}</span>
    </button>
  );
}

interface EmojiReactionsProps {
  reactions: { [emoji: string]: { count: number; users: string[] } };
  currentUserId: string;
  onReactionToggle: (emoji: string) => void;
  onEmojiAdd: (emoji: string) => void;
}

export function EmojiReactions({ reactions, currentUserId, onReactionToggle, onEmojiAdd }: EmojiReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* Existing reactions */}
      {Object.entries(reactions).map(([emoji, data]) => (
        <EmojiReaction
          key={emoji}
          emoji={emoji}
          count={data.count}
          isReacted={data.users.includes(currentUserId)}
          onClick={() => onReactionToggle(emoji)}
        />
      ))}
      
      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Add reaction"
        >
          <Smile size={16} />
        </button>
        
        <EmojiPicker
          isOpen={showPicker}
          onClose={() => setShowPicker(false)}
          onEmojiSelect={onEmojiAdd}
          position="top"
        />
      </div>
    </div>
  );
}