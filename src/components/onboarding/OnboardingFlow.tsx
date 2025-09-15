import React, { useEffect } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import Limi from './Limi';
import TalkBubble from './TalkBubble';
import { ConfettiEffect } from './ConfettiEffect';
import { RewardModal } from './RewardModal';
import { cn } from '../../lib/utils';
import type { UserPurpose } from '../../contexts/OnboardingContext';

interface PurposeOption {
  id: UserPurpose;
  label: string;
  icon: string;
  description: string;
}

const purposeOptions: PurposeOption[] = [
  {
    id: 'study',
    label: 'Học tập & Nghiên cứu',
    icon: '📚',
    description: 'Quản lý bài tập, lịch học, nghiên cứu và mục tiêu học tập một cách khoa học'
  },
  {
    id: 'work',
    label: 'Công việc & Dự án',
    icon: '💼',
    description: 'Theo dõi dự án, deadline, meeting và tối ưu hóa hiệu suất làm việc'
  },
  {
    id: 'personal',
    label: 'Phát triển bản thân',
    icon: '🚀',
    description: 'Xây dựng kỹ năng mới, theo đuổi đam mê và thực hiện ý tưởng sáng tạo'
  },
  {
    id: 'life',
    label: 'Quản lý cuộc sống',
    icon: '🏡',
    description: 'Tổ chức thói quen, chăm sóc sức khỏe và cân bằng cuộc sống hàng ngày'
  }
];

const experienceOptions = [
  { id: 'beginner', label: 'Mới bắt đầu', icon: '🌱', description: 'Tôi chưa quen với việc quản lý task' },
  { id: 'intermediate', label: 'Có kinh nghiệm', icon: '🌿', description: 'Tôi đã sử dụng một số công cụ quản lý' },
  { id: 'advanced', label: 'Chuyên nghiệp', icon: '🌳', description: 'Tôi cần công cụ mạnh mẽ và linh hoạt' }
];

