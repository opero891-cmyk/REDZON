import React from 'react';
import { Settings, Cpu, Zap, HardDrive, Thermometer, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';

interface AdvancedSettingsProps {
  rootReady: boolean;
  thermalThrottling: boolean;
  onOptimizeCPU: () => Promise<void>;
  onOptimizeGPU: () => Promise<void>;
  onOptimizeRAM: () => Promise<void>;
  onToggleThermal: () => Promise<void>;
  onOptimizeIO: () => Promise<void>;
  language: 'ar' | 'en';
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  rootReady,
  thermalThrottling,
  onOptimizeCPU,
  onOptimizeGPU,
  onOptimizeRAM,
  onToggleThermal,
  onOptimizeIO,
  language
}) => {
  const isArabic = language === 'ar';
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  const settingsList = [
    {
      id: 'setting-cpu-opt',
      title: isArabic ? 'تحسين CPU (وضع الأداء القصوى)' : 'CPU Performance Scaling Governor',
      desc: isArabic ? 'تفعيل جميع أنوية المعالج بأقصى تردد تشغيلي' : 'Locks all CPU cores into "performance" governor',
      icon: Cpu,
      accent: 'text-[#2DD4BF]',
      action: onOptimizeCPU
    },
    {
      id: 'setting-gpu-opt',
      title: isArabic ? 'تحسين GPU (قفل التردد الأقصى)' : 'Lock Maximum GPU Frequency',
      desc: isArabic ? 'تثبيت تردد معالج الرسوميات على 825 MHz للألعاب الثقيلة' : 'Forces GPU devfreq min_freq to hardware ceiling',
      icon: Zap,
      accent: 'text-[#F4B860]',
      action: onOptimizeGPU
    },
    {
      id: 'setting-ram-opt',
      title: isArabic ? 'تحسين الذاكرة RAM' : 'RAM Cache Drop & Compaction',
      desc: isArabic ? 'تفريغ الذاكرة المؤقتة vm.drop_caches=3 وتحرير المساحة' : 'Executes sync and flushes Linux pagecache/dentries',
      icon: HardDrive,
      accent: 'text-[#10B981]',
      action: onOptimizeRAM
    },
    {
      id: 'setting-thermal-opt',
      title: thermalThrottling
        ? (isArabic ? 'تعطيل كبح الحرارة (Thermal Throttling)' : 'Disable Thermal Throttling')
        : (isArabic ? 'تفعيل كبح الحرارة (Thermal Protection)' : 'Enable Thermal Protection'),
      desc: thermalThrottling
        ? (isArabic ? 'إيقاف خفض الأداء عند ارتفاع الحرارة للحصول على أقصى FPS' : 'Stops kernel from throttling clocks during intense gaming')
        : (isArabic ? 'إعادة تفعيل حماية المعالج من درجات الحرارة المرتفعة' : 'Restores thermal governor to protect device hardware'),
      icon: Thermometer,
      accent: 'text-[#F43F5E]',
      action: onToggleThermal
    },
    {
      id: 'setting-io-opt',
      title: isArabic ? 'تحسين سرعة التخزين (I/O Scheduler)' : 'Tune Storage I/O Scheduler',
      desc: isArabic ? 'تغيير جدولة القراءة/الكتابة لتقليل بطء تحميل الألعاب' : 'Sets noop/deadline scheduler on internal flash memory',
      icon: Database,
      accent: 'text-indigo-400',
      action: onOptimizeIO
    }
  ];

  return (
    <CollapsibleCard
      id="advanced-settings-section"
      title={isArabic ? 'إعدادات النواة والعتاد المتقدمة' : 'Advanced Kernel & Hardware Controls'}
      subtitle={isArabic ? 'أوامر مباشرة للنواة وذاكرة الوصول العشوائي ومتحكمات Adreno' : 'Direct sysfs node switches for memory, clocks, and thermal management'}
      icon={Settings}
      defaultExpanded={false}
      accentColor="#10B981"
    >
      <div className="space-y-2">
        {settingsList.map((item) => {
          const ItemIcon = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              disabled={!rootReady}
              onClick={() => item.action()}
              className="w-full p-3 rounded-xl bg-[#09111D] border border-slate-800 hover:border-slate-700 hover:bg-[#16283B] transition-all flex items-center justify-between text-start disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ItemIcon className={`w-4 h-4 ${item.accent}`} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-white group-hover:text-[#2DD4BF] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#91A5B8]">
                    {item.desc}
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
