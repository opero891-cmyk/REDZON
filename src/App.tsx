import React, { useState, useEffect, useCallback } from 'react';
import { systemEngine, initialDeviceInfo, SysfsVerifiedState } from './services/systemService';
import { SystemMetrics, CommandLog, PerformanceMode } from './types';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { LiveMonitor } from './components/LiveMonitor';
import { DaemonArchitectureBanner } from './components/DaemonArchitectureBanner';
import { FPSController } from './components/FPSController';
import { PerformanceModes } from './components/PerformanceModes';
import { AdvancedSettings } from './components/AdvancedSettings';
import { GameOptimizer } from './components/GameOptimizer';
import { TerminalLogs } from './components/TerminalLogs';
import { DeviceInfoModal } from './components/DeviceInfoModal';
import { ShutdownModal, ShutdownScreen } from './components/ShutdownModal';
import { InstructionsModal } from './components/InstructionsModal';
import { InstructionsCard } from './components/InstructionsCard';
import { SystemPermissionsManager } from './components/SystemPermissionsManager';
import { FloatingOverlayHUD } from './components/FloatingOverlayHUD';
import { QuickGridHub } from './components/QuickGridHub';
import { InstalledGame } from './data/gamesDatabase';
import {
  LayoutGrid,
  Gamepad2,
  Zap,
  FolderLock,
  BookOpen,
  Layers
} from 'lucide-react';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isPoweredOff, setIsPoweredOff] = useState<boolean>(false);
  const [showShutdownModal, setShowShutdownModal] = useState<boolean>(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [showOverlayHUD, setShowOverlayHUD] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<SystemMetrics>(systemEngine.getMetrics());
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>(systemEngine.getCommandLogs());
  const [verifiedState, setVerifiedState] = useState<SysfsVerifiedState>(systemEngine.getVerifiedState());
  const [rootReady, setRootReady] = useState<boolean>(systemEngine.getRootState());
  const [rootStatus, setRootStatus] = useState<string>('Scene Daemon متصل ✓');
  const [currentMode, setCurrentMode] = useState<PerformanceMode>('normal');
  const [actionStatus, setActionStatus] = useState<string>('مقبس Scene Daemon نشط (<0.8ms IPC)');
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [showDeviceInfo, setShowDeviceInfo] = useState<boolean>(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState<'hub' | 'games' | 'performance' | 'permissions' | 'guide' | 'all'>('hub');

  const isArabic = language === 'ar';

  useEffect(() => {
    const unsubMetrics = systemEngine.subscribeMetrics((newMetrics) => {
      setMetrics(newMetrics);
    });

    const unsubLogs = systemEngine.subscribeLogs((newLogs) => {
      setCommandLogs(newLogs);
    });

    const unsubState = systemEngine.subscribeVerifiedState((newState) => {
      setVerifiedState(newState);
      if (newState.cpuGovernor === 'performance' && newState.gpuGovernor === 'performance') {
        setCurrentMode('extreme');
      } else if (newState.cpuGovernor === 'powersave') {
        setCurrentMode('balanced');
      } else {
        setCurrentMode('normal');
      }
    });

    return () => {
      unsubMetrics();
      unsubLogs();
      unsubState();
    };
  }, []);

  const handleToggleRoot = useCallback(() => {
    const nextRoot = !rootReady;
    setRootReady(nextRoot);
    systemEngine.setRootState(nextRoot);
    if (nextRoot) {
      setRootStatus(isArabic ? 'Scene Daemon متصل ✓' : 'Scene Daemon Connected ✓');
      setActionStatus(isArabic ? 'تم الاتصال بمقبس Daemon المحلي (uid=0)' : 'Connected to local Root Daemon socket (uid=0)');
    } else {
      setRootStatus(isArabic ? 'محدود - Daemon مفصول ✗' : 'Limited - Daemon Disconnected ✗');
      setActionStatus(isArabic ? 'تم فصل المقبس (وضع القراءة فقط)' : 'Daemon socket closed (read-only mode)');
    }
  }, [rootReady, isArabic]);

  const handleLockFPS = async (fps: number) => {
    setActionStatus(isArabic ? `جاري إرسال رسالة IPC لقفل ${fps} FPS...` : `Sending IPC message for ${fps} FPS...`);
    const res = await systemEngine.lockFPS(fps);
    setActionStatus(res.message);
  };

  const handleUnlockFPS = async () => {
    setActionStatus(isArabic ? 'جاري تحرير قفل FPS عبر Daemon...' : 'Unlocking FPS via Daemon...');
    const res = await systemEngine.unlockFPS();
    setActionStatus(res.message);
  };

  const handleApplyBalanced = async () => {
    setActionStatus(isArabic ? 'جاري تطبيق الوضع المتوازن عبر مقبس الروت...' : 'Dispatching Balanced mode over IPC...');
    const res = await systemEngine.balancedMode();
    setActionStatus(res.message);
  };

  const handleApplyExtreme = async () => {
    setActionStatus(isArabic ? 'جاري كتابة جميع مسارات العتاد عبر Scene Daemon...' : 'Batch writing all sysfs nodes via Scene Daemon...');
    const res = await systemEngine.extremePerformanceMode();
    setActionStatus(res.message);
  };

  const handleResetDefaults = async () => {
    setActionStatus(isArabic ? 'جاري استعادة المسارات الافتراضية عبر Daemon...' : 'Restoring stock sysfs nodes via Daemon...');
    const res = await systemEngine.resetToDefaults();
    setActionStatus(res.message);
  };

  const handleOptimizeCPU = async () => {
    setActionStatus(isArabic ? 'جاري إرسال أمر CPU Governor إلى Daemon...' : 'Writing CPU Governor via Daemon...');
    const res = await systemEngine.setCPUPerformance();
    setActionStatus(res.message);
  };

  const handleOptimizeGPU = async () => {
    setActionStatus(isArabic ? 'جاري قفل تردد Adreno عبر Daemon والتحقق...' : 'Writing Adreno clocks via Daemon & verifying...');
    const res = await systemEngine.lockGPUFrequency();
    setActionStatus(res.message);
  };

  const handleOptimizeRAM = async () => {
    setActionStatus(isArabic ? 'جاري تنظيف الكاش والصفحات عبر Daemon...' : 'Flushing memory via Daemon socket...');
    const res = await systemEngine.optimizeRAM();
    setActionStatus(res.message);
  };

  const handleToggleThermal = async () => {
    const disableThermal = verifiedState.thermalEnabled;
    setActionStatus(
      disableThermal
        ? (isArabic ? 'جاري إرسال إيقاف كبح الحرارة إلى Daemon...' : 'Disabling thermal throttling via Daemon...')
        : (isArabic ? 'جاري إرسال تشغيل كبح الحرارة إلى Daemon...' : 'Enabling thermal throttling via Daemon...')
    );
    const res = disableThermal
      ? await systemEngine.disableThermalThrottling()
      : await systemEngine.enableThermalThrottling();
    setActionStatus(res.message);
  };

  const handleOptimizeIO = async () => {
    setActionStatus(isArabic ? 'جاري تعيين noop لمجدول التخزين عبر Daemon...' : 'Setting noop queue scheduler via Daemon...');
    const res = await systemEngine.optimizeIO();
    setActionStatus(res.message);
  };

  const handleExecuteCustomCommand = async (cmd: string) => {
    setActionStatus(isArabic ? `جاري التنفيذ عبر مقبس الروت: ${cmd}` : `Executing via Root Daemon Socket: ${cmd}`);
    const res = await systemEngine.executeCustomCommand(cmd);
    if (res.success) {
      setActionStatus(isArabic ? 'تم التنفيذ فورا وتحديث حالة العتاد' : 'Executed in daemon context & hardware updated');
    } else {
      setActionStatus(isArabic ? 'فشل تنفيذ الأمر' : 'Command execution failed');
    }
  };

  const handleApplyGameProfile = async (game: InstalledGame, generatedCommand: string) => {
    setActionStatus(isArabic ? `جاري تطبيق بروفايل ${game.name}...` : `Applying ${game.nameEn} booster...`);
    if (game.id === 'oxide-survival' || game.packageName === 'com.catsbit.oxidesurvivalisland') {
      const res = await systemEngine.boostOxideSurvival();
      setActionStatus(res.message);
    } else {
      const res = await systemEngine.executeCustomCommand(generatedCommand);
      if (res.success) {
        setActionStatus(isArabic ? `تم تفعيل تحسينات ${game.name} والتحقق من الملفات!` : `${game.nameEn} Boost Profile Active & Verified!`);
      } else {
        setActionStatus(isArabic ? `تعذر تفعيل التحسين لـ ${game.name}` : `Failed to boost ${game.nameEn}`);
      }
    }
  };

  const handleNavigateFromGuide = (targetElementId: string) => {
    setShowInstructionsModal(false);
    
    if (['fps-controller-section', 'fps-button-30', 'fps-button-60', 'fps-button-90', 'fps-button-120', 'fps-unlock-btn'].includes(targetElementId)) {
      setActiveTab('performance');
    } else if (['performance-modes-section', 'mode-balanced-btn', 'mode-extreme-btn', 'mode-reset-btn'].includes(targetElementId)) {
      setActiveTab('performance');
    } else if (['advanced-settings-section', 'setting-cpu-opt', 'setting-gpu-opt', 'setting-ram-opt', 'setting-thermal-opt', 'setting-io-opt'].includes(targetElementId)) {
      setActiveTab('performance');
    } else if (targetElementId.startsWith('game-')) {
      setActiveTab('games');
    } else if (['header-instructions-btn', 'card-guide-trigger-btn'].includes(targetElementId)) {
      setActiveTab('guide');
    } else {
      setActiveTab('all');
    }

    setTimeout(() => {
      const element = document.getElementById(targetElementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-[#2DD4BF]', 'ring-offset-2', 'ring-offset-[#09111D]');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-[#2DD4BF]', 'ring-offset-2', 'ring-offset-[#09111D]');
        }, 2200);
      }
    }, 150);
  };

  const handleExecuteShutdown = async () => {
    setActionStatus(isArabic ? 'جاري إيقاف Scene Daemon واستعادة ضبط العتاد...' : 'Shutting down Scene Daemon and resetting sysfs nodes...');
    await systemEngine.resetToDefaults();
    systemEngine.shutdownDaemon();
    setShowShutdownModal(false);
    setIsPoweredOff(true);
  };

  const handleRestartPower = () => {
    setIsPoweredOff(false);
    systemEngine.restartTelemetry();
    systemEngine.verifyHardwareState();
    setActionStatus(isArabic ? 'تم تشغيل Scene Daemon والاتصال بالمقبس بنجاح' : 'Scene Daemon started and socket connected');
  };

  if (isPoweredOff) {
    return (
      <ShutdownScreen
        onRestart={handleRestartPower}
        language={language}
      />
    );
  }

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070D14] text-slate-100 font-sans selection:bg-[#2DD4BF] selection:text-black antialiased relative"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#2DD4BF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 end-1/4 w-96 h-96 bg-[#F43F5E]/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          rootAvailable={rootReady}
          onToggleRoot={(hasRoot) => {
            setRootReady(hasRoot);
            systemEngine.setRootState(hasRoot);
          }}
          language={language}
        />
      )}

      {/* Floating Game HUD Overlay */}
      <FloatingOverlayHUD
        isOpen={showOverlayHUD}
        metrics={metrics}
        onClose={() => setShowOverlayHUD(false)}
        onTriggerQuickBoost={handleApplyExtreme}
        language={language}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-4 md:py-6 space-y-4">
        {/* Header */}
        <Header
          rootReady={rootReady}
          rootStatus={rootStatus}
          onToggleRoot={handleToggleRoot}
          onOpenDeviceInfo={() => setShowDeviceInfo(true)}
          onOpenInstructions={() => setShowInstructionsModal(true)}
          onToggleTerminal={() => setShowTerminal(!showTerminal)}
          showTerminal={showTerminal}
          onRestartSplash={() => setShowSplash(true)}
          onOpenShutdown={() => setShowShutdownModal(true)}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        />

        {/* Scene Root Daemon Live Banner */}
        <DaemonArchitectureBanner
          verifiedState={verifiedState}
          rootReady={rootReady}
          language={language}
        />

        {/* 1. Live Telemetry Monitor */}
        <LiveMonitor
          metrics={metrics}
          actionStatus={actionStatus}
          language={language}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1.5 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'hub'
                  ? 'bg-gradient-to-r from-[#2DD4BF] to-teal-500 text-[#09111D] font-black shadow-lg shadow-[#2DD4BF]/20 scale-[1.02]'
                  : 'bg-[#111E2C] text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{isArabic ? 'الرئيسية (Hub)' : 'Main Hub'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-lg shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-[#111E2C] text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>{isArabic ? 'تسريع الألعاب' : 'Game Booster'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('performance')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'performance'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black shadow-lg shadow-amber-600/20 scale-[1.02]'
                  : 'bg-[#111E2C] text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isArabic ? 'العتاد والنواة' : 'Kernel & HW'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'permissions'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-blue-600/20 scale-[1.02]'
                  : 'bg-[#111E2C] text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderLock className="w-4 h-4" />
              <span>{isArabic ? 'الأذونات والملفات' : 'Permissions & OBB'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'guide'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black shadow-lg shadow-sky-600/20 scale-[1.02]'
                  : 'bg-[#111E2C] text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isArabic ? 'دليل الأزرار' : 'Button Guide'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'all' ? 'hub' : 'all')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === 'all'
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 font-black'
                : 'bg-[#111E2C]/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isArabic ? 'عرض كل الأقسام في شاشة واحدة' : 'Display all sections'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isArabic ? (activeTab === 'all' ? 'عرض موحد' : 'عرض الكل') : (activeTab === 'all' ? 'Unified' : 'Show All')}</span>
          </button>
        </div>

        {/* 2. Quick Grid Hub */}
        {(activeTab === 'hub' || activeTab === 'all') && (
          <QuickGridHub
            language={language}
            rootReady={rootReady}
            metrics={metrics}
            onSelectTab={(tab) => setActiveTab(tab as any)}
            onQuickLock120={() => handleLockFPS(120)}
            onQuickExtremeMode={handleApplyExtreme}
            onQuickOptimizeRAM={handleOptimizeRAM}
            onQuickOxideBoost={async () => {
              setActionStatus(isArabic ? 'جاري تفعيل تيربو 120 FPS للعبة Oxide Survival...' : 'Activating Oxide Survival 120 FPS Turbo...');
              const res = await systemEngine.boostOxideSurvival();
              setActionStatus(res.message);
            }}
            onQuickOpenHUD={async () => {
              await systemEngine.grantOverlayPermission();
              setShowOverlayHUD(true);
              setActionStatus(isArabic ? 'تم تشغيل النافذة العائمة فوق الشاشة' : 'Launched Floating HUD Overlay');
            }}
            onQuickTouchBoost={async () => {
              setActionStatus(isArabic ? 'جاري رفع تردد اللمس إلى 960Hz...' : 'Boosting touch sampling to 960Hz...');
              const res = await systemEngine.optimizeTouchEngine();
              setActionStatus(res.message);
            }}
            onQuickGrantStorage={async () => {
              setActionStatus(isArabic ? 'جاري منح صلاحيات الوصول للملفات OBB/Data عبر Daemon...' : 'Granting All Files Access (OBB/Data) via Daemon...');
              const res = await systemEngine.grantAllFilesPermission();
              setActionStatus(res.message);
            }}
            onQuickVerifyHardware={async () => {
              setActionStatus(isArabic ? 'جاري فحص وتحديث قراءات النواة والعتاد...' : 'Verifying sysfs/procfs hardware telemetry...');
              await systemEngine.verifyHardwareState();
              setActionStatus(isArabic ? 'تم تحديث وقراءة قيم العتاد عبر Daemon بنجاح' : 'Hardware states verified via Scene Daemon');
            }}
            isOverlayActive={showOverlayHUD}
          />
        )}

        {/* 3. Game Space Optimizer */}
        {(activeTab === 'games' || activeTab === 'all') && (
          <GameOptimizer
            rootReady={rootReady}
            onApplyGameProfile={handleApplyGameProfile}
            onOpenOverlayHUD={() => setShowOverlayHUD(true)}
            language={language}
          />
        )}

        {/* System Permissions Manager */}
        {(activeTab === 'permissions' || activeTab === 'all') && (
          <SystemPermissionsManager
            language={language}
            rootReady={rootReady}
            onOpenOverlayHUD={() => setShowOverlayHUD(true)}
            isOverlayActive={showOverlayHUD}
            onGrantAllFiles={async () => {
              setActionStatus(isArabic ? 'جاري منح إذن الوصول الشامل للملفات...' : 'Granting MANAGE_EXTERNAL_STORAGE via Daemon...');
              const res = await systemEngine.grantAllFilesPermission();
              setActionStatus(res.message);
            }}
            onGrantOverlay={async () => {
              setActionStatus(isArabic ? 'جاري منح إذن العرض فوق الشاشة...' : 'Granting SYSTEM_ALERT_WINDOW via Daemon...');
              const res = await systemEngine.grantOverlayPermission();
              setActionStatus(res.message);
            }}
          />
        )}

        {/* 4. Performance & Hardware Settings */}
        {(activeTab === 'performance' || activeTab === 'all') && (
          <div className="space-y-4">
            {/* FPS Lock Controller */}
            <FPSController
              activeFPS={metrics.activeFPS}
              rootReady={rootReady}
              onLockFPS={handleLockFPS}
              onUnlockFPS={handleUnlockFPS}
              language={language}
            />

            {/* Smart Performance Profiles */}
            <PerformanceModes
              currentMode={currentMode}
              rootReady={rootReady}
              onApplyBalanced={handleApplyBalanced}
              onApplyExtreme={handleApplyExtreme}
              onResetDefaults={handleResetDefaults}
              language={language}
            />

            {/* Advanced Kernel & Hardware Settings */}
            <AdvancedSettings
              rootReady={rootReady}
              verifiedState={verifiedState}
              onOptimizeCPU={handleOptimizeCPU}
              onOptimizeGPU={handleOptimizeGPU}
              onOptimizeRAM={handleOptimizeRAM}
              onToggleThermal={handleToggleThermal}
              onOptimizeIO={handleOptimizeIO}
              language={language}
            />
          </div>
        )}

        {/* 5. Feature Instructions Guide */}
        {(activeTab === 'guide' || activeTab === 'all') && (
          <InstructionsCard
            language={language}
            onOpenFullModal={() => setShowInstructionsModal(true)}
          />
        )}

        {/* Terminal Logs (Shown when toggled from header) */}
        {showTerminal && (
          <TerminalLogs
            logs={commandLogs}
            onExecuteCommand={handleExecuteCustomCommand}
            language={language}
          />
        )}

        {/* Footer */}
        <footer className="text-center py-6 text-[11px] text-[#91A5B8] space-y-1">
          <p className="font-mono">
            REDZON v1.0 • {rootReady ? 'SCENE DAEMON ROOT (Local UNIX Domain Socket IPC • uid=0)' : 'LIMITED MODE'}
          </p>
          <p className="text-[10px] text-slate-600">
            {isArabic
              ? 'بنية Scene Daemon: خادم روت خفي في الخلفية يعمل بملف تنفيذي دائم، وتواصل خفيف عبر مقبس محلي بدون استدعاء su منفصل.'
              : 'Scene Daemon Architecture: Background daemon with permanent uid=0, ultra-fast UNIX socket IPC (<0.8ms), direct kernel node manipulation.'}
          </p>
        </footer>
      </div>

      {/* Device Info Modal */}
      <DeviceInfoModal
        isOpen={showDeviceInfo}
        onClose={() => setShowDeviceInfo(false)}
        deviceInfo={initialDeviceInfo}
        rootReady={rootReady}
        language={language}
      />

      {/* Power Off / Shutdown Modal */}
      <ShutdownModal
        isOpen={showShutdownModal}
        onClose={() => setShowShutdownModal(false)}
        onConfirmShutdown={handleExecuteShutdown}
        onResetAllAndShutdown={handleExecuteShutdown}
        language={language}
        rootReady={rootReady}
      />

      {/* Full Feature Instructions Guide Modal */}
      <InstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        language={language}
        onNavigateToFeature={handleNavigateFromGuide}
      />
    </div>
  );
};
