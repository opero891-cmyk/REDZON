import React from 'react';
import { X, Cpu, ShieldCheck, HardDrive, Layers, Terminal, AlertTriangle } from 'lucide-react';
import { DeviceInfo } from '../types';

interface DeviceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceInfo: DeviceInfo;
  rootReady: boolean;
  language: 'ar' | 'en';
}

export const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({
  isOpen,
  onClose,
  deviceInfo,
  rootReady,
  language
}) => {
  if (!isOpen) return null;
  const isArabic = language === 'ar';

  const specs = [
    { label: isArabic ? 'طراز المعالج / SoC' : 'Processor / SoC', value: deviceInfo.soc, icon: Cpu },
    { label: isArabic ? 'معمارية النواة' : 'CPU Architecture', value: deviceInfo.cpuArch, icon: Layers },
    { label: isArabic ? 'معالج الرسوميات GPU' : 'GPU Renderer', value: deviceInfo.gpuRenderer, icon: HardDrive },
    { label: isArabic ? 'إصدار أندرويد' : 'Android Platform', value: `${deviceInfo.androidVersion} (API ${deviceInfo.apiLevel})`, icon: Layers },
    { label: isArabic ? 'طريقة الروت الحالية' : 'Root Framework', value: rootReady ? deviceInfo.rootMethod : 'غير متوفر (Non-Root)', icon: ShieldCheck },
    { label: isArabic ? 'إصدار الكيرنل Kernel' : 'Kernel Release', value: deviceInfo.kernelVersion, icon: Terminal },
    { label: isArabic ? 'حالة SELinux' : 'SELinux State', value: deviceInfo.selinuxStatus, icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1824] border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#2DD4BF]" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isArabic ? 'مواصفات الجهاز ونظام التشغيل' : 'Device Architecture & Kernel Specs'}
            </h3>
          </div>
          <button
            id="close-device-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spec List */}
        <div className="space-y-2.5 mb-5">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-2.5 rounded-xl bg-[#080E16] border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#2DD4BF]" />
                  <span className="text-xs text-[#91A5B8] font-medium">{item.label}</span>
                </div>
                <span className="text-xs font-bold text-white font-mono text-end max-w-[55%] truncate">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Safety & Optimization Notice */}
        <div className="p-3 rounded-xl bg-[#F4B860]/10 border border-[#F4B860]/20 text-[#F4B860] flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">
              {isArabic ? 'تنبيه أمان الأداء' : 'Kernel Performance Notice'}
            </div>
            <div className="text-[11px] opacity-90 mt-0.5">
              {isArabic
                ? 'تطبيق REDZON يكتب مباشرة في مسارات sysfs و kgsl لضمان ثبات معدل الإطارات أثناء تشغيل الألعاب الثقيلة. يرجى مراقبة درجة حرارة البطارية بانتظام.'
                : 'REDZON executes direct writes to kernel sysfs & devfreq nodes to eliminate frame drops in heavy 3D titles. Keep an eye on battery thermals.'}
            </div>
          </div>
        </div>

        <button
          id="device-modal-dismiss-btn"
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-[#111E2C] hover:bg-[#16283B] border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-colors"
        >
          {isArabic ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  );
};
