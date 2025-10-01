
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen } from '../types';
import { XMarkIcon } from '../components/icons';

const SettingsScreen: React.FC = () => {
    const { setCurrentScreen } = useContext(AppContext);

    return (
        <div className="bg-white fixed inset-0 flex flex-col">
            <header className="bg-white flex items-center p-5 z-10 border-b flex-shrink-0 relative">
                <button onClick={() => setCurrentScreen(Screen.MAIN)} className="p-1 absolute left-4">
                    <XMarkIcon className="w-6 h-6 text-neutral-800" />
                </button>
                <h1 className="text-xl font-semibold text-neutral-800 text-center w-full">설정</h1>
            </header>
            <main className="flex-1 overflow-y-auto">
                {/* Content moved to MainScreen footer */}
            </main>
        </div>
    );
};

export default SettingsScreen;
