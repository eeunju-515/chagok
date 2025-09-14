
export enum Screen {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  MAIN = 'MAIN',
  PART_SELECTION = 'PART_SELECTION',
  LESSON_INTRO = 'LESSON_INTRO',
  QUIZ = 'QUIZ',
  LESSON_COMPLETE = 'LESSON_COMPLETE',
  DASHBOARD = 'DASHBOARD',
}

export interface UserData {
  lastPart: string;
  nextLessonByPart: { [partId: string]: string };
  streakCount: number;
  lastAccessDate: string; // YYYY-MM-DD
  completedLessons: { [lessonId: string]: boolean };
  totalLearningTime: number; // in seconds
  lessonDates: string[]; // YYYY-MM-DD
}

export interface Quiz {
  type: 'OX' | 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK';
  question: string;
  options: string[];
  answer: string;
  correctExplanation: string;
  incorrectExplanation: string | { [key: string]: string };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  quizzes: Quiz[];
  completionContent: {
    summary: string;
    action: string;
  };
}

export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Part {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  courses: Course[];
}

export interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  activeLesson: Lesson | null;
  setActiveLesson: (lesson: Lesson | null) => void;
  lessonResult: { accuracy: number, time: number } | null;
  setLessonResult: (result: { accuracy: number, time: number } | null) => void;
  hasOnboarded: boolean;
  setHasOnboarded: (status: boolean) => void;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  getLessonStatus: (lessonId: string, part: Part, course: Course) => 'completed' | 'next' | 'locked';
  getPartProgress: (partId: string) => number;
  getCourseProgress: (courseId: string) => number;
}
