package com.redzon.app

import java.io.BufferedReader
import java.io.InputStreamReader

object RootCommand {
    data class CommandResult(val success: Boolean, val output: String, val error: String? = null)

    /**
     * Execute a root command and return the result
     */
    fun execute(command: String): CommandResult = try {
        val process = ProcessBuilder("su", "-c", command)
            .redirectErrorStream(true)
            .start()
        
        val output = BufferedReader(InputStreamReader(process.inputStream)).use { 
            it.readText() 
        }
        
        val exitCode = process.waitFor()
        if (exitCode == 0) {
            CommandResult(true, output)
        } else {
            CommandResult(false, "", "فشل تنفيذ الأمر: $command")
        }
    } catch (e: Exception) {
        CommandResult(false, "", "خطأ: ${e.message}")
    }

    /**
     * Check if root is available
     */
    fun isRootAvailable(): Boolean {
        return execute("id").success && execute("id").output.contains("uid=0")
    }

    /**
     * Lock FPS to specific refresh rate
     */
    suspend fun lockFPS(fps: Int): CommandResult {
        val rate = fps.toFloat()
        val result1 = execute("settings put system peak_refresh_rate $rate")
        val result2 = execute("settings put system min_refresh_rate $rate")
        
        return if (result1.success && result2.success) {
            CommandResult(true, "تم تطبيق $fps FPS بنجاح")
        } else {
            CommandResult(false, "", "فشل في تطبيق معدل الإطارات")
        }
    }

    /**
     * Unlock FPS to default
     */
    fun unlockFPS(): CommandResult {
        val result1 = execute("settings delete system peak_refresh_rate")
        val result2 = execute("settings delete system min_refresh_rate")
        
        return if (result1.success && result2.success) {
            CommandResult(true, "تم إلغاء قفل FPS")
        } else {
            CommandResult(false, "", "فشل في إلغاء قفل FPS")
        }
    }

    /**
     * Set CPU governor to performance
     */
    fun setCPUPerformance(): CommandResult {
        return try {
            val cores = Runtime.getRuntime().availableProcessors()
            var allSuccess = true
            for (i in 0 until cores) {
                val result = execute("echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor")
                if (!result.success) allSuccess = false
            }
            if (allSuccess) {
                CommandResult(true, "تم تحسين CPU بنجاح")
            } else {
                CommandResult(false, "", "فشل في تحسين CPU")
            }
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ: ${e.message}")
        }
    }

    /**
     * Set CPU to powersave mode
     */
    fun setCPUPowersave(): CommandResult {
        return try {
            val cores = Runtime.getRuntime().availableProcessors()
            var allSuccess = true
            for (i in 0 until cores) {
                val result = execute("echo powersave > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor")
                if (!result.success) allSuccess = false
            }
            if (allSuccess) {
                CommandResult(true, "تم تحديث وضع CPU إلى توفير الطاقة")
            } else {
                CommandResult(false, "", "فشل في تحديث وضع CPU")
            }
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ: ${e.message}")
        }
    }

    /**
     * Lock GPU to max frequency
     */
    fun lockGPUFrequency(): CommandResult {
        return try {
            val freqs = execute("cat /sys/class/kgsl/kgsl-3d0/devfreq/available_frequencies")
                .output.trim().split(" ")
                .mapNotNull { it.toLongOrNull() }
                .sorted()
            
            if (freqs.isNotEmpty()) {
                val maxFreq = freqs.last()
                val result1 = execute("echo $maxFreq > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq")
                val result2 = execute("echo $maxFreq > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq")
                
                if (result1.success && result2.success) {
                    CommandResult(true, "تم قفل GPU بنجاح")
                } else {
                    CommandResult(false, "", "فشل في قفل GPU")
                }
            } else {
                CommandResult(false, "", "لم يتم العثور على ترددات GPU")
            }
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ: ${e.message}")
        }
    }

    /**
     * Optimize RAM by dropping caches
     */
    fun optimizeRAM(): CommandResult {
        return try {
            val result1 = execute("sync")
            val result2 = execute("sysctl -w vm.drop_caches=3")
            
            if (result1.success && result2.success) {
                CommandResult(true, "تم تحسين RAM بنجاح")
            } else {
                CommandResult(false, "", "فشل في تحسين RAM")
            }
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ: ${e.message}")
        }
    }

    /**
     * Optimize I/O scheduler for performance
     */
    fun optimizeIO(): CommandResult {
        return try {
            val result1 = execute("echo noop > /sys/block/mmcblk0/queue/scheduler")
            val result2 = execute("echo noop > /sys/block/mmcblk0p1/queue/scheduler")
            
            if (result1.success || result2.success) {
                CommandResult(true, "تم تحسين I/O بنجاح")
            } else {
                CommandResult(false, "", "فشل في تحسين I/O")
            }
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ: ${e.message}")
        }
    }

    /**
     * Disable thermal throttling
     */
    fun disableThermalThrottling(): CommandResult {
        return try {
            val result = execute("echo 0 > /sys/module/msm_thermal/parameters/enabled")
            if (result.success) {
                CommandResult(true, "تم تعطيل كبح الحرارة")
            } else {
                CommandResult(false, "", "فشل في تعطيل كبح الحرارة")
            }
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ: ${e.message}")
        }
    }

    /**
     * Enable thermal throttling
     */
    fun enableThermalThrottling(): CommandResult {
        return try {
            val result = execute("echo 1 > /sys/module/msm_thermal/parameters/enabled")
            if (result.success) {
                CommandResult(true, "تم تفعيل كبح الحرارة")
            } else {
                CommandResult(false, "", "فشل في تفعيل كبح الحرارة")
            }
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ: ${e.message}")
        }
    }

    /**
     * Apply balanced mode
     */
    fun balancedMode(): CommandResult {
        return try {
            setCPUPowersave()
            lockFPS(90)
            CommandResult(true, "تم تطبيق الوضع المتوازن")
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ في الوضع المتوازن: ${e.message}")
        }
    }

    /**
     * Apply extreme performance mode
     */
    fun extremePerformanceMode(): CommandResult {
        return try {
            setCPUPerformance()
            lockGPUFrequency()
            lockFPS(120)
            CommandResult(true, "تم تطبيق أداء أقصى")
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ في الأداء الأقصى: ${e.message}")
        }
    }

    /**
     * Reset to defaults
     */
    fun resetToDefaults(): CommandResult {
        return try {
            unlockFPS()
            setCPUPowersave()
            CommandResult(true, "تمت إعادة تعيين الإعدادات الافتراضية")
        } catch (e: Exception) {
            CommandResult(false, "", "خطأ في إعادة التعيين: ${e.message}")
        }
    }
}
