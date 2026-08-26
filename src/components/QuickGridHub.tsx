import React, { useState } from 'react';
import {
  Gamepad2,
  Zap,
  Gauge,
  Eye,
  FolderLock,
  Cpu,
  Wind,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SystemMetrics } from '../types';
import oxideImg from '../assets/images/oxide_survival_icon_1787672111879.jpg';

interface QuickGridHubProps {
  metrics: SystemMetrics;
  rootReady: boolean;
  language: 'ar' | 'en';
  onQuickOxideBoost: () => void;
  onQuickExtremeMode: () => void;
  onQuickLock120: () => void;
  onQuickOpenHUD: () => void;
  onQuickOptimizeRAM: () => void;
  onQuickTouchBoost?: () => void;
  onQuickGrantStorage?: () => void;
  onQuickVerifyHardware?: () => void;
  onSelectTab: (tabId: string) => void;
  isOverlayActive: boolean;
}

export const QuickGridHub: React.FC<QuickGridHubProps> = ({
  metrics,
  rootReady,
  language,
  onQuickOxideBoost,
  onQuickExtremeMode,
  onQuickLock120,
  onQuickOpenHUD,
  onQuickOptimizeRAM,
  onQuickTouchBoost,
  onQuickGrantStorage,
  onQuickVerifyHardware,
  onSelectTab,
  isOverlayActive
}) => {
  const isArabic = language === 'ar';
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const triggerAction = (id: string, callback: () => void) => {
    setActiveActionId(id);
    callback();
    setTimeout(() => setActiveActionId(null), 1600);
  };

  const tiles = [
    {
      id: 'oxide-quick',
      titleAr: 'أوكسيد سيرفايفل 120 FPS',
      titleEn: 'Oxide 120 FPS Turbo',
      descAr: 'تثبيت الفريمات واستقرار فائق',
      descEn: 'Lock 120 FPS & Maximum Stability',
      icon: Gamepad2,
      image: oxideImg,
      color: 'from-emerald-600/30 to-teal-900/40',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      iconColor: 'text-emerald-400',
      tagAr: 'لعبة نشطة 🏝️',
      tagEn: 'Active 🏝️',
      tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      badgeValue: '120 FPS',
      onClick: () => triggerAction('oxide-quick', onQuickOxideBoost),
      onDetailClick: () => onSelectTab('games')
    },
    {
      id: 'extreme-mode',
      titleAr: 'تيربو ديابلو الفائق',
      titleEn: 'Diablo Extreme Turbo',
      descAr: 'كسر سرعة المعالج والكرت لأقصى تردد',
      descEn: 'Max CPU/GPU Overclocking',
      icon: Zap,
      color: 'from-purple-600/30 to-indigo-950/40',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      iconColor: 'text-purple-400',
      tagAr: 'أقصى أداء ⚡',
      tagEn: 'Peak Boost ⚡',
      tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      badgeValue: '3.4 GHz',
      onClick: () => triggerAction('extreme-mode', onQuickExtremeMode),
      onDetailClick: () => onSelectTab('performance')
    },
    {
      id: 'fps-lock-120',
      titleAr: 'قفل التحديث 120Hz',
      titleEn: 'Lock 120Hz FPS',
      descAr: 'منع هبوط الفريمات واستقرار الشاشة',
      descEn: 'Smooth lock & touch rate boost',
      icon: Gauge,
      color: 'from-cyan-600/30 to-blue-950/40',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      iconColor: 'text-cyan-400',
      tagAr: metrics.activeFPS >= 120 ? 'مثبت 120' : `${metrics.activeFPS} FPS`,
      tagEn: metrics.activeFPS >= 120 ? '120 Locked' : `${metrics.activeFPS} FPS`,
      tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      badgeValue: `${metrics.activeFPS} FPS`,
      onClick: () => triggerAction('fps-lock-120', onQuickLock120),
      onDetailClick: () => onSelectTab('performance')
    },
    {
      id: 'floating-hud',
      titleAr: 'النافذة العائمة فوق اللعبة',
      titleEn: 'In-Game Floating HUD',
      descAr: 'عداد الفريمات والحرارة المباشر',
      descEn: 'Live FPS, CPU Temp & Turbo',
      icon: Eye,
      color: 'from-teal-600/30 to-slate-950/40',
      borderColor: 'border-teal-500/40 hover:border-teal-400',
      iconColor: 'text-teal-300',
      tagAr: isOverlayActive ? 'نشطة الآن 🟢' : 'تشغيل 👁️',
      tagEn: isOverlayActive ? 'Active 🟢' : 'Launch 👁️',
      tagBg: isOverlayActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      badgeValue: `${metrics.batteryTemp}°C`,
      onClick: () => triggerAction('floating-hud', onQuickOpenHUD),
      onDetailClick: () => onSelectTab('permissions')
    },
    {
      id: 'ram-cleaner',
      titleAr: 'تنظيف وتحرير الرام',
      titleEn: 'RAM & Cache Purge',
      descAr: 'إخلاء الذاكرة المؤقتة للعبة',
      descEn: 'Drop caches & free memory',
      icon: Cpu,
      color: 'from-amber-600/30 to-orange-950/40',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      iconColor: 'text-amber-400',
      tagAr: `${metrics.ramUsage}% مستخدم`,
      tagEn: `${metrics.ramUsage}% RAM`,
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      badgeValue: `${metrics.ramUsage}%`,
      onClick: () => triggerAction('ram-cleaner', onQuickOptimizeRAM),
      onDetailClick: () => onSelectTab('performance')
    },
    {
      id: 'touch-response',
      titleAr: 'حساسية اللمس 960Hz',
      titleEn: '960Hz Touch Response',
      descAr: 'استجابة فائقة السرعة للتحكم والرمي',
      descEn: 'Ultra low touch latency & fast aim',
      icon: Wind,
      color: 'from-sky-600/30 to-blue-950/40',
      borderColor: 'border-sky-500/40 hover:border-sky-400',
      iconColor: 'text-sky-400',
      tagAr: '960Hz ⚡',
      tagEn: '960Hz ⚡',
      tagBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      badgeValue: '960 Hz',
      onClick: () => triggerAction('touch-response', onQuickTouchBoost || onQuickExtremeMode),
      onDetailClick: () => onSelectTab('games')
    },
    {
      id: 'storage-permission',
      titleAr: 'أذونات ملفات الألعاب OBB',
      titleEn: 'All Files Access (OBB)',
      descAr: 'قراءة وتعديل ملفات الرسومات',
      descEn: 'Manage Data/OBB files & configs',
      icon: FolderLock,
      color: 'from-blue-600/30 to-indigo-950/40',
      borderColor: 'border-blue-500/40 hover:border-blue-400',
      iconColor: 'text-blue-400',
      tagAr: 'مفعل ✅',
      tagEn: 'Granted ✅',
      tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      badgeValue: 'STORAGE',
      onClick: () => triggerAction('storage-permission', onQuickGrantStorage || (() => onSelectTab('permissions'))),
      onDetailClick: () => onSelectTab('permissions')
    },
    {
      id: 'soc-status',
      titleAr: 'مواصفات العتاد والمعالج',
      titleEn: 'SoC & Hardware Specs',
      descAr: 'معمارية ARM64 وكفاءة كرت Adreno',
      descEn: 'Snapdragon CPU & Adreno GPU status',
      icon: Cpu,
      color: 'from-indigo-600/30 to-slate-950/40',
      borderColor: 'border-indigo-500/40 hover:border-indigo-400',
      iconColor: 'text-indigo-400',
      tagAr: rootReady ? 'ROOT جاهز 🛡️' : 'Kernel Normal',
      tagEn: rootReady ? 'ROOT Active 🛡️' : 'Kernel Normal',
      tagBg: rootReady ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-700 text-slate-300 border-slate-600',
      badgeValue: 'ARM64-v8a',
      onClick: () => triggerAction('soc-status', onQuickVerifyHardware || (() => onSelectTab('performance'))),
      onDetailClick: () => onSelectTab('performance')
    }
  ];

  return (
    <div className="space-y-3">
      {/* Title Bar for Bento Grid */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2DD4BF] to-purple-600 flex items-center justify-center text-[#09111D] font-black shadow-md shadow-[#2DD4BF]/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{isArabic ? 'لوحة المربعات السريعة والتحكم الفوري' : 'Quick Bento Hub & One-Tap Controls'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {isArabic ? 'اضغط المربع لتفعيل الميزة مباشرة أو اضغط السهم لفتح إعداداتها التفصيلية' : 'Tap tile for instant trigger or arrow for full settings'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#111E2C] border border-slate-800 text-[#2DD4BF]">
            {tiles.length} {isArabic ? 'ميزات سريعة' : 'Tiles'}
          </span>
        </div>
      </div>

      {/* Grid of Square/Modular Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          const isTriggered = activeActionId === tile.id;

          return (
            <div
              key={tile.id}
              className={`group relative bg-[#09111D] bg-gradient-to-b ${tile.color} border ${tile.borderColor} rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:scale-[1.015] active:scale-[0.98] cursor-pointer`}
              onClick={tile.onClick}
            >
              {/* Top Header of Card */}
              <div className="flex items-start justify-between gap-1.5 mb-2">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#09111D]/80 border border-slate-800 flex items-center justify-center ${tile.iconColor} shadow-md group-hover:scale-105 transition-transform shrink-0 overflow-hidden`}>
                  {isTriggered ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                  ) : tile.image ? (
                    <img
                      src={tile.image}
                      alt={tile.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${tile.tagBg}`}>
                    {tile.tagAr && (isArabic ? tile.tagAr : tile.tagEn)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      tile.onDetailClick();
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                    title={isArabic ? 'فتح الإعدادات الكاملة' : 'View Full Settings'}
                  >
                    <ChevronRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-[#2DD4BF] transition-colors">
                  {isArabic ? tile.titleAr : tile.titleEn}
                </h3>
                <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                  {isArabic ? tile.descAr : tile.descEn}
                </p>
              </div>

              {/* Bottom Quick Trigger Bar */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-400 text-[10px]">
                  {tile.badgeValue}
                </span>

                <span className={`font-bold transition-colors ${
                  isTriggered ? 'text-emerald-400' : 'text-[#2DD4BF] group-hover:underline'
                }`}>
                  {isTriggered
                    ? (isArabic ? 'تم التطبيق!' : 'Applied!')
                    : (isArabic ? 'تفعيل فوري' : 'Tap to apply')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
