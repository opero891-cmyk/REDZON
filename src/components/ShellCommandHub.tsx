import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, Cpu, Gauge, Zap, HardDrive, Database, Thermometer } from 'lucide-react';
import { SHELL_COMMANDS, ShellCommandDefinition } from '../data/shellCommands';
import { CollapsibleCard } from './CollapsibleCard';

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
    const fullCommand = `su -c "${text}"`;
    navigator.clipboard.writeText(fullCommand);
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
    <CollapsibleCard
      id="shell-command-hub-section"
      title={isArabic ? 'مركز أوامر Shell & Kernel المباشرة' : 'Direct Shell & Kernel Commands Hub'}
      subtitle={isArabic ? 'أوامر حقيقية قابلة للتنفيذ والنسخ المباشر لـ Termux وADB' : 'Real root commands ready to copy or trigger live on-device'}
      icon={Terminal}
      defaultExpanded={false}
      accentColor="#38BDF8"
    >
      <div className="space-y-3.5">
        {/* Termux Usage Tip */}
        <div className="bg-[#09111D] border border-amber-500/30 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2.5">
          <span className="text-amber-400 font-bold text-sm">💡</span>
          <div className="space-y-1 text-[11px] leading-relaxed">
            <p className="font-bold text-amber-300">
              {isArabic ? 'تنبيه مهم لتشغيل الأوامر داخل Termux بنجاح:' : 'Important note for running commands in Termux:'}
            </p>
            <p className="text-[#91A5B8]">
              {isArabic
                ? 'تطبيق Termux يعمل كمستخدم عادي افتراضياً ($). لتعديل إعدادات النظام ومعدل الإطارات والأنوية بدون خطأ، يجب كتابة الأمر `su` أولاً ثم الضغط على Enter والموافقة على صلاحية الروت من Magisk / KernelSU (ليتحول الرمز إلى #)، أو تشغيل الأمر مع بادئة `su -c "..."` المنسوخة تلقائياً.'
                : 'Termux runs as standard user by default ($). Type `su` first and grant root permission (prompt changes to #) or run with `su -c "..."` prefix.'}
            </p>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-[11px] font-bold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#2DD4BF] text-[#09111D]'
                  : 'bg-[#09111D] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Commands List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {commandsList.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const isCopied = copiedId === item.id;
            const isExecuting = executedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-[#09111D] border border-slate-800/90 rounded-xl p-3 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 text-[#2DD4BF]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{isArabic ? item.name : item.nameEn}</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          ROOT
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isArabic ? item.description : item.descriptionEn}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(item.command, item.id)}
                      className="p-1.5 rounded-lg bg-[#111E2C] hover:bg-[#16283B] text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title={isArabic ? 'نسخ الأمر جاهز مع su -c' : 'Copy command with su -c'}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRun(item)}
                      disabled={!rootReady}
                      className="px-2.5 py-1.5 rounded-lg bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 text-[11px] font-bold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isArabic ? 'تنفيذ الأمر عبر التطبيق' : 'Execute via App'}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isExecuting ? '...' : (isArabic ? 'تشغيل' : 'Run')}</span>
                    </button>
                  </div>
                </div>

                {/* Shell Command Code Block */}
                <div className="bg-[#050A10] p-2 rounded-lg border border-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed selectable-text">
                  su -c "{item.command}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CollapsibleCard>
  );
};
