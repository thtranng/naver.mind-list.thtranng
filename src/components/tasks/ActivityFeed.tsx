import React, { useState } from 'react';
import { MessageCircle, Clock, User, Edit, Trash2, CheckCircle, AlertCircle, Reply } from 'lucide-react';
import { ActivityItem, Comment, SystemActivity } from '../../types';
import { EmojiReactions } from './EmojiPicker';
import { ThreadedReplies } from './ThreadedReplies';

interface ActivityFeedProps {
  taskId: string;
}

// Mock data with replies
const mockActivities: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'comment',
    userId: 'user-1',
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    content: 'Tôi nghĩ chúng ta nên thêm một số **tính năng mới** vào phần này. @NguyenVanB bạn có ý kiến gì không?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    reactions: {
      '👍': { count: 2, users: ['user-2', 'user-3'] },
      '❤️': { count: 1, users: ['user-2'] }
    },
    authorId: 'user-1',
    authorName: 'Nguyễn Văn A',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    taskId: 'task-1',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    mentions: [],
    replies: [
      {
        id: 'reply-1',
        content: 'Ý tưởng hay đấy! Tôi sẽ nghiên cứu thêm về vấn đề này.',
        authorId: 'user-2',
        authorName: 'Nguyễn Văn B',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        taskId: 'task-1',
        createdAt: new Date(Date.now() - 3 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 1000),
        reactions: {
          '👍': { count: 1, users: ['user-1'] }
        },
        mentions: [],
        userId: 'user-2',
        userName: 'Nguyễn Văn B',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        replies: []
      }
    ]
  },
  {
    id: 'activity-2',
    type: 'system',
    action: 'status_changed',
    details: {
      field: 'status',
      oldValue: 'Đang thực hiện',
      newValue: 'Hoàn thành',
      userId: 'user-2',
      userName: 'Nguyễn Văn B'
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'activity-3',
    type: 'comment',
    userId: 'user-2',
    userName: 'Nguyễn Văn B',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    content: 'Đã hoàn thành phần kiểm tra. Mọi thứ đều ổn! 🎉',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    reactions: {
      '🎉': { count: 3, users: ['user-1', 'user-3', 'user-4'] }
    },
    replies: []
  },
  {
    id: 'activity-4',
    type: 'system',
    action: 'due_date_changed',
    details: {
      field: 'dueDate',
      oldValue: '2024-01-15',
      newValue: '2024-01-20',
      userId: 'user-1',
      userName: 'Nguyễn Văn A'
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

export function ActivityFeed({ taskId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [isLoading] = useState(false);
  const currentUserId = 'user-1'; // Mock current user ID

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const handleReactionToggle = (activityId: string, emoji: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId && activity.type === 'comment') {
        const reactions = { ...activity.reactions };
        
        if (reactions[emoji]) {
          const userIndex = reactions[emoji].users.indexOf(currentUserId);
          if (userIndex > -1) {
            // Remove reaction
            reactions[emoji].users.splice(userIndex, 1);
            reactions[emoji].count--;
            if (reactions[emoji].count === 0) {
              delete reactions[emoji];
            }
          } else {
            // Add reaction
            reactions[emoji].users.push(currentUserId);
            reactions[emoji].count++;
          }
        } else {
          // Add new reaction
          reactions[emoji] = {
            count: 1,
            users: [currentUserId]
          };
        }
        
        return { ...activity, reactions };
      }
      return activity;
    }));
  };

  const handleEmojiAdd = (activityId: string, emoji: string) => {
    handleReactionToggle(activityId, emoji);
  };

  const handleReplySubmit = (parentId: string, content: string, mentions: string[]) => {
    // Mock reply submission
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      content,
      authorId: currentUserId,
      authorName: 'Bạn',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      taskId: taskId,
      createdAt: new Date(),
      updatedAt: new Date(),
      reactions: {},
      mentions,
      // Additional for compatibility
      userId: currentUserId,
      userName: 'Bạn',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      timestamp: new Date(),
      replies: []
    };

    setActivities(prev => prev.map(activity => {
      if (activity.id === parentId && activity.type === 'comment') {
        return {
          ...activity,
          replies: [...(activity.replies || []), newReply]
        };
      }
      return activity;
    }));
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

  const renderSystemActivity = (activity: ActivityItem) => {
    const { action, details } = activity;
    
    const getSystemIcon = () => {
      switch (action) {
        case 'status_changed':
          return <CheckCircle size={16} className="text-green-500" />;
        case 'due_date_changed':
          return <Clock size={16} className="text-blue-500" />;
        case 'assignee_changed':
          return <User size={16} className="text-purple-500" />;
        case 'priority_changed':
          return <AlertCircle size={16} className="text-orange-500" />;
        default:
          return <Edit size={16} className="text-gray-500" />;
      }
    };

    const getSystemMessage = () => {
      switch (action) {
        case 'status_changed':
          return `${details.userName} đã thay đổi trạng thái từ "${details.oldValue}" thành "${details.newValue}"`;
        case 'due_date_changed':
          return `${details.userName} đã thay đổi hạn chót từ ${details.oldValue} thành ${details.newValue}`;
        case 'assignee_changed':
          return `${details.userName} đã thay đổi người được giao từ "${details.oldValue}" thành "${details.newValue}"`;
        case 'priority_changed':
          return `${details.userName} đã thay đổi độ ưu tiên từ "${details.oldValue}" thành "${details.newValue}"`;
        default:
          return `${details.userName} đã thực hiện một thay đổi`;
      }
    };

    return (
      <div className="flex items-start gap-3 py-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          {getSystemIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-600">
            {getSystemMessage()}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {formatTime(activity.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  const groupActivitiesByDate = (activities: ActivityItem[]) => {
    const groups: { [key: string]: ActivityItem[] } = {};
    
    activities.forEach(activity => {
      const date = activity.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-500">Đang tải hoạt động...</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Chưa có hoạt động nào</p>
        <p className="text-gray-400 text-xs mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
      </div>
    );
  }

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="space-y-4">
      {Object.entries(groupedActivities)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, dateActivities]) => (
          <div key={date}>
            {/* Date header */}
            <div className="sticky top-0 bg-white py-2 border-b border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {formatDateHeader(date)}
              </h4>
            </div>
            
            {/* Activities for this date */}
            <div className="space-y-1">
              {dateActivities
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((activity) => (
                  <div key={activity.id}>
                    {activity.type === 'comment' ? (
                      <div className="flex items-start gap-3 py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2">
                        <img
                          src={activity.userAvatar}
                          alt={activity.userName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {activity.userName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTime(activity.timestamp)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 whitespace-pre-wrap">
                            {renderContent(activity.content)}
                          </div>
                          
                          {/* Emoji Reactions */}
                          <EmojiReactions
                            reactions={activity.reactions || {}}
                            currentUserId={currentUserId}
                            onReactionToggle={(emoji) => handleReactionToggle(activity.id, emoji)}
                            onEmojiAdd={(emoji) => handleEmojiAdd(activity.id, emoji)}
                          />
                          
                          {/* Threaded Replies */}
                          <ThreadedReplies
                            parentComment={activity}
                            replies={activity.replies || []}
                            currentUserId={currentUserId}
                            onReplySubmit={handleReplySubmit}
                            onReactionToggle={handleReactionToggle}
                            onEmojiAdd={handleEmojiAdd}
                          />
                        </div>
                      </div>
                    ) : (
                      renderSystemActivity(activity)
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}