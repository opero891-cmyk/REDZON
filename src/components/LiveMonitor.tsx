import React from 'react';
import { Cpu, Activity, HardDrive, Zap, Thermometer, BatteryCharging } from 'lucide-react';
import { SystemMetrics } from '../types';

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

  return (
    <div className="bg-[#111E2C] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2DD4BF] animate-pulse" />
          <h2 className="text-base font-bold text-white tracking-wide">
            {isArabic ? 'المراقبة المباشرة' : 'Live System Monitor'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#09111D] border border-slate-700/60 text-[#2DD4BF]">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
            {metrics.activeFPS} FPS ACTIVE
          </span>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* CPU Card */}
        <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:border-[#2DD4BF]/40">
          <div className="flex items-center gap-1 text-[#2DD4BF] mb-1">
            <Cpu className="w-4 h-4" />
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
            <Zap className="w-4 h-4" />
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
            {metrics.gpuFrequency} MHz
          </span>
        </div>

        {/* RAM Card */}
        <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:border-[#10B981]/40">
          <div className="flex items-center gap-1 text-[#10B981] mb-1">
            <HardDrive className="w-4 h-4" />
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
            {metrics.ramAvailable} MB free
          </span>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
        {/* GPU Details */}
        <div className="bg-[#09111D] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#2DD4BF] block">
              {isArabic ? 'تردد كرت الشاشة' : 'GPU Frequency'}
            </span>
            <span className="text-sm font-bold font-mono text-white">
              {metrics.gpuFrequency} MHz
            </span>
          </div>
          <Zap className="w-4 h-4 text-[#2DD4BF]/60" />
        </div>

        {/* Battery Temperature */}
        <div className={`bg-[#09111D] border rounded-xl p-2.5 flex items-center justify-between transition-colors ${
          isOverheating ? 'border-[#EF4444]/50 bg-[#EF4444]/5' : 'border-slate-800/80'
        }`}>
          <div>
            <span className={`text-[10px] font-bold block ${isOverheating ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
              {isArabic ? 'درجة الحرارة' : 'Battery Temp'}
            </span>
            <span className={`text-sm font-bold font-mono ${isOverheating ? 'text-[#EF4444]' : 'text-white'}`}>
              {metrics.batteryTemp.toFixed(1)}°C
            </span>
          </div>
          <Thermometer className={`w-4 h-4 ${isOverheating ? 'text-[#EF4444] animate-bounce' : 'text-[#10B981]'}`} />
        </div>

        {/* Thermal / Power status */}
        <div className="col-span-2 sm:col-span-1 bg-[#09111D] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#91A5B8] block">
              {isArabic ? 'كبح الحرارة الثرمالي' : 'Thermal Throttling'}
            </span>
            <span className={`text-xs font-bold ${metrics.thermalThrottling ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {metrics.thermalThrottling
                ? (isArabic ? 'مفعل (حماية)' : 'Active (Safe)')
                : (isArabic ? 'معطل (أداء أقصى)' : 'Disabled (Peak)')
              }
            </span>
          </div>
          <BatteryCharging className="w-4 h-4 text-[#91A5B8]" />
        </div>
      </div>

      {/* Action Status Banner */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs text-[#91A5B8]">
        <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
        <span className="font-medium text-slate-300">
          {actionStatus}
        </span>
      </div>
    </div>
  );
};
