import React, { useState } from 'react';
import { Power, RotateCcw, AlertTriangle, MonitorOff } from 'lucide-react';

interface ShutdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmShutdown: () => void;
  onResetAllAndShutdown: () => void;
  language: 'ar' | 'en';
  rootReady?: boolean;
}

export const ShutdownModal: React.FC<ShutdownModalProps> = ({
  isOpen,
  onClose,
  onConfirmShutdown,
  onResetAllAndShutdown,
  language
}) => {
  const isArabic = language === 'ar';
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('');

  if (!isOpen) return null;

  const handleFullShutdown = () => {
    setIsProcessing(true);
    setStatusText(isArabic ? 'جاري إعادة ضبط ترددات المعالج وإلغاء القفل...' : 'Resetting CPU clocks & unlocking display...');
    
    setTimeout(() => {
      setStatusText(isArabic ? 'جاري إيقاف محرك Telemetry وإغلاق REDZON...' : 'Stopping telemetry daemon & closing REDZON...');
      setTimeout(() => {
        onResetAllAndShutdown();
      }, 700);
    }, 700);
  };

  const handleQuickExit = () => {
    setIsProcessing(true);
    setStatusText(isArabic ? 'جاري إيقاف التطبيق...' : 'Stopping application...');
    setTimeout(() => {
      onConfirmShutdown();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111E2C] border border-red-500/40 rounded-2xl p-5 md:p-6 w-full max-w-lg space-y-4 shadow-2xl shadow-red-500/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Power Icon */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Power className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{isArabic ? 'إطفاء التطبيق وإنهاء العمليات' : 'Power Off & Shutdown REDZON'}</span>
            </h3>
            <p className="text-xs text-[#91A5B8]">
              {isArabic
                ? 'إيقاف محرك المراقبة وإعادة النظام لتردداته الآمنة الافتراضية'
                : 'Stop telemetry engine, restore default kernel governors & exit'}
            </p>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 animate-spin">
              <RotateCcw className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white font-mono">{statusText}</p>
              <p className="text-xs text-[#91A5B8]">
                {isArabic ? 'يرجى الانتظار لحماية استقرار الجهاز' : 'Please wait while restoring safe hardware states'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Warning / Explanation Box */}
            <div className="bg-[#09111D] border border-amber-500/30 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'خيارات الإطفاء المتاحة:' : 'Shutdown Options:'}</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                <li>
                  <strong className="text-emerald-400">{isArabic ? 'إطفاء واستعادة الافتراضي (موصى به): ' : 'Reset & Power Off (Recommended): '}</strong>
                  {isArabic
                    ? 'يُلغي كسر السرعة، ويعيد معالج CPU/GPU إلى Schedutil الافتراضي، ويلغي قفل الفريمات، ويوقف المراقبة تماماً.'
                    : 'Resets CPU/GPU governors to schedutil, unlocks refresh rate & kills daemon.'}
                </li>
                <li>
                  <strong className="text-slate-200">{isArabic ? 'إطفاء فوري: ' : 'Quick Shutdown: '}</strong>
                  {isArabic
                    ? 'يوقف التطبيق فوراً مع الحفاظ على التعديلات الحالية في النواة.'
                    : 'Exits immediately while keeping active kernel tweaks.'}
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {/* Option 1: Full Reset and Power Off */}
              <button
                type="button"
                id="shutdown-reset-btn"
                onClick={handleFullShutdown}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all active:scale-[0.99]"
              >
                <Power className="w-4 h-4" />
                <span>{isArabic ? 'إعادة ضبط كل شيء وإطفاء التطبيق بالكامل' : 'Reset Everything to Default & Power Off'}</span>
              </button>

              {/* Option 2: Quick Power Off */}
              <button
                type="button"
                id="shutdown-quick-btn"
                onClick={handleQuickExit}
                className="w-full py-2.5 px-4 rounded-xl bg-[#09111D] hover:bg-[#16283B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MonitorOff className="w-3.5 h-3.5 text-slate-400" />
                <span>{isArabic ? 'إطفاء فوري للتطبيق فقط' : 'Quick Power Off (Keep Current Tweaks)'}</span>
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                id="shutdown-cancel-btn"
                onClick={onClose}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-medium transition-colors"
              >
                {isArabic ? 'إلغاء والعودة للتطبيق' : 'Cancel & Resume App'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface ShutdownScreenProps {
  onRestart: () => void;
  language: 'ar' | 'en';
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onRestart, language }) => {
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen bg-[#050A10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient dark circle */}
      <div className="absolute w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#0E1724] border border-slate-800 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#09111D] border border-slate-800 flex items-center justify-center text-slate-600 shadow-inner">
          <Power className="w-10 h-10 text-slate-600" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>{isArabic ? 'النظام مطفأ' : 'SYSTEM POWERED OFF'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide font-cyber">
            REDZON POWERED OFF
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            {isArabic
              ? 'تم إيقاف التطبيق وكافة العمليات الخلفية ومراقبة المعالج بنجاح.'
              : 'Application daemon and all background monitors have been terminated safely.'}
          </p>
        </div>

        <div className="bg-[#09111D] rounded-2xl p-4 border border-slate-800/80 text-right rtl:text-right ltr:text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>{isArabic ? 'حالة المعالج (Governor):' : 'CPU Governor:'}</span>
            <span className="font-mono text-emerald-400 font-bold">schedutil (Default)</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>{isArabic ? 'معدل الإطارات (Display):' : 'Refresh Rate:'}</span>
            <span className="font-mono text-slate-200 font-bold">Auto / Dynamic</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>{isArabic ? 'محرك التبريد (Fan & ICE):' : 'Thermal Daemon:'}</span>
            <span className="font-mono text-cyan-400 font-bold">Protected / Standby</span>
          </div>
        </div>

        <button
          type="button"
          id="restart-app-btn"
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#0d9488] text-[#09111D] font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#2DD4BF]/20 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isArabic ? 'إعادة تشغيل REDZON' : 'Power On & Restart REDZON'}</span>
        </button>
      </div>
    </div>
  );
};
