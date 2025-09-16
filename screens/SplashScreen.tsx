
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen } from '../types';

const Blob1 = () => (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M81.5 108C69 108 58.5 101 54 91.5C49.5 101 39 108 26.5 108C11.5 108 0 96.5 0 81.5C0 71 7.5 61 15.5 56.5C7.5 52 0 42 0 31.5C0 16.5 11.5 5 26.5 5C39 5 49.5 12 54 21.5C58.5 12 69 5 81.5 5C96.5 5 108 16.5 108 31.5C108 42 100.5 52 92.5 56.5C100.5 61 108 71 108 81.5C108 96.5 96.5 108 81.5 108Z" fill="white"/>
    </svg>
);

const Blob2 = () => (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M108 54C108 83.5 84 108 54 108C36 108 20.5 99 9.5 85.5C-1.5 72 -3 54 5 39C13 24 28.5 10.5 46.5 4C64.5 -2.5 87 1.50001 98 16.5C109 31.5 108 54 108 54Z" fill="white"/>
    </svg>
);

const SplashScreen: React.FC = () => {
    const { setCurrentScreen, hasOnboarded } = useContext(AppContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentScreen(hasOnboarded ? Screen.MAIN : Screen.ONBOARDING);
        }, 2000);
        return () => clearTimeout(timer);
    }, [setCurrentScreen, hasOnboarded]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center w-full bg-[#03AA72]">
            <div className="flex items-center justify-center space-x-2 mb-6">
                <Blob1 />
                <Blob2 />
            </div>
            <div className="text-center text-white">
                <p className="text-lg font-medium leading-[1.5]">슬기로운 금융 생활을 위한,</p>
                <p className="text-lg font-medium leading-[1.5]">쉽고 재밌는 금융 학습</p>
            </div>
        </div>
    );
};

export default SplashScreen;