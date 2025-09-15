import React, { useState } from 'react';
import { Reply, ChevronDown, ChevronRight } from 'lucide-react';
import { Comment } from '../../types';
import { EmojiReactions } from './EmojiPicker';
import { CommentInput } from './CommentInput';

interface ThreadedRepliesProps {
  parentComment: any; // ActivityItem or Comment
  replies: Comment[];
  currentUserId: string;
  onReplySubmit: (parentId: string, content: string, mentions: string[]) => void;
  onReactionToggle: (commentId: string, emoji: string) => void;
  onEmojiAdd: (commentId: string, emoji: string) => void;
}

export function ThreadedReplies({
  parentComment,
  replies,
  currentUserId,
  onReplySubmit,
  onReactionToggle,
  onEmojiAdd
}: ThreadedRepliesProps) {
  const [showReplies, setShowReplies] = useState(replies.length > 0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock current user - in a real app, this would come from context or props
  const currentUser = {
    id: currentUserId,
    name: 'Bạn',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  };

  // Mock collaborators - in a real app, this would be the task collaborators
  const collaborators: any[] = []; // Empty for now

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const renderContent = (content: string) => {
    // Simple markdown rendering
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>')
      .split('\n')
      .map((line, index) => (
        <span key={index} dangerouslySetInnerHTML={{ __html: line }} />
      ));
  };

  const handleReplySubmit = async (content: string, mentions: string[]) => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onReplySubmit(parentComment.id, content, mentions);
      setShowReplyInput(false);
      setShowReplies(true);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3">
      {/* Reply toggle and count */}
      {replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-2"
        >
          {showReplies ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {replies.length} {replies.length === 1 ? 'trả lời' : 'trả lời'}
        </button>
      )}

      {/* Reply button */}
      <div className="flex items-center gap-3 mb-2">
        <button 
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <Reply size={12} />
          Trả lời
        </button>
      </div>

      {/* Reply input */}
      {showReplyInput && (
        <div className="ml-6 mb-3">
          <CommentInput
            currentUser={currentUser}
            collaborators={collaborators}
            onSubmit={handleReplySubmit}
            placeholder={`Trả lời ${parentComment.userName}...`}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Replies list */}
      {showReplies && replies.length > 0 && (
        <div className="ml-6 space-y-3 border-l-2 border-gray-100 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3">
              <img
                src={reply.userAvatar}
                alt={reply.userName}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-xs text-gray-900">
                    {reply.userName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(reply.timestamp)}
                  </span>
                </div>
                
                <div className="text-xs text-gray-600 whitespace-pre-wrap mb-2">
                  {renderContent(reply.content)}
                </div>
                
                {/* Reply reactions */}
                <EmojiReactions
                  reactions={reply.reactions || {}}
                  currentUserId={currentUserId}
                  onReactionToggle={(emoji) => onReactionToggle(reply.id, emoji)}
                  onEmojiAdd={(emoji) => onEmojiAdd(reply.id, emoji)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ReplyButtonProps {
  onClick: () => void;
  replyCount?: number;
}

export function ReplyButton({ onClick, replyCount = 0 }: ReplyButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
    >
      <Reply size={12} />
      {replyCount > 0 ? `${replyCount} trả lời` : 'Trả lời'}
    </button>
  );
}

interface ReplyCountProps {
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ReplyCount({ count, isExpanded, onToggle }: ReplyCountProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
    >
      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      {count} {count === 1 ? 'trả lời' : 'trả lời'}
    </button>
  );
}