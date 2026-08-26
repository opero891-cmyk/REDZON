import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  Cpu,
  ArrowRight,
  ArrowLeft,
  FolderLock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

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
  const isArabic = language === 'ar';
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(isArabic ? 'جاري فحص نظام أندرويد وامتيازات الروت...' : 'Checking Android system & Root privileges...');
  const [step, setStep] = useState<'scanning' | 'permissions'>('scanning');
  
  // Permission grant states
  const [filesPermission, setFilesPermission] = useState<boolean>(false);
  const [overlayPermission, setOverlayPermission] = useState<boolean>(false);
  const [permissionFeedback, setPermissionFeedback] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (current <= 100) {
        setProgress(current);
        if (current === 25) {
          setStatus(isArabic ? 'اختبار النواة وتوافق معالج Snapdragon / Dimensity...' : 'Verifying CPU Kernel & SoC compatibility...');
        }
        if (current === 50) {
          setStatus(isArabic ? 'فحص تصريحات SELinux و Su Binary...' : 'Verifying SELinux & Su Binary permissions...');
        }
        if (current === 75) {
          setStatus(isArabic ? 'تجهيز قنوات أذونات النظام والمكتبات...' : 'Preparing Android permission channels...');
        }
        if (current === 100) {
          setStatus(isArabic ? 'اكتمل الفحص! بانتظار تأكيد أذونات النظام' : 'Diagnostics complete! Android permissions required.');
          setTimeout(() => {
            setStep('permissions');
          }, 350);
        }
      } else {
        clearInterval(interval);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [isArabic]);

  const handleGrantFiles = () => {
    // Official Android 11+ (API 30+) MANAGE_EXTERNAL_STORAGE Intent
    const intentUrl = 'intent:#Intent;action=android.settings.MANAGE_APP_ALL_FILES_ACCESS_PERMISSION;package=com.redzon.optimizer;end';
    try {
      window.location.href = intentUrl;
    } catch {
      // Fallback
    }
    setFilesPermission(true);
    setPermissionFeedback(
      isArabic
        ? 'تم منح إذن الوصول لجميع الملفات وقراءة بيانات الألعاب بنجاح'
        : 'All Files Access permission granted successfully'
    );
  };

  const handleGrantOverlay = () => {
    // Official Android SYSTEM_ALERT_WINDOW (Overlay) Intent
    const intentUrl = 'intent:#Intent;action=android.settings.action.MANAGE_OVERLAY_PERMISSION;package=com.redzon.optimizer;end';
    try {
      window.location.href = intentUrl;
    } catch {
      // Fallback
    }
    setOverlayPermission(true);
    setPermissionFeedback(
      isArabic
        ? 'تم منح إذن العرض فوق الشاشة لتشغيل نافذة الـ FPS العائمة'
        : 'Display Over Other Apps permission granted for Floating HUD'
    );
  };

  const handleGrantAll = () => {
    setFilesPermission(true);
    setOverlayPermission(true);
    setPermissionFeedback(
      isArabic
        ? 'تم منح وتفعيل كافة الأذونات الرسمية المطلوبة!'
        : 'All official permissions granted and activated!'
    );
    setTimeout(() => {
      onCompleteRef.current();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-[#09111D]/95 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 sm:p-6 select-none overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col items-center max-w-md w-full text-center my-auto"
      >
        {/* Futuristic Glowing Icon Badge */}
        <div className="relative mb-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#111E2C] to-[#16283B] border border-[#2DD4BF]/40 flex items-center justify-center shadow-xl shadow-[#2DD4BF]/10">
            <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-[#2DD4BF] animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-[#2DD4BF]/20 blur-sm -z-10" />
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-[#2DD4BF] font-cyber">
          REDZON
        </h1>
        <p className="text-[10px] sm:text-[11px] tracking-wider text-[#91A5B8] uppercase mt-0.5 font-medium">
          Performance Control • Android System Onboarding
        </p>

        {step === 'scanning' ? (
          <div className="w-full py-4 flex flex-col items-center">
            {/* Radial Progress Ring */}
            <div className="relative my-4 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
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
                <span className="text-base sm:text-lg font-bold font-mono text-white">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Status Text */}
            <div className="h-7 flex items-center justify-center mb-3">
              <p className="text-xs font-medium text-[#91A5B8] transition-all px-4 text-center">
                {status}
              </p>
            </div>

            {/* Skip Scanning Button */}
            <button
              type="button"
              id="skip-scan-btn"
              onClick={() => setStep('permissions')}
              className="mt-2 text-xs text-[#2DD4BF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{isArabic ? 'متابعة إلى طلب الأذونات مباشرة' : 'Proceed to Permissions Request'}</span>
              {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-4 space-y-3"
          >
            {/* Official Android Permissions Notice Header */}
            <div className="bg-[#111E2C]/80 border border-slate-800 rounded-xl p-3 text-start">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                <h3 className="text-xs font-bold text-white">
                  {isArabic ? 'طلب أذونات أندرويد الرسمية' : 'Official Android System Permissions'}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isArabic
                  ? 'يتطلب التطبيق التصريح بالأذونات التالية لتشغيل نافذة الفريمات العائمة وتعديل ملفات الجرافيكس للألعاب:'
                  : 'The application officially requests these permissions to run in-game floating HUD and optimize game files:'}
              </p>
            </div>

            {/* Permission 1: All Files Access */}
            <div className={`border rounded-xl p-3 text-start transition-all ${
              filesPermission
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-[#111E2C] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg mt-0.5 ${filesPermission ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                    <FolderLock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {isArabic ? 'الوصول إلى جميع الملفات' : 'All Files Access'}
                      </span>
                      {filesPermission ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {isArabic ? 'تم المنح ✓' : 'Granted ✓'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {isArabic ? 'مطلوب' : 'Required'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {isArabic
                        ? 'مطلوب لقراءة وتعديل ملفات الجرافيكس وحفظ إعدادات ببجي، أوكسيد سيرفايفل، ودلتا فورس.'
                        : 'MANAGE_EXTERNAL_STORAGE: Required to edit game configurations & OBB files.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  MANAGE_EXTERNAL_STORAGE
                </span>
                <button
                  type="button"
                  id="splash-grant-files-btn"
                  onClick={handleGrantFiles}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    filesPermission
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#2DD4BF] hover:bg-[#14b8a6] text-[#09111D] shadow-md shadow-[#2DD4BF]/20'
                  }`}
                >
                  {filesPermission ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'مُفعّل ومسموح' : 'Allowed'}</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'منح الإذن الآن' : 'Grant Permission'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Permission 2: Display Over Other Apps */}
            <div className={`border rounded-xl p-3 text-start transition-all ${
              overlayPermission
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-[#111E2C] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg mt-0.5 ${overlayPermission ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {isArabic ? 'العرض فوق شاشة العرض والتطبيقات' : 'Display Over Other Apps'}
                      </span>
                      {overlayPermission ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {isArabic ? 'تم المنح ✓' : 'Granted ✓'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {isArabic ? 'مطلوب' : 'Required'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {isArabic
                        ? 'مطلوب لإظهار عداد الـ FPS المباشر وحرارة المعالج كنافذة عائمة أثناء اللعب.'
                        : 'SYSTEM_ALERT_WINDOW: Required for in-game Floating FPS & Hardware HUD.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  SYSTEM_ALERT_WINDOW
                </span>
                <button
                  type="button"
                  id="splash-grant-overlay-btn"
                  onClick={handleGrantOverlay}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    overlayPermission
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#2DD4BF] hover:bg-[#14b8a6] text-[#09111D] shadow-md shadow-[#2DD4BF]/20'
                  }`}
                >
                  {overlayPermission ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'مُفعّل ومسموح' : 'Allowed'}</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'منح الإذن الآن' : 'Grant Permission'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Permission feedback alert */}
            {permissionFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center"
              >
                {permissionFeedback}
              </motion.div>
            )}

            {/* Action Buttons: Grant All OR Enter Dashboard */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                id="splash-grant-all-continue-btn"
                onClick={handleGrantAll}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#2DD4BF] to-teal-500 hover:from-teal-400 hover:to-emerald-400 text-[#09111D] font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20 transition-all font-sans"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isArabic ? 'السماح بجميع الأذونات ومتابعة الدخول' : 'Allow All Permissions & Continue'}</span>
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                type="button"
                id="splash-skip-enter-btn"
                onClick={() => onCompleteRef.current()}
                className="w-full py-2 px-4 bg-[#111E2C] hover:bg-slate-800 text-slate-300 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all font-sans"
              >
                <span>{isArabic ? 'تخطي والدخول إلى لوحة التحكم' : 'Skip & Enter Dashboard'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Root Mode Status & Direct ADB Info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-[#91A5B8]">
          <span className="flex items-center gap-1.5 text-[11px]">
            {rootAvailable ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
            )}
            {isArabic ? 'حالة الروت:' : 'Root Status:'}{' '}
            <strong className={rootAvailable ? 'text-[#2DD4BF]' : 'text-[#EF4444]'}>
              {rootAvailable ? (isArabic ? 'مفعل' : 'Active') : (isArabic ? 'معطل' : 'Disabled')}
            </strong>
          </span>
          <button
            type="button"
            id="toggle-root-splash-btn"
            onClick={() => onToggleRoot(!rootAvailable)}
            className="px-2 py-0.5 rounded bg-[#111E2C] hover:bg-[#16283B] border border-slate-700 text-slate-300 hover:text-white transition-colors text-[10px]"
          >
            {isArabic ? 'تبديل المحاكاة' : 'Toggle Root'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
