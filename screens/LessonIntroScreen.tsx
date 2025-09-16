
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen } from '../types';
import { ChevronLeftIcon } from '../components/icons';

const LessonIntroScreen: React.FC = () => {
  const { setCurrentScreen, activeLesson } = useContext(AppContext);

  if (!activeLesson) {
    // Should not happen, but as a fallback
    return (
      <div className="p-5">
        <p>레슨 정보를 불러올 수 없습니다.</p>
        <button onClick={() => setCurrentScreen(Screen.MAIN)}>홈으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
      <header className="flex-shrink-0 bg-white flex items-center p-5 border-b border-neutral-200">
        <button onClick={() => setCurrentScreen(Screen.MAIN)} className="p-1 -ml-1">
          <ChevronLeftIcon className="w-6 h-6 text-[#202326]" />
        </button>
        <h1 className="text-base font-semibold text-[#202326] mx-auto">레슨 안내</h1>
        <div className="w-8"></div> {/* Spacer to balance the back button */}
      </header>

      <main className="flex-grow flex flex-col p-5 pt-9 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-[#202326] leading-[1.4] mb-2">
            {activeLesson.title}
          </h2>
          <div className="bg-neutral-100 rounded-[14px] p-4">
            <p className="text-base text-[#3E3E3E] leading-[1.5]">
              {activeLesson.description}
            </p>
          </div>
      </main>

      <footer className="flex-shrink-0 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] w-full max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentScreen(Screen.QUIZ)}
          className="w-full bg-[#03AA72] text-white py-4 rounded-lg text-base font-bold"
        >
          학습하기
        </button>
      </footer>
    </div>
  );
};

export default LessonIntroScreen;