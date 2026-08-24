import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Terminal, RefreshCw, Globe, Power } from 'lucide-react';

interface HeaderProps {
  rootReady: boolean;
  rootStatus: string;
  onToggleRoot: () => void;
  onOpenDeviceInfo: () => void;
  onToggleTerminal: () => void;
  showTerminal: boolean;
  onRestartSplash: () => void;
  onOpenShutdown: () => void;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  rootReady,
  rootStatus,
  onToggleRoot,
  onOpenDeviceInfo,
  onToggleTerminal,
  showTerminal,
  onRestartSplash,
  onOpenShutdown,
  language,
  onToggleLanguage
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#111E2C] border border-[#2DD4BF]/30 flex items-center justify-center shadow-md shadow-[#2DD4BF]/5">
          <Cpu className="w-7 h-7 text-[#2DD4BF]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-wider text-[#2DD4BF] font-cyber">
              REDZON
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#111E2C] text-[#2DD4BF] border border-[#2DD4BF]/20">
              v1.0
            </span>
          </div>
          <p className="text-xs text-[#91A5B8] font-medium">
            {language === 'ar' ? 'تحسين الأداء المتطور • 64-bit' : 'Advanced Game Performance Optimizer • 64-bit'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Root Status Pill with Click to Switch/Simulate */}
        <button
          id="header-root-status-toggle-btn"
          onClick={onToggleRoot}
          title={language === 'ar' ? 'انقر لتبديل حالة الروت' : 'Click to toggle ROOT access state'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            rootReady
              ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/20'
              : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/20'
          }`}
        >
          {rootReady ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          <span>{rootStatus}</span>
        </button>

        {/* Device Info Trigger */}
        <button
          id="header-device-info-btn"
          onClick={onOpenDeviceInfo}
          className="p-2 rounded-lg bg-[#111E2C] hover:bg-[#16283B] text-[#91A5B8] hover:text-white border border-slate-700/60 transition-colors"
          title={language === 'ar' ? 'معلومات الجهاز والمعالج' : 'Device & Hardware Specs'}
        >
          <Cpu className="w-4 h-4" />
        </button>

        {/* Terminal Drawer Trigger */}
        <button
          id="header-terminal-toggle-btn"
          onClick={onToggleTerminal}
          className={`p-2 rounded-lg border transition-colors ${
            showTerminal
              ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/40'
              : 'bg-[#111E2C] hover:bg-[#16283B] text-[#91A5B8] hover:text-white border-slate-700/60'
          }`}
          title={language === 'ar' ? 'سجل أوامر Shell / Root' : 'Shell / Root Commands Log'}
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Language Toggle */}
        <button
          id="header-lang-toggle-btn"
          onClick={onToggleLanguage}
          className="px-2.5 py-1.5 rounded-lg bg-[#111E2C] hover:bg-[#16283B] text-[#91A5B8] hover:text-white border border-slate-700/60 transition-colors text-xs font-bold flex items-center gap-1"
          title="Toggle Language / تبديل اللغة"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Restart Splash Screen */}
        <button
          id="header-restart-splash-btn"
          onClick={onRestartSplash}
          className="p-2 rounded-lg bg-[#111E2C] hover:bg-[#16283B] text-[#91A5B8] hover:text-white border border-slate-700/60 transition-colors"
          title={language === 'ar' ? 'إعادة شاشة البداية' : 'Replay Splash Screen'}
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Power Off App and All Engine Processes Button */}
        <button
          id="header-power-off-btn"
          onClick={onOpenShutdown}
          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 transition-all shadow-md shadow-red-500/10 active:scale-95 flex items-center gap-1.5 px-3"
          title={language === 'ar' ? 'إطفاء التطبيق وكل شيء' : 'Power off application and reset all'}
        >
          <Power className="w-4 h-4 text-red-400" />
          <span className="text-xs font-bold font-mono hidden sm:inline">
            {language === 'ar' ? 'إطفاء' : 'OFF'}
          </span>
        </button>
      </div>
    </header>
  );
};
