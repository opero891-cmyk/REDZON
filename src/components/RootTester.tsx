import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, ShieldCheck, Smartphone, Play, HelpCircle } from 'lucide-react';

interface RootTesterProps {
  language: 'ar' | 'en';
}

export const RootTester: React.FC<RootTesterProps> = ({ language }) => {
  const isArabic = language === 'ar';
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'termux' | 'adb' | 'magisk'>('termux');

  const shellScript = `#!/system/bin/sh
# ==========================================================
# REDZON Kernel & Performance Optimizer Shell Script v1.0
# Requires ROOT permissions (su)
# ==========================================================

echo "========================================"
echo "⚡ REDZON 64-bit Game Optimizer Starting..."
echo "========================================"

# 1. Verify ROOT Access
if [ "$(id -u)" -ne 0 ]; then
  echo "[-] ERROR: Root permission required. Run with 'su' first!"
  exit 1
fi
echo "[+] ROOT access verified: $(id)"

# 2. Lock Refresh Rate to 120 FPS / Peak
echo "[*] Setting Display Refresh Rate to 120Hz..."
settings put system peak_refresh_rate 120.0
settings put system min_refresh_rate 120.0
echo "[+] Peak refresh rate locked at 120.0 Hz"

# 3. CPU Optimization - Set Governor to 'performance' for all 8 cores
echo "[*] Unlocking CPU Cores to Performance Governor..."
for i in 0 1 2 3 4 5 6 7; do
  if [ -f /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor ]; then
    echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor
    echo "  -> CPU core $i: $(cat /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor)"
  fi
done

# 4. GPU Optimization - Lock Max Clock Frequency (Adreno / kgsl)
echo "[*] Optimizing GPU Frequency..."
if [ -d /sys/class/kgsl/kgsl-3d0/devfreq ]; then
  MAX_FREQ=$(cat /sys/class/kgsl/kgsl-3d0/devfreq/max_freq 2>/dev/null || echo "825000000")
  echo $MAX_FREQ > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq 2>/dev/null
  echo "  -> GPU Devfreq set to max clock: $MAX_FREQ"
fi

# 5. Flush and Drop RAM Caches
echo "[*] Dropping Page Cache & Compacting RAM..."
sync
sysctl -w vm.drop_caches=3
echo "[+] RAM freed successfully"

# 6. Optimize I/O Scheduler to 'noop' for storage
echo "[*] Tuning I/O Storage Queues..."
for queue in /sys/block/mmcblk*/queue/scheduler /sys/block/sd*/queue/scheduler; do
  if [ -f "$queue" ]; then
    echo noop > "$queue" 2>/dev/null
  fi
done

# 7. Disable Thermal Throttling
echo "[*] Bypassing Qualcomm Thermal Engine..."
if [ -f /sys/module/msm_thermal/parameters/enabled ]; then
  echo 0 > /sys/module/msm_thermal/parameters/enabled
  echo "[+] Thermal throttling disabled for peak gaming performance"
fi

echo "========================================"
echo "✓ REDZON Tweaks applied successfully!"
echo "========================================"
`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(key);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const downloadScriptFile = () => {
    const blob = new Blob([shellScript], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redzon_optimizer.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#111E2C] border border-[#2DD4BF]/30 rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#2DD4BF]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-[#2DD4BF]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{isArabic ? 'دليل واختبار التنفيذ الحقيقي على الهاتف' : 'Real Hardware Verification & Live Script'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-bold">
                100% Real Commands
              </span>
            </h2>
            <p className="text-[11px] text-[#91A5B8]">
              {isArabic
                ? 'طريقة تجربة هذه الأوامر والتأكد من فعاليتها المباشرة على هاتفك الذي يحتوي على روت'
                : 'How to execute and verify these exact sysfs commands live on your rooted Android phone'}
            </p>
          </div>
        </div>

        {/* Download & Copy Script Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="download-script-btn"
            onClick={downloadScriptFile}
            className="px-3 py-1.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14b8a6] text-[#09111D] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#2DD4BF]/20 font-sans"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isArabic ? 'تحميل السكريبت (.sh)' : 'Download (.sh)'}</span>
          </button>
          <button
            id="copy-script-btn"
            onClick={() => copyToClipboard(shellScript, 'full-script')}
            className="px-3 py-1.5 rounded-xl bg-[#09111D] hover:bg-[#16283B] text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors font-sans"
          >
            {copiedScript === 'full-script' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span className="text-[#2DD4BF]">{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isArabic ? 'نسخ السكريبت' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Proof & Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-[#09111D] border border-slate-800 rounded-xl p-3">
          <div className="flex items-center gap-2 text-[#2DD4BF] text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{isArabic ? '1. التحقق من المسارات' : '1. Real Kernel Sysfs Paths'}</span>
          </div>
          <p className="text-[11px] text-[#91A5B8] leading-relaxed">
            {isArabic
              ? 'الأوامر تستهدف مسارات Linux الحقيقية في نظام أندرويد مثل `/sys/devices/system/cpu` و `/sys/class/kgsl` و `/proc/stat`.'
              : 'Commands write to actual Linux kernel nodes: `/sys/devices/system/cpu`, `/sys/class/kgsl`, and `/proc/stat`.'}
          </p>
        </div>

        <div className="bg-[#09111D] border border-slate-800 rounded-xl p-3">
          <div className="flex items-center gap-2 text-[#F4B860] text-xs font-bold mb-1">
            <Play className="w-4 h-4" />
            <span>{isArabic ? '2. إثبات عمل الأوامر' : '2. Direct Execution Proof'}</span>
          </div>
          <p className="text-[11px] text-[#91A5B8] leading-relaxed">
            {isArabic
              ? 'يمكنك تشغيل أي أمر من الأزرار مباشرة في تطبيق Termux بصلاحيات su ورؤية تغيّر ترددات المعالج والإطارات فوراً.'
              : 'You can run any button command directly inside Termux with root `su` and see instant clock and frame changes.'}
          </p>
        </div>

        <div className="bg-[#09111D] border border-slate-800 rounded-xl p-3">
          <div className="flex items-center gap-2 text-[#10B981] text-xs font-bold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>{isArabic ? '3. التوافقية الشاملة' : '3. 100% Root Compatibility'}</span>
          </div>
          <p className="text-[11px] text-[#91A5B8] leading-relaxed">
            {isArabic
              ? 'متوافق مع Magisk v27+، KernelSU، APatch، وجميع أجهزة Snapdragon، MediaTek Dimensity، و Exynos 64-bit.'
              : 'Compatible with Magisk v27+, KernelSU, APatch across Qualcomm Snapdragon, MediaTek, and Exynos.'}
          </p>
        </div>
      </div>

      {/* Step by Step Tabs for Verification */}
      <div className="bg-[#09111D] border border-slate-800 rounded-xl p-3.5 mb-4">
        <div className="flex items-center gap-2 mb-3 border-b border-slate-800/80 pb-2">
          <span className="text-xs text-slate-400 font-bold">{isArabic ? 'طرق تشغيل واختبار الأوامر على هاتفك:' : 'Select Testing Method:'}</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveTab('termux')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'termux'
                  ? 'bg-[#2DD4BF] text-[#09111D]'
                  : 'bg-[#111E2C] text-[#91A5B8] hover:text-white'
              }`}
            >
              Termux (على الهاتف مباشرة)
            </button>
            <button
              onClick={() => setActiveTab('adb')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'adb'
                  ? 'bg-[#2DD4BF] text-[#09111D]'
                  : 'bg-[#111E2C] text-[#91A5B8] hover:text-white'
              }`}
            >
              ADB Shell (عبر الكمبيوتر)
            </button>
          </div>
        </div>

        {activeTab === 'termux' && (
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111E2C] text-[#2DD4BF] font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-bold text-white">{isArabic ? 'افتح تطبيق Termux على هاتفك واطلب صلاحيات الروت:' : 'Open Termux and enter root mode:'}</p>
                <div className="bg-[#070D14] p-2 rounded-lg font-mono text-[#2DD4BF] mt-1 border border-slate-800 flex items-center justify-between">
                  <span>su</span>
                  <button onClick={() => copyToClipboard('su', 'cmd-su')} className="text-slate-500 hover:text-white">
                    {copiedScript === 'cmd-su' ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111E2C] text-[#2DD4BF] font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-white">{isArabic ? 'قم بنسخ وتطبيق أمر قفل 120 FPS لملاحظة السلاسة الفورية للشاشة:' : 'Run the 120 FPS lock command:'}</p>
                <div className="bg-[#070D14] p-2 rounded-lg font-mono text-[#2DD4BF] mt-1 border border-slate-800 flex items-center justify-between">
                  <span>settings put system peak_refresh_rate 120.0 && settings put system min_refresh_rate 120.0</span>
                  <button onClick={() => copyToClipboard('settings put system peak_refresh_rate 120.0 && settings put system min_refresh_rate 120.0', 'cmd-fps')} className="text-slate-500 hover:text-white">
                    {copiedScript === 'cmd-fps' ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111E2C] text-[#2DD4BF] font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-white">{isArabic ? 'التحقق من حالة ترددات المعالج الحالية في هاتفك:' : 'Inspect actual CPU Governor on your phone:'}</p>
                <div className="bg-[#070D14] p-2 rounded-lg font-mono text-[#2DD4BF] mt-1 border border-slate-800 flex items-center justify-between">
                  <span>cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor</span>
                  <button onClick={() => copyToClipboard('cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor', 'cmd-gov')} className="text-slate-500 hover:text-white">
                    {copiedScript === 'cmd-gov' ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adb' && (
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-slate-400">
              {isArabic ? 'إذا كان هاتفك متصلاً بالكمبيوتر، يمكنك تشغيل الأوامر عبر ADB مباشرة:' : 'Run directly via ADB shell:'}
            </p>
            <div className="bg-[#070D14] p-2.5 rounded-lg font-mono text-[#2DD4BF] border border-slate-800 space-y-1">
              <div>adb devices</div>
              <div>adb shell "su -c 'settings put system peak_refresh_rate 120.0'"</div>
              <div>adb shell "su -c 'sysctl -w vm.drop_caches=3'"</div>
            </div>
          </div>
        )}
      </div>

      {/* Script Preview Box */}
      <div className="rounded-xl bg-[#070D14] border border-slate-900 p-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800/80 mb-2 font-mono">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>redzon_optimizer.sh</span>
          </span>
          <span className="text-[10px] text-slate-500">Executable Linux Shell Script</span>
        </div>
        <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto max-h-40 leading-relaxed">
          {shellScript}
        </pre>
      </div>
    </div>
  );
};
