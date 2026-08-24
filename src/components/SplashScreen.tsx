import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Cpu, ArrowRight, ArrowLeft } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  rootAvailable: boolean;
  onToggleRoot: (hasRoot: boolean) => void;
  language?: 'ar' | 'en';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  rootAvailable,
  onToggleRoot,
  language = 'ar'
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('جار فحص صلاحية ROOT...');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const isArabic = language === 'ar';

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      if (current <= 100) {
        setProgress(current);
        if (current === 20) setStatus('جاري اختبار الوصول إلى النظام...');
        if (current === 60) setStatus('التحقق من تصريحات SELinux و Su Binary...');
        if (current === 100) {
          setStatus(rootAvailable ? '✓ ROOT متوفر - جاري بدء التطبيق' : '✓ تم فحص النظام - جاهز للبدء');
          setTimeout(() => {
            onCompleteRef.current();
          }, 400);
        }
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [rootAvailable]);

  return (
    <div className="fixed inset-0 bg-[#09111D] flex flex-col items-center justify-center z-50 p-6 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center max-w-sm w-full text-center"
      >
        {/* Futuristic Glowing Icon Badge */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#111E2C] to-[#16283B] border border-[#2DD4BF]/40 flex items-center justify-center shadow-lg shadow-[#2DD4BF]/10">
            <Cpu className="w-10 h-10 text-[#2DD4BF] animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-[#2DD4BF]/20 blur-sm -z-10" />
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl font-extrabold tracking-widest text-[#2DD4BF] font-cyber">
          REDZON
        </h1>
        <p className="text-[11px] tracking-wider text-[#91A5B8] uppercase mt-0.5 font-medium">
          Performance Control • ARM64-v8a
        </p>

        {/* Radial Progress Ring */}
        <div className="relative my-6 flex items-center justify-center w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#111E2C"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#2DD4BF"
              strokeWidth="6"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-200 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-lg font-bold font-mono text-white">
              {progress}%
            </span>
          </div>
        </div>

        {/* Status Text */}
        <div className="h-6 flex items-center justify-center mb-4">
          <p className="text-xs font-medium text-[#91A5B8] transition-all">
            {status}
          </p>
        </div>

        {/* Instant Enter / Skip Button */}
        <button
          id="splash-skip-enter-btn"
          onClick={() => onCompleteRef.current()}
          className="w-full py-2.5 px-4 bg-[#2DD4BF] hover:bg-[#14b8a6] text-[#09111D] font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20 transition-all font-sans"
        >
          <span>{isArabic ? 'الدخول المباشر إلى لوحة التحكم' : 'Enter Dashboard Directly'}</span>
          {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>

        {/* Root Mode Toggle for testing environments */}
        <div className="mt-6 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-[#91A5B8]">
          <span className="flex items-center gap-1.5 text-[11px]">
            {rootAvailable ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
            )}
            حالة الروت: <strong className={rootAvailable ? 'text-[#2DD4BF]' : 'text-[#EF4444]'}>{rootAvailable ? 'مفعل' : 'معطل'}</strong>
          </span>
          <button
            id="toggle-root-splash-btn"
            onClick={() => onToggleRoot(!rootAvailable)}
            className="px-2 py-0.5 rounded bg-[#111E2C] hover:bg-[#16283B] border border-slate-700 text-slate-300 hover:text-white transition-colors text-[10px]"
          >
            تبديل المحاكاة
          </button>
        </div>
      </motion.div>
    </div>
  );
};
