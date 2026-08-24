import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, ShieldAlert, Cpu, Gauge, Zap, HardDrive, Database, Thermometer, Info } from 'lucide-react';
import { SHELL_COMMANDS, ShellCommandDefinition } from '../data/shellCommands';

interface ShellCommandHubProps {
  onExecuteCommand: (cmd: string) => Promise<void>;
  rootReady: boolean;
  language: 'ar' | 'en';
}

export const ShellCommandHub: React.FC<ShellCommandHubProps> = ({
  onExecuteCommand,
  rootReady,
  language
}) => {
  const isArabic = language === 'ar';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [executedId, setExecutedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: isArabic ? 'الكل' : 'All' },
    { id: 'fps', label: isArabic ? 'الإطارات (FPS)' : 'Refresh Rate' },
    { id: 'cpu', label: isArabic ? 'المعالج (CPU)' : 'CPU Governor' },
    { id: 'gpu', label: isArabic ? 'الرسوميات (GPU)' : 'GPU Frequency' },
    { id: 'ram', label: isArabic ? 'الذاكرة (RAM)' : 'Memory Tuning' },
    { id: 'thermal', label: isArabic ? 'الحرارة (Thermal)' : 'Thermal Throttling' },
    { id: 'io', label: isArabic ? 'التخزين (I/O)' : 'I/O Scheduler' },
    { id: 'diagnostics', label: isArabic ? 'فحص النظام (Proc/Dumpsys)' : 'Diagnostics' }
  ];

  const commandsList = Object.values(SHELL_COMMANDS).filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleRun = async (item: ShellCommandDefinition) => {
    setExecutedId(item.id);
    await onExecuteCommand(item.command);
    setTimeout(() => setExecutedId(null), 1200);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fps': return Gauge;
      case 'cpu': return Cpu;
      case 'gpu': return Zap;
      case 'ram': return HardDrive;
      case 'thermal': return Thermometer;
      case 'io': return Database;
      default: return Terminal;
    }
  };

  return (
    <div className="bg-[#111E2C] border border-[#2DD4BF]/30 rounded-2xl p-4 md:p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-[#2DD4BF]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>{isArabic ? 'مركز أوامر Shell Commands المباشرة' : 'Direct Shell Commands Engine'}</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 font-bold uppercase">
                su -c
              </span>
            </h2>
            <p className="text-[11px] text-[#91A5B8]">
              {isArabic
                ? 'ربط كامل بين واجهات الأزرار وأوامر Linux Sysfs الحقيقية المنفذة في النظام'
                : 'Direct mapping between UI controls and verified Linux / Sysfs root shell commands'}
            </p>
          </div>
        </div>

        {!rootReady && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الروت معطل' : 'Root Disabled'}</span>
          </div>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-xs ${
              selectedCategory === cat.id
                ? 'bg-[#2DD4BF] text-[#09111D] shadow-md shadow-[#2DD4BF]/20'
                : 'bg-[#09111D] text-[#91A5B8] hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Commands List Cards */}
      <div className="grid grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto pe-1">
        {commandsList.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const isExecuted = executedId === item.id;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-[#09111D] border border-slate-800/90 hover:border-[#2DD4BF]/40 rounded-xl p-3 transition-all space-y-2 group"
            >
              {/* Top Title & Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#111E2C] border border-slate-800 group-hover:border-[#2DD4BF]/40 transition-colors">
                    <Icon className="w-4 h-4 text-[#2DD4BF]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-[#2DD4BF] transition-colors">
                      {isArabic ? item.name : item.nameEn}
                    </h3>
                    <p className="text-[10px] text-[#91A5B8] line-clamp-1">
                      {isArabic ? item.description : item.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Run & Copy buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(item.command, item.id)}
                    title={isArabic ? 'نسخ الأمر' : 'Copy command'}
                    className="p-1.5 rounded-lg bg-[#111E2C] hover:bg-[#16283B] border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors flex items-center gap-1"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span className="text-[10px] text-[#2DD4BF] font-mono">{isArabic ? 'تم' : 'Done'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">{isArabic ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={!rootReady}
                    onClick={() => handleRun(item)}
                    title={isArabic ? 'تنفيذ الأمر في الـ Shell فوراً' : 'Execute in root shell'}
                    className={`px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                      isExecuted
                        ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/20'
                        : 'bg-[#2DD4BF] hover:bg-[#14b8a6] text-[#09111D] shadow-md shadow-[#2DD4BF]/10'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isExecuted ? (isArabic ? 'تم التنفيذ!' : 'Executed!') : (isArabic ? 'تشغيل' : 'Run')}</span>
                  </button>
                </div>
              </div>

              {/* Raw Command Box */}
              <div className="bg-[#050A10] border border-slate-900 rounded-lg p-2 flex items-center justify-between gap-2">
                <code className="text-[10px] font-mono text-[#2DD4BF] overflow-x-auto whitespace-nowrap block flex-1">
                  su -c "{item.command}"
                </code>
              </div>

              {/* Target Sysfs Info */}
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                <Info className="w-3 h-3 text-slate-600" />
                <span>Target: {item.sysfsTarget}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
