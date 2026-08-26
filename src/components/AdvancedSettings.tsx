import React from 'react';
import { Settings, Cpu, Zap, HardDrive, Thermometer, Database, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';
import { SysfsVerifiedState } from '../services/systemService';

interface AdvancedSettingsProps {
  rootReady: boolean;
  verifiedState: SysfsVerifiedState;
  onOptimizeCPU: () => Promise<void>;
  onOptimizeGPU: () => Promise<void>;
  onOptimizeRAM: () => Promise<void>;
  onToggleThermal: () => Promise<void>;
  onOptimizeIO: () => Promise<void>;
  language: 'ar' | 'en';
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  rootReady,
  verifiedState,
  onOptimizeCPU,
  onOptimizeGPU,
  onOptimizeRAM,
  onToggleThermal,
  onOptimizeIO,
  language
}) => {
  const isArabic = language === 'ar';
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  const isCpuPerformance = verifiedState.cpuGovernor === 'performance';
  const isGpuLocked = verifiedState.gpuGovernor === 'performance' && verifiedState.gpuMinFreq >= 800;
  const isThermalBypassed = !verifiedState.thermalEnabled;
  const isIoOptimized = verifiedState.ioScheduler === 'noop';

  const settingsList = [
    {
      id: 'setting-cpu-opt',
      title: isArabic ? 'حاكم المعالج CPU (Performance Governor)' : 'CPU Performance Scaling Governor',
      desc: isArabic
        ? `القيمة الفعلية في sysfs: ${verifiedState.cpuGovernor} على 8 أنوية`
        : `Verified sysfs node: ${verifiedState.cpuGovernor} across 8 cores`,
      icon: Cpu,
      accent: isCpuPerformance ? 'text-[#2DD4BF]' : 'text-slate-400',
      isActive: isCpuPerformance,
      action: onOptimizeCPU,
      nodePath: '/sys/devices/system/cpu/cpu0/cpufreq/scaling_governor',
      nodeValue: verifiedState.cpuGovernor
    },
    {
      id: 'setting-gpu-opt',
      title: isArabic ? 'تثبيت تردد كرت الشاشة Adreno (Max Clock)' : 'Lock Maximum GPU Frequency',
      desc: isArabic
        ? `القيمة الفعلية في sysfs: ${verifiedState.gpuGovernor} @ ${verifiedState.gpuMinFreq} MHz`
        : `Verified devfreq node: ${verifiedState.gpuGovernor} @ ${verifiedState.gpuMinFreq} MHz`,
      icon: Zap,
      accent: isGpuLocked ? 'text-[#F4B860]' : 'text-slate-400',
      isActive: isGpuLocked,
      action: onOptimizeGPU,
      nodePath: '/sys/class/kgsl/kgsl-3d0/devfreq/min_freq',
      nodeValue: `${verifiedState.gpuMinFreq} MHz`
    },
    {
      id: 'setting-ram-opt',
      title: isArabic ? 'تحرير الذاكرة وتفريغ كاش النواة (vm.drop_caches)' : 'RAM Cache Drop & Compaction',
      desc: isArabic
        ? 'تنفيذ sync مباشر وكتابة القيمة 3 إلى /proc/sys/vm/drop_caches'
        : 'Direct write to /proc/sys/vm/drop_caches and vm.compact_memory',
      icon: HardDrive,
      accent: 'text-[#10B981]',
      isActive: false,
      action: onOptimizeRAM,
      nodePath: '/proc/sys/vm/drop_caches',
      nodeValue: 'Sync & Drop'
    },
    {
      id: 'setting-thermal-opt',
      title: verifiedState.thermalEnabled
        ? (isArabic ? 'تعطيل كبح الحرارة (Thermal Throttling)' : 'Disable Thermal Throttling')
        : (isArabic ? 'تفعيل كبح الحرارة (Thermal Protection)' : 'Enable Thermal Protection'),
      desc: isArabic
        ? `الحالة في النواة: ${verifiedState.thermalEnabled ? 'حماية نشطة (Y)' : 'كبح معطل لأقصى FPS (N)'}`
        : `Kernel sysfs node value: ${verifiedState.thermalEnabled ? 'Enabled (Y)' : 'Disabled (N)'}`,
      icon: Thermometer,
      accent: isThermalBypassed ? 'text-[#F43F5E]' : 'text-slate-400',
      isActive: isThermalBypassed,
      action: onToggleThermal,
      nodePath: '/sys/module/msm_thermal/parameters/enabled',
      nodeValue: verifiedState.thermalEnabled ? 'Y (Active)' : 'N (Bypassed)'
    },
    {
      id: 'setting-io-opt',
      title: isArabic ? 'جدولة التخزين (I/O Scheduler: noop)' : 'Tune Storage I/O Scheduler',
      desc: isArabic
        ? `القيمة الحالية في sysfs: ${verifiedState.ioScheduler}`
        : `Verified sysfs node: [${verifiedState.ioScheduler}]`,
      icon: Database,
      accent: isIoOptimized ? 'text-indigo-400' : 'text-slate-400',
      isActive: isIoOptimized,
      action: onOptimizeIO,
      nodePath: '/sys/block/mmcblk0/queue/scheduler',
      nodeValue: verifiedState.ioScheduler
    }
  ];

  return (
    <CollapsibleCard
      id="advanced-settings-section"
      title={isArabic ? 'إعدادات النواة والعتاد المباشرة (Scene Style Sysfs)' : 'Direct Sysfs / Procfs Hardware Controls'}
      subtitle={isArabic ? 'كتابة وقراءة مباشرة لملفات العتاد مع التحقق من التطابق' : 'Direct node writes with verified read-back status'}
      icon={Settings}
      defaultExpanded={false}
      accentColor="#10B981"
    >
      <div className="space-y-2.5">
        {settingsList.map((item) => {
          const ItemIcon = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              disabled={!rootReady}
              onClick={() => item.action()}
              className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between text-start disabled:opacity-40 disabled:cursor-not-allowed group ${
                item.isActive
                  ? 'bg-[#111E2C] border-cyan-500/40 shadow-sm'
                  : 'bg-[#09111D] border-slate-800 hover:border-slate-700 hover:bg-[#16283B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                  item.isActive ? 'bg-cyan-500/20' : 'bg-slate-800/80 group-hover:scale-105'
                }`}>
                  <ItemIcon className={`w-5 h-5 ${item.accent}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-bold text-white group-hover:text-[#2DD4BF] transition-colors">
                      {item.title}
                    </span>
                    {item.isActive && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {isArabic ? 'مطابق لـ Sysfs' : 'Sysfs Verified'}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#91A5B8]">
                    {item.desc}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                    node: {item.nodePath} = <span className="text-cyan-400 font-bold">{item.nodeValue}</span>
                  </div>
                </div>
              </div>
              <ChevronIcon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
            </button>
          );
        })}
      </div>
    </CollapsibleCard>
  );
};
