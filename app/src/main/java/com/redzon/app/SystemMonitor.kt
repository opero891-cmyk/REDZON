package com.redzon.app

import android.app.ActivityManager
import android.content.Context
import android.os.BatteryManager
import android.content.Intent
import android.content.IntentFilter
import java.io.File

data class SystemMetrics(
    val cpuUsage: Float = 0f,
    val gpuUsage: Float = 0f,
    val gpuFrequency: Long = 0L,
    val ramUsage: Float = 0f,
    val ramAvailable: Long = 0L,
    val batteryTemp: Float = 0f,
    val isCharging: Boolean = false
)

object SystemMonitor {
    data class CpuStats(val idle: Long, val total: Long)

    /**
     * Read CPU usage from /proc/stat
     */
    fun readCpuStats(): CpuStats {
        return try {
            val fields = File("/proc/stat").useLines { lines ->
                lines.firstOrNull()?.trim()?.split(Regex("\\s+")) ?: emptyList()
            }
            val values = fields.drop(1).map { it.toLongOrNull() ?: 0L }
            CpuStats(
                idle = values.getOrElse(3) { 0L },
                total = values.sum().coerceAtLeast(1L)
            )
        } catch (e: Exception) {
            CpuStats(0L, 1L)
        }
    }

    /**
     * Calculate CPU usage between two samples
     */
    fun calculateCpuUsage(previous: CpuStats, current: CpuStats): Float {
        val totalDelta = current.total - previous.total
        val idleDelta = current.idle - previous.idle
        return if (totalDelta > 0) {
            ((totalDelta - idleDelta) * 100f / totalDelta).coerceIn(0f, 100f)
        } else {
            0f
        }
    }

    /**
     * Read RAM usage
     */
    fun readRamUsage(context: Context): Float {
        return try {
            val info = ActivityManager.MemoryInfo()
            val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            activityManager.getMemoryInfo(info)
            val totalMem = info.totalMem
            val usedMem = totalMem - info.availMem
            if (totalMem > 0) {
                ((usedMem * 100f) / totalMem).coerceIn(0f, 100f)
            } else {
                0f
            }
        } catch (e: Exception) {
            0f
        }
    }

    /**
     * Read available RAM in MB
     */
    fun readAvailableRam(context: Context): Long {
        return try {
            val info = ActivityManager.MemoryInfo()
            val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            activityManager.getMemoryInfo(info)
            info.availMem / (1024 * 1024)
        } catch (e: Exception) {
            0L
        }
    }

    /**
     * Read GPU frequency in MHz
     */
    fun readGpuFrequency(): Long {
        return try {
            File("/sys/class/kgsl/kgsl-3d0/devfreq/cur_freq").useLines { lines ->
                lines.firstOrNull()?.toLongOrNull()?.let { it / 1_000_000 } ?: 0L
            }
        } catch (e: Exception) {
            0L
        }
    }

    /**
     * Read GPU usage percentage
     */
    fun readGpuUsage(): Float {
        return try {
            val freq = readGpuFrequency()
            val maxFreq = File("/sys/class/kgsl/kgsl-3d0/devfreq/max_freq").useLines { lines ->
                lines.firstOrNull()?.toLongOrNull()?.let { it / 1_000_000 } ?: 1L
            }
            if (maxFreq > 0) {
                ((freq * 100f) / maxFreq).coerceIn(0f, 100f)
            } else {
                0f
            }
        } catch (e: Exception) {
            0f
        }
    }

    /**
     * Read battery temperature in Celsius
     */
    fun readBatteryTemperature(context: Context): Float {
        return try {
            val intent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
            intent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0)?.let { temp ->
                temp / 10f
            } ?: 0f
        } catch (e: Exception) {
            0f
        }
    }

    /**
     * Check if device is charging
     */
    fun isDeviceCharging(context: Context): Boolean {
        return try {
            val intent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
            val status = intent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
            status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Get all system metrics
     */
    fun getMetrics(context: Context, cpuPrevious: CpuStats, cpuCurrent: CpuStats): SystemMetrics {
        return SystemMetrics(
            cpuUsage = calculateCpuUsage(cpuPrevious, cpuCurrent),
            gpuUsage = readGpuUsage(),
            gpuFrequency = readGpuFrequency(),
            ramUsage = readRamUsage(context),
            ramAvailable = readAvailableRam(context),
            batteryTemp = readBatteryTemperature(context),
            isCharging = isDeviceCharging(context)
        )
    }
}
