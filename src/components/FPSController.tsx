import React from 'react';
import { Gauge, Unlock } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';

interface FPSControllerProps {
  activeFPS: number;
  rootReady: boolean;
  onLockFPS: (fps: number) => Promise<void>;
  onUnlockFPS: () => Promise<void>;
  language: 'ar' | 'en';
}

export const FPSController: React.FC<FPSControllerProps> = ({
  activeFPS,
  rootReady,
  onLockFPS,
  onUnlockFPS,
  language
}) => {
  const isArabic = language === 'ar';
  const fpsOptions = [30, 60, 90, 120];

  const unlockButton = (
    <button
      id="fps-unlock-btn"
      onClick={() => onUnlockFPS()}
      disabled={!rootReady}
      title={isArabic ? 'إلغاء قفل FPS والعودة للوضع الافتراضي' : 'Unlock FPS back to dynamic mode'}
      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-700 bg-[#09111D] text-[#91A5B8] hover:text-white hover:border-[#2DD4BF]/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
    >
      <Unlock className="w-3 h-3" />
      <span className="hidden sm:inline">{isArabic ? 'إلغاء القفل' : 'Unlock'}</span>
    </button>
  );

  return (
    <CollapsibleCard
      id="fps-controller-section"
      title={isArabic ? 'قفل معدل الإطارات (FPS Lock)' : 'Lock Refresh Rate (FPS)'}
      subtitle={isArabic ? 'تثبيت التحديث على معدل ثابت واستقرار الفريمات' : 'Force constant display refresh rate via Android system settings'}
      icon={Gauge}
      headerAction={unlockButton}
      defaultExpanded={true}
      accentColor="#2DD4BF"
    >
      {/* 4 FPS Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {fpsOptions.map((fps) => {
          const isSelected = activeFPS === fps;
          return (
            <button
              key={fps}
              id={`fps-button-${fps}`}
              disabled={!rootReady}
              onClick={() => onLockFPS(fps)}
              className={`py-3 md:py-3.5 px-2 rounded-xl font-cyber text-center transition-all flex flex-col items-center justify-center gap-0.5 border ${
                isSelected
                  ? 'bg-[#2DD4BF] text-[#09111D] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/25 scale-[1.02] font-black'
                  : 'bg-[#09111D] text-white border-slate-700/80 hover:border-[#2DD4BF]/50 hover:bg-[#16283B]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className="text-lg md:text-xl font-bold font-cyber">
                {fps}
              </span>
              <span className="text-[10px] uppercase font-sans opacity-80">
                {isArabic ? 'إطار/ث' : 'FPS'}
              </span>
            </button>
          );
        })}
      </div>
    </CollapsibleCard>
  );
};
