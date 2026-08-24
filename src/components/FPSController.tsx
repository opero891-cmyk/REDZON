import React from 'react';
import { Gauge, Unlock } from 'lucide-react';

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

  return (
    <div className="bg-[#111E2C] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-[#2DD4BF]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              {isArabic ? 'قفل معدل الإطارات FPS' : 'Lock Refresh Rate (FPS)'}
            </h2>
            <p className="text-[11px] text-[#91A5B8]">
              {isArabic ? 'تثبيت التحديث على معدل ثابت واستقرار الفريمات' : 'Force constant display refresh rate via Android system settings'}
            </p>
          </div>
        </div>

        {/* Unlock button */}
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
      </div>

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
              className={`py-2.5 px-3 rounded-xl font-bold transition-all flex flex-col items-center justify-center border ${
                isSelected
                  ? 'bg-[#2DD4BF] text-[#09111D] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/20 scale-[1.02]'
                  : 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/20 hover:border-[#2DD4BF]/40'
              } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#2DD4BF]/10`}
            >
              <span className="text-base font-black font-cyber">{fps}</span>
              <span className="text-[9px] uppercase tracking-wider font-mono opacity-80">
                FPS
              </span>
            </button>
          );
        })}
      </div>

      {!rootReady && (
        <p className="text-[10px] text-[#EF4444] mt-2 text-center font-medium">
          {isArabic ? '⚠ يتطلب صلاحيات ROOT لتطبيق قفل FPS على مستوى النظام' : '⚠ Root permissions required to write system refresh rate parameters'}
        </p>
      )}
    </div>
  );
};
