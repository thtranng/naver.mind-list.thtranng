import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Clock } from 'lucide-react';
import { CommentInput } from './CommentInput';
import { ActivityFeed } from './ActivityFeed';
import { useActivityTracker, addActivityToTask } from '../../services/activityTracker';

interface ActivitySectionProps {
  taskId: string;
}

export default function ActivitySection({ taskId }: ActivitySectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'comments' | 'changes'>('all');
  const activityTracker = useActivityTracker();
  
  // Mock current user
  const currentUser = {
    id: 'user-1',
    name: 'Bạn'
  };

  const handleCommentSubmit = async (content: string, mentions: string[]) => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Comment submitted:', content, 'Mentions:', mentions);

      // Track comment activity
      const commentActivity = {
        id: `comment-${Date.now()}`,
        type: 'comment' as const,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        content,
        timestamp: new Date(),
        reactions: {},
        replies: []
      };

      // In a real app, this would be saved to your backend
      console.log('New comment activity:', commentActivity);

    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Example of tracking system changes
  useEffect(() => {
    // This would typically be called when task properties change
    // For demonstration, we'll show how to track a status change
    const trackStatusChange = () => {
      const activity = activityTracker.trackStatusChange(
        taskId,
        'Đang thực hiện',
        'Hoàn thành',
        currentUser.id,
        currentUser.name
      );
      addActivityToTask(taskId, activity);
    };
    
    // You would call trackStatusChange() when the task status actually changes
    // trackStatusChange();
  }, [taskId, activityTracker, currentUser]);

  const tabs = [
    { id: 'all', label: 'Tất cả', icon: MessageCircle },
    { id: 'comments', label: 'Bình luận', icon: Users },
    { id: 'changes', label: 'Thay đổi', icon: Clock }
  ] as const;

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động</h3>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={14} className="inline mr-1" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <CommentInput
          currentUser={currentUser}
          collaborators={[]} // Empty array for now, can be populated with actual collaborators later
          onSubmit={handleCommentSubmit}
          placeholder="Viết bình luận..."
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Activity Feed */}
      <div className="px-6 py-4 bg-white max-h-96 overflow-y-auto">
        <ActivityFeed taskId={taskId} />
      </div>

      {/* Footer with collaboration info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
                alt="User 1"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face"
                alt="User 2"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
                alt="User 3"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            </div>
            <span>3 thành viên đang cộng tác</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Đang hoạt động</span>
          </div>
        </div>
      </div>
    </div>
  );
}