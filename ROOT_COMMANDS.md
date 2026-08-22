# أوامر ROOT المتقدمة

This file documents all the advanced ROOT commands used by REDZON for performance optimization.

## قائمة الأوامر

### 1. FPS Lock Commands
```bash
# قفل على 30 FPS
settings put system peak_refresh_rate 30.0
settings put system min_refresh_rate 30.0

# قفل على 60 FPS
settings put system peak_refresh_rate 60.0
settings put system min_refresh_rate 60.0

# قفل على 90 FPS
settings put system peak_refresh_rate 90.0
settings put system min_refresh_rate 90.0

# قفل على 120 FPS
settings put system peak_refresh_rate 120.0
settings put system min_refresh_rate 120.0

# إلغاء القفل
settings delete system peak_refresh_rate
settings delete system min_refresh_rate
```

### 2. CPU Governor Commands
```bash
# تحديد عدد الأنوية
CORES=$(grep -c processor /proc/cpuinfo)

# تفعيل وضع الأداء الأقصى لجميع الأنوية
for i in $(seq 0 $((CORES-1))); do
    echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor
done

# العودة لوضع الحفظ
for i in $(seq 0 $((CORES-1))); do
    echo powersave > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor
done
```

### 3. GPU Frequency Commands
```bash
# قراءة الترددات المتاحة
cat /sys/class/kgsl/kgsl-3d0/devfreq/available_frequencies

# قراءة التردد الحالي
cat /sys/class/kgsl/kgsl-3d0/devfreq/cur_freq

# قفل على أقصى تردد (مثال: 800 MHz)
echo 800000000 > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq
echo 800000000 > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq

# إعادة التعيين
echo 380000000 > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq
echo 200000000 > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq
```

### 4. RAM Optimization
```bash
# تزامن الذاكرة
sync

# حذف الذاكرة المؤقتة (Cache)
sysctl -w vm.drop_caches=1

# حذف المخزن المؤقت والمخزن المؤقت الخاص بـ Inodes
sysctl -w vm.drop_caches=3

# ضبط معاملات LMK
echo 1536,2048,3072,5120,7680,9216 > /sys/module/lowmemorykiller/parameters/minfree_0
```

### 5. I/O Scheduler Optimization
```bash
# تحديد الجدولة على noop (أسرع)
echo noop > /sys/block/mmcblk0/queue/scheduler
echo noop > /sys/block/mmcblk0p1/queue/scheduler

# تحديد الجدولة على cfq
echo cfq > /sys/block/mmcblk0/queue/scheduler

# تحديد الجدولة على deadline
echo deadline > /sys/block/mmcblk0/queue/scheduler

# قراءة الجدولة الحالية
cat /sys/block/mmcblk0/queue/scheduler
```

### 6. Thermal Throttling Control
```bash
# تعطيل كبح الحرارة (تحذير: قد تحتاج الجهاز للبرودة)
echo 0 > /sys/module/msm_thermal/parameters/enabled

# تفعيل كبح الحرارة
echo 1 > /sys/module/msm_thermal/parameters/enabled

# تعطيل core control
echo 0 > /sys/module/msm_thermal/core_control/enabled

# تفعيل core control
echo 1 > /sys/module/msm_thermal/core_control/enabled

# قراءة درجة الحرارة
cat /sys/class/thermal/thermal_zone*/temp
```

### 7. CPU Frequency Control
```bash
# قراءة الترددات المتاحة
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_frequencies

# قراءة التردد الحالي
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq

# قفل التردد الأدنى
echo 2000000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_min_freq

# قفل التردد الأقصى
echo 3000000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
```

### 8. Display Settings
```bash
# تعطيل Touch Boost
echo 0 > /sys/module/cpu_boost/parameters/input_boost_enabled

# تفعيل Triple Buffering
setprop ro.sf.triple_buffer_enabled 1

# تعطيل Refresh Rate Switching
settings put system min_refresh_rate [value]
```

### 9. Power Management
```bash
# تعطيل PCIe Power Management
echo "0" > /sys/module/pciedev/parameters/ioctl_debug

# ضبط Governor الحد الأدنى
echo interactive > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

### 10. Battery Optimization
```bash
# قراءة حالة البطارية
dumpsys battery

# قراءة درجة الحرارة الحالية
dumpsys battery | grep temperature
```

## ملاحظات مهمة

### ⚠️ تحذيرات الأمان
1. تعطيل كبح الحرارة قد يؤدي لتلف الأجهزة
2. قفل التردد على الأقصى يستهلك البطارية بسرعة
3. استخدم هذه الأوامر على مسؤوليتك الخاصة
4. اختبر على جهازك قبل الاستخدام الكامل

### نصائح التحسين
- استخدم الأداء الأقصى فقط أثناء الألعاب الثقيلة
- راقب درجة الحرارة باستمرار
- أعد التعيين الأوضاع قبل إغلاق التطبيق
- تجنب استخدام جميع التحسينات معاً لفترات طويلة

### اختبار الأوامر
```bash
# للتحقق من نجاح أمر
su -c "command" && echo "Success" || echo "Failed"

# قراءة الملفات كـ ROOT
su -c "cat /sys/path/to/file"

# كتابة الملفات كـ ROOT
su -c "echo value > /sys/path/to/file"
```

## أجهزة مدعومة

هذه الأوامر مدعومة على معظم أجهزة Android 8.0+، لكن قد تختلف المسارات بين المصنعين:

- **Qualcomm**: `/sys/class/kgsl/kgsl-3d0/`
- **MediaTek**: `/sys/devices/platform/*/`
- **Samsung Exynos**: `/sys/kernel/gpu/`

## المراجع

- Android Power Management Documentation
- Kernel sysfs Documentation
- Qualcomm Performance Tuning Guide
