import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, Copy, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';

interface AppInstallerProps {
  language: 'ar' | 'en';
}

export const AppInstaller: React.FC<AppInstallerProps> = ({ language }) => {
  const isArabic = language === 'ar';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Capture the PWA install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If direct browser event isn't supported yet (e.g. inside iframe), notify with instructions
      alert(
        isArabic
          ? 'لتثبيت التطبيق على هاتفك:\n1. اضغط على زر (⋮ ثلاث نقاط) في متصفح Chrome على هاتفك.\n2. اضغط على "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'
          : 'To install on Android:\n1. Open menu ⋮ in Chrome.\n2. Tap "Install App" or "Add to Home screen".'
      );
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="bg-[#111E2C] border border-[#2DD4BF]/40 rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden space-y-4">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2DD4BF]/20 to-[#2DD4BF]/5 border border-[#2DD4BF]/40 flex items-center justify-center shadow-lg shadow-[#2DD4BF]/10">
            <Download className="w-5 h-5 text-[#2DD4BF]" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>{isArabic ? 'خاصية تثبيت التطبيق على الهاتف' : 'In-App Mobile App Installer'}</span>
              {isInstalled ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isArabic ? 'مثبت بنجاح' : 'Installed'}
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 font-bold">
                  PWA Standalone
                </span>
              )}
            </h2>
            <p className="text-[11px] text-[#91A5B8]">
              {isArabic
                ? 'تثبيت REDZON كتطبيق أصلي مستقل على هاتفك الأندرويد بشاشة كاملة وبدون متصفح'
                : 'Install REDZON as a standalone full-screen native mobile application'}
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyAppUrl}
            className="px-2.5 py-1.5 rounded-xl bg-[#09111D] hover:bg-[#16283B] border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors font-sans"
            title={isArabic ? 'نسخ رابط التثبيت' : 'Copy link'}
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span className="text-[#2DD4BF] text-[11px]">{isArabic ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">{isArabic ? 'نسخ الرابط' : 'Copy Link'}</span>
              </>
            )}
          </button>

          <button
            onClick={openInNewTab}
            className="px-2.5 py-1.5 rounded-xl bg-[#09111D] hover:bg-[#16283B] border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors font-sans"
            title={isArabic ? 'فتح في نافذة جديدة' : 'Open in new tab'}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="text-[11px]">{isArabic ? 'نافذة جديدة' : 'New Tab'}</span>
          </button>
        </div>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#09111D] border border-[#2DD4BF]/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#111E2C] border border-slate-800 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-[#2DD4BF]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isArabic ? 'تثبيت بنقرة واحدة على الشاشة الرئيسية' : 'One-Click Standalone Mobile Installation'}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F4B860]" />
            </h3>
            <p className="text-[11px] text-[#91A5B8] mt-0.5">
              {isArabic
                ? 'يعمل بملء الشاشة، سرعة فائقة 120 FPS، ووصول مباشر لجميع أدوات الروت والنواة.'
                : 'Runs in fullscreen with instant responsiveness and direct root tool access.'}
            </p>
          </div>
        </div>

        {/* Install Trigger Button */}
        <div className="w-full md:w-auto flex-shrink-0">
          <button
            id="inapp-install-action-btn"
            onClick={handleInstallClick}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] hover:from-[#14B8A6] hover:to-[#0D9488] text-[#09111D] font-extrabold rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-95 font-sans"
          >
            <Download className="w-4 h-4" />
            <span>
              {isInstalled
                ? (isArabic ? 'التطبيق مثبت بالفعل على جهازك ✓' : 'App is Already Installed ✓')
                : (isArabic ? 'تثبيت التطبيق على جهازي الآن' : 'Install App on My Device Now')}
            </span>
          </button>
        </div>
      </div>

      {/* Guide Steps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#09111D] border border-slate-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-[#2DD4BF] text-xs font-bold">
            <span className="w-5 h-5 rounded-full bg-[#111E2C] border border-[#2DD4BF]/30 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>{isArabic ? 'افتح على هاتف أندرويد' : '1. Open on Android'}</span>
          </div>
          <p className="text-[11px] text-[#91A5B8] leading-relaxed">
            {isArabic
              ? 'افتح الرابط في متصفح Chrome أو المتصفح الافتراضي لهاتفك.'
              : 'Open this web link inside Chrome or your default Android browser.'}
          </p>
        </div>

        <div className="bg-[#09111D] border border-slate-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-[#F4B860] text-xs font-bold">
            <span className="w-5 h-5 rounded-full bg-[#111E2C] border border-[#F4B860]/30 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>{isArabic ? 'اضغط زر التثبيت' : '2. Click Install'}</span>
          </div>
          <p className="text-[11px] text-[#91A5B8] leading-relaxed">
            {isArabic
              ? 'اضغط زر "تثبيت التطبيق على جهازي الآن" بالأعلى أو اختر (تثبيت التطبيق ⋮) من قائمة المتصفح.'
              : 'Click the install button above or select "Install App" from browser menu.'}
          </p>
        </div>

        <div className="bg-[#09111D] border border-slate-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-[#10B981] text-xs font-bold">
            <span className="w-5 h-5 rounded-full bg-[#111E2C] border border-[#10B981]/30 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>{isArabic ? 'أيقونة فورية بالشاشة' : '3. Instant Home Icon'}</span>
          </div>
          <p className="text-[11px] text-[#91A5B8] leading-relaxed">
            {isArabic
              ? 'تتم إضافة أيقونة REDZON فوراً لشاشتك الرئيسية كأي تطبيق APK مثبت.'
              : 'The REDZON icon is placed directly on your phone home launcher.'}
          </p>
        </div>
      </div>
    </div>
  );
};