const OnboardingFlow: React.FC = () => {
  const {
    state,
    setUserProfile,
    hideMessage,
    skipOnboarding,
    hideRewardModal,
    hideSpotlight,
    showSpotlight,
    nextStep,
    previousStep,
    updateProgress,
    completeStep,
    addAchievement,
    getPersonalizedContent
  } = useOnboarding();

  // Handle purpose selection
  const handlePurposeSelect = (purpose: UserPurpose) => {
    setUserProfile({ purpose });
    updateProgress(50);
  };

  // Handle experience selection
  const handleExperienceSelect = (experience: 'beginner' | 'intermediate' | 'advanced') => {
    setUserProfile({ experience });
    updateProgress(100);
    setTimeout(() => completeStep('role_selection'), 500);
  };

  // Effect to manage spotlight target highlighting
  useEffect(() => {
    if (state.targetElementId) {
      const element = document.getElementById(state.targetElementId);
      if (element) {
        element.classList.add('onboarding-spotlight-target');
        return () => {
          element.classList.remove('onboarding-spotlight-target');
        };
      }
    }
  }, [state.targetElementId]);

  // Handle skip onboarding
  const handleSkip = () => {
    skipOnboarding();
  };

  // Don't render if onboarding is not active
  if (!state.isActive) {
    return null;
  }

  return (
    <>
      {/* Progress Bar */}
      {state.showProgressBar && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Thiết lập Mind List</h3>
              <span className="text-xs text-gray-500">
                {state.progress.completedSteps.length + 1}/{state.progress.totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((state.progress.completedSteps.length / state.progress.totalSteps) * 100) + (state.progress.currentStepProgress / state.progress.totalSteps)}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Overlay */}
      {state.showSpotlight && state.spotlightPosition && (
        <div className="spotlight-overlay">
          <div 
            className="spotlight-cutout animated"
            style={{
              top: `${state.spotlightPosition.top}px`,
              left: `${state.spotlightPosition.left}px`,
              width: `${state.spotlightPosition.width}px`,
              height: `${state.spotlightPosition.height}px`
            }}
          />
        </div>
      )}
      
      {/* Limi Assistant */}
      <div className="relative z-50">
        <Limi 
          state={state.limiState}
          position={state.limiPosition}
          onAnimationComplete={() => {
            // Handle animation completion if needed
          }}
        />
        
        {/* Talk Bubble */}
        {state.showTalkBubble && (
          <div 
            className="fixed z-50"
            style={{
              left: `${state.limiPosition.x}%`,
              top: `${state.limiPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <TalkBubble
              message={state.talkBubbleMessage}
              isVisible={state.showTalkBubble}
              position="top"
              onComplete={hideMessage}
              autoHide={true}
              hideDelay={3000}
            />
          </div>
        )}
      </div>

      {/* Role Selection Modal */}
      {state.currentStep === 'role_selection' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Bạn muốn sử dụng Mind List để làm gì?
              </h2>
              <p className="text-gray-600 text-lg">
                Chọn mục đích chính để chúng tôi tùy chỉnh trải nghiệm phù hợp nhất với bạn
              </p>
            </div>

            {/* Purpose Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {purposeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    handlePurposeSelect(option.id);
                    hideSpotlight();
                  }}
                  className={cn(
                    "purpose-button p-6 rounded-xl border-2 text-left transition-all duration-300",
                    "hover:border-blue-500 hover:shadow-xl hover:scale-105",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "group cursor-pointer bg-gradient-to-br from-gray-50 to-white",
                    state.userProfile?.purpose === option.id && "border-blue-500 bg-blue-50"
                  )}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-lg">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Experience Level Selection */}
            {state.userProfile?.purpose && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Mức độ kinh nghiệm của bạn?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {experienceOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleExperienceSelect(option.id as any)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-center transition-all duration-200",
                        "hover:border-purple-500 hover:shadow-lg hover:scale-105",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                        "group cursor-pointer"
                      )}
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                        {option.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {option.label}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
              >
                Bỏ qua hướng dẫn
              </button>
              
              {state.userProfile?.purpose && (
                <div className="text-sm text-gray-600">
                  Đã chọn: <span className="font-semibold">{purposeOptions.find(p => p.id === state.userProfile?.purpose)?.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workspace Setup Modal */}
      {state.currentStep === 'workspace_setup' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🏗️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Thiết lập workspace của bạn
              </h2>
              <p className="text-gray-600">
                Dựa trên mục đích {state.userProfile?.purpose === 'study' ? 'học tập' : 
                state.userProfile?.purpose === 'work' ? 'công việc' : 
                state.userProfile?.purpose === 'personal' ? 'phát triển bản thân' : 'quản lý cuộc sống'} của bạn, 
                chúng tôi đã chuẩn bị những template phù hợp
              </p>
            </div>

            {/* Personalized Templates */}
            {(() => {
              const content = getPersonalizedContent();
              return content ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {content.templates.map((template: string, index: number) => (
                    <div key={index} className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <span className="text-blue-600 font-bold">+</span>
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{template}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null;
            })()}

            <div className="flex justify-between items-center">
              <button
                onClick={previousStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Quay lại
              </button>
              <button
                onClick={() => {
                  completeStep('workspace_setup');
                  nextStep('first_task_creation');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* First Task Creation */}
      {state.currentStep === 'first_task_creation' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Tạo task đầu tiên của bạn
              </h2>
              <p className="text-gray-600">
                Hãy thử tạo một task để trải nghiệm tính năng cơ bản của Mind List
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <span className="font-medium">Nhấp vào nút "Add Task" ở góc trên</span>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold">2</span>
                </div>
                <span className="text-gray-600">Nhập tên task và mô tả</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold">3</span>
                </div>
                <span className="text-gray-600">Đặt deadline và priority</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={previousStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Quay lại
              </button>
              <button
                onClick={() => {
                  showSpotlight('quick-add-task');
                  addAchievement('feature', 'Task Creation Guide');
                  skipOnboarding();
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Bắt đầu tạo task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal with Rewards */}
      {state.currentStep === 'completion_celebration' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg mx-4 text-center transform animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 4)]
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Chúc mừng! Bạn đã sẵn sàng!
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn đã sẵn sàng để {state.userProfile?.purpose === 'study' ? 'tổ chức việc học hiệu quả' : 
                state.userProfile?.purpose === 'work' ? 'quản lý công việc chuyên nghiệp' : 
                state.userProfile?.purpose === 'personal' ? 'phát triển bản thân một cách có hệ thống' : 
                'quản lý cuộc sống một cách thông minh'} với Mind List!
              </p>
              
              {/* Achievements Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-3">Thành tựu đã đạt được:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {state.achievements.map((achievement, index) => (
                    <div key={index} className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-1">
                        {achievement.type === 'milestone' ? '🏆' :
                         achievement.type === 'feature' ? '⭐' : '🎯'}
                      </div>
                      <span className="text-xs text-gray-700 font-medium">{achievement.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Bước tiếp theo:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tạo task đầu tiên của bạn</li>
                  <li>• Khám phá các tính năng nâng cao</li>
                  <li>• Tùy chỉnh workspace theo ý thích</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Limi sẽ luôn ở đây để hỗ trợ bạn. Chúc bạn có trải nghiệm tuyệt vời với Mind List! 🚀
              </p>

              <button
                onClick={() => {
                  completeStep('completion_celebration');
                  skipOnboarding();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Bắt đầu hành trình với Mind List →
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Contextual Tips */}
      {state.contextualTips && state.contextualTips.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm">
          {state.contextualTips.map((tip, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-3 transform animate-in slide-in-from-right-5 duration-300">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">💡</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {tip.content}
                  </p>
                  {tip.action && (
                    <button
                      onClick={() => {
                        if (tip.action?.type === 'highlight') {
                          showSpotlight(tip.action.target);
                        }
                      }}
                      className="mt-2 text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors"
                    >
                      {tip.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    // Remove this tip
                    const newTips = state.contextualTips.filter((_, i) => i !== index);
                    // This would need to be implemented in context
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confetti Effect */}
      <ConfettiEffect
        isActive={state.currentStep === 'completion_celebration'}
        duration={3000}
      />
      
      {/* Reward Modal */}
      <RewardModal 
        isOpen={state.showRewardModal}
        onClose={hideRewardModal}
      />
    </>
  );
};

export default OnboardingFlow;