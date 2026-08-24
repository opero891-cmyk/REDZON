import React from 'react';
import { TrendingUp, Flame, RotateCcw, Shield } from 'lucide-react';
import { PerformanceMode } from '../types';
import { CollapsibleCard } from './CollapsibleCard';

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
    <CollapsibleCard
      id="performance-modes-section"
      title={isArabic ? 'أوضاع الأداء الذكية' : 'Smart Performance Profiles'}
      subtitle={isArabic ? 'تهيئة تلقائية لترددات المعالج والإطارات والذاكرة' : 'One-click multi-core governor and GPU synchronization'}
      icon={TrendingUp}
      defaultExpanded={true}
      accentColor="#F4B860"
    >
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
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/20">
            90 FPS
          </span>
        </button>

        {/* Extreme / Gaming Mode Button */}
        <button
          id="mode-extreme-btn"
          disabled={!rootReady}
          onClick={() => onApplyExtreme()}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-between border ${
            currentMode === 'extreme'
              ? 'bg-[#F43F5E] text-white border-[#F43F5E] shadow-lg shadow-[#F43F5E]/30 font-black'
              : 'bg-[#09111D] text-white border-slate-700/80 hover:border-[#F43F5E]/50 hover:bg-[#16283B]'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-2.5">
            <Flame className={`w-4 h-4 ${currentMode === 'extreme' ? 'text-white' : 'text-[#F43F5E]'}`} />
            <div className="text-start">
              <div className="text-xs md:text-sm font-bold">
                {isArabic ? 'أداء أقصى (120 FPS + قفل CPU/GPU)' : 'Extreme Gaming Profile (120 FPS)'}
              </div>
              <div className={`text-[10px] ${currentMode === 'extreme' ? 'text-white/80' : 'text-[#91A5B8]'}`}>
                {isArabic ? 'Performance Governor + تعطيل كبح الحرارة لأعلى استجابة' : 'Performance governor & bypassed thermal throttling'}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/20">
            120 FPS
          </span>
        </button>

        {/* Reset Defaults Button */}
        <button
          id="mode-reset-btn"
          disabled={!rootReady}
          onClick={() => onResetDefaults()}
          className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-[#91A5B8] hover:text-white bg-[#09111D]/60 hover:bg-[#09111D] border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isArabic ? 'إعادة ضبط المصنع (Schedutil / Auto FPS)' : 'Reset to System Defaults (Schedutil / Dynamic)'}</span>
        </button>
      </div>
    </CollapsibleCard>
  );
};
