import React, { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface CollapsibleCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string; // e.g. '#2DD4BF', '#F43F5E', etc.
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  defaultExpanded = true,
  headerAction,
  children,
  accentColor = '#2DD4BF'
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div
      id={id}
      className="bg-[#111E2C] border border-slate-800/80 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Accordion Header / Trigger */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full p-4 md:p-5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#16283B]/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}40`,
                boxShadow: `0 4px 12px ${accentColor}10`
              }}
            >
              <Icon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
          )}
          <div className="min-w-0 text-right rtl:text-right ltr:text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wide truncate">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <p className="text-[11px] text-[#91A5B8] truncate mt-0.5 max-w-lg">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side controls (action + chevron) */}
        <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {headerAction}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className={`w-8 h-8 rounded-lg bg-[#09111D] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-transform duration-300 ${
              isExpanded ? 'rotate-180 text-[#2DD4BF]' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accordion Content Body */}
      {isExpanded && (
        <div className="px-4 pb-4 md:px-5 md:pb-5 pt-0 border-t border-slate-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="pt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
