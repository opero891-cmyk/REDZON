import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { CommandLog } from '../types';

interface TerminalLogsProps {
  logs: CommandLog[];
  onExecuteCommand: (cmd: string) => Promise<void>;
  language: 'ar' | 'en';
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({
  logs,
  onExecuteCommand,
  language
}) => {
  const [inputCommand, setInputCommand] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isArabic = language === 'ar';

  const sampleCommands = [
    'cat /proc/stat',
    'dumpsys battery',
    'cat /sys/class/kgsl/kgsl-3d0/devfreq/cur_freq',
    'cat /proc/cpuinfo'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;
    onExecuteCommand(inputCommand.trim());
    setInputCommand('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-[#0B1420] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 font-bold ml-2">
            <Terminal className="w-4 h-4 text-[#2DD4BF]" />
            <span>REDZON ROOT Shell Engine (`su -c`)</span>
          </div>
        </div>
        <span className="text-[10px] text-[#91A5B8] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          {logs.length} {isArabic ? 'أمر منفذ' : 'commands'}
        </span>
      </div>

      {/* Preset Quick Commands */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-[10px] text-slate-500 self-center font-sans">
          {isArabic ? 'أوامر سريعة:' : 'Quick Presets:'}
        </span>
        {sampleCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => onExecuteCommand(cmd)}
            className="px-2 py-1 rounded bg-[#111E2C] hover:bg-[#16283B] text-[#2DD4BF] border border-slate-800 text-[10px] transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Log Output Stream */}
      <div className="h-64 overflow-y-auto space-y-2.5 p-3 bg-[#070D14] rounded-xl border border-slate-900/90 font-mono text-[11px] mb-3">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600">
            {isArabic ? 'لم يتم تنفيذ أي أمر بعد' : 'No commands executed yet'}
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-2 rounded bg-[#0D1824] border border-slate-800/60">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  {log.success ? (
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-[#EF4444]" />
                  )}
                  <span className="text-slate-500">[{log.timestamp}]</span>
                  <span className="text-[#2DD4BF] font-bold"># {log.command}</span>
                </span>
                <button
                  onClick={() => handleCopy(log.command, log.id)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                  title="Copy command"
                >
                  {copiedId === log.id ? (
                    <Check className="w-3 h-3 text-[#2DD4BF]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {log.output && (
                <pre className="text-slate-300 whitespace-pre-wrap text-[10px] bg-[#060B10] p-1.5 rounded mt-1 border border-slate-900 overflow-x-auto">
                  {log.output}
                </pre>
              )}

              {log.error && (
                <div className="text-[#EF4444] text-[10px] mt-1">
                  Error: {log.error}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Interactive Command Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 start-3 flex items-center text-[#2DD4BF] font-bold">
            #
          </span>
          <input
            id="terminal-custom-command-input"
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder={isArabic ? 'اكتب أمر root (مثال: sysctl -w vm.drop_caches=3)...' : 'Type root command to run as su...'}
            className="w-full bg-[#070D14] border border-slate-800 rounded-xl py-2 ps-8 pe-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#2DD4BF]/60 text-xs font-mono"
          />
        </div>
        <button
          id="terminal-submit-command-btn"
          type="submit"
          disabled={!inputCommand.trim()}
          className="px-4 py-2 bg-[#2DD4BF] hover:bg-[#14b8a6] text-[#09111D] font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isArabic ? 'تنفيذ' : 'Run'}</span>
        </button>
      </form>
    </div>
  );
};
