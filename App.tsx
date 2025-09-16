
import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { Screen } from './types';

import OnboardingScreen from './screens/OnboardingScreen';
import MainScreen from './screens/MainScreen';
import PartSelectionScreen from './screens/PartSelectionScreen';
import LessonIntroScreen from './screens/LessonIntroScreen';
import QuizScreen from './screens/QuizScreen';
import LessonCompleteScreen from './screens/LessonCompleteScreen';
import DashboardScreen from './screens/DashboardScreen';


const App: React.FC = () => {
  const { currentScreen, hasOnboarded, setHasOnboarded, setCurrentScreen } = useContext(AppContext);

  useEffect(() => {
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
      case Screen.LESSON_INTRO:
        return <LessonIntroScreen />;
      case Screen.QUIZ:
        return <QuizScreen />;
      case Screen.LESSON_COMPLETE:
        return <LessonCompleteScreen />;
      case Screen.DASHBOARD:
        return <DashboardScreen />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <div className="bg-neutral-000 min-h-screen">
       <div className="relative w-full h-full">
         {renderScreen()}
       </div>
    </div>
  );
};

export default App;