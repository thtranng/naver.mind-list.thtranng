import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

const Index = () => {
  return (
    <AppProvider>
      <AppLayout />
      <OnboardingFlow />
    </AppProvider>
  );
};

export default Index;
