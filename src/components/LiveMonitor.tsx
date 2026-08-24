import React from 'react';
import { Activity } from 'lucide-react';
import { SystemMetrics } from '../types';
import { CollapsibleCard } from './CollapsibleCard';

interface LiveMonitorProps {
  metrics: SystemMetrics;
  actionStatus: string;
  language: 'ar' | 'en';
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({
  metrics,
  actionStatus,
  language
}) => {
  const isArabic = language === 'ar';
  const isOverheating = metrics.batteryTemp > 40;
  const ramUsedMB = Math.round((metrics.ramUsage / 100) * metrics.ramTotal);

  const headerBadge = (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#09111D] border border-slate-700/60 text-[#2DD4BF]">
      <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
      {metrics.activeFPS} FPS ACTIVE
    </span>
  );

  return (
    <CollapsibleCard
      id="live-monitor-section"
      title={isArabic ? 'لوحة المراقبة الحية (Telemetry Monitor)' : 'Live Telemetry Monitor'}
      subtitle={isArabic ? `حالة النظام: ${actionStatus}` : `Status: ${actionStatus}`}
      icon={Activity}
      badge={headerBadge}
      defaultExpanded={true}
      accentColor="#2DD4BF"
    >
      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* CPU Card */}
        <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:border-[#2DD4BF]/40">
          <div className="flex items-center gap-1 text-[#2DD4BF] mb-1">
            <span className="text-[11px] font-bold tracking-wider">CPU</span>
          </div>
          <span className="text-2xl md:text-3xl font-black font-cyber text-white">
            {Math.round(metrics.cpuUsage)}%
          </span>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#2DD4BF] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.cpuUsage)}%` }}
            />
          </div>
          <span className="text-[9px] text-[#91A5B8] mt-1 font-mono">
            Gov: {metrics.cpuGovernor}
          </span>
        </div>

        {/* GPU Card */}
        <div className="bg-[#F4B860]/10 border border-[#F4B860]/20 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:border-[#F4B860]/40">
          <div className="flex items-center gap-1 text-[#F4B860] mb-1">
            <span className="text-[11px] font-bold tracking-wider">GPU</span>
          </div>
          <span className="text-2xl md:text-3xl font-black font-cyber text-white">
            {Math.round(metrics.gpuUsage)}%
          </span>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#F4B860] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.gpuUsage)}%` }}
            />
          </div>
          <span className="text-[9px] text-[#91A5B8] mt-1 font-mono">
            Clock: {metrics.gpuFrequency} MHz
          </span>
        </div>

        {/* RAM Card */}
        <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:border-[#10B981]/40">
          <div className="flex items-center gap-1 text-[#10B981] mb-1">
            <span className="text-[11px] font-bold tracking-wider">RAM</span>
          </div>
          <span className="text-2xl md:text-3xl font-black font-cyber text-white">
            {Math.round(metrics.ramUsage)}%
          </span>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.ramUsage)}%` }}
            />
          </div>
          <span className="text-[9px] text-[#91A5B8] mt-1 font-mono">
            {ramUsedMB} / {metrics.ramTotal} MB
          </span>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-[#09111D] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-mono">
            {isArabic ? 'معدل FPS' : 'Active FPS'}
          </span>
          <span className="text-white font-mono font-bold text-sm">
            {metrics.activeFPS} Hz
          </span>
        </div>

        <div className="bg-[#09111D] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-mono">
            {isArabic ? 'حرارة البطارية' : 'Battery Temp'}
          </span>
          <span className={`font-mono font-bold text-sm ${isOverheating ? 'text-[#F43F5E]' : 'text-slate-200'}`}>
            {metrics.batteryTemp.toFixed(1)}°C
          </span>
        </div>

        <div className="bg-[#09111D] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-mono">
            {isArabic ? 'الذاكرة الحرة' : 'Free RAM'}
          </span>
          <span className="text-slate-200 font-mono font-bold text-sm">
            {metrics.ramAvailable} MB
          </span>
        </div>

        <div className="bg-[#09111D] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-mono">
            {isArabic ? 'كبح الحرارة' : 'Thermal'}
          </span>
          <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
            metrics.thermalThrottling
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {metrics.thermalThrottling ? (isArabic ? 'نشط' : 'Throttling') : (isArabic ? 'معطل (أقصى FPS)' : 'Disabled')}
          </span>
        </div>
      </div>
    </CollapsibleCard>
  );
};
