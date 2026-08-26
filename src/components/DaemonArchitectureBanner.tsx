import React from 'react';
import { Cpu, Zap, Activity, HardDrive, Radio, CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { SysfsVerifiedState } from '../services/systemService';
import { redzonDaemon } from '../services/rootShellManager';

interface DaemonArchitectureBannerProps {
  verifiedState: SysfsVerifiedState;
  rootReady: boolean;
  language: 'ar' | 'en';
}

export const DaemonArchitectureBanner: React.FC<DaemonArchitectureBannerProps> = ({
  verifiedState,
  rootReady,
  language
}) => {
  const isArabic = language === 'ar';
  const sockInfo = redzonDaemon.getSocketInfo();

  return (
    <div
      id="scene-daemon-banner-section"
      className="bg-[#0B1522] border border-[#2DD4BF]/30 rounded-2xl p-4 shadow-xl relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 end-0 w-64 h-64 bg-[#2DD4BF]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF] shadow-sm">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{isArabic ? 'خادم الروت الخفي (Scene Root Daemon)' : 'Scene Root Daemon IPC'}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  rootReady
                    ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {rootReady ? 'ONLINE • <0.8ms' : 'OFFLINE'}
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-[#91A5B8]">
              {isArabic
                ? 'مقبس محلي (Local Socket) يمتلك صلاحية root دائمة (uid=0) بدون استدعاء su منفصل بعد كل نقرة'
                : 'Local UNIX Socket with permanent root (uid=0) - zero fork latency & zero UI freezing'}
            </p>
          </div>
        </div>

        {/* Socket Info Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-[#070D14] border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-300 flex items-center gap-2">
            {rootReady ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            )}
            <span>PID: {sockInfo.pid} (RootService)</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">{verifiedState.ipcLatencyMs}ms IPC</span>
          </div>
        </div>
      </div>

      {/* 4 Direct Subsystem Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 text-xs">
        {/* CPU Controller */}
        <div className="bg-[#070D14]/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold flex items-center gap-1 text-slate-300">
              <Cpu className="w-3 h-3 text-[#2DD4BF]" />
              CPU EAS Node
            </span>
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
          </div>
          <p className="font-mono text-[11px] text-[#2DD4BF] font-bold truncate">
            {verifiedState.cpuGovernor}
          </p>
          <span className="text-[9px] text-slate-500 font-mono truncate">
            /sys/devices/system/cpu
          </span>
        </div>

        {/* GPU Adreno Controller */}
        <div className="bg-[#070D14]/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold flex items-center gap-1 text-slate-300">
              <Zap className="w-3 h-3 text-[#F4B860]" />
              KGSL Adreno 3D
            </span>
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
          </div>
          <p className="font-mono text-[11px] text-[#F4B860] font-bold truncate">
            {verifiedState.gpuMinFreq} MHz ({verifiedState.gpuGovernor})
          </p>
          <span className="text-[9px] text-slate-500 font-mono truncate">
            /sys/class/kgsl/kgsl-3d0
          </span>
        </div>

        {/* Memory & VM Compactor */}
        <div className="bg-[#070D14]/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold flex items-center gap-1 text-slate-300">
              <Activity className="w-3 h-3 text-[#10B981]" />
              Linux VM Pagecache
            </span>
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
          </div>
          <p className="font-mono text-[11px] text-[#10B981] font-bold truncate">
            drop_caches / compact
          </p>
          <span className="text-[9px] text-slate-500 font-mono truncate">
            /proc/sys/vm/
          </span>
        </div>

        {/* Display / SurfaceFlinger */}
        <div className="bg-[#070D14]/90 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold flex items-center gap-1 text-slate-300">
              <HardDrive className="w-3 h-3 text-[#38BDF8]" />
              SurfaceFlinger Lock
            </span>
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
          </div>
          <p className="font-mono text-[11px] text-[#38BDF8] font-bold truncate">
            {verifiedState.fpsLocked} FPS (Swap 0)
          </p>
          <span className="text-[9px] text-slate-500 font-mono truncate">
            resetprop debug.sf
          </span>
        </div>
      </div>
    </div>
  );
};
