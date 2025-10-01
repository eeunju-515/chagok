
import React, { createContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Screen, Lesson, UserData, AppContextType, Part, Course } from '../types';
import { useUserData } from '../hooks/useUserData';
import { CURRICULUM_DATA } from '../data/curriculum';

const defaultContextValue: AppContextType = {
  currentScreen: Screen.ONBOARDING,
  setCurrentScreen: () => {},
  activeLesson: null,
  setActiveLesson: () => {},
  lessonResult: null,
  setLessonResult: () => {},
  hasOnboarded: false,
  setHasOnboarded: () => {},
  userData: {} as UserData,
  updateUserData: () => {},
  getLessonStatus: () => 'locked',
  getPartProgress: () => 0,
  getCourseProgress: () => 0,
  toast: { show: false, message: '' },
  displayToast: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonResult, setLessonResult] = useState<{ accuracy: number; time: number } | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const { userData, updateUserData, isLoaded } = useUserData();
  const [toast, setToast] = useState({ show: false, message: '' });

  const displayToast = useCallback((message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  }, []);

  const getPartProgress = (partId: string): number => {
    if (!isLoaded) return 0;
    const part = CURRICULUM_DATA.find(p => p.id === partId);
    if (!part) return 0;
    const totalLessons = part.courses.reduce((acc, course) => acc + course.lessons.length, 0);
    if (totalLessons === 0) return 0;
    
    const completedCount = part.courses.reduce((acc, course) => {
        return acc + course.lessons.filter(l => userData.completedLessons?.[l.id]).length;
    }, 0);

    return Math.round((completedCount / totalLessons) * 100);
  };

  const getCourseProgress = (courseId: string): number => {
    if (!isLoaded) return 0;
    let course: Course | undefined;
    CURRICULUM_DATA.forEach(p => {
        const foundCourse = p.courses.find(c => c.id === courseId);
        if (foundCourse) course = foundCourse;
    });
    
    if (!course) return 0;
    const totalLessons = course.lessons.length;
    if (totalLessons === 0) return 0;

    const completedCount = course.lessons.filter(l => userData.completedLessons?.[l.id]).length;
    return Math.round((completedCount / totalLessons) * 100);
  };

  const getLessonStatus = (lessonId: string, part: Part, course: Course): 'completed' | 'next' | 'locked' => {
    if (!isLoaded || !userData.nextLessonByPart) return 'locked';

    if (userData.completedLessons?.[lessonId]) {
        return 'completed';
    }
    
    const partIndex = CURRICULUM_DATA.findIndex(p => p.id === part.id);
    if (partIndex > 0) {
        const previousPart = CURRICULUM_DATA[partIndex - 1];
        const previousPartProgress = getPartProgress(previousPart.id);
        if (previousPartProgress < 100) {
            return 'locked';
        }
    }

    const nextLessonIdForPart = userData.nextLessonByPart[part.id];
    
    if (lessonId === nextLessonIdForPart) {
        return 'next';
    }

    return 'locked';
  };

  const value = useMemo(() => ({
    currentScreen,
    setCurrentScreen,
    activeLesson,
    setActiveLesson,
    lessonResult,
    setLessonResult,
    hasOnboarded,
    setHasOnboarded,
    userData,
    updateUserData,
    getLessonStatus,
    getPartProgress,
    getCourseProgress,
    toast,
    displayToast
  }), [currentScreen, activeLesson, lessonResult, hasOnboarded, userData, updateUserData, isLoaded, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};