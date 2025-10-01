import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen, Part, Lesson } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { StarIcon } from '../components/icons';

const activeStreakIcon = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbwV5lC%2FbtsQ0zXqwWU%2FAAAAAAAAAAAAAAAAAAAAAL4VRqWeOg8t4gAG1eznSkDSJXKNBxlySFz9xQwyUUlZ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3D1RLmY3XJe5fMWRagqChONnueynY%253D";
const inactiveStreakIcon = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbhcyOg%2FbtsQ0FpPt5i%2FAAAAAAAAAAAAAAAAAAAAAN2N2zPtv4Jsahm7YC14VLdgXEowlQjNmqnKILh_lXkX%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DTs4QgPxogMPavPwTy5jnRJDWhdM%253D";

const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const LessonCompleteScreen: React.FC = () => {
    const { setCurrentScreen, activeLesson, lessonResult, userData, updateUserData } = useContext(AppContext);

    useEffect(() => {
        if (!activeLesson || !lessonResult) return;

        const today = getTodayDateString();
        let newStreak = userData.streakCount;
        
        if(userData.lastAccessDate !== today) {
            const lastDate = userData.lastAccessDate ? new Date(userData.lastAccessDate) : new Date(0);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak = (newStreak || 0) + 1;
            } else if (diffDays > 1) {
                newStreak = 1; 
            } else if (userData.lastAccessDate === '') {
                 newStreak = 1;
            }
        } else if (newStreak === 0) {
            newStreak = 1;
        }
        
        const newCompletedLessons = { ...userData.completedLessons, [activeLesson.id]: true };

        let currentPart: Part | undefined;
        let currentPartIndex = -1;
        for (const [index, part] of CURRICULUM_DATA.entries()) {
            if (part.courses.some(c => c.lessons.some(l => l.id === activeLesson.id))) {
                currentPart = part;
                currentPartIndex = index;
                break;
            }
        }

        let newLastPart = userData.lastPart;
        const nextLessonByPart = { ...userData.nextLessonByPart };

        if (currentPart) {
            const allLessonsInPart = currentPart.courses.flatMap(c => c.lessons);
            const currentLessonIndexInPart = allLessonsInPart.findIndex(l => l.id === activeLesson.id);
            const nextLessonInPart = allLessonsInPart[currentLessonIndexInPart + 1];

            if (nextLessonInPart) {
                nextLessonByPart[currentPart.id] = nextLessonInPart.id;
            } else {
                delete nextLessonByPart[currentPart.id];
            }

            const isPartComplete = allLessonsInPart.every(l => newCompletedLessons[l.id]);
            if (isPartComplete) {
                if (currentPartIndex > -1 && currentPartIndex < CURRICULUM_DATA.length - 1) {
                    const nextPart = CURRICULUM_DATA[currentPartIndex + 1];
                    newLastPart = nextPart.id;
                    if(nextPart?.courses?.[0]?.lessons?.[0] && !nextLessonByPart[nextPart.id]) {
                        nextLessonByPart[nextPart.id] = nextPart.courses[0].lessons[0].id;
                    }
                }
            }
        }
        
        const newTotalTime = (userData.totalLearningTime || 0) + (lessonResult?.time || 0);
        const newLessonDates = [...new Set([...(userData.lessonDates || []), today])];

        updateUserData({
            streakCount: newStreak,
            lastAccessDate: today,
            nextLessonByPart,
            completedLessons: newCompletedLessons,
            totalLearningTime: newTotalTime,
            lessonDates: newLessonDates,
            lastPart: newLastPart,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLesson, lessonResult]);

    if (!activeLesson || !lessonResult) {
        return (
            <div className="p-5">
                <p>결과를 불러올 수 없습니다.</p>
                <button onClick={() => setCurrentScreen(Screen.MAIN)}>홈으로 돌아가기</button>
            </div>
        );
    }
    
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    const streakIcon = (userData.streakCount || 0) > 0 ? activeStreakIcon : inactiveStreakIcon;

    return (
        <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
            <main className="flex-grow p-5 pt-12 w-full max-w-2xl mx-auto overflow-y-auto text-center">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-300 rounded-full opacity-30 blur-lg"></div>
                    <StarIcon className="w-24 h-24 text-yellow-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-neutral-800 mt-4 leading-snug">
                    오늘도 금융 레벨 +1 상승!
                </h1>
                
                <div className="inline-flex items-center justify-center gap-2.5 mt-2 px-3 py-1.5 bg-neutral-100 rounded-full">
                    <span className="text-sm font-semibold text-neutral-600">
                        {activeLesson.title}
                    </span>
                </div>

                <section className="grid grid-cols-3 gap-3 my-8 text-center">
                    <div className="bg-neutral-100 p-4 rounded-2xl flex flex-col justify-center">
                        <p className="text-base text-neutral-500">정답률</p>
                        <p className="text-2xl font-bold text-neutral-800 mt-1">{lessonResult.accuracy}%</p>
                    </div>
                    <div className="bg-neutral-100 p-4 rounded-2xl flex flex-col justify-center">
                        <p className="text-base text-neutral-500">소요 시간</p>
                        <p className="text-2xl font-bold text-neutral-800 mt-1">{formatTime(lessonResult.time)}</p>
                    </div>
                    <div className="bg-neutral-100 p-4 rounded-2xl flex flex-col justify-center">
                        <p className="text-base text-neutral-500">연속 학습</p>
                        <div className="flex items-center justify-center mt-1">
                             <p className="text-2xl font-bold text-neutral-800">{userData.streakCount}일</p>
                             <img src={streakIcon} alt="연속 학습" className="w-5 h-5 ml-0.5" />
                        </div>
                    </div>
                </section>

                <section className="bg-white border border-neutral-200 p-5 rounded-2xl text-left mb-4">
                    <h2 className="text-base font-semibold text-neutral-800 mb-2">
                        💡 핵심만 쏙!
                    </h2>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                        {activeLesson.completionContent.summary}
                    </p>
                </section>

                <section className="bg-white border border-neutral-200 p-5 rounded-2xl text-left">
                    <h2 className="text-base font-semibold text-neutral-800 mb-2">
                        ✨ 바로 실천해볼까요?
                    </h2>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                        {activeLesson.completionContent.action}
                    </p>
                </section>
            </main>

            <footer className="flex-shrink-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] w-full max-w-2xl mx-auto">
                <button
                    onClick={() => setCurrentScreen(Screen.MAIN)}
                    className="w-full bg-[#03AA72] text-white py-4 rounded-lg text-lg font-bold"
                >
                    완료하기
                </button>
            </footer>
        </div>
    );
};

export default LessonCompleteScreen;