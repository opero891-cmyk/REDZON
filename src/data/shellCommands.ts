export interface ShellCommandDefinition {
  id: string;
  name: string;
  nameEn: string;
  category: 'fps' | 'cpu' | 'gpu' | 'ram' | 'thermal' | 'io' | 'diagnostics' | 'profile';
  command: string;
  description: string;
  descriptionEn: string;
  sysfsTarget: string;
  expectedOutput?: string;
}

export const SHELL_COMMANDS: Record<string, ShellCommandDefinition> = {
  LOCK_FPS_30: {
    id: 'LOCK_FPS_30',
    name: 'قفل 30 FPS',
    nameEn: 'Lock 30 FPS',
    category: 'fps',
    command: 'settings put system peak_refresh_rate 30.0 && settings put system min_refresh_rate 30.0',
    description: 'إجبار شاشة الهاتف على تحديث 30Hz لتوفير الطاقة واستقرار الألعاب الخفيفة',
    descriptionEn: 'Forces display to lock at 30Hz refresh rate',
    sysfsTarget: 'android.provider.Settings.System (peak_refresh_rate, min_refresh_rate)'
  },
  LOCK_FPS_60: {
    id: 'LOCK_FPS_60',
    name: 'قفل 60 FPS',
    nameEn: 'Lock 60 FPS',
    category: 'fps',
    command: 'settings put system peak_refresh_rate 60.0 && settings put system min_refresh_rate 60.0',
    description: 'قفل معدل الإطارات القياسي 60Hz المستقر لجميع ألعاب أندرويد',
    descriptionEn: 'Locks standard 60Hz smooth display refresh rate',
    sysfsTarget: 'android.provider.Settings.System (peak_refresh_rate, min_refresh_rate)'
  },
  LOCK_FPS_90: {
    id: 'LOCK_FPS_90',
    name: 'قفل 90 FPS',
    nameEn: 'Lock 90 FPS',
    category: 'fps',
    command: 'settings put system peak_refresh_rate 90.0 && settings put system min_refresh_rate 90.0',
    description: 'قفل معدل التحديث على 90Hz للألعاب الداعمة مثل PUBG Mobile',
    descriptionEn: 'Locks display at 90Hz ultra-smooth gaming refresh rate',
    sysfsTarget: 'android.provider.Settings.System (peak_refresh_rate, min_refresh_rate)'
  },
  LOCK_FPS_120: {
    id: 'LOCK_FPS_120',
    name: 'قفل 120 FPS',
    nameEn: 'Lock 120 FPS',
    category: 'fps',
    command: 'settings put system peak_refresh_rate 120.0 && settings put system min_refresh_rate 120.0',
    description: 'قفل أعلى معدل تحديث 120Hz لأقصى سرعة واستجابة للمس',
    descriptionEn: 'Forces display to absolute maximum 120Hz ceiling',
    sysfsTarget: 'android.provider.Settings.System (peak_refresh_rate, min_refresh_rate)'
  },
  UNLOCK_FPS: {
    id: 'UNLOCK_FPS',
    name: 'إلغاء قفل FPS',
    nameEn: 'Unlock FPS',
    category: 'fps',
    command: 'settings delete system peak_refresh_rate && settings delete system min_refresh_rate',
    description: 'استعادة التردد التلقائي الديناميكي للنظام (Adaptive Refresh Rate)',
    descriptionEn: 'Restores stock adaptive dynamic refresh rate',
    sysfsTarget: 'android.provider.Settings.System'
  },
  CPU_PERFORMANCE: {
    id: 'CPU_PERFORMANCE',
    name: 'أداء المعالج الأقصى (Performance Governor)',
    nameEn: 'CPU Performance Governor',
    category: 'cpu',
    command: 'for i in $(seq 0 7); do if [ -f /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor ]; then echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor; fi; done',
    description: 'ضبط حاكم التردد على performance لجميع أنوية المعالج (0-7)',
    descriptionEn: 'Sets all 8 CPU core governors to high performance mode',
    sysfsTarget: '/sys/devices/system/cpu/cpu[0-7]/cpufreq/scaling_governor'
  },
  CPU_POWERSAVE: {
    id: 'CPU_POWERSAVE',
    name: 'توفير طاقة المعالج (Powersave Governor)',
    nameEn: 'CPU Powersave Governor',
    category: 'cpu',
    command: 'for i in $(seq 0 7); do if [ -f /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor ]; then echo powersave > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor; fi; done',
    description: 'ضبط حاكم التردد على powersave للأنوية للحفاظ على البطارية والحرارة',
    descriptionEn: 'Sets CPU governors to powersave',
    sysfsTarget: '/sys/devices/system/cpu/cpu[0-7]/cpufreq/scaling_governor'
  },
  CPU_RESET: {
    id: 'CPU_RESET',
    name: 'إعادة ضبط حاكم المعالج (Schedutil Governor)',
    nameEn: 'Restore Schedutil CPU Governor',
    category: 'cpu',
    command: 'for i in $(seq 0 7); do if [ -f /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor ]; then echo schedutil > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor; fi; done',
    description: 'إعادة حاكم المعالج للوضع الافتراضي التكيفي schedutil',
    descriptionEn: 'Restores stock Android kernel schedutil governor',
    sysfsTarget: '/sys/devices/system/cpu/cpu[0-7]/cpufreq/scaling_governor'
  },
  GPU_LOCK_MAX: {
    id: 'GPU_LOCK_MAX',
    name: 'قفل أقصى تردد لكرت الشاشة GPU',
    nameEn: 'Lock Max GPU Frequency',
    category: 'gpu',
    command: 'if [ -d /sys/class/kgsl/kgsl-3d0/devfreq ]; then echo 825000000 > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq && echo 825000000 > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq; fi',
    description: 'تثبيت تردد معالج الرسوميات Adreno على 825 MHz لمنع انخفاض الفريمات',
    descriptionEn: 'Locks Qualcomm Adreno GPU devfreq to 825 MHz clock frequency',
    sysfsTarget: '/sys/class/kgsl/kgsl-3d0/devfreq/min_freq & max_freq'
  },
  GPU_RESET: {
    id: 'GPU_RESET',
    name: 'إعادة تعيين تردد GPU التلقائي',
    nameEn: 'Reset GPU Frequency',
    category: 'gpu',
    command: 'if [ -d /sys/class/kgsl/kgsl-3d0/devfreq ]; then echo 380000000 > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq; fi',
    description: 'إعادة أدنى تردد لكرت الشاشة إلى 380 MHz الافتراضي',
    descriptionEn: 'Restores default minimum GPU frequency',
    sysfsTarget: '/sys/class/kgsl/kgsl-3d0/devfreq/min_freq'
  },
  RAM_DROP_CACHES: {
    id: 'RAM_DROP_CACHES',
    name: 'تفريغ وتطهير الذاكرة RAM',
    nameEn: 'Flush Pagecache & Compact RAM',
    category: 'ram',
    command: 'sync && sysctl -w vm.drop_caches=3 && echo 1 > /proc/sys/vm/compact_memory',
    description: 'مزامنة التخزين وتفريغ كافة كاش النواة وضغط مساحات الذاكرة العشوائية',
    descriptionEn: 'Flushes clean pagecaches, dentries, inodes and compacts RAM',
    sysfsTarget: '/proc/sys/vm/drop_caches & /proc/sys/vm/compact_memory'
  },
  DISABLE_THERMAL: {
    id: 'DISABLE_THERMAL',
    name: 'تعطيل كبح الحرارة (Thermal Throttling Bypass)',
    nameEn: 'Disable Thermal Throttling',
    category: 'thermal',
    command: 'if [ -f /sys/module/msm_thermal/parameters/enabled ]; then echo 0 > /sys/module/msm_thermal/parameters/enabled; fi; stop thermal-engine 2>/dev/null',
    description: 'إيقاف كبح ترددات المعالج والـ GPU عند ارتفاع درجة حرارة الجهاز',
    descriptionEn: 'Bypasses Qualcomm msm_thermal and stops thermal-engine daemon',
    sysfsTarget: '/sys/module/msm_thermal/parameters/enabled'
  },
  ENABLE_THERMAL: {
    id: 'ENABLE_THERMAL',
    name: 'تفعيل حماية الحرارة (Enable Thermal Protection)',
    nameEn: 'Enable Thermal Protection',
    category: 'thermal',
    command: 'if [ -f /sys/module/msm_thermal/parameters/enabled ]; then echo 1 > /sys/module/msm_thermal/parameters/enabled; fi; start thermal-engine 2>/dev/null',
    description: 'إعادة تشغيل نظام الحماية التلقائي من الحرارة للحفاظ على عمر العتاد',
    descriptionEn: 'Restores thermal engine governor protection',
    sysfsTarget: '/sys/module/msm_thermal/parameters/enabled'
  },
  IO_NOOP: {
    id: 'IO_NOOP',
    name: 'تسريع قراءة التخزين I/O (Scheduler: noop)',
    nameEn: 'Optimize Storage I/O (noop)',
    category: 'io',
    command: 'for queue in /sys/block/mmcblk*/queue/scheduler /sys/block/sd*/queue/scheduler; do if [ -f "$queue" ]; then echo noop > "$queue" 2>/dev/null; fi; done',
    description: 'تغيير جدولة وحدات تخزين UFS / eMMC إلى noop لتقليل زمن استجابة التحميل',
    descriptionEn: 'Switches storage block schedulers to low-latency noop',
    sysfsTarget: '/sys/block/mmcblk*/queue/scheduler & /sys/block/sd*/queue/scheduler'
  },
  IO_RESET: {
    id: 'IO_RESET',
    name: 'استعادة جدولة التخزين الافتراضية (cfq / mq-deadline)',
    nameEn: 'Reset Storage I/O Scheduler',
    category: 'io',
    command: 'for queue in /sys/block/mmcblk*/queue/scheduler /sys/block/sd*/queue/scheduler; do if [ -f "$queue" ]; then echo mq-deadline > "$queue" 2>/dev/null || echo cfq > "$queue" 2>/dev/null; fi; done',
    description: 'إعادة جدولة الأقراص إلى الوضع الافتراضي للبطارية والاستخدام اليومي',
    descriptionEn: 'Restores default storage scheduler',
    sysfsTarget: '/sys/block/mmcblk*/queue/scheduler'
  },
  GET_CPU_STAT: {
    id: 'GET_CPU_STAT',
    name: 'قراءة استهلاك المعالج الحي',
    nameEn: 'Read Live CPU Stats',
    category: 'diagnostics',
    command: 'cat /proc/stat | grep "^cpu "',
    description: 'قراءة دورات عمل المعالج في نواة لينكس لحساب نسبة الاستهلاك الدقيقة',
    descriptionEn: 'Reads Linux procfs cpu statistics',
    sysfsTarget: '/proc/stat'
  },
  GET_BATTERY_STATUS: {
    id: 'GET_BATTERY_STATUS',
    name: 'قراءة معلومات البطارية والحرارة',
    nameEn: 'Read Battery & Thermal Telemetry',
    category: 'diagnostics',
    command: 'dumpsys battery | grep -E "level|temperature|voltage|AC powered"',
    description: 'قراءة حرارة البطارية بالميلي درجة مئوية وحالة الشحن من خدمة النظام',
    descriptionEn: 'Queries Android BatteryManager dump for live temperature and level',
    sysfsTarget: 'Android BatteryService (dumpsys battery)'
  },
  GET_GPU_FREQ: {
    id: 'GET_GPU_FREQ',
    name: 'قراءة التردد اللحظي لمعالج الرسوميات',
    nameEn: 'Read Live GPU Frequency',
    category: 'diagnostics',
    command: 'cat /sys/class/kgsl/kgsl-3d0/devfreq/cur_freq 2>/dev/null || cat /sys/class/kgsl/kgsl-3d0/gpuclk',
    description: 'استعلام مباشر عن تردد كرت الشاشة بالـ Hertz',
    descriptionEn: 'Reads Adreno kgsl live clock speed in Hz',
    sysfsTarget: '/sys/class/kgsl/kgsl-3d0/devfreq/cur_freq'
  }
};
