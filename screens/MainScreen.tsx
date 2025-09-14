
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen, Part, Course, Lesson } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { FireIcon, ChevronRightIcon, CheckCircleIcon, LockClosedIcon, ChevronUpIcon, ChevronDownIcon } from '../components/icons';

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CourseAccordion: React.FC<{ part: Part; course: Course }> = ({ part, course }) => {
    const { setCurrentScreen, setActiveLesson, getCourseProgress, getLessonStatus } = useContext(AppContext);
    const progress = getCourseProgress(course.id);
    const [isOpen, setIsOpen] = useState(course.id === part.courses[0].id || progress > 0);

    const isCourseActive = progress > 0 || course.lessons.some(l => getLessonStatus(l.id, part, course) !== 'locked');

    const handleLessonClick = (lesson: Lesson) => {
        const status = getLessonStatus(lesson.id, part, course);
        if (status !== 'locked') {
            setActiveLesson(lesson);
            setCurrentScreen(Screen.LESSON_INTRO);
        }
    };

    return (
        <div className="flex flex-col items-start w-full bg-white rounded-[18px] shadow-sm">
            <header onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-5 w-full cursor-pointer">
                <div className="inline-flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-lg ${isCourseActive ? 'bg-[#03AA72]' : 'bg-[#A2A2A2]'}`}>
                        <span className="text-xs font-medium text-white">
                            코스 {part.courses.findIndex(c => c.id === course.id) + 1}
                        </span>
                    </span>
                    <h2 className={`text-sm font-semibold ${isCourseActive ? 'text-[#3E3E3E]' : 'text-[#A2A2A2]'}`}>
                        {course.title}
                    </h2>
                </div>
                <div className="inline-flex items-center gap-1">
                    <span className={`text-xs font-medium ${isCourseActive ? 'text-[#03AA72]' : 'text-[#A2A2A2]'}`}>
                        {progress}%
                    </span>
                    {isOpen ? <ChevronUpIcon className="w-6 h-6 text-gray-400" /> : <ChevronDownIcon className="w-6 h-6 text-gray-400" />}
                </div>
            </header>

            {isOpen && (
                <div className="flex flex-col items-start gap-2 w-full px-5 pb-5">
                    {course.lessons.map(lesson => {
                        const status = getLessonStatus(lesson.id, part, course);
                        const isLocked = status === 'locked';
                        const isCompleted = status === 'completed';
                        const isUnlocked = !isLocked;
                        
                        return (
                            <button
                                key={lesson.id}
                                disabled={isLocked}
                                onClick={() => handleLessonClick(lesson)}
                                className="flex items-center justify-between p-4 w-full rounded-xl bg-[#F6F6F6]"
                            >
                                <span className={`text-base font-medium ${isUnlocked ? 'text-[#3E3E3E]' : 'text-[#A2A2A2]'}`}>
                                    {lesson.title}
                                </span>
                                {isLocked && <LockClosedIcon className="w-4 h-4 text-[#A2A2A2]" />}
                                {isCompleted && <CheckCircleIcon className="w-5 h-5 text-[#03AA72]" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


const MainScreen: React.FC = () => {
    const { setCurrentScreen, userData, getPartProgress } = useContext(AppContext);
    const [currentPart, setCurrentPart] = useState<Part | null>(null);

    useEffect(() => {
        const part = CURRICULUM_DATA.find(p => p.id === userData.lastPart) || CURRICULUM_DATA[0];
        setCurrentPart(part);
    }, [userData.lastPart]);

    const isTodayLearned = userData.lastAccessDate === getTodayDateString();

    if (!currentPart) return null;

    const progress = getPartProgress(currentPart.id);

    return (
        <div className="bg-[#F6F6F6] w-full min-h-screen">
            <header className="flex flex-col w-full max-w-md items-start gap-5 pt-4 pb-5 px-5 fixed top-0 bg-white rounded-b-2xl shadow-lg z-10">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-xl font-semibold text-[#3E3E3E]">
                        오늘도 차곡 쌓아봐요!
                    </h1>
                    <button onClick={() => setCurrentScreen(Screen.DASHBOARD)} className="inline-flex items-center gap-1">
                        <FireIcon className={`w-6 h-6 ${userData.streakCount > 0 ? 'text-gray-400' : 'text-gray-300'}`} />
                        <span className="text-lg font-medium text-[#A2A2A2]">
                            {userData.streakCount}
                        </span>
                    </button>
                </div>

                <div className="flex flex-col w-full items-start gap-2 p-5 bg-white rounded-[18px] border border-solid border-[#E1E1E1]">
                    <div className="flex justify-between self-stretch w-full items-center">
                        <div className="inline-flex gap-2 items-center">
                            <span className="bg-[#3E3E3E] inline-flex items-center justify-center px-1.5 py-0.5 rounded-lg">
                                <span className="text-xs font-medium text-white">
                                    파트 {CURRICULUM_DATA.findIndex(p => p.id === currentPart!.id) + 1}
                                </span>
                            </span>
                            <span className="text-sm font-semibold text-[#3E3E3E]">
                                {currentPart.title}
                            </span>
                        </div>
                        <button onClick={() => setCurrentScreen(Screen.PART_SELECTION)} className="inline-flex items-center justify-end gap-1">
                            <span className="text-xs font-medium text-[#7E7E7E]">
                                파트 변경
                            </span>
                            <ChevronRightIcon className="w-6 h-6 text-[#7E7E7E]" />
                        </button>
                    </div>

                    <h2 className="self-stretch text-xl font-semibold text-[#202326]">
                        {currentPart.subtitle}
                    </h2>

                    <div className="relative self-stretch w-full h-2 bg-[#EFEFEF] rounded-full">
                         <div className="bg-[#03AA72] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </header>

            <main className="flex flex-col w-full items-center gap-4 p-5 pt-[220px] pb-10">
                {currentPart.courses.map(course => (
                    <CourseAccordion key={course.id} part={currentPart!} course={course} />
                ))}
            </main>
        </div>
    );
};

export default MainScreen;
