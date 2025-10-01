import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { Screen } from './types';

import OnboardingScreen from './screens/OnboardingScreen';
import MainScreen from './screens/MainScreen';
import PartSelectionScreen from './screens/PartSelectionScreen';
import QuizScreen from './screens/QuizScreen';
import LessonCompleteScreen from './screens/LessonCompleteScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';

const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-out whitespace-nowrap">
        <style>
            {`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, 10px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, 10px); }
                }
                .animate-fade-in-out {
                    animation: fadeInOut 3s ease-in-out forwards;
                }
            `}
        </style>
        {message}
    </div>
);

const App: React.FC = () => {
  const { currentScreen, hasOnboarded, setHasOnboarded, setCurrentScreen, toast } = useContext(AppContext);

  useEffect(() => {
    // App versioning to handle cache invalidation.
    // Incrementing appVersion will reset the user's progress.
    const appVersion = '1.0.3';
    const storedVersion = localStorage.getItem('appVersion');

    if (storedVersion !== appVersion) {
      localStorage.removeItem('userData');
      localStorage.removeItem('hasOnboarded');
      localStorage.setItem('appVersion', appVersion);
    }

    const onboarded = localStorage.getItem('hasOnboarded');
    if (onboarded === 'true') {
      setHasOnboarded(true);
      setCurrentScreen(Screen.MAIN);
    } else {
      setCurrentScreen(Screen.ONBOARDING);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ONBOARDING:
        return <OnboardingScreen />;
      case Screen.MAIN:
        return <MainScreen />;
      case Screen.PART_SELECTION:
        return <PartSelectionScreen />;
      case Screen.QUIZ:
        return <QuizScreen />;
      case Screen.LESSON_COMPLETE:
        return <LessonCompleteScreen />;
      case Screen.DASHBOARD:
        return <DashboardScreen />;
      case Screen.SETTINGS:
        return <SettingsScreen />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <div className="bg-neutral-000 min-h-screen">
       <div className="relative w-full h-full">
         {renderScreen()}
         {toast.show && <Toast message={toast.message} />}
       </div>
    </div>
  );
};

export default App;