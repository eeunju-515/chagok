import { useState, useEffect, useCallback } from 'react';
import { UserData } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getInitialUserData = (): UserData => {
    const initialNextLessonByPart: { [partId: string]: string } = {};
    CURRICULUM_DATA.forEach(part => {
        if (part.courses.length > 0 && part.courses[0].lessons.length > 0) {
            initialNextLessonByPart[part.id] = part.courses[0].lessons[0].id;
        }
    });

    return {
        lastPart: 'part_01',
        nextLessonByPart: initialNextLessonByPart,
        streakCount: 0,
        lastAccessDate: '',
        completedLessons: {},
        totalLearningTime: 0,
        lessonDates: [],
        coins: 0
    };
};


export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(getInitialUserData());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData: UserData = JSON.parse(storedData);
        
        // Streak check logic
        const today = getTodayDateString();
        const lastAccess = parsedData.lastAccessDate;
        
        if (lastAccess) {
          const lastDate = new Date(lastAccess);
          const todayDate = new Date(today);
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 2) {
            parsedData.streakCount = 0;
          }
        }
        setUserData(parsedData);
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const updateUserData = useCallback((newData: Partial<UserData>) => {
    setUserData(prevData => {
      const updatedData = { ...prevData, ...newData };
      try {
        localStorage.setItem('userData', JSON.stringify(updatedData));
      } catch (error) {
        console.error("Failed to save user data to localStorage", error);
      }
      return updatedData;
    });
  }, []);

  return { userData, updateUserData, isLoaded };
};