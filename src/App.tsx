import React, { useState, useEffect, useCallback } from 'react';
import { systemEngine, initialDeviceInfo } from './services/systemService';
import { SystemMetrics, CommandLog, PerformanceMode } from './types';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { LiveMonitor } from './components/LiveMonitor';
import { FPSController } from './components/FPSController';
import { PerformanceModes } from './components/PerformanceModes';
import { AdvancedSettings } from './components/AdvancedSettings';
import { TerminalLogs } from './components/TerminalLogs';
import { RootTester } from './components/RootTester';
import { ShellCommandHub } from './components/ShellCommandHub';
import { DeviceInfoModal } from './components/DeviceInfoModal';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<SystemMetrics>(systemEngine.getMetrics());
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>(systemEngine.getCommandLogs());
  const [rootReady, setRootReady] = useState<boolean>(systemEngine.getRootState());
  const [rootStatus, setRootStatus] = useState<string>('ROOT متصل ✓');
  const [currentMode, setCurrentMode] = useState<PerformanceMode>('normal');
  const [actionStatus, setActionStatus] = useState<string>('جاهز');
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [showDeviceInfo, setShowDeviceInfo] = useState<boolean>(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const isArabic = language === 'ar';

  useEffect(() => {
    const unsubMetrics = systemEngine.subscribeMetrics((newMetrics) => {
      setMetrics(newMetrics);
    });

    const unsubLogs = systemEngine.subscribeLogs((newLogs) => {
      setCommandLogs(newLogs);
    });

    return () => {
      unsubMetrics();
      unsubLogs();
    };
  }, []);

  const handleToggleRoot = useCallback(() => {
    const nextRoot = !rootReady;
    setRootReady(nextRoot);
    systemEngine.setRootState(nextRoot);
    if (nextRoot) {
      setRootStatus(isArabic ? 'ROOT متصل ✓' : 'ROOT Connected ✓');
      setActionStatus(isArabic ? 'تم تفعيل صلاحيات ROOT بنجاح' : 'Root permissions enabled');
    } else {
      setRootStatus(isArabic ? 'محدود - بدون ROOT ✗' : 'Limited - Non-Root ✗');
      setActionStatus(isArabic ? 'تم تعطيل صلاحيات ROOT (وضع القراءة فقط)' : 'Root permissions disabled (read-only mode)');
    }
  }, [rootReady, isArabic]);

  const handleLockFPS = async (fps: number) => {
    setActionStatus(isArabic ? `جاري تطبيق ${fps} FPS...` : `Applying ${fps} FPS lock...`);
    const res = await systemEngine.lockFPS(fps);
    setActionStatus(res.message);
  };

  const handleUnlockFPS = async () => {
    setActionStatus(isArabic ? 'جاري إلغاء قفل FPS...' : 'Unlocking FPS...');
    const res = await systemEngine.unlockFPS();
    setActionStatus(res.message);
  };

  const handleApplyBalanced = async () => {
    setActionStatus(isArabic ? 'جاري تطبيق الوضع المتوازن...' : 'Applying Balanced mode...');
    setCurrentMode('balanced');
    const res = await systemEngine.balancedMode();
    setActionStatus(res.message);
  };

  const handleApplyExtreme = async () => {
    setActionStatus(isArabic ? 'جاري تطبيق الأداء الأقصى...' : 'Applying Extreme performance mode...');
    setCurrentMode('extreme');
    const res = await systemEngine.extremePerformanceMode();
    setActionStatus(res.message);
  };

  const handleResetDefaults = async () => {
    setActionStatus(isArabic ? 'جاري إعادة تعيين الإعدادات...' : 'Resetting system defaults...');
    setCurrentMode('normal');
    const res = await systemEngine.resetToDefaults();
    setActionStatus(res.message);
  };

  const handleOptimizeCPU = async () => {
    setActionStatus(isArabic ? 'جاري تحسين CPU...' : 'Optimizing CPU governor...');
    const res = await systemEngine.setCPUPerformance();
    setActionStatus(res.message);
  };

  const handleOptimizeGPU = async () => {
    setActionStatus(isArabic ? 'جاري تحسين GPU...' : 'Optimizing GPU clocks...');
    const res = await systemEngine.lockGPUFrequency();
    setActionStatus(res.message);
  };

  const handleOptimizeRAM = async () => {
    setActionStatus(isArabic ? 'جاري تحسين RAM...' : 'Dropping caches and optimizing RAM...');
    const res = await systemEngine.optimizeRAM();
    setActionStatus(res.message);
  };

  const handleToggleThermal = async () => {
    const disableThermal = metrics.thermalThrottling;
    setActionStatus(
      disableThermal
        ? (isArabic ? 'جاري تعطيل كبح الحرارة...' : 'Disabling thermal throttling...')
        : (isArabic ? 'جاري تفعيل كبح الحرارة...' : 'Enabling thermal throttling...')
    );
    const res = disableThermal
      ? await systemEngine.disableThermalThrottling()
      : await systemEngine.enableThermalThrottling();
    setActionStatus(res.message);
  };

  const handleOptimizeIO = async () => {
    setActionStatus(isArabic ? 'جاري تحسين I/O...' : 'Optimizing storage I/O scheduler...');
    const res = await systemEngine.optimizeIO();
    setActionStatus(res.message);
  };

  const handleExecuteCustomCommand = async (cmd: string) => {
    setActionStatus(isArabic ? `جاري تنفيذ: ${cmd}` : `Executing: ${cmd}`);
    const res = await systemEngine.executeCustomCommand(cmd);
    if (res.success) {
      setActionStatus(isArabic ? 'تم تنفيذ الأمر بنجاح' : 'Command executed successfully');
    } else {
      setActionStatus(isArabic ? 'فشل تنفيذ الأمر' : 'Command execution failed');
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
    setRootStatus(
      rootReady
        ? (nextLang === 'ar' ? 'ROOT متصل ✓' : 'ROOT Connected ✓')
        : (nextLang === 'ar' ? 'محدود - بدون ROOT ✗' : 'Limited - Non-Root ✗')
    );
  };

  return (
    <div className={`min-h-screen bg-[#09111D] text-slate-100 font-sans ${isArabic ? 'dir-rtl' : 'dir-ltr'}`}>
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          rootAvailable={rootReady}
          onToggleRoot={(val) => {
            setRootReady(val);
            systemEngine.setRootState(val);
          }}
          language={language}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-4">
        {/* Main Header */}
        <Header
          rootReady={rootReady}
          rootStatus={rootStatus}
          onToggleRoot={handleToggleRoot}
          onOpenDeviceInfo={() => setShowDeviceInfo(true)}
          onToggleTerminal={() => setShowTerminal((prev) => !prev)}
          showTerminal={showTerminal}
          onRestartSplash={() => setShowSplash(true)}
          language={language}
          onToggleLanguage={toggleLanguage}
        />

        {/* Live System Telemetry Monitor */}
        <LiveMonitor
          metrics={metrics}
          actionStatus={actionStatus}
          language={language}
        />

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
          thermalThrottling={metrics.thermalThrottling}
          onOptimizeCPU={handleOptimizeCPU}
          onOptimizeGPU={handleOptimizeGPU}
          onOptimizeRAM={handleOptimizeRAM}
          onToggleThermal={handleToggleThermal}
          onOptimizeIO={handleOptimizeIO}
          language={language}
        />

        {/* Terminal Logs (Collapsible or Always Visible Toggle) */}
        {showTerminal && (
          <TerminalLogs
            logs={commandLogs}
            onExecuteCommand={handleExecuteCustomCommand}
            language={language}
          />
        )}

        {/* Direct Shell Commands Engine */}
        <ShellCommandHub
          onExecuteCommand={handleExecuteCustomCommand}
          rootReady={rootReady}
          language={language}
        />

        {/* Live Hardware Root Verification & Script Download */}
        <RootTester language={language} />

        {/* Footer */}
        <footer className="text-center py-6 text-[11px] text-[#91A5B8] space-y-1">
          <p className="font-mono">
            REDZON v1.0 • {rootReady ? 'ROOT MODE (Magisk / KernelSU)' : 'LIMITED MODE'}
          </p>
          <p className="text-[10px] text-slate-600">
            {isArabic
              ? 'تطبيق تحسين أداء الألعاب ومعمارية ARM64-v8a'
              : 'Android Game Performance Optimizer & Hardware Control'}
          </p>
        </footer>
      </div>

      {/* Device Info & Specs Modal */}
      <DeviceInfoModal
        isOpen={showDeviceInfo}
        onClose={() => setShowDeviceInfo(false)}
        deviceInfo={initialDeviceInfo}
        rootReady={rootReady}
        language={language}
      />
    </div>
  );
};
