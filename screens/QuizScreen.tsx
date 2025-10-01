import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen, Quiz } from '../types';
import { XMarkIcon } from '../components/icons';

const FeedbackModal: React.FC<{ isCorrect: boolean; explanation: string; onContinue: () => void }> = ({ isCorrect, explanation, onContinue }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20 px-5">
        <div className="bg-white w-full rounded-[24px] p-5 max-w-md mx-auto shadow-lg">
            <div className="flex flex-col items-start gap-1.5 mb-4">
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                    {isCorrect ? '정답이에요! 🎉' : '아쉬워요, 다시 확인해볼까요?'}
                </h2>
                <div className={`w-full p-4 rounded-[14px] ${isCorrect ? 'bg-[#FFF2E4]' : 'bg-[#FCE6E7]'}`}>
                    <p className="text-lg font-medium text-neutral-600 leading-relaxed">
                        {explanation}
                    </p>
                </div>
            </div>
            <button 
                onClick={onContinue} 
                className={`w-full h-12 text-white rounded-xl text-lg font-bold ${isCorrect ? 'bg-[#03AA72]' : 'bg-[#EE8085]'}`}
            >
                계속하기
            </button>
        </div>
    </div>
);


const QuizScreen: React.FC = () => {
    const { setCurrentScreen, activeLesson, setLessonResult, updateUserData, userData } = useContext(AppContext);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);
    const [correctOnFirstTry, setCorrectOnFirstTry] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    if (!activeLesson || activeLesson.quizzes.length === 0) {
        return <div>퀴즈를 불러올 수 없습니다.</div>;
    }

    const quizzes = activeLesson.quizzes;
    const currentQuiz = quizzes[questionIndex];
    const progress = ((questionIndex + 1) / quizzes.length) * 100;

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer !== null) return;

        const isFirstAttempt = incorrectAnswers.length === 0;
        setSelectedAnswer(answer);
        const correct = answer === currentQuiz.answer;
        setIsCorrect(correct);

        if (correct) {
            if (isFirstAttempt) {
                setCorrectOnFirstTry(prev => prev + 1);
            }
        } else {
            setIncorrectAnswers(prev => [...prev, answer]);
        }
        setShowModal(true);
    };

    const handleModalContinue = () => {
        setShowModal(false);
        if (isCorrect) {
            if (questionIndex + 1 < quizzes.length) {
                setQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIncorrectAnswers([]);
            } else {
                const endTime = Date.now();
                const timeTaken = Math.round((endTime - startTime) / 1000);
                const accuracy = Math.round((correctOnFirstTry / quizzes.length) * 100);
                setLessonResult({ accuracy, time: timeTaken });
                setCurrentScreen(Screen.LESSON_COMPLETE);
            }
        } else {
             setSelectedAnswer(null);
        }
    };
    
    const getExplanation = () => {
        if (!selectedAnswer) return "";
        if (isCorrect) return currentQuiz.correctExplanation;
        
        if (typeof currentQuiz.incorrectExplanation === 'string') {
            return currentQuiz.incorrectExplanation;
        }
        return currentQuiz.incorrectExplanation[selectedAnswer] || "틀린 답입니다. 다시 생각해보세요!";
    };

    const renderOptions = (quiz: Quiz) => {
        switch (quiz.type) {
            case 'OX':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleAnswerSelect('O')} disabled={incorrectAnswers.includes('O')} className="flex-1 h-[116px] flex items-center justify-center rounded-xl bg-[#D2E9FF] disabled:opacity-50">
                            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F7XPvF%2FbtsQZTIATgT%2FAAAAAAAAAAAAAAAAAAAAAM8eq9YK6GKCr_NvKB6pfQeeAJhUwW6FqM533j5lsv6s%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DNvZKJrgo4nTpS7YEcm5PkP0sh9k%253D" alt="O" className="w-12 h-12" />
                        </button>
                        <button onClick={() => handleAnswerSelect('X')} disabled={incorrectAnswers.includes('X')} className="flex-1 h-[116px] flex items-center justify-center rounded-xl bg-[#FCE6E7] disabled:opacity-50">
                            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcqKRjE%2FbtsQ0cO0jYC%2FAAAAAAAAAAAAAAAAAAAAAG68zmwhKCKncNIsEV8paAAs-Gs9D_2d0oZZsXvvpkXP%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DVLmJ8d139OYeOGOlzADIwQ7rJ1o%253D" alt="X" className="w-12 h-12" />
                        </button>
                    </div>
                );
            case 'MULTIPLE_CHOICE':
            case 'FILL_IN_BLANK':
                return (
                    <div className="space-y-3">
                        {quiz.options.map(option => (
                             <button 
                                key={option} 
                                onClick={() => handleAnswerSelect(option)}
                                disabled={incorrectAnswers.includes(option)}
                                className="w-full p-4 border border-solid border-[#E1E1E1] rounded-[12px] text-left text-lg font-medium text-[#202326] disabled:bg-neutral-100 disabled:text-neutral-300"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
            <header className="flex-shrink-0 flex w-full items-center justify-between px-5 py-4 bg-white border-b border-solid border-neutral-200">
                <button onClick={() => setCurrentScreen(Screen.MAIN)} className="p-1">
                    <XMarkIcon className="w-6 h-6 text-[#202326]" />
                </button>
                <div className="text-lg font-semibold text-neutral-500">{questionIndex + 1} / {quizzes.length}</div>
                <div className="w-8"></div>
            </header>
            
            <div className="flex-shrink-0 px-5 pt-4">
                <div className="w-full h-2 bg-neutral-150 rounded-full overflow-hidden">
                    <div className="bg-[#03AA72] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <main className="flex-grow flex flex-col p-5 overflow-hidden w-full max-w-2xl mx-auto">
                <div className="pt-4 overflow-hidden">
                    <h2 className="text-2xl font-medium text-neutral-600 text-left leading-relaxed">
                       {currentQuiz.question.split('____').map((part, index, array) => (
                            <React.Fragment key={index}>
                                {part}
                                {index < array.length - 1 && <span className="inline-block w-24 h-7 bg-[#EFEFEF] rounded-[6px] align-middle mx-1"></span>}
                            </React.Fragment>
                        ))}
                    </h2>
                </div>
                <div className="flex-grow flex flex-col justify-start pt-24">
                    {renderOptions(currentQuiz)}
                </div>
            </main>
            {showModal && <FeedbackModal isCorrect={isCorrect} explanation={getExplanation()} onContinue={handleModalContinue} />}
        </div>
    );
};

export default QuizScreen;