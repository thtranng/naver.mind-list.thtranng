import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LimiState, LimiPosition } from '@/components/onboarding/Limi';

export type OnboardingStep = 
  | 'welcome'
  | 'role_selection'
  | 'workspace_setup'
  | 'first_task_creation'
  | 'task_organization'
  | 'productivity_tips'
  | 'completion_celebration'
  | 'inactive';

export type UserPurpose = 'study' | 'work' | 'personal' | 'life';

export interface UserProfile {
  purpose: UserPurpose;
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferredFeatures: string[];
}

export interface Achievement {
  type: 'task' | 'feature' | 'milestone';
  title: string;
}

export interface ContextualTip {
  title: string;
  content: string;
  action?: {
    type: string;
    target?: string;
    label: string;
  };
}

interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface OnboardingState {
  currentStep: OnboardingStep;
  isActive: boolean;
  limiState: LimiState;
  limiPosition: LimiPosition;
  talkBubbleMessage: string;
  showTalkBubble: boolean;
  userProfile?: UserProfile;
  progress: {
    completedSteps: OnboardingStep[];
    currentStepProgress: number;
    totalSteps: number;
  };
  achievements: Achievement[];
  showRewardModal: boolean;
  showSpotlight: boolean;
  spotlightPosition: SpotlightPosition | null;
  targetElementId: string | null;
  showProgressBar: boolean;
  contextualTips: ContextualTip[];
}

