package com.redzon.app

import java.io.BufferedReader
import java.io.InputStreamReader

object RootCommand {
    /**
     * Execute a root command and return the output
     */
    fun execute(command: String): String? = try {
        val process = ProcessBuilder("su", "-c", command)
            .redirectErrorStream(true)
            .start()
        
        val output = BufferedReader(InputStreamReader(process.inputStream)).use { 
            it.readText() 
        }
        
        val exitCode = process.waitFor()
        if (exitCode == 0) output else null
    } catch (e: Exception) {
        null
    }

    /**
     * Check if root is available
     */
    fun isRootAvailable(): Boolean {
        return execute("id")?.contains("uid=0") == true
    }

    /**
     * Lock FPS to specific refresh rate
     */
    fun lockFPS(fps: Int) {
        val rate = fps.toFloat()
        execute("settings put system peak_refresh_rate $rate")
        execute("settings put system min_refresh_rate $rate")
    }

    /**
     * Unlock FPS to default
     */
    fun unlockFPS() {
        execute("settings delete system peak_refresh_rate")
        execute("settings delete system min_refresh_rate")
    }

    /**
     * Set CPU governor to performance
     */
    fun setCPUPerformance() {
        val cores = Runtime.getRuntime().availableProcessors()
        for (i in 0 until cores) {
            execute("echo performance > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor")
        }
    }

    /**
     * Set CPU to powersave mode
     */
    fun setCPUPowersave() {
        val cores = Runtime.getRuntime().availableProcessors()
        for (i in 0 until cores) {
            execute("echo powersave > /sys/devices/system/cpu/cpu$i/cpufreq/scaling_governor")
        }
    }

    /**
     * Lock GPU to max frequency
     */
    fun lockGPUFrequency() {
        // Read available frequencies
        val freqs = execute("cat /sys/class/kgsl/kgsl-3d0/devfreq/available_frequencies")
            ?.trim()?.split(" ")
            ?.mapNotNull { it.toLongOrNull() }
            ?.sorted()
        
        if (freqs != null && freqs.isNotEmpty()) {
            val maxFreq = freqs.last()
            execute("echo $maxFreq > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq")
            execute("echo $maxFreq > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq")
        }
    }

    /**
     * Unlock GPU to normal operation
     */
    fun unlockGPU() {
        execute("echo 380000000 > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq")
        execute("echo 200000000 > /sys/class/kgsl/kgsl-3d0/devfreq/min_freq")
    }

    /**
     * Optimize RAM by dropping caches
     */
    fun optimizeRAM() {
        // Sync and drop caches
        execute("sync")
        execute("sysctl -w vm.drop_caches=3")
    }

    /**
     * Adjust I/O scheduler for performance
     */
    fun optimizeIO() {
        execute("echo noop > /sys/block/mmcblk0/queue/scheduler")
        execute("echo noop > /sys/block/mmcblk0p1/queue/scheduler")
    }

    /**
     * Disable thermal throttling
     */
    fun disableThermalThrottling() {
        execute("echo 0 > /sys/module/msm_thermal/parameters/enabled")
        execute("echo 1 > /sys/module/msm_thermal/core_control/enabled")
    }

    /**
     * Enable thermal throttling
     */
    fun enableThermalThrottling() {
        execute("echo 1 > /sys/module/msm_thermal/parameters/enabled")
        execute("echo 0 > /sys/module/msm_thermal/core_control/enabled")
    }

    /**
     * Extreme performance mode - all optimizations enabled
     */
    fun extremePerformanceMode() {
        lockFPS(120)
        setCPUPerformance()
        lockGPUFrequency()
        optimizeRAM()
        optimizeIO()
        disableThermalThrottling()
    }

    /**
     * Balanced mode - moderate optimizations
     */
    fun balancedMode() {
        lockFPS(90)
        setCPUPerformance()
        optimizeRAM()
    }

    /**
     * Reset to defaults
     */
    fun resetToDefaults() {
        unlockFPS()
        setCPUPowersave()
        unlockGPU()
        enableThermalThrottling()
    }
}
