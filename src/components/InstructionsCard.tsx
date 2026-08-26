import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';
import { FEATURE_INSTRUCTIONS } from '../data/featureInstructions';

interface InstructionsCardProps {
  language: 'ar' | 'en';
  onOpenFullModal: () => void;
}

export const InstructionsCard: React.FC<InstructionsCardProps> = ({
  language,
  onOpenFullModal
}) => {
  const isArabic = language === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('game_space');

  const categories = [
    { id: 'game_space', nameAr: 'معزز الألعاب', nameEn: 'Game Space' },
    { id: 'fps_controller', nameAr: 'قفل الفريمات', nameEn: 'FPS Lock' },
    { id: 'performance_modes', nameAr: 'أوضاع الأداء', nameEn: 'Profiles' },
    { id: 'advanced_kernel', nameAr: 'النواة والعتاد', nameEn: 'Kernel' },
    { id: 'header', nameAr: 'الترويسة والإطفاء', nameEn: 'Header & Off' }
  ];

  const currentItems = FEATURE_INSTRUCTIONS.filter(
    (item) => item.sectionId === activeCategory
  );

  const headerAction = (
    <button
      onClick={onOpenFullModal}
      className="px-3 py-1.5 rounded-xl bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#2DD4BF]/5 active:scale-95"
    >
      <BookOpen className="w-3.5 h-3.5" />
      <span>{isArabic ? 'فتح الدليل الشامل والبحث' : 'Open Full Guide & Search'}</span>
    </button>
  );

  return (
    <CollapsibleCard
      id="instructions-card-section"
      title={isArabic ? 'دليل وتعليمات تشغيل الأزرار والخصائص (Quick Manual)' : 'Button & Feature Instructions Manual'}
      subtitle={isArabic
        ? 'شرح وظيفة وطريقة تشغيل كل زر وخاصية في التطبيق مع الأوامر المباشرة'
        : 'Detailed explanation and usage guide for every button and feature'}
      icon={HelpCircle}
      headerAction={headerAction}
      defaultExpanded={false}
      accentColor="#38BDF8"
    >
      <div className="space-y-3.5">
        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#38BDF8] text-[#09111D] shadow-md shadow-[#38BDF8]/20'
                  : 'bg-[#09111D] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {isArabic ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#09111D] border border-slate-800/80 rounded-xl p-3 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  <h4 className="text-xs font-bold text-white">
                    {isArabic ? item.titleAr : item.titleEn}
                  </h4>
                </div>
              </div>

              <p className="text-[11px] text-[#91A5B8] leading-relaxed line-clamp-2">
                {isArabic ? item.descriptionAr : item.descriptionEn}
              </p>

              <div className="bg-[#111E2C] p-2 rounded-lg text-[10px] text-emerald-300 font-medium">
                <strong className="text-white block mb-0.5">
                  {isArabic ? 'طريقة التشغيل:' : 'How to use:'}
                </strong>
                {isArabic ? item.howToUseAr : item.howToUseEn}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner to Open Full Interactive Modal */}
        <div className="bg-gradient-to-r from-[#111E2C] to-[#16283B] border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4B860] shrink-0" />
            <span className="text-slate-300 text-xs">
              {isArabic
                ? 'هل تبحث عن شرح لزر معين؟ استخدم ميزة البحث السريع في الدليل الشامل.'
                : 'Looking for a specific button? Use quick search in the full manual.'}
            </span>
          </div>
          <button
            onClick={onOpenFullModal}
            className="px-3.5 py-1.5 rounded-lg bg-[#38BDF8] text-[#09111D] font-bold text-xs hover:bg-[#0284c7] transition-all flex items-center justify-center gap-1 shrink-0"
          >
            <span>{isArabic ? 'فتح الدليل التفاعلي الكامل' : 'Open Full Guide'}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </CollapsibleCard>
  );
};
