export interface SystemMetrics {
  cpuUsage: number;
  gpuUsage: number;
  gpuFrequency: number; // in MHz
  ramUsage: number;
  ramAvailable: number; // in MB
  ramTotal: number; // in MB
  batteryTemp: number; // in Celsius
  isCharging: boolean;
  activeFPS: number;
  thermalThrottling: boolean;
  cpuGovernor: 'performance' | 'powersave' | 'schedutil' | 'interactive';
  ioScheduler: 'noop' | 'cfq' | 'deadline';
  gpuMaxFreq: number;
}

export type PerformanceMode = 'normal' | 'balanced' | 'extreme';

export interface CommandLog {
  id: string;
  timestamp: string;
  command: string;
  output: string;
  success: boolean;
  error?: string;
}

export interface DeviceInfo {
  model: string;
  soc: string;
  cpuArch: string;
  cpuCores: number;
  gpuRenderer: string;
  androidVersion: string;
  apiLevel: number;
  rootMethod: 'Magisk v27.0' | 'KernelSU v0.9.5' | 'APatch v10.7' | 'None';
  kernelVersion: string;
  selinuxStatus: 'Permissive' | 'Enforcing';
}
