
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen, Part } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { ChevronLeftIcon, LockClosedIcon } from '../components/icons';

const PartCard: React.FC<{ part: Part; index: number, progress: number, isLocked: boolean }> = ({ part, index, progress, isLocked }) => {
    const { setCurrentScreen, updateUserData, displayToast } = useContext(AppContext);
    
    const handleSelectPart = () => {
        if (!isLocked) {
            updateUserData({ lastPart: part.id });
            setCurrentScreen(Screen.MAIN);
        } else {
            displayToast('이전 파트를 완료해야 진행할 수 있어요.');
        }
    };

    const isCompleted = !isLocked && progress === 100;

    // Locked State
    if (isLocked) {
        return (
            <button onClick={handleSelectPart} className="w-full bg-[#F6F6F6] border border-[#E1E1E1] rounded-xl p-5 mb-3 text-left shadow-sm">
                <header className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                         <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#E7E7E7]">
                            <span className="text-sm font-semibold text-[#7E7E7E]">파트 {index + 1}</span>
                        </span>
                        <h2 className="text-base font-semibold text-[#7E7E7E]">{part.title}</h2>
                    </div>
                    <LockClosedIcon className="w-5 h-5 text-[#A2A2A2]" />
                </header>
                <div className="mt-2">
                    <h1 className="text-xl font-semibold text-[#7E7E7E]">{part.subtitle}</h1>
                    <p className="text-base text-[#A2A2A2] mt-1 leading-relaxed">{part.description}</p>
                </div>
            </button>
        );
    }

    // Unlocked States (Completed & In Progress)
    const tagBg = isCompleted ? 'bg-[#3E3E3E]' : 'bg-[#03AA72]';
    const progressColor = isCompleted ? 'text-[#3E3E3E]' : 'text-[#7E7E7E]';

    return (
        <button 
            onClick={handleSelectPart} 
            className="w-full bg-white rounded-xl p-5 mb-3 text-left shadow-sm border border-[#E1E1E1] hover:bg-gray-50 transition-colors"
        >
            <header className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md ${tagBg}`}>
                        <span className="text-sm font-semibold text-white">파트 {index + 1}</span>
                    </span>
                    <h2 className="text-base font-semibold text-[#3E3E3E]">{part.title}</h2>
                </div>
                <span className={`text-base font-medium ${progressColor}`}>{progress}%</span>
            </header>
            <div className="mt-2">
                <h1 className="text-xl font-semibold text-[#202326]">{part.subtitle}</h1>
                <p className="text-base text-[#7E7E7E] mt-1 leading-relaxed">{part.description}</p>
            </div>
        </button>
    );
};


const PartSelectionScreen: React.FC = () => {
    const { setCurrentScreen, getPartProgress } = useContext(AppContext);

    return (
        <div className="bg-[#F3F3F3] min-h-screen">
            <header className="bg-white flex items-center p-5 sticky top-0 z-10 border-b">
                <button onClick={() => setCurrentScreen(Screen.MAIN)} className="p-1">
                    <ChevronLeftIcon className="w-6 h-6 text-[#202326]" />
                </button>
                <h1 className="text-lg font-semibold text-[#202326] mx-auto">파트 선택</h1>
                 <div className="w-8"></div>
            </header>

            <main className="p-5">
                <div className="max-w-2xl mx-auto">
                    {CURRICULUM_DATA.map((part, index) => {
                        const progress = getPartProgress(part.id);
                        const isLocked = index > 0 && getPartProgress(CURRICULUM_DATA[index - 1].id) < 100;

                        return (
                            <PartCard 
                                key={part.id} 
                                part={part} 
                                index={index} 
                                progress={progress} 
                                isLocked={isLocked}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default PartSelectionScreen;