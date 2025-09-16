import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen, Part, Course, Lesson, UserData } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { ChevronRightIcon, CheckCircleIcon, LockClosedIcon, ChevronUpIcon, ChevronDownIcon, MenuIcon, CoinIcon } from '../components/icons';

const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getWeekDays = (lessonDates: string[]): { name: string; date: Date; status: 'completed' | 'current' | 'inactive' }[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const weekDays = [];
    const todayDateString = toLocalDateString(today);

    const monday = new Date(today);
    const currentDay = monday.getDay();
    const diff = monday.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    monday.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        
        const dateString = toLocalDateString(day);
        
        const isLearned = (lessonDates || []).includes(dateString);
        const isToday = dateString === todayDateString;

        let status: 'completed' | 'current' | 'inactive';
        if (isLearned) {
            status = 'completed';
        } else if (isToday) {
            status = 'current';
        } else {
            status = 'inactive';
        }

        weekDays.push({
            name: dayNames[i],
            date: day,
            status: status
        });
    }
    return weekDays;
};

const WeeklyStreakTracker: React.FC<{ userData: UserData; onNavigate: () => void; }> = ({ userData, onNavigate }) => {
    const weekInfo = useMemo(() => getWeekDays(userData.lessonDates || []), [userData.lessonDates]);

    return (
        <div className="flex flex-col w-full items-start gap-3 p-4 relative bg-white rounded-[18px] shadow-sm">
            <button onClick={onNavigate} className="justify-between self-stretch w-full flex items-center relative">
                <p className="relative w-fit">
                    <span className="font-medium text-[#3e3e3e] text-xs">연속 학습</span>
                    <span className="font-bold text-[#ff9922] text-base">
                        {' '}{userData.streakCount || 0}
                    </span>
                    <span className="font-medium text-[#3e3e3e] text-xs">
                        일
                    </span>
                </p>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
            <div className="h-7 justify-between self-stretch w-full flex items-center relative">
                 {weekInfo.map(({ name, status }, index) => {
                    if (status === 'completed') {
                        return (
                            <div key={index} className="w-9 h-9 justify-center flex items-center relative">
                                <CoinIcon className="w-full h-full" />
                            </div>
                        );
                    }
                    
                    const bgColor = status === 'current' ? 'bg-[#FFF2E4]' : 'bg-[#F6F6F6]';
                    const textColor = status === 'current' ? 'text-[#FF9922]' : 'text-[#A2A2A2]';

                    return (
                        <div key={index} className="w-9 h-9 justify-center flex items-center relative">
                            <div className={`${bgColor} relative w-full h-full rounded-full flex items-center justify-center`}>
                                <span className={`${textColor} whitespace-nowrap text-sm font-medium text-center`}>
                                    {name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CircularProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const sqSize = 50;
    const strokeWidth = 5;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * progress) / 100;

    return (
        <div className="relative" style={{ width: sqSize, height: sqSize }}>
            <svg width={sqSize} height={sqSize} viewBox={viewBox} className="-rotate-90">
                <circle
                    className="stroke-gray-200"
                    cx={sqSize / 2}
                    cy={sqSize / 2}
                    r={radius}
                    strokeWidth={`${strokeWidth}px`}
                    fill="none"
                />
                <circle
                    className="stroke-[#03AA72]"
                    cx={sqSize / 2}
                    cy={sqSize / 2}
                    r={radius}
                    strokeWidth={`${strokeWidth}px`}
                    fill="none"
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                        transition: 'stroke-dashoffset 0.5s ease 0s',
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-[#03AA72]">{progress}</span>
                <span className="text-xs font-bold text-gray-400 mt-0.5">%</span>
            </div>
        </div>
    );
};

const PartProgressCard: React.FC<{ part: Part; progress: number }> = ({ part, progress }) => (
    <div className="flex w-full items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white">
        <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-1">
                <span className="bg-[#E2FAF2] inline-flex items-center justify-center px-1.5 py-0.5 rounded-lg">
                    <span className="text-xs font-medium text-[#03AA72]">
                        파트 {CURRICULUM_DATA.findIndex(p => p.id === part.id) + 1}
                    </span>
                </span>
                <span className="text-xs font-medium text-gray-500">{part.title}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">{part.subtitle}</h2>
        </div>
        <CircularProgressBar progress={progress} />
    </div>
);


const CourseAccordion: React.FC<{ part: Part; course: Course }> = ({ part, course }) => {
    const { setCurrentScreen, setActiveLesson, userData, getLessonStatus } = useContext(AppContext);
    
    const completedCount = course.lessons.filter(l => userData.completedLessons?.[l.id]).length;
    const totalLessons = course.lessons.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    
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
        <div className="flex flex-col items-start w-full">
            <header onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between py-2 w-full cursor-pointer">
                <h2 className={`text-sm font-semibold ${isCourseActive ? 'text-[#3E3E3E]' : 'text-[#A2A2A2]'}`}>
                    {course.title}
                </h2>
                <div className="inline-flex items-center gap-1">
                    <span className={`text-xs font-medium ${isCourseActive ? 'text-[#3E3E3E]' : 'text-[#A2A2A2]'}`}>
                        {completedCount}/{totalLessons}
                    </span>
                    {isOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-400" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
                </div>
            </header>

            {isOpen && (
                <div className="flex flex-col items-start gap-2 w-full">
                    {course.lessons.map(lesson => {
                        const status = getLessonStatus(lesson.id, part, course);
                        const isLocked = status === 'locked';
                        const isCompleted = status === 'completed';
                        
                        return (
                            <button
                                key={lesson.id}
                                disabled={isLocked}
                                onClick={() => handleLessonClick(lesson)}
                                className="flex items-center justify-between p-4 w-full rounded-xl bg-[#F6F6F6] disabled:bg-opacity-70"
                            >
                                <span className={`text-base font-medium ${!isLocked ? 'text-[#3E3E3E]' : 'text-[#A2A2A2]'}`}>
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
    const [activeTab, setActiveTab] = useState('current');

    useEffect(() => {
        const part = CURRICULUM_DATA.find(p => p.id === userData.lastPart) || CURRICULUM_DATA[0];
        setCurrentPart(part);
    }, [userData.lastPart]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!currentPart) return null;

    const progress = getPartProgress(currentPart.id);

    return (
        <div className="bg-[#F6F6F6] w-full min-h-screen">
            <header className="flex w-full max-w-2xl items-center justify-between py-3 px-5 fixed top-0 bg-white z-10 left-1/2 -translate-x-1/2 shadow-sm">
                <h1 className="text-2xl font-bold text-[#03AA72]">
                    차곡
                </h1>
                 <button className="p-1">
                    <MenuIcon className="w-6 h-6 text-gray-700" />
                </button>
            </header>

            <main className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-5 pt-20 pb-10">
                <WeeklyStreakTracker userData={userData} onNavigate={() => setCurrentScreen(Screen.DASHBOARD)} />
                
                <div className="flex">
                    <div className="py-3 px-5 bg-white rounded-t-xl">
                        <button className="text-sm font-bold text-gray-800">현재 파트</button>
                    </div>
                    <div className="py-3 px-5">
                        <button onClick={() => setCurrentScreen(Screen.PART_SELECTION)} className="text-sm font-semibold text-gray-500">전체 파트</button>
                    </div>
                </div>

                <div className="bg-white rounded-b-xl rounded-tr-xl p-4 flex flex-col gap-4 -mt-4">
                     <PartProgressCard part={currentPart} progress={progress} />
                     {currentPart.courses.map(course => (
                        <CourseAccordion key={course.id} part={currentPart!} course={course} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MainScreen;