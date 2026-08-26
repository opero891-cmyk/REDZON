import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Terminal,
  Power,
  Activity,
  Gamepad2,
  Gauge,
  Unlock,
  Zap,
  Flame,
  RotateCcw,
  Trash2,
  Play,
  Download,
  Fan,
  Sparkles,
  AlertTriangle,
  X,
  Layers,
  ChevronRight,
  Scan
} from 'lucide-react';
import { FEATURE_INSTRUCTIONS, FeatureInstruction } from '../data/featureInstructions';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  onNavigateToFeature?: (elementId: string) => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateToFeature
}) => {
  const isArabic = language === 'ar';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(FEATURE_INSTRUCTIONS[0]?.id || null);

  const sections = useMemo(() => {
    const list = [
      { id: 'all', nameAr: 'جميع الأزرار والخصائص', nameEn: 'All Buttons & Features' },
      { id: 'header', nameAr: 'الترويسة والتحكم العام', nameEn: 'Header & Global Controls' },
      { id: 'live_monitor', nameAr: 'لوحة المراقبة الحية', nameEn: 'Live Telemetry' },
      { id: 'game_space', nameAr: 'معزز ألعاب الهاتف (Game Space)', nameEn: 'Game Space Booster' },
      { id: 'fps_controller', nameAr: 'متحكم قفل الفريمات (FPS)', nameEn: 'FPS Controller' },
      { id: 'performance_modes', nameAr: 'أوضاع الأداء الذكية', nameEn: 'Performance Profiles' },
      { id: 'advanced_kernel', nameAr: 'إعدادات النواة المتقدمة', nameEn: 'Advanced Kernel' },
      { id: 'shell_hub', nameAr: 'مركز أوامر Shell', nameEn: 'Shell Commands Hub' },
      { id: 'root_tester', nameAr: 'السكربت وتفعيل العتاد', nameEn: 'Script & Verification' }
    ];
    return list;
  }, []);

  const badgeFilters = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'safe', labelAr: 'آمن 100%', labelEn: 'Safe' },
    { id: 'root', labelAr: 'يحتاج Root', labelEn: 'Requires Root' },
    { id: 'extreme', labelAr: 'أداء أقصى / كسر سرعة', labelEn: 'Extreme / OC' },
    { id: 'instant', labelAr: 'فوري / نسخ', labelEn: 'Instant' }
  ];

  const filteredInstructions = useMemo(() => {
    return FEATURE_INSTRUCTIONS.filter((item) => {
      const matchesSection = selectedSection === 'all' || item.sectionId === selectedSection;
      const matchesBadge = selectedBadge === 'all' || item.badge === selectedBadge;
      
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesSection && matchesBadge;

      const title = (isArabic ? item.titleAr : item.titleEn).toLowerCase();
      const desc = (isArabic ? item.descriptionAr : item.descriptionEn).toLowerCase();
      const howTo = (isArabic ? item.howToUseAr : item.howToUseEn).toLowerCase();
      const command = (item.commandSnippet || '').toLowerCase();
      const section = (isArabic ? item.sectionTitleAr : item.sectionTitleEn).toLowerCase();

      const matchesSearch =
        title.includes(query) ||
        desc.includes(query) ||
        howTo.includes(query) ||
        command.includes(query) ||
        section.includes(query);

      return matchesSection && matchesBadge && matchesSearch;
    });
  }, [searchQuery, selectedSection, selectedBadge, isArabic]);

  if (!isOpen) return null;

  const handleCopyCommand = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Cpu': return Cpu;
      case 'Terminal': return Terminal;
      case 'Power': return Power;
      case 'Activity': return Activity;
      case 'Gamepad2': return Gamepad2;
      case 'Gauge': return Gauge;
      case 'Unlock': return Unlock;
      case 'Zap': return Zap;
      case 'Flame': return Flame;
      case 'RotateCcw': return RotateCcw;
      case 'Trash2': return Trash2;
      case 'Play': return Play;
      case 'Download': return Download;
      case 'Fan': return Fan;
      case 'Sparkles': return Sparkles;
      case 'Scan': return Scan;
      default: return BookOpen;
    }
  };

  const getBadgeStyle = (badge: FeatureInstruction['badge']) => {
    switch (badge) {
      case 'root':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'extreme':
        return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
      case 'safe':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'instant':
        return 'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/40';
      case 'adb':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getBadgeLabel = (badge: FeatureInstruction['badge']) => {
    switch (badge) {
      case 'root': return isArabic ? 'يحتاج ROOT' : 'ROOT Required';
      case 'extreme': return isArabic ? 'أداء أقصى Extreme' : 'Extreme Boost';
      case 'safe': return isArabic ? 'آمن 100%' : '100% Safe';
      case 'instant': return isArabic ? 'فوري / جاهز' : 'Instant / Ready';
      case 'adb': return isArabic ? 'أوامر ADB' : 'ADB Command';
      default: return badge;
    }
  };

  const handleJumpToSection = (targetElementId?: string) => {
    if (!targetElementId) return;
    onClose();
    if (onNavigateToFeature) {
      onNavigateToFeature(targetElementId);
    } else {
      const el = document.getElementById(targetElementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <div className="bg-[#0E1724] border border-[#2DD4BF]/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-[#2DD4BF]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-800/80 bg-[#111E2C] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2DD4BF]/20 to-purple-500/20 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/10">
              <BookOpen className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black text-white tracking-wide">
                  {isArabic ? 'دليل وتعليمات تشغيل كل زر وخاصية' : 'Comprehensive Button & Feature Guide'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 font-bold hidden sm:inline-block">
                  REDZON v1.0 Manual
                </span>
              </div>
              <p className="text-xs text-[#91A5B8]">
                {isArabic
                  ? 'شرح دقيق لوظيفة كل زر، متى تستخدمه، طريقة تشغيله، والأمر البرمجي التابع له'
                  : 'Detailed explanation for every button, usage instructions, safety level & shell commands'}
              </p>
            </div>
          </div>

          <button
            id="close-instructions-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#09111D] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
            title={isArabic ? 'إغلاق الدليل' : 'Close Guide'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search & Filters Bar */}
        <div className="p-3 md:p-4 bg-[#09111D] border-b border-slate-800/80 space-y-3 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 ltr:left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث باسم الزر أو الخاصية (مثال: فريمات، مروحة، كسر سرعة، termux، روت)...' : 'Search by button name or keyword (e.g. FPS, Fan, Overclock, Termux)...'}
              className="w-full bg-[#111E2C] border border-slate-700/80 rounded-xl py-2.5 px-10 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-3 ltr:right-3 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Section Filter Horizontal Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all ${
                  selectedSection === sec.id
                    ? 'bg-[#2DD4BF] text-[#09111D] shadow-md shadow-[#2DD4BF]/20'
                    : 'bg-[#111E2C] text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {isArabic ? sec.nameAr : sec.nameEn}
              </button>
            ))}
          </div>

          {/* Badge Filter Sub-bar */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#2DD4BF]" />
                {isArabic ? 'المستوى:' : 'Type:'}
              </span>
              {badgeFilters.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBadge(b.id)}
                  className={`px-2.5 py-0.5 rounded-lg border transition-colors ${
                    selectedBadge === b.id
                      ? 'bg-slate-700 text-white border-slate-500 font-bold'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  {isArabic ? b.labelAr : b.labelEn}
                </button>
              ))}
            </div>

            <div className="text-slate-400 font-mono text-xs shrink-0">
              <span className="text-[#2DD4BF] font-bold">{filteredInstructions.length}</span> {isArabic ? 'خاصية وزر' : 'items'}
            </div>
          </div>
        </div>

        {/* Content Body List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5">
          {filteredInstructions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">
                {isArabic ? 'لم يتم العثور على أزرار تطابق بحثك' : 'No matching buttons or features found'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSection('all');
                  setSelectedBadge('all');
                }}
                className="text-xs text-[#2DD4BF] hover:underline"
              >
                {isArabic ? 'إعادة ضبط عوامل التصفية' : 'Reset search filters'}
              </button>
            </div>
          ) : (
            filteredInstructions.map((item) => {
              const Icon = getIcon(item.iconName);
              const isExpanded = expandedId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  id={`guide-item-${item.id}`}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-[#111E2C] border-[#2DD4BF]/50 shadow-lg shadow-[#2DD4BF]/5'
                      : 'bg-[#09111D] border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Card Collapsible Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-3.5 md:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                        isExpanded
                          ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/40'
                          : 'bg-[#16283B] text-slate-300 border-slate-700'
                      }`}>
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xs md:text-sm font-bold text-white tracking-wide truncate">
                            {isArabic ? item.titleAr : item.titleEn}
                          </h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${getBadgeStyle(item.badge)}`}>
                            {getBadgeLabel(item.badge)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#91A5B8] truncate mt-0.5">
                          {isArabic ? item.sectionTitleAr : item.sectionTitleEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`p-1 rounded-lg text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-[#2DD4BF]' : ''}`}>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed Instructions */}
                  {isExpanded && (
                    <div className="px-4 pb-4 md:px-5 md:pb-5 pt-1 border-t border-slate-800/80 space-y-3.5 text-xs">
                      
                      {/* What it does / Description */}
                      <div className="bg-[#09111D] p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[11px] font-bold text-[#2DD4BF] uppercase tracking-wider block">
                          {isArabic ? '💡 الوظيفة والتأثير:' : 'Function & Impact:'}
                        </span>
                        <p className="text-slate-200 leading-relaxed text-xs">
                          {isArabic ? item.descriptionAr : item.descriptionEn}
                        </p>
                      </div>

                      {/* Step-by-Step How to Use */}
                      <div className="bg-[#09111D] p-3 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                          {isArabic ? '🚀 طريقة الاستخدام خطوة بخطوة:' : 'How to Use Step-by-Step:'}
                        </span>
                        <p className="text-slate-300 leading-relaxed text-xs">
                          {isArabic ? item.howToUseAr : item.howToUseEn}
                        </p>
                      </div>

                      {/* When to Use Scenario */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div className="bg-[#09111D] p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-[#F4B860] uppercase tracking-wider block">
                            {isArabic ? '🎯 متى تستخدمه؟' : 'When to Use?'}
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {isArabic ? item.whenToUseAr : item.whenToUseEn}
                          </p>
                        </div>

                        <div className="bg-[#09111D] p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-sky-400" />
                            {isArabic ? 'مستوى الأمان والحرارة:' : 'Safety & Thermals:'}
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {isArabic ? item.safetyAr : item.safetyEn}
                          </p>
                        </div>
                      </div>

                      {/* Shell Command Code Block if available */}
                      {item.commandSnippet && (
                        <div className="bg-[#050A10] p-3 rounded-xl border border-slate-900 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-mono text-[#2DD4BF] font-bold flex items-center gap-1">
                              <Terminal className="w-3 h-3" />
                              {isArabic ? 'الأمر البرمجي المباشر لـ Termux / ADB:' : 'Direct Shell / ADB Command:'}
                            </span>
                            <button
                              onClick={() => handleCopyCommand(item.commandSnippet!, item.id)}
                              className="px-2 py-1 rounded bg-[#111E2C] hover:bg-[#16283B] text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1 text-[10px] font-bold transition-colors"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-[#2DD4BF]" />
                                  <span className="text-[#2DD4BF]">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>{isArabic ? 'نسخ الأمر' : 'Copy'}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap select-all bg-[#09111D] p-2 rounded-lg border border-slate-800/80">
                            {item.commandSnippet}
                          </div>
                        </div>
                      )}

                      {/* Action to Jump to this button in app */}
                      {item.targetElementId && (
                        <div className="pt-1 flex items-center justify-end">
                          <button
                            onClick={() => handleJumpToSection(item.targetElementId)}
                            className="px-3 py-1.5 rounded-xl bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <span>{isArabic ? 'الانتقال إلى هذا الزر في التطبيق' : 'Go to this Feature in App'}</span>
                            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                          </button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Quick Start Tip */}
        <div className="p-3 md:p-4 bg-[#111E2C] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-amber-400 font-bold text-base">⚡</span>
            <span className="text-[11px] text-slate-300">
              {isArabic
                ? 'نصيحة سريعة: لتشغيل الألعاب بأقصى فريمات، اختر اللعبة في Game Space ثم اضغط 120 FPS وفعل المروحة Max.'
                : 'Quick Tip: Select your game in Game Space, pick 120 FPS and set cooling fan to Max.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#09111D] hover:bg-[#16283B] border border-slate-700 text-white font-bold text-xs transition-colors self-end sm:self-auto"
          >
            {isArabic ? 'فهمت، العودة للتطبيق' : 'Got it, Back to App'}
          </button>
        </div>

      </div>
    </div>
  );
};
