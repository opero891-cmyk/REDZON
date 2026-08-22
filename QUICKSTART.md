# دليل البدء السريع - REDZON Quick Start Guide

## الخطوة 1: متطلبات التطوير

تأكد من لديك:
- Android Studio (أحدث إصدار)
- Java Development Kit 17+
- Android SDK 35
- Gradle 8.6+

## الخطوة 2: إعداد المشروع

```bash
# فتح المشروع في Android Studio
cd Android

# مزامنة Gradle
./gradlew sync

# تنظيف المشروع
./gradlew clean
```

## الخطوة 3: البناء والتجميع

```bash
# بناء نسخة Debug
./gradlew assembleDebug

# بناء نسخة Release
./gradlew assembleRelease

# بناء ملف Signed APK (مطلوب للنشر)
./gradlew bundleRelease
```

## الخطوة 4: التثبيت على الجهاز

```bash
# تثبيت على جهاز متصل
adb install app/build/outputs/apk/debug/app-debug.apk

# تثبيت وتشغيل مباشرة
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.redzon.app/.SplashActivity
```

## الخطوة 5: منح صلاحيات الروت

التطبيق يحتاج لصلاحيات ROOT. تأكد من:

```bash
# فحص وجود Magisk
adb shell which magisk
adb shell which su

# مثال: استخدام Magisk
adb shell su -c "id"  # يجب أن يُظهر uid=0
```

## عملية التطوير

### بناء وتثبيت بأمر واحد
```bash
./gradlew installDebug
```

### عرض السجلات (Logs)
```bash
# جميع السجلات
adb logcat

# السجلات من التطبيق فقط
adb logcat | grep REDZON

# حفظ السجلات في ملف
adb logcat > logs.txt
```

### تصحيح الأخطاء (Debug)
```bash
# تشغيل في وضع Debugger
./gradlew installDebug
# ثم الضغط على Debug في Android Studio
```

## بنية المجلدات

```
Android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/redzon/app/
│   │       │   ├── MainActivity.kt          # الشاشة الرئيسية
│   │       │   ├── SplashActivity.kt        # شاشة البداية
│   │       │   ├── RootCommand.kt           # أوامر الروت
│   │       │   ├── SystemMonitor.kt         # مراقبة النظام
│   │       │   └── MonitoringService.kt     # خدمة المراقبة
│   │       ├── res/
│   │       │   └── values/
│   │       │       └── styles.xml           # الأنماط
│   │       └── AndroidManifest.xml          # التكوين
│   ├── build.gradle.kts                     # إعدادات البناء
│   └── proguard-rules.pro                   # قواعد البهاء (Obfuscation)
├── build.gradle.kts                         # إعدادات المشروع العام
├── settings.gradle.kts                      # إعدادات الإضافات
├── gradle.properties                        # خصائص Gradle
└── README.md                                # التوثيق

```

## حل المشاكل الشائعة

### المشكلة: gradle sync failed
**الحل:**
```bash
./gradlew clean
./gradlew sync
```

### المشكلة: App crashes immediately
**الحل:**
1. تحقق من السجلات:
```bash
adb logcat | grep AndroidRuntime
```
2. تأكد من وجود ROOT
3. إعادة تثبيت التطبيق

### المشكلة: Root commands not working
**الحل:**
```bash
# اختبار صلاحيات ROOT
adb shell su -c "id"

# يجب أن تُظهر:
# uid=0(root) gid=0(root) groups=...
```

### المشكلة: GPU monitoring not working
**الحل:**
1. التحقق من المسار الصحيح:
```bash
adb shell ls /sys/class/kgsl/
adb shell ls /sys/class/kgsl/kgsl-3d0/devfreq/
```

2. قد تختلف المسارات حسب الجهاز والمصنع

## أوامر مفيدة للتطوير

### حذف البيانات المخزنة
```bash
adb shell pm clear com.redzon.app
```

### معلومات التطبيق
```bash
adb shell dumpsys package com.redzon.app
```

### الأجهزة المتصلة
```bash
adb devices
adb devices -l  # مع التفاصيل
```

### نسخة Android
```bash
adb shell getprop ro.build.version.release
adb shell getprop ro.build.version.sdk
```

### معلومات الجهاز
```bash
adb shell getprop ro.product.model
adb shell getprop ro.product.manufacturer
adb shell getprop ro.product.cpu.abi
```

## نصائح الأداء

1. **استخدم Release Build** للاختبار النهائي:
```bash
./gradlew assembleRelease
```

2. **مراقبة استهلاك الذاكرة**:
```bash
adb shell dumpsys meminfo com.redzon.app
```

3. **اختبر على جهازين مختلفين** على الأقل:
   - جهاز حديث (Android 12+)
   - جهاز أقدم (Android 8-9)

## الخطوات التالية

1. ✅ اختبر FPS locking على ألعاب
2. ✅ راقب درجة الحرارة أثناء الاستخدام
3. ✅ تحقق من استقرار البطاقات الرسومية
4. ✅ اختبر جميع أوضاع الأداء
5. ✅ أضف التحسينات الإضافية حسب الحاجة

## الموارد المفيدة

- [Android Developer Documentation](https://developer.android.com)
- [Kotlin Language Docs](https://kotlinlang.org/docs)
- [Jetpack Compose Docs](https://developer.android.com/jetpack/compose)
- [Android Performance Guidelines](https://developer.android.com/performance)

## الدعم والمساعدة

إذا واجهت مشاكل:
1. راجع السجلات (logcat)
2. تحقق من متطلبات الروت
3. جرب على جهاز مختلف
4. استشر توثيق Android الرسمية
