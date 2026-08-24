import React from 'react';
import { TrendingUp, Flame, RotateCcw, Shield } from 'lucide-react';
import { PerformanceMode } from '../types';

interface PerformanceModesProps {
  currentMode: PerformanceMode;
  rootReady: boolean;
  onApplyBalanced: () => Promise<void>;
  onApplyExtreme: () => Promise<void>;
  onResetDefaults: () => Promise<void>;
  language: 'ar' | 'en';
}

export const PerformanceModes: React.FC<PerformanceModesProps> = ({
  currentMode,
  rootReady,
  onApplyBalanced,
  onApplyExtreme,
  onResetDefaults,
  language
}) => {
  const isArabic = language === 'ar';

  return (
    <div className="bg-[#111E2C] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#F4B860]/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-[#F4B860]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {isArabic ? 'أوضاع الأداء الذكية' : 'Smart Performance Profiles'}
          </h2>
          <p className="text-[11px] text-[#91A5B8]">
            {isArabic ? 'تهيئة تلقائية لترددات المعالج والإطارات والذاكرة' : 'One-click multi-core governor and GPU synchronization'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {/* Balanced Mode Button */}
        <button
          id="mode-balanced-btn"
          disabled={!rootReady}
          onClick={() => onApplyBalanced()}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-between border ${
            currentMode === 'balanced'
              ? 'bg-[#2DD4BF] text-[#09111D] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/20 font-black'
              : 'bg-[#09111D] text-white border-slate-700/80 hover:border-[#2DD4BF]/50 hover:bg-[#16283B]'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-2.5">
            <Shield className={`w-4 h-4 ${currentMode === 'balanced' ? 'text-[#09111D]' : 'text-[#2DD4BF]'}`} />
            <div className="text-start">
              <div className="text-xs md:text-sm font-bold">
                {isArabic ? 'الوضع المتوازن (90 FPS)' : 'Balanced Profile (90 FPS)'}
              </div>
              <div className={`text-[10px] ${currentMode === 'balanced' ? 'text-[#09111D]/80' : 'text-[#91A5B8]'}`}>
                {isArabic ? 'توفير الطاقة الذكي + استقرار الفريمات + تنظيف RAM' : 'Powersave governor, 90 FPS cap & RAM sweep'}
              </div>
            </div>
          </div>
          {currentMode === 'balanced' && (
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#09111D] text-[#2DD4BF]">
              ACTIVE
            </span>
          )}
        </button>

        {/* Extreme Mode Button */}
        <button
          id="mode-extreme-btn"
          disabled={!rootReady}
          onClick={() => onApplyExtreme()}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-between border ${
            currentMode === 'extreme'
              ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-lg shadow-[#EF4444]/30 font-black animate-pulse'
              : 'bg-[#09111D] text-white border-slate-700/80 hover:border-[#EF4444]/50 hover:bg-[#16283B]'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-2.5">
            <Flame className={`w-4 h-4 ${currentMode === 'extreme' ? 'text-white' : 'text-[#EF4444]'}`} />
            <div className="text-start">
              <div className="text-xs md:text-sm font-bold">
                {isArabic ? 'أداء أقصى (120 FPS + قفل CPU/GPU)' : 'Extreme Performance (120 FPS + Unlocked)'}
              </div>
              <div className={`text-[10px] ${currentMode === 'extreme' ? 'text-white/90' : 'text-[#91A5B8]'}`}>
                {isArabic ? 'Performance Governor لكافة الأنوية + قفل GPU 825MHz + تعطيل الثرمال' : 'Max CPU governor, peak GPU clocks, noop scheduler & thermal uncap'}
              </div>
            </div>
          </div>
          {currentMode === 'extreme' && (
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black/40 text-white border border-white/20">
              ACTIVE
            </span>
          )}
        </button>

        {/* Reset to Defaults */}
        <button
          id="mode-reset-btn"
          disabled={!rootReady}
          onClick={() => onResetDefaults()}
          className="w-full py-2.5 px-4 rounded-xl font-bold border border-slate-700 text-[#91A5B8] hover:text-white hover:border-slate-500 bg-transparent hover:bg-slate-800/40 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isArabic ? 'إعادة تعيين الإعدادات الافتراضية' : 'Restore Stock Android Parameters'}</span>
        </button>
      </div>
    </div>
  );
};
