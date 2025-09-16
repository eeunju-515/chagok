import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, FireIcon, CoinIcon } from '../components/icons';

const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const DashboardScreen: React.FC = () => {
    const { setCurrentScreen, userData } = useContext(AppContext);
    const [date, setDate] = useState(new Date());
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        mainRef.current?.scrollTo(0, 0);
    }, []);

    const formatTime = (totalSeconds: number) => {
        if (totalSeconds < 3600) {
            const min = Math.floor(totalSeconds / 60);
            const sec = totalSeconds % 60;
            return (
                <span className="text-xl font-bold text-neutral-600">
                    {min}<span className="text-sm font-medium">분</span> {sec}<span className="text-sm font-medium">초</span>
                </span>
            )
        }
        const hours = Math.floor(totalSeconds / 3600);
        const min = Math.floor((totalSeconds % 3600) / 60);
        return (
            <span className="text-xl font-bold text-neutral-600">
                {hours}<span className="text-sm font-medium">시간</span> {min}<span className="text-sm font-medium">분</span>
            </span>
        );
    };

    const changeMonth = (amount: number) => {
        setDate(prevDate => {
            const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + amount, 1);
            return newDate;
        });
    };
    
    const isTodayCompleted = useMemo(() => {
        return userData.lessonDates?.includes(getTodayDateString()) ?? false;
    }, [userData.lessonDates]);

    const calendarData = useMemo(() => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday is 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const learnedDates = new Set(userData.lessonDates);
        const todayString = getTodayDateString();

        const days = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push({ day: null, dateString: null, isLearned: false });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({ day: i, dateString, isLearned: learnedDates.has(dateString) });
        }

        return days.map((d, i) => {
            if (!d.day) return d;
            
            const isStreak = d.isLearned && ((days[i-1]?.isLearned) || (days[i+1]?.isLearned));
            
            return {
                ...d,
                isPast: d.dateString! < todayString,
                isToday: d.dateString === todayString,
                isStreak,
                isStreakStart: isStreak && !(days[i-1]?.isLearned),
                // FIX: Corrected typo from `is Streak` to `isStreak`. This typo was causing multiple cascading errors.
                isStreakEnd: isStreak && !(days[i+1]?.isLearned),
            }
        });

    }, [date, userData.lessonDates]);

    return (
        <div className="bg-white fixed inset-0 flex flex-col">
             <header className="bg-white flex items-center p-5 z-10 border-b flex-shrink-0">
                <button onClick={() => setCurrentScreen(Screen.MAIN)} className="p-1">
                    <ChevronLeftIcon className="w-6 h-6 text-[#202326]" />
                </button>
                <h1 className="text-base font-semibold text-[#202326] mx-auto">학습 현황</h1>
                <div className="w-8"></div>
            </header>

            <main ref={mainRef} className="p-5 flex-1 overflow-y-auto max-w-4xl w-full mx-auto">
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-[#F6F6F6] rounded-[18px] py-5 flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-bold text-neutral-600">{userData.streakCount || 0}</span>
                            <FireIcon className={`w-5 h-5 ${isTodayCompleted ? 'text-orange-400' : 'text-gray-300'}`}/>
                        </div>
                        <p className="text-sm text-neutral-400">연속 학습</p>
                    </div>
                     <div className="bg-[#F6F6F6] rounded-[18px] py-5 flex flex-col items-center justify-center gap-1">
                        {formatTime(userData.totalLearningTime || 0)}
                        <p className="text-sm text-neutral-400">총 학습 시간</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 text-neutral-500 hover:text-neutral-800"><ChevronLeftIcon className="w-5 h-5"/></button>
                    <h2 className="text-base font-semibold text-neutral-500">{date.getFullYear()}년 {date.getMonth() + 1}월</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 text-neutral-500 hover:text-neutral-800"><ChevronRightIcon className="w-5 h-5"/></button>
                </div>
                
                <div className="grid grid-cols-7 text-center text-sm text-neutral-500 pb-2">
                    {['월', '화', '수', '목', '금', '토', '일'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 text-center">
                    {calendarData.map((d, i) => {
                        let textColor = 'text-[#3E3E3E]';
                        if (d.isPast && !d.isLearned) textColor = 'text-[#A2A2A2]';

                        return (
                            <div key={i} className="py-1 flex justify-center items-center h-12">
                                {d.day && (
                                    <div className={`w-full h-9 flex items-center justify-center
                                        ${d.isStreak ? 'bg-[#FFF2E4]' : ''}
                                        ${d.isStreakStart ? 'rounded-l-full' : ''}
                                        ${d.isStreakEnd ? 'rounded-r-full' : ''}
                                    `}>
                                        {d.isLearned ? 
                                            <CoinIcon className="w-7 h-7" /> : 
                                            <span className={`text-sm font-medium ${textColor}`}>{d.day}</span>
                                        }
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    );
};

export default DashboardScreen;
