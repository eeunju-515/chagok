
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Screen } from '../types';

const MarqueeRowContent: React.FC<{ tags: { text: string; style: string }[] }> = ({ tags }) => (
  <>
    {tags.map((tag, index) => (
      <span
        key={index}
        className={`px-3.5 py-2.5 rounded-[40px] text-sm font-semibold whitespace-nowrap mx-1.5 ${tag.style}`}
      >
        {tag.text}
      </span>
    ))}
  </>
);

const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen, setHasOnboarded, updateUserData } = useContext(AppContext);

  const topics = [
    "재무 목표 설계", "월급 통장 쪼개기", "한 달 예산 세우기",
    "돈 굴리기", "비상금을 위한 파킹통장", "위험과 수익, 투자의 기본",
    "주식이 뭐야?", "은퇴 준비 만능통장", "투자의 정석, 분산투자"
  ];

  const topicColors = [
    "bg-[#D2E9FF] text-[#1D92FF]", "bg-[#CDEEE3] text-[#03AA72]", "bg-[#FFF2E4] text-[#FFC076]",
    "bg-[#FCE6E7] text-[#EE8085]", "bg-[#CDEEE3] text-[#03AA72]", "bg-[#FFF2E4] text-[#FFC076]",
    "bg-[#D2E9FF] text-[#1D92FF]", "bg-[#FCE6E7] text-[#EE8085]", "bg-[#FFF2E4] text-[#FFC076]"
  ];
  
  const tagData = topics.map((topic, index) => ({ text: topic, style: topicColors[index % topicColors.length] }));

  // Create varied rows for a more dynamic look
  const row1Tags = [tagData[0], tagData[1], tagData[2], tagData[3], tagData[4]];
  const row2Tags = [tagData[5], tagData[6], tagData[7], tagData[8]];
  const row3Tags = [tagData[2], tagData[4], tagData[6], tagData[8], tagData[1]];


  const handleStart = () => {
    setHasOnboarded(true);
    updateUserData({}); // This initializes the local storage if it's the very first time
    localStorage.setItem('hasOnboarded', 'true');
    setCurrentScreen(Screen.MAIN);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
      <div className="pt-16 px-5 w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-left text-[#202326] leading-[1.4]">
          매일 3분 퀴즈로<br />
          꼭 필요한 금융 지식을<br />
          <span className="text-[#03AA72]">차곡차곡</span> 쌓아봐요
        </h1>
      </div>

      <div className="flex-grow w-full overflow-hidden flex flex-col justify-center space-y-4">
        <div className="flex w-max animate-marquee-left">
          <MarqueeRowContent tags={row1Tags} />
          <MarqueeRowContent tags={row1Tags} />
        </div>
        <div className="flex w-max animate-marquee-right">
          <MarqueeRowContent tags={row2Tags} />
          <MarqueeRowContent tags={row2Tags} />
        </div>
        <div className="flex w-max animate-marquee-left">
          <MarqueeRowContent tags={row3Tags} />
          <MarqueeRowContent tags={row3Tags} />
        </div>
      </div>

      <footer className="p-5 flex-shrink-0 pb-[calc(1.25rem+env(safe-area-inset-bottom))] w-full max-w-2xl mx-auto">
        <div className="text-center text-xs text-[#A2A2A2] bg-[#F3F3F3] p-3 rounded-lg mb-4">
          차곡은 아직 베타 버전이라 캐시를 삭제하거나 시크릿 모드를 사용하면 학습 기록이 저장되지 않으니 서비스 이용에 참고해 주세요!
        </div>
        <button
          onClick={handleStart}
          className="w-full bg-[#03AA72] text-white py-4 rounded-lg text-base font-bold"
        >
          시작하기
        </button>
      </footer>
    </div>
  );
};

export default OnboardingScreen;