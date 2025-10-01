
import React, { useContext, useMemo, useRef, useState, forwardRef, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen, Part, Lesson, Course } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { LockClosedIcon, CheckCircleIcon, ChevronUpIcon, ChevronDownIcon } from '../components/icons';

const activeStreakIcon = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbwV5lC%2FbtsQ0zXqwWU%2FAAAAAAAAAAAAAAAAAAAAAL4VRqWeOg8t4gAG1eznSkDSJXKNBxlySFz9xQwyUUlZ%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3D1RLmY3XJe5fMWRagqChONnueynY%253D";
const inactiveStreakIcon = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbhcyOg%2FbtsQ0FpPt5i%2FAAAAAAAAAAAAAAAAAAAAAN2N2zPtv4Jsahm7YC14VLdgXEowlQjNmqnKILh_lXkX%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DTs4QgPxogMPavPwTy5jnRJDWhdM%253D";


const PartCard = forwardRef<HTMLButtonElement, { part: Part, isActive: boolean, isLocked: boolean, isCompleted: boolean, isInProgress: boolean, onClick: () => void }>(({ part, isActive, isLocked, isCompleted, isInProgress, onClick }, ref) => {
    const totalLessons = useMemo(() => part.courses.reduce((acc, course) => acc + course.lessons.length, 0), [part]);
    
    const partIcons: { [key: string]: string } = {
        'part_01': 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb3BoI8%2FbtsQ04Qqp5k%2FAAAAAAAAAAAAAAAAAAAAAN3FFGwNk3RLz4xG8WJZiviRIui40Ig0fbOMlcaPbk0A%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DLbDeY59nTs3RlWfh9wlez9fJULk%253D',
        'part_02': 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FclRfE7%2FbtsQZAJiuuB%2FAAAAAAAAAAAAAAAAAAAAACw5gcy2kVsLf12wJ26IaF1aUYYgXnhiITp8LJoR-JM0%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3D7RXp1Kn2FP6kF06Q2KmSZAacKRg%253D',
        'part_03': 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcOXvLW%2FbtsQZ0nqZ0q%2FAAAAAAAAAAAAAAAAAAAAAOQezEC-aozosxofTB0EfxdkBIb0h4SE4MA8xNTRpeiu%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DHBe7vhJia%252FV%252Fgm9NLDmCaTwnB4E%253D',
        'part_04': 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fcx0V4N%2FbtsQZEkTETv%2FAAAAAAAAAAAAAAAAAAAAAHyGoqKahVeFonO0vvc1Ys0cNgrbGmWVt9A58tKJgUSP%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3Dodo3MKahHVWO9pebG5wKTNKK1IY%253D',
        'part_05': 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb1WXU9%2FbtsQZVsQLf8%2FAAAAAAAAAAAAAAAAAAAAAKybqcrhFsA2xrzqn1MJKNtTTTg1fADeeRKZ1SUZxWJ1%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DYRP2f24xSD%252FEawqsGCRFVdmDBgA%253D',
        'part_06': 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FLTqLS%2FbtsQYemHYP0%2FAAAAAAAAAAAAAAAAAAAAAB6KsoChjwqC1QxcM-9IxDl6d4mI5NPCY_7N-Ins3j3T%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DGl9k333L2UzODE0lWaxVu7oN98M%253D',
    };
    const iconSrc = partIcons[part.id] || partIcons['part_01'];

    return (
        <button ref={ref} onClick={onClick} className={`flex flex-col flex-shrink-0 w-[140px] h-[160px] bg-white rounded-2xl p-3.5 relative shadow-sm transition-all duration-300 text-left ${isActive ? 'border-2 border-[#03AA72]' : ''}`}>
            <div className="flex justify-between items-start">
                <span className={`inline-block px-1.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-500`}>
                    파트 {CURRICULUM_DATA.findIndex(p => p.id === part.id) + 1}
                </span>
                {isLocked ? (
                    <LockClosedIcon className="w-4 h-4 text-gray-300" />
                ) : isCompleted ? (
                    <CheckCircleIcon className="w-5 h-5 text-[#03AA72]" />
                ) : isInProgress ? (
                    <span className="text-xs font-bold text-[#03AA72]">진행 중</span>
                ) : null}
            </div>
            <div className="flex-grow flex flex-col justify-end mt-2">
                <h3 className="text-base font-bold text-gray-800 leading-tight">{part.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">레슨 {totalLessons}</p>
                <div className="mt-auto self-end">
                     <img src={iconSrc} alt={part.title} className="w-12 h-12" />
                </div>
            </div>
        </button>
    );
});
PartCard.displayName = "PartCard";

const CurriculumSection: React.FC = () => {
    const { userData, getPartProgress, updateUserData, displayToast } = useContext(AppContext);
    
    const totalLessons = useMemo(() => CURRICULUM_DATA.reduce((total, part) => total + part.courses.reduce((acc, course) => acc + course.lessons.length, 0), 0), []);
    const completedLessons = useMemo(() => Object.keys(userData.completedLessons).length, [userData.completedLessons]);
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const partCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    let inProgressPartId = '';
    for (let i = 0; i < CURRICULUM_DATA.length; i++) {
        const part = CURRICULUM_DATA[i];
        const progress = getPartProgress(part.id);
        const isCompleted = progress === 100;
        const prevPartProgress = i > 0 ? getPartProgress(CURRICULUM_DATA[i - 1].id) : 100;
        const isLocked = prevPartProgress < 100;

        if (!isLocked && !isCompleted) {
            inProgressPartId = part.id;
            break;
        }
    }
    if (!inProgressPartId && CURRICULUM_DATA.length > 0) {
        // FIX: Replaced `findLastIndex` with a reverse for-loop for wider browser compatibility.
        let lastCompletedPartIndex = -1;
        for (let i = CURRICULUM_DATA.length - 1; i >= 0; i--) {
            if (getPartProgress(CURRICULUM_DATA[i].id) === 100) {
                lastCompletedPartIndex = i;
                break;
            }
        }
        if (lastCompletedPartIndex > -1 && lastCompletedPartIndex < CURRICULUM_DATA.length - 1) {
             inProgressPartId = CURRICULUM_DATA[lastCompletedPartIndex + 1].id;
        } else if (lastCompletedPartIndex === -1) {
             inProgressPartId = CURRICULUM_DATA[0].id;
        }
    }


    useEffect(() => {
        const scrollOnNextFrame = () => {
            const activePartIndex = CURRICULUM_DATA.findIndex(p => p.id === userData.lastPart);
            if (activePartIndex !== -1 && scrollContainerRef.current) {
                const activeCardElement = partCardRefs.current[activePartIndex];
                if (activeCardElement) {
                    const containerPadding = 20; // Corresponds to px-5
                    const scrollPosition = activeCardElement.offsetLeft - containerPadding;
                    
                    scrollContainerRef.current.scrollTo({
                        left: scrollPosition,
                        behavior: 'auto', 
                    });
                }
            }
        };

        const animationFrameId = requestAnimationFrame(scrollOnNextFrame);

        return () => cancelAnimationFrame(animationFrameId);
    }, [userData.lastPart]);


    // Mouse Events
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
        scrollContainerRef.current.style.userSelect = 'none';
    };

    const handleMouseLeaveOrUp = () => {
        if (!scrollContainerRef.current) return;
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = 'grab';
        scrollContainerRef.current.style.userSelect = 'auto';
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Multiplier for scroll speed
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };
    
    // Touch Events
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };
    
    return (
        <section>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-neutral-800">전체 커리큘럼</h2>
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-500">진행률</span>
                    <span className="text-sm font-bold text-[#03AA72]">{overallProgress}%</span>
                </div>
            </div>
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-3 pb-2 cursor-grab -mx-5 px-5" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
            >
                <style>{`::-webkit-scrollbar { display: none; }`}</style>
                {CURRICULUM_DATA.map((part, index) => {
                    const prevPartProgress = index > 0 ? getPartProgress(CURRICULUM_DATA[index - 1].id) : 100;
                    const isLocked = prevPartProgress < 100;
                    const progress = getPartProgress(part.id);
                    const isCompleted = progress === 100;


                    const handlePartClick = () => {
                        if (isLocked) {
                            displayToast('이전 파트를 완료해야 진행할 수 있어요.');
                        } else {
                            updateUserData({ lastPart: part.id });
                        }
                    };

                    return (
                        <PartCard
                            ref={el => { if(el) partCardRefs.current[index] = el; }}
                            key={part.id}
                            part={part}
                            isActive={part.id === userData.lastPart}
                            isLocked={isLocked}
                            isCompleted={isCompleted}
                            isInProgress={part.id === inProgressPartId}
                            onClick={handlePartClick}
                        />
                    );
                })}
            </div>
        </section>
    );
};

const NextLessonSection: React.FC = () => {
    const { userData, setActiveLesson, setCurrentScreen } = useContext(AppContext);
    const part = CURRICULUM_DATA.find(p => p.id === userData.lastPart);
    if (!part) return null;

    const allLessonsInPart = useMemo(() => part.courses.flatMap(course => course.lessons), [part]);
    const completedCount = allLessonsInPart.filter(l => userData.completedLessons?.[l.id]).length;
    const isPartCompleted = completedCount === allLessonsInPart.length;

    const nextLessonId = userData.nextLessonByPart[part.id];
    let nextLesson: Lesson | null = null;
    let lessonNumberText = '';

    if (nextLessonId) {
        let lessonCounter = 0;
        for (const course of part.courses) {
            for (const lesson of course.lessons) {
                lessonCounter++;
                if (lesson.id === nextLessonId) {
                    nextLesson = lesson;
                    const lessonIndexInCourse = course.lessons.findIndex(l => l.id === nextLessonId) + 1;
                    lessonNumberText = `레슨 ${lessonIndexInCourse}`;
                    break;
                }
            }
            if (nextLesson) break;
        }
    }

    const handleStartLearning = () => {
        if (!nextLesson) return;
        setActiveLesson(nextLesson);
        setCurrentScreen(Screen.QUIZ);
    };

    return (
        <section className="flex flex-col">
             <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-neutral-800">파트 {CURRICULUM_DATA.findIndex(p => p.id === part.id) + 1}</h2>
                 <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-500">진행률</span>
                    <span className={`text-sm font-bold ${isPartCompleted ? 'text-[#03AA72]' : 'text-gray-800'}`}>
                        {completedCount}/{allLessonsInPart.length}
                    </span>
                </div>
            </div>
            {nextLesson && (
                <div className="bg-white rounded-2xl p-5">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md mb-2">{lessonNumberText}</span>
                    <p className="text-xl font-bold text-gray-800 mb-4 leading-snug">{nextLesson.title}</p>
                    <button
                        onClick={handleStartLearning}
                        className="w-full bg-[#03AA72] text-white py-3 rounded-lg text-base font-bold hover:bg-green-700 transition-colors"
                    >
                        바로 학습하기
                    </button>
                </div>
            )}
        </section>
    );
};

