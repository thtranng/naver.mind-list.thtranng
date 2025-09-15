import React, { useState, useRef, useEffect } from 'react';
import { Send, AtSign, Bold, Italic, Link, List } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface CommentInputProps {
  currentUser?: User;
  collaborators?: User[];
  onSubmit: (content: string, mentions: string[]) => Promise<void>;
  placeholder?: string;
  parentCommentId?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function CommentInput({
  currentUser,
  collaborators = [],
  onSubmit,
  placeholder = "Thêm bình luận...",
  parentCommentId,
  onCancel,
  isSubmitting = false
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentions, setMentions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionDropdownRef = useRef<HTMLDivElement>(null);

  // Filter collaborators based on mention query
  const filteredCollaborators = collaborators.filter(user => 
    user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(mentionQuery.toLowerCase()))
  );

  // Handle textarea input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setContent(value);
    
    // Check for @ mention
    const textBeforeCursor = value.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@([^\s]*)$/);

    if (mentionMatch && collaborators.length > 0) {
      setShowMentions(true);
      setMentionQuery(mentionMatch[1]);
      setMentionPosition(cursorPosition - mentionMatch[1].length - 1);
      setSelectedMentionIndex(0);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  };

  // Handle mention selection
  const selectMention = (user: User) => {
    const beforeMention = content.substring(0, mentionPosition);
    const afterMention = content.substring(mentionPosition + mentionQuery.length + 1);
    const newContent = beforeMention + `@${user.name} ` + afterMention;
    
    setContent(newContent);
    setShowMentions(false);
    setMentionQuery('');
    
    // Add to mentions list if not already included
    if (!mentions.includes(user.id)) {
      setMentions(prev => [...prev, user.id]);
    }
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = beforeMention.length + user.name.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  // Handle keyboard navigation in mention dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && filteredCollaborators.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedMentionIndex(prev => 
            prev < filteredCollaborators.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedMentionIndex(prev => 
            prev > 0 ? prev - 1 : filteredCollaborators.length - 1
          );
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          selectMention(filteredCollaborators[selectedMentionIndex]);
          break;
        case 'Escape':
          setShowMentions(false);
          break;
      }
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      // Ctrl/Cmd + Enter to submit
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (content.trim()) {
      try {
        await onSubmit(content.trim(), mentions);
        setContent('');
        setMentions([]);
        setIsFocused(false);
      } catch (error) {
        console.error('Failed to submit comment:', error);
      }
    }
  };

  // Handle cancel (for replies)
  const handleCancel = () => {
    setContent('');
    setMentions([]);
    setIsFocused(false);
    if (onCancel) {
      onCancel();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Close mentions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mentionDropdownRef.current && !mentionDropdownRef.current.contains(event.target as Node)) {
        setShowMentions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Insert markdown formatting
  const insertMarkdown = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = start + before.length + selectedText.length + after.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {currentUser ? (
            currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
              ?
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-1">
          <div className={`border rounded-lg transition-colors ${
            isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'
          }`}>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)}
              placeholder={placeholder}
              className="w-full p-3 border-none outline-none resize-none min-h-[80px] max-h-[200px] rounded-t-lg"
              rows={3}
            />
            
            {/* Toolbar */}
            {isFocused && (
              <div className="flex items-center justify-between p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center gap-1">
                  {/* Markdown formatting buttons */}
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title="In đậm (Ctrl+B)"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title="In nghiêng (Ctrl+I)"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](url)')}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title="Chèn link"
                  >
                    <Link size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ')}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title="Danh sách"
                  >
                    <List size={16} />
                  </button>
                  {collaborators.length > 0 && (
                    <button
                      type="button"
                      onClick={() => insertMarkdown('@')}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                      title="Mention người dùng"
                    >
                      <AtSign size={16} />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {parentCommentId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Hủy
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={14} />
                    {isSubmitting ? 'Đang gửi...' : (parentCommentId ? 'Trả lời' : 'Bình luận')}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mention Dropdown */}
          {showMentions && filteredCollaborators.length > 0 && (
            <div 
              ref={mentionDropdownRef}
              className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              {filteredCollaborators.map((user, index) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectMention(user)}
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors ${
                    index === selectedMentionIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    {user.email && (
                      <div className="text-xs text-gray-500">{user.email}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Helper text */}
          {isFocused && (
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Mẹo:</span> Sử dụng @ để mention người dùng, **in đậm**, *in nghiêng*. Nhấn Ctrl+Enter để gửi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}