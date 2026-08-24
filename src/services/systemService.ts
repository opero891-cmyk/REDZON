import { SystemMetrics, CommandLog, PerformanceMode, DeviceInfo } from '../types';

export const initialDeviceInfo: DeviceInfo = {
  model: 'Snapdragon 8 Gen 2 (ARM64-v8a)',
  soc: 'Qualcomm SM8550-AB',
  cpuArch: '8-Core (1x3.2 GHz Cortex-X3 & 4x2.8 GHz & 3x2.0 GHz)',
  cpuCores: 8,
  gpuRenderer: 'Adreno 740 (kgsl-3d0)',
  androidVersion: 'Android 14 (HyperOS / AOSP)',
  apiLevel: 34,
  rootMethod: 'Magisk v27.0',
  kernelVersion: '5.15.137-android14-9-redzon',
  selinuxStatus: 'Permissive'
};

export const initialMetrics: SystemMetrics = {
  cpuUsage: 28,
  gpuUsage: 35,
  gpuFrequency: 380,
  ramUsage: 45,
  ramAvailable: 4420,
  ramTotal: 8192,
  batteryTemp: 34.5,
  isCharging: true,
  activeFPS: 60,
  thermalThrottling: true,
  cpuGovernor: 'schedutil',
  ioScheduler: 'cfq',
  gpuMaxFreq: 825
};

export class RedzonSystemEngine {
  private metrics: SystemMetrics = { ...initialMetrics };
  private commandLogs: CommandLog[] = [];
  private isRootAvailable = true;
  private currentMode: PerformanceMode = 'normal';
  private listeners: ((metrics: SystemMetrics) => void)[] = [];
  private logListeners: ((logs: CommandLog[]) => void)[] = [];
  private intervalId: number | null = null;

  constructor() {
    this.startTelemetry();
    this.logCommand('su -c "id"', 'uid=0(root) gid=0(root) groups=0(root) context=u:r:magisk:s0', true);
  }

  public getMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  public getCommandLogs(): CommandLog[] {
    return [...this.commandLogs];
  }

  public getRootState(): boolean {
    return this.isRootAvailable;
  }

  public setRootState(hasRoot: boolean) {
    this.isRootAvailable = hasRoot;
    if (hasRoot) {
      this.logCommand('su -c "id"', 'uid=0(root) gid=0(root) groups=0(root)', true);
    } else {
      this.logCommand('su -c "id"', 'Permission denied: su not found or denied', false, 'su: not found');
    }
  }

  public getCurrentMode(): PerformanceMode {
    return this.currentMode;
  }

  public subscribeMetrics(fn: (metrics: SystemMetrics) => void): () => void {
    this.listeners.push(fn);
    fn({ ...this.metrics });
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public subscribeLogs(fn: (logs: CommandLog[]) => void): () => void {
    this.logListeners.push(fn);
    fn([...this.commandLogs]);
    return () => {
      this.logListeners = this.logListeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn({ ...this.metrics }));
  }

  private notifyLogs() {
    this.logListeners.forEach(fn => fn([...this.commandLogs]));
  }

  private logCommand(command: string, output: string, success: boolean, error?: string) {
    const log: CommandLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      command,
      output,
      success,
      error
    };
    this.commandLogs = [log, ...this.commandLogs.slice(0, 49)];
    this.notifyLogs();
  }

  private startTelemetry() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = window.setInterval(() => {
      // Simulate realistic fluctuations depending on current state
      const targetCpu = this.currentMode === 'extreme' ? 78 : this.currentMode === 'balanced' ? 52 : 32;
      const targetGpu = this.currentMode === 'extreme' ? 88 : this.currentMode === 'balanced' ? 60 : 38;
      
      const cpuJitter = (Math.random() * 12) - 6;
      const gpuJitter = (Math.random() * 14) - 7;

      const newCpu = Math.min(100, Math.max(8, targetCpu + cpuJitter));
      const newGpu = Math.min(100, Math.max(5, targetGpu + gpuJitter));

      // Calculate realistic battery temperature
      let tempDrift = 0;
      if (this.currentMode === 'extreme' && !this.metrics.thermalThrottling) {
        tempDrift = 0.2;
      } else if (this.currentMode === 'extreme') {
        tempDrift = 0.05;
      } else {
        tempDrift = -0.1;
      }
      const newTemp = Math.min(52.5, Math.max(28.0, this.metrics.batteryTemp + tempDrift + (Math.random() * 0.2 - 0.1)));

      // RAM calculation
      const ramUsagePercent = ( (this.metrics.ramTotal - this.metrics.ramAvailable) / this.metrics.ramTotal ) * 100;

      this.metrics = {
        ...this.metrics,
        cpuUsage: parseFloat(newCpu.toFixed(1)),
        gpuUsage: parseFloat(newGpu.toFixed(1)),
        batteryTemp: parseFloat(newTemp.toFixed(1)),
        ramUsage: parseFloat(ramUsagePercent.toFixed(1))
      };

      this.notify();
    }, 1000);
  }

  // --- ROOT ACTIONS MATCHING RootCommand.kt ---

  public async lockFPS(fps: number): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) {
      return { success: false, message: 'يتطلب صلاحيات ROOT' };
    }

    const cmd1 = `settings put system peak_refresh_rate ${fps.toFixed(1)}`;
    const cmd2 = `settings put system min_refresh_rate ${fps.toFixed(1)}`;
    
    this.logCommand(cmd1, '0', true);
    this.logCommand(cmd2, '0', true);

    this.metrics.activeFPS = fps;
    this.notify();
    return { success: true, message: `تم تطبيق ${fps} FPS بنجاح` };
  }

  public async unlockFPS(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const cmd1 = 'settings delete system peak_refresh_rate';
    const cmd2 = 'settings delete system min_refresh_rate';
    this.logCommand(cmd1, '0', true);
    this.logCommand(cmd2, '0', true);

    this.metrics.activeFPS = 60;
    this.notify();
    return { success: true, message: 'تم إلغاء قفل FPS' };
  }

  public async setCPUPerformance(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const cmd = `for i in $(seq 0 7); do echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor; done`;
    this.logCommand(cmd, 'Governor changed to [performance] across 8 cores', true);

    this.metrics.cpuGovernor = 'performance';
    this.notify();
    return { success: true, message: 'تم تحسين CPU بنجاح (وضع الأداء)' };
  }

  public async setCPUPowersave(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const cmd = `for i in $(seq 0 7); do echo powersave > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor; done`;
    this.logCommand(cmd, 'Governor changed to [powersave] across 8 cores', true);

    this.metrics.cpuGovernor = 'powersave';
    this.notify();
    return { success: true, message: 'تم تحديث وضع CPU إلى توفير الطاقة' };
  }

  public async lockGPUFrequency(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const maxFreq = 825000000;
    const cmd1 = `echo ${maxFreq} > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq`;
    const cmd2 = `echo ${maxFreq} > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq`;
    
    this.logCommand(cmd1, '0', true);
    this.logCommand(cmd2, '0', true);

    this.metrics.gpuFrequency = 825;
    this.notify();
    return { success: true, message: 'تم قفل GPU على أقصى تردد (825 MHz)' };
  }

  public async optimizeRAM(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const cmd1 = 'sync';
    const cmd2 = 'sysctl -w vm.drop_caches=3';
    this.logCommand(cmd1, '', true);
    this.logCommand(cmd2, 'vm.drop_caches = 3', true);

    // Free up RAM
    const freedMB = 950 + Math.floor(Math.random() * 600);
    this.metrics.ramAvailable = Math.min(this.metrics.ramTotal - 1024, this.metrics.ramAvailable + freedMB);
    const newRamUsage = ((this.metrics.ramTotal - this.metrics.ramAvailable) / this.metrics.ramTotal) * 100;
    this.metrics.ramUsage = parseFloat(newRamUsage.toFixed(1));
    this.notify();

    return { success: true, message: `تم تحسين RAM بنجاح (تحرير ~${freedMB} MB)` };
  }

  public async optimizeIO(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const cmd1 = 'echo noop > /sys/block/mmcblk0/queue/scheduler';
    const cmd2 = 'echo noop > /sys/block/mmcblk0p1/queue/scheduler';
    this.logCommand(cmd1, '0', true);
    this.logCommand(cmd2, '0', true);

    this.metrics.ioScheduler = 'noop';
    this.notify();
    return { success: true, message: 'تم تحسين I/O بنجاح (Scheduler: noop)' };
  }

  public async disableThermalThrottling(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const cmd = 'echo 0 > /sys/module/msm_thermal/parameters/enabled';
    this.logCommand(cmd, '0', true);

    this.metrics.thermalThrottling = false;
    this.notify();
    return { success: true, message: 'تم تعطيل كبح الحرارة (تحذير: الأداء أقصى)' };
  }

  public async enableThermalThrottling(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    const cmd = 'echo 1 > /sys/module/msm_thermal/parameters/enabled';
    this.logCommand(cmd, '1', true);

    this.metrics.thermalThrottling = true;
    this.notify();
    return { success: true, message: 'تم تفعيل كبح الحرارة للحماية' };
  }

  public async balancedMode(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    this.currentMode = 'balanced';
    await this.setCPUPowersave();
    await this.lockFPS(90);
    await this.optimizeRAM();
    this.metrics.gpuFrequency = 580;
    this.notify();

    return { success: true, message: 'تم تطبيق الوضع المتوازن (90 FPS)' };
  }

  public async extremePerformanceMode(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    this.currentMode = 'extreme';
    await this.setCPUPerformance();
    await this.lockGPUFrequency();
    await this.lockFPS(120);
    await this.optimizeRAM();
    await this.optimizeIO();
    await this.disableThermalThrottling();
    this.notify();

    return { success: true, message: 'تم تطبيق الأداء الأقصى (120 FPS + قفل CPU/GPU)' };
  }

  public async resetToDefaults(): Promise<{ success: boolean; message: string }> {
    if (!this.isRootAvailable) return { success: false, message: 'يتطلب صلاحيات ROOT' };

    this.currentMode = 'normal';
    await this.unlockFPS();
    await this.enableThermalThrottling();

    const cmd = `for i in $(seq 0 7); do echo schedutil > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor; done`;
    this.logCommand(cmd, 'Governor reset to [schedutil]', true);
    
    this.logCommand('echo 380000000 > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq', '0', true);
    this.logCommand('echo cfq > /sys/block/mmcblk0/queue/scheduler', '0', true);

    this.metrics.cpuGovernor = 'schedutil';
    this.metrics.ioScheduler = 'cfq';
    this.metrics.gpuFrequency = 380;
    this.metrics.activeFPS = 60;
    this.notify();

    return { success: true, message: 'تمت إعادة تعيين الإعدادات الافتراضية' };
  }

  public async executeCustomCommand(command: string): Promise<{ success: boolean; output: string; error?: string }> {
    if (!this.isRootAvailable) {
      const err = 'Permission denied: su required';
      this.logCommand(command, '', false, err);
      return { success: false, output: '', error: err };
    }

    const trimmed = command.trim();
    let simulatedOutput = '0';
    let isSuccess = true;

    if (trimmed.includes('id')) {
      simulatedOutput = 'uid=0(root) gid=0(root) groups=0(root) context=u:r:magisk:s0';
    } else if (trimmed.includes('/proc/stat') || trimmed.includes('/proc/cpuinfo')) {
      simulatedOutput = 'processor: 0-7\nmodel name: ARMv8 Processor rev 1 (v8l)\nBogoMIPS: 38.40\nFeatures: fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp';
    } else if (trimmed.includes('cur_freq')) {
      simulatedOutput = `${this.metrics.gpuFrequency}000000`;
    } else if (trimmed.includes('scaling_governor')) {
      simulatedOutput = this.metrics.cpuGovernor;
    } else if (trimmed.includes('drop_caches')) {
      simulatedOutput = 'vm.drop_caches = 3';
    } else if (trimmed.includes('peak_refresh_rate')) {
      simulatedOutput = `${this.metrics.activeFPS}.0`;
    } else if (trimmed.includes('temperature') || trimmed.includes('thermal_zone')) {
      simulatedOutput = `${(this.metrics.batteryTemp * 1000).toFixed(0)}`;
    } else if (trimmed.includes('dumpsys battery')) {
      simulatedOutput = `Current Battery Service state:\n  AC powered: true\n  USB powered: false\n  level: 88\n  scale: 100\n  voltage: 4280\n  temperature: ${(this.metrics.batteryTemp * 10).toFixed(0)}\n  technology: Li-poly`;
    } else {
      simulatedOutput = `Executed successfully: ${trimmed}`;
    }

    this.logCommand(trimmed, simulatedOutput, isSuccess);
    return { success: isSuccess, output: simulatedOutput };
  }

  public destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

export const systemEngine = new RedzonSystemEngine();