const AllLessonsSection: React.FC = () => {
    const { userData, getLessonStatus, setActiveLesson, setCurrentScreen, displayToast } = useContext(AppContext);
    const [isExpanded, setIsExpanded] = useState(true);
    const part = CURRICULUM_DATA.find(p => p.id === userData.lastPart);
    if (!part) return null;

    const allLessonsInPart = useMemo(() => part.courses.flatMap(course => course.lessons.map(lesson => ({ ...lesson, course }))), [part]);

    const handleLessonClick = (lesson: Lesson, course: Course) => {
        const status = getLessonStatus(lesson.id, part, course);
        if (status === 'locked') {
            displayToast('이전 레슨을 완료해야 진행할 수 있어요.');
        } else {
            setActiveLesson(lesson);
            setCurrentScreen(Screen.QUIZ);
        }
    };
    
    return (
        <section className="bg-white rounded-2xl p-4">
            <div 
                className="flex justify-between items-center px-2 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="font-bold text-lg text-neutral-800">전체 레슨</h3>
                {isExpanded ? <ChevronUpIcon className="w-6 h-6 text-gray-500" /> : <ChevronDownIcon className="w-6 h-6 text-gray-500" />}
            </div>
            {isExpanded && (
                <div className="space-y-3 mt-3">
                    {allLessonsInPart.map((lesson, index) => {
                        const status = getLessonStatus(lesson.id, part, lesson.course);
                        
                        return (
                            <button 
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson, lesson.course)}
                                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl text-left"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">레슨 {index + 1}</span>
                                    <span className={`font-semibold text-base ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                                        {lesson.title}
                                    </span>
                                </div>
                                {status === 'completed' && <CheckCircleIcon className="w-6 h-6 text-[#03AA72]" />}
                                {status === 'next' && (
                                    <span
                                        className="bg-[#03AA72] text-white px-4 py-1.5 rounded-full text-sm font-bold"
                                    >
                                        학습하기
                                    </span>
                                )}
                                 {status === 'locked' && <LockClosedIcon className="w-5 h-5 text-gray-300" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};


const MainScreen: React.FC = () => {
    const { userData } = useContext(AppContext);
    const streakIcon = (userData.streakCount || 0) > 0 ? activeStreakIcon : inactiveStreakIcon;
    const part = CURRICULUM_DATA.find(p => p.id === userData.lastPart);
    const hasNextLesson = part && userData.nextLessonByPart[part.id];


    return (
        <div className="bg-[#F9FAFB] min-h-screen">
             <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-3 px-5 bg-[#F9FAFB]">
                <h1 className="text-2xl font-extrabold text-[#202326]">
                    FinEdu
                </h1>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5">
                        <img src={streakIcon} alt="연속 학습" className="w-5 h-5" />
                        <span className="font-bold text-sm text-neutral-700">{userData.streakCount || 0}</span>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-2xl mx-auto flex flex-col gap-8 p-5 pt-4 pb-4">
                <CurriculumSection />
                <div className={`flex flex-col ${hasNextLesson ? 'gap-3' : 'gap-8'}`}>
                    <NextLessonSection />
                    <AllLessonsSection />
                </div>
            </main>
            
            <footer className="w-full max-w-2xl mx-auto p-5 pt-0 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                <div className="text-center text-sm text-neutral-500 bg-neutral-200/50 p-3 rounded-lg mb-4">
                    FinEdu는 아직 베타 버전이라 캐시를 삭제하거나 시크릿 모드를 사용하면 학습 기록이 저장되지 않으니 서비스 이용에 참고해 주세요!
                </div>
                <div className="flex justify-center items-center space-x-4 text-sm text-neutral-500 mb-2">
                    <a href="#" className="hover:underline">공지사항</a>
                    <span className="text-neutral-300">|</span>
                    <a href="mailto:feedback@chachag.com" className="hover:underline">의견 보내기</a>
                    <span className="text-neutral-300">|</span>
                    <a href="#" className="hover:underline">개인정보 처리방침</a>
                </div>
                <p className="text-center text-sm text-neutral-400">© 2025 FinEdu. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainScreen;
