
import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { Screen } from './types';

import SplashScreen from './screens/SplashScreen';
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
      setCurrentScreen(Screen.SPLASH);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.SPLASH:
        return <SplashScreen />;
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
    <div className="bg-neutral-000 min-h-screen max-w-md mx-auto shadow-lg">
       <div className="relative w-full h-full">
         {renderScreen()}
       </div>
    </div>
  );
};

export default App;
