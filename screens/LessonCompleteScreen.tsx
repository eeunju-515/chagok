
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { FireIcon } from '../components/icons';

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
        if (!activeLesson) return;

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
        
        // Find next lesson
        const allLessons: { id: string; partId: string }[] = [];
        CURRICULUM_DATA.forEach(part => {
            part.courses.forEach(course => {
                course.lessons.forEach(lesson => {
                    allLessons.push({ id: lesson.id, partId: part.id });
                });
            });
        });

        const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson.id);
        const nextLessonInfo = allLessons[currentLessonIndex + 1];

        const nextLessonByPart = { ...userData.nextLessonByPart };
        if (nextLessonInfo) {
             const currentPartId = allLessons[currentLessonIndex].partId;
             if (nextLessonInfo.partId !== currentPartId) {
                // If next lesson is in a new part, keep the old part's next lesson
                nextLessonByPart[currentPartId] = nextLessonInfo.id;
             } else {
                nextLessonByPart[nextLessonInfo.partId] = nextLessonInfo.id;
             }
        }

        const newCompletedLessons = { ...userData.completedLessons, [activeLesson.id]: true };
        const newTotalTime = (userData.totalLearningTime || 0) + (lessonResult?.time || 0);
        const newLessonDates = [...new Set([...(userData.lessonDates || []), today])];

        updateUserData({
            streakCount: newStreak,
            lastAccessDate: today,
            nextLessonByPart,
            completedLessons: newCompletedLessons,
            totalLearningTime: newTotalTime,
            lessonDates: newLessonDates,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLesson]);

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

    return (
        <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
            <main className="flex-grow p-5 pt-9 w-full max-w-2xl mx-auto overflow-hidden">
                <div className="inline-flex items-center justify-center gap-2.5 px-3 py-1.5 bg-[#E2FAF2] rounded-xl">
                    <span className="text-xs font-semibold text-[#03AA72]">
                        {activeLesson.title}
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-[#202326] mt-2 leading-snug">
                    오늘도 금융 레벨 +1 상승!
                </h1>

                <section className="mt-8 space-y-6">
                    <article className="flex flex-col items-start gap-1.5">
                        <h2 className="text-sm font-semibold text-[#3E3E3E]">
                            💡 핵심만 쏙!
                        </h2>
                        <p className="text-base text-[#7E7E7E] leading-relaxed">
                            {activeLesson.completionContent.summary}
                        </p>
                    </article>
                    <article className="flex flex-col items-start gap-1.5">
                        <h2 className="text-sm font-semibold text-[#3E3E3E]">
                            ✨ 바로 실천해볼까요?
                        </h2>
                        <p className="text-base text-[#7E7E7E] leading-relaxed">
                            {activeLesson.completionContent.action}
                        </p>
                    </article>
                </section>
            </main>

            <footer className="flex-shrink-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] w-full max-w-2xl mx-auto">
                 <section className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-[#F6F6F6] p-4 rounded-2xl flex flex-col justify-center">
                        <p className="text-sm text-[#7E7E7E]">정답률</p>
                        <p className="text-xl font-bold text-[#3E3E3E] mt-1">{lessonResult.accuracy}%</p>
                    </div>
                    <div className="bg-[#F6F6F6] p-4 rounded-2xl flex flex-col justify-center">
                        <p className="text-sm text-[#7E7E7E]">소요 시간</p>
                        <p className="text-xl font-bold text-[#3E3E3E] mt-1">{formatTime(lessonResult.time)}</p>
                    </div>
                    <div className="bg-[#F6F6F6] p-4 rounded-2xl flex flex-col justify-center">
                        <p className="text-sm text-[#7E7E7E]">연속 학습</p>
                        <div className="flex items-center justify-center mt-1">
                             <p className="text-xl font-bold text-[#3E3E3E]">{userData.streakCount}일</p>
                             <FireIcon className="w-5 h-5 text-orange-400 ml-0.5" />
                        </div>
                    </div>
                </section>
                <button
                    onClick={() => setCurrentScreen(Screen.MAIN)}
                    className="w-full bg-[#03AA72] text-white py-4 rounded-lg text-base font-bold"
                >
                    완료하기
                </button>
            </footer>
        </div>
    );
};

export default LessonCompleteScreen;