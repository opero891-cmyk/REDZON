import React from 'react';
import { Settings, Cpu, Zap, HardDrive, Thermometer, Database, ChevronLeft, ChevronRight } from 'lucide-react';

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
      accent: thermalThrottling ? 'text-[#EF4444]' : 'text-[#10B981]',
      action: onToggleThermal
    },
    {
      id: 'setting-io-opt',
      title: isArabic ? 'تحسين I/O (سرعة قراءة التخزين)' : 'Storage I/O Scheduler (noop)',
      desc: isArabic ? 'ضبط جدولة وحدات التخزين على noop لتقليل زمن تحميل الألعاب' : 'Sets block device queue scheduler to zero-overhead "noop"',
      icon: Database,
      accent: 'text-[#2DD4BF]',
      action: onOptimizeIO
    }
  ];

  return (
    <div className="bg-[#111E2C] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#F4B860]/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#F4B860]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {isArabic ? 'الإعدادات والتحسينات المتقدمة' : 'Kernel Sysfs & Tweaks'}
          </h2>
          <p className="text-[11px] text-[#91A5B8]">
            {isArabic ? 'التحكم المباشر في بارامترات الكيرنل ونظام أندرويد' : 'Direct execution of sysfs writes and Linux kernel parameters'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {settingsList.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              disabled={!rootReady}
              onClick={() => item.action()}
              className="w-full text-start p-3 rounded-xl bg-[#09111D] border border-slate-800/80 hover:border-[#2DD4BF]/40 hover:bg-[#16283B] transition-all flex items-center justify-between group disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#111E2C] group-hover:bg-[#1C334A] transition-colors">
                  <Icon className={`w-4 h-4 ${item.accent}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#2DD4BF] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#91A5B8] mt-0.5 line-clamp-1">
                    {item.desc}
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-md bg-[#111E2C] group-hover:bg-[#2DD4BF] group-hover:text-[#09111D] text-[#91A5B8] flex items-center justify-center transition-colors">
                <ChevronIcon className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