interface OnboardingContextType {
  state: OnboardingState;
  startOnboarding: () => void;
  nextStep: (step?: OnboardingStep) => void;
  previousStep: () => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setLimiState: (state: LimiState) => void;
  moveLimiTo: (position: LimiPosition) => void;
  showMessage: (message: string, duration?: number) => void;
  hideMessage: () => void;
  addAchievement: (type: 'task' | 'feature', value: string | number) => void;
  updateProgress: (stepProgress: number) => void;
  completeStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  hideRewardModal: () => void;
  showSpotlight: (elementId: string) => void;
  hideSpotlight: () => void;
  updateSpotlightPosition: (position: SpotlightPosition) => void;
  showContextualTip: (tip: ContextualTip) => void;
  getPersonalizedContent: () => any;
  markTaskCreated: () => void;
  markDueDateSet: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'mindlist_onboarding_completed';

const initialState: OnboardingState = {
  currentStep: 'inactive',
  isActive: false,
  limiState: 'idle',
  limiPosition: { x: 50, y: 50 },
  talkBubbleMessage: '',
  showTalkBubble: false,
  progress: {
    completedSteps: [],
    currentStepProgress: 0,
    totalSteps: 6
  },
  achievements: [],
  showRewardModal: false,
  showSpotlight: false,
  spotlightPosition: null,
  targetElementId: null,
  showProgressBar: true,
  contextualTips: []
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(initialState);

  // Check if onboarding should start on mount
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!hasCompletedOnboarding) {
      // Delay to ensure app is fully loaded
      setTimeout(() => {
        startOnboarding();
      }, 1000);
    }
  }, []);

  const startOnboarding = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'welcome',
      isActive: true,
      limiState: 'idle',
      limiPosition: { x: 50, y: 50 },
      progress: {
        ...prev.progress,
        currentStepProgress: 0
      }
    }));

    // Show personalized welcome message
    setTimeout(() => {
      showMessage("Chào mừng bạn đến với Mind List! 🌟 Tôi là Limi, sẽ giúp bạn khám phá những tính năng tuyệt vời.", 4000);
    }, 500);

    // Move Limi to bottom right corner after welcome message
    setTimeout(() => {
      moveLimiTo({ x: 85, y: 85 });
    }, 3000);

    // Auto progress to role selection
    setTimeout(() => {
      nextStep('role_selection');
    }, 5000);
  };

  const nextStep = (step?: OnboardingStep) => {
    if (step) {
      setState(prev => ({ 
        ...prev, 
        currentStep: step,
        progress: {
          ...prev.progress,
          currentStepProgress: 0
        }
      }));
      return;
    }

    // Progressive disclosure logic
    setState(prev => {
      const stepOrder: OnboardingStep[] = [
        'welcome', 'role_selection', 'workspace_setup', 
        'first_task_creation', 'task_organization', 
        'productivity_tips', 'completion_celebration'
      ];
      
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const nextStepIndex = currentIndex + 1;
      
      if (nextStepIndex < stepOrder.length) {
        return {
          ...prev,
          currentStep: stepOrder[nextStepIndex],
          progress: {
            ...prev.progress,
            currentStepProgress: 0
          }
        };
      }
      
      return prev;
    });
  };

  const previousStep = () => {
    setState(prev => {
      const stepOrder: OnboardingStep[] = [
        'welcome', 'role_selection', 'workspace_setup', 
        'first_task_creation', 'task_organization', 
        'productivity_tips', 'completion_celebration'
      ];
      
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const prevStepIndex = currentIndex - 1;
      
      if (prevStepIndex >= 0) {
        return {
          ...prev,
          currentStep: stepOrder[prevStepIndex],
          progress: {
            ...prev.progress,
            currentStepProgress: 100
          }
        };
      }
      
      return prev;
    });
  };

  const setUserProfile = (profile: Partial<UserProfile>) => {
    setState(prev => ({ 
      ...prev, 
      userProfile: { ...prev.userProfile, ...profile } as UserProfile 
    }));
    
    // Personalized progression based on user profile
    setTimeout(() => {
      nextStep('workspace_setup');
      moveLimiTo({ x: 20, y: 20 });
      const personalizedMessage = getPersonalizedWelcomeMessage(profile.purpose);
      showMessage(personalizedMessage);
    }, 1000);
  };

  const getPersonalizedWelcomeMessage = (purpose?: UserPurpose) => {
    const messages = {
      study: "Tuyệt vời! Hãy cùng thiết lập workspace để quản lý học tập hiệu quả! 📚",
      work: "Hoàn hảo! Chúng ta sẽ tối ưu hóa workspace cho công việc của bạn! 💼",
      personal: "Tuyệt! Hãy tạo một không gian lý tưởng cho các dự án cá nhân! 🚀",
      life: "Tốt lắm! Cùng xây dựng hệ thống quản lý cuộc sống hiệu quả! 🏡"
    };
    return purpose ? messages[purpose] : "Hãy cùng thiết lập workspace phù hợp với bạn! ✨";
  };

  const setLimiState = (limiState: LimiState) => {
    setState(prev => ({ ...prev, limiState }));
  };

  const moveLimiTo = (position: LimiPosition) => {
    setState(prev => ({ ...prev, limiPosition: position }));
  };

  const showMessage = (message: string, duration: number = 3000) => {
    setState(prev => ({
      ...prev,
      talkBubbleMessage: message,
      showTalkBubble: true,
      limiState: 'talking'
    }));
    
    // Auto hide after duration
    setTimeout(() => {
      hideMessage();
    }, duration);
  };

  const hideMessage = () => {
    setState(prev => ({
      ...prev,
      showTalkBubble: false,
      limiState: 'idle'
    }));
  };

  const addAchievement = (type: 'task' | 'feature', value: string | number) => {
    setState(prev => {
      const newAchievements = [...prev.achievements];

      if (type === 'task') {
        newAchievements.push({ type: 'task', title: 'Task Created' });
        const taskCount = newAchievements.filter(a => a.type === 'task').length;
        setLimiState('happy');
        showMessage(`Tuyệt vời! Bạn đã tạo ${taskCount} task! 🎉`);
      } else if (type === 'feature') {
        const featureTitle = value as string;
        if (!newAchievements.some(a => a.type === 'feature' && a.title === featureTitle)) {
          newAchievements.push({ type: 'feature', title: featureTitle });
          showMessage(`Bạn đã khám phá tính năng: ${featureTitle}! 🌟`);
        }
      }

      return {
        ...prev,
        achievements: newAchievements
      };
    });
  };

  const updateProgress = (stepProgress: number) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        currentStepProgress: Math.min(100, Math.max(0, stepProgress))
      }
    }));
  };

  const completeStep = (step: OnboardingStep) => {
    setState(prev => {
      const completedSteps = [...prev.progress.completedSteps];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedSteps,
          currentStepProgress: 100
        }
      };
    });
    
    setLimiState('happy');
    hideSpotlight();
  };

  const completeOnboarding = () => {
    setLimiState('happy');
    moveLimiTo({ x: 50, y: 50 });
    
    const completionMessage = getPersonalizedCompletionMessage();
    showMessage(completionMessage, 4000);
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentStep: 'completion_celebration',
        isActive: false,
        showRewardModal: true,
        progress: {
          ...prev.progress,
          currentStepProgress: 100
        }
      }));
      
      // Save completion status with user profile
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('mindlist_user_profile', JSON.stringify(state.userProfile));
      
      // Move Limi to corner
      setTimeout(() => {
        moveLimiTo({ x: 90, y: 90 });
        setLimiState('idle');
        hideMessage();
      }, 3000);
    }, 2000);
  };

  const getPersonalizedCompletionMessage = () => {
    const purpose = state.userProfile?.purpose;
    const messages = {
      study: "Tuyệt vời! Bạn đã sẵn sàng quản lý học tập hiệu quả với Mind List! 🎓",
      work: "Hoàn hảo! Workspace của bạn đã được tối ưu hóa cho công việc! 💼",
      personal: "Xuất sắc! Bạn đã có công cụ lý tưởng cho các dự án cá nhân! 🚀",
      life: "Tuyệt! Cuộc sống của bạn sẽ được tổ chức một cách khoa học! 🏡"
    };
    return purpose ? messages[purpose] : "Xuất sắc! Bạn đã nắm được cách dùng Mind List rồi đó! 🎉";
  };

  const skipOnboarding = () => {
    setState(initialState);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const hideRewardModal = () => {
    setState(prev => ({
      ...prev,
      showRewardModal: false,
      isActive: false,
      limiPosition: { x: 90, y: 90 },
      limiState: 'idle',
      showTalkBubble: false
    }));
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const showSpotlight = (elementId: string) => {
    setState(prev => ({ 
      ...prev, 
      showSpotlight: true, 
      targetElementId: elementId 
    }));
    
    // Calculate spotlight position based on element
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const position: SpotlightPosition = {
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16
        };
        updateSpotlightPosition(position);
      }
    }, 100);
  };

  const hideSpotlight = () => {
    setState(prev => ({ 
      ...prev, 
      showSpotlight: false, 
      spotlightPosition: null,
      targetElementId: null 
    }));
  };

  const updateSpotlightPosition = (position: SpotlightPosition) => {
    setState(prev => ({ ...prev, spotlightPosition: position }));
  };

  const showContextualTip = (tip: ContextualTip) => {
    setState(prev => ({
      ...prev,
      contextualTips: [...prev.contextualTips, tip]
    }));
  };

  const getPersonalizedContent = () => {
    const profile = state.userProfile;
    if (!profile) return null;

    const contentMap = {
      study: {
        templates: ['Lịch học', 'Bài tập', 'Ôn thi', 'Nghiên cứu'],
        tips: ['Sử dụng Pomodoro Timer', 'Đặt deadline cho bài tập', 'Tạo checklist ôn tập'],
        features: ['Calendar View', 'Priority Tags', 'Study Analytics']
      },
      work: {
        templates: ['Dự án', 'Meeting', 'Deadline', 'KPI Tracking'],
        tips: ['Phân chia task nhỏ', 'Sử dụng labels cho priority', 'Review tiến độ hàng tuần'],
        features: ['Gantt Chart', 'Team Collaboration', 'Time Tracking']
      },
      personal: {
        templates: ['Mục tiêu cá nhân', 'Kỹ năng mới', 'Sở thích', 'Thể dục'],
        tips: ['Đặt mục tiêu SMART', 'Theo dõi tiến độ hàng ngày', 'Celebrate small wins'],
        features: ['Habit Tracker', 'Goal Setting', 'Progress Visualization']
      },
      life: {
        templates: ['Thói quen', 'Sức khỏe', 'Tài chính', 'Gia đình'],
        tips: ['Tạo routine hàng ngày', 'Theo dõi chi tiêu', 'Lên kế hoạch tuần'],
        features: ['Daily Planner', 'Budget Tracker', 'Health Monitor']
      }
    };

    return contentMap[profile.purpose] || contentMap.personal;
  };

  const contextValue: OnboardingContextType = {
    state,
    startOnboarding,
    nextStep,
    previousStep,
    setUserProfile,
    setLimiState,
    moveLimiTo,
    showMessage,
    hideMessage,
    addAchievement,
    updateProgress,
    completeStep,
    completeOnboarding,
    skipOnboarding,
    hideRewardModal,
    showSpotlight,
    hideSpotlight,
    updateSpotlightPosition,
    showContextualTip,
    getPersonalizedContent,
    markTaskCreated: () => {
      addAchievement('task', 'Task Created');
    },
    markDueDateSet: () => {
      showMessage("Tuyệt vời! Bạn đã đặt ngày deadline! 📅");
    }
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;