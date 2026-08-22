package com.redzon.app

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material.icons.filled.Videogame
import androidx.compose.material.icons.filled.Restore
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import androidx.compose.runtime.rememberCoroutineScope
import java.util.Locale

private val Ink = Color(0xFF09111D)
private val Panel = Color(0xFF111E2C)
private val Cyan = Color(0xFF2DD4BF)
private val Amber = Color(0xFFF4B860)
private val Green = Color(0xFF10B981)
private val Red = Color(0xFFEF4444)
private val Muted = Color(0xFF91A5B8)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { RedzonApp(applicationContext) }
    }
}

@Composable
private fun RedzonApp(context: Context) {
    var rootStatus by remember { mutableStateOf("جار فحص الروت...") }
    var rootReady by remember { mutableStateOf(false) }
    var metrics by remember { mutableStateOf(SystemMetrics()) }
    var currentMode by remember { mutableStateOf("normal") }
    var actionStatus by remember { mutableStateOf("جاهز") }
    var thermaling by remember { mutableStateOf(true) }
    var cpuPrevious by remember { mutableStateOf(SystemMonitor.readCpuStats()) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        val hasRoot = withContext(Dispatchers.IO) {
            RootCommand.isRootAvailable()
        }
        rootReady = hasRoot
        rootStatus = if (hasRoot) "ROOT متصل ✓" else "محدود - بدون ROOT ✗"
    }

    LaunchedEffect(Unit) {
        while (true) {
            delay(1000)
            val cpuCurrent = SystemMonitor.readCpuStats()
            metrics = SystemMonitor.getMetrics(context, cpuPrevious, cpuCurrent)
            cpuPrevious = cpuCurrent
        }
    }

    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = Ink) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("REDZON", color = Cyan, fontSize = 36.sp, fontWeight = FontWeight.Black)
                            Text("تحسين الأداء المتطور", color = Muted, fontSize = 13.sp)
                        }
                        StatusPill(rootStatus, rootReady)
                    }
                }

                item {
                    Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(16.dp)) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Text("المراقبة المباشرة", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                MetricCard("CPU", String.format(Locale.US, "%.0f%%", metrics.cpuUsage), Cyan, Modifier.weight(1f))
                                MetricCard("GPU", String.format(Locale.US, "%.0f%%", metrics.gpuUsage), Amber, Modifier.weight(1f))
                                MetricCard("RAM", String.format(Locale.US, "%.0f%%", metrics.ramUsage), Green, Modifier.weight(1f))
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                MetricSmall("GPU", "${metrics.gpuFrequency} MHz", Cyan, Modifier.weight(1f))
                                MetricSmall("درجة الحرارة", String.format(Locale.US, "%.1f°C", metrics.batteryTemp), if (metrics.batteryTemp > 40) Red else Green, Modifier.weight(1f))
                            }
                            Text(actionStatus, color = Muted, fontSize = 11.sp)
                        }
                    }
                }

                item {
                    Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(16.dp)) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Speed, contentDescription = null, tint = Cyan, modifier = Modifier.size(24.dp))
                                Column(modifier = Modifier.padding(start = 12.dp).weight(1f)) {
                                    Text("قفل معدل الإطارات FPS", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text("تثبيت التحديث على معدل ثابت", color = Muted, fontSize = 11.sp)
                                }
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                FPSButton("30", 30, rootReady) { fps ->
                                    actionStatus = "جاري تطبيق $fps FPS..."
                                    withContext(Dispatchers.IO) { RootCommand.lockFPS(fps) }
                                    actionStatus = "تم تطبيق $fps FPS بنجاح"
                                }
                                FPSButton("60", 60, rootReady) { fps ->
                                    actionStatus = "جاري تطبيق $fps FPS..."
                                    withContext(Dispatchers.IO) { RootCommand.lockFPS(fps) }
                                    actionStatus = "تم تطبيق $fps FPS بنجاح"
                                }
                                FPSButton("90", 90, rootReady) { fps ->
                                    actionStatus = "جاري تطبيق $fps FPS..."
                                    withContext(Dispatchers.IO) { RootCommand.lockFPS(fps) }
                                    actionStatus = "تم تطبيق $fps FPS بنجاح"
                                }
                                FPSButton("120", 120, rootReady) { fps ->
                                    actionStatus = "جاري تطبيق $fps FPS..."
                                    withContext(Dispatchers.IO) { RootCommand.lockFPS(fps) }
                                    actionStatus = "تم تطبيق $fps FPS بنجاح"
                                }
                            }
                        }
                    }
                }

                item {
                    Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(16.dp)) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.TrendingUp, contentDescription = null, tint = Amber, modifier = Modifier.size(24.dp))
                                Text("أوضاع الأداء", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp, modifier = Modifier.padding(start = 12.dp))
                            }

                            Button(
                                onClick = {
                                    scope.launch {
                                        actionStatus = "جاري تطبيق الوضع المتوازن..."
                                        currentMode = "balanced"
                                        withContext(Dispatchers.IO) { RootCommand.balancedMode() }
                                        actionStatus = "تم تطبيق الوضع المتوازن"
                                    }
                                },
                                enabled = rootReady,
                                modifier = Modifier.fillMaxWidth().height(45.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = if (currentMode == "balanced") Cyan else Panel, contentColor = if (currentMode == "balanced") Ink else Color.White)
                            ) {
                                Text("الوضع المتوازن (90 FPS)", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }

                            Button(
                                onClick = {
                                    scope.launch {
                                        actionStatus = "جاري تطبيق الأداء الأقصى..."
                                        currentMode = "extreme"
                                        withContext(Dispatchers.IO) { RootCommand.extremePerformanceMode() }
                                        actionStatus = "تم تطبيق الأداء الأقصى"
                                    }
                                },
                                enabled = rootReady,
                                modifier = Modifier.fillMaxWidth().height(45.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = if (currentMode == "extreme") Red else Panel, contentColor = Color.White)
                            ) {
                                Text("أداء أقصى (120 FPS + قفل CPU/GPU)", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }

                            OutlinedButton(
                                onClick = {
                                    scope.launch {
                                        actionStatus = "جاري إعادة تعيين الإعدادات..."
                                        currentMode = "normal"
                                        withContext(Dispatchers.IO) { RootCommand.resetToDefaults() }
                                        actionStatus = "تمت إعادة تعيين الإعدادات الافتراضية"
                                    }
                                },
                                enabled = rootReady,
                                modifier = Modifier.fillMaxWidth().height(45.dp),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Icon(Icons.Default.Restore, contentDescription = null)
                                Text("  إعادة تعيين الإعدادات", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                item {
                    Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(16.dp)) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Settings, contentDescription = null, tint = Amber, modifier = Modifier.size(24.dp))
                                Text("الإعدادات المتقدمة", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp, modifier = Modifier.padding(start = 12.dp))
                            }

                            SettingToggle("تحسين CPU (وضع الأداء القصوى)", Icons.Default.Memory, rootReady) {
                                actionStatus = "جاري تحسين CPU..."
                                withContext(Dispatchers.IO) { RootCommand.setCPUPerformance() }
                                actionStatus = "تم تحسين CPU"
                            }

                            SettingToggle("تحسين GPU (قفل التردد الأقصى)", Icons.Default.Videogame, rootReady) {
                                actionStatus = "جاري تحسين GPU..."
                                withContext(Dispatchers.IO) { RootCommand.lockGPUFrequency() }
                                actionStatus = "تم تحسين GPU"
                            }

                            SettingToggle("تحسين الذاكرة RAM", Icons.Default.Memory, rootReady) {
                                actionStatus = "جاري تحسين RAM..."
                                withContext(Dispatchers.IO) { RootCommand.optimizeRAM() }
                                actionStatus = "تم تحسين RAM"
                            }

                            SettingToggle(if (thermaling) "تعطيل كبح الحرارة" else "تفعيل كبح الحرارة", Icons.Default.Thermostat, rootReady) {
                                actionStatus = if (thermaling) "جاري تعطيل كبح الحرارة..." else "جاري تفعيل كبح الحرارة..."
                                val disableThermal = thermaling
                                thermaling = !thermaling
                                withContext(Dispatchers.IO) {
                                    if (disableThermal) {
                                        RootCommand.disableThermalThrottling()
                                    } else {
                                        RootCommand.enableThermalThrottling()
                                    }
                                }
                                actionStatus = if (disableThermal) "تم تعطيل كبح الحرارة" else "تم تفعيل كبح الحرارة"
                            }

                            SettingToggle("تحسين I/O (سرعة قراءة البيانات)", Icons.Default.Speed, rootReady) {
                                actionStatus = "جاري تحسين I/O..."
                                withContext(Dispatchers.IO) { RootCommand.optimizeIO() }
                                actionStatus = "تم تحسين I/O"
                            }
                        }
                    }
                }

                item {
                    Text("REDZON v1.0  •  ${if (rootReady) "ROOT MODE" else "LIMITED MODE"}", color = Muted, fontSize = 10.sp, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp))
                }
            }
        }
    }
}

@Composable
private fun StatusPill(status: String, ready: Boolean) {
    Box(modifier = Modifier.background(if (ready) Cyan.copy(alpha = 0.16f) else Red.copy(alpha = 0.16f), RoundedCornerShape(50))) {
        Text(status, color = if (ready) Cyan else Red, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp))
    }
}

@Composable
private fun MetricCard(label: String, value: String, accent: Color, modifier: Modifier) {
    Card(modifier = modifier, colors = CardDefaults.cardColors(containerColor = accent.copy(alpha = 0.1f)), shape = RoundedCornerShape(12.dp)) {
        Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.Memory, contentDescription = null, tint = accent, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Black)
            Text(label, color = accent, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun MetricSmall(label: String, value: String, accent: Color, modifier: Modifier) {
    Card(modifier = modifier, colors = CardDefaults.cardColors(containerColor = accent.copy(alpha = 0.1f)), shape = RoundedCornerShape(12.dp)) {
        Column(modifier = Modifier.padding(10.dp)) {
            Text(label, color = accent, fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Text(value, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun FPSButton(label: String, fps: Int, enabled: Boolean, onClick: suspend (Int) -> Unit) {
    val scope = rememberCoroutineScope()
    Button(
        onClick = { scope.launch { onClick(fps) } },
        enabled = enabled,
        modifier = Modifier.height(40.dp),
        shape = RoundedCornerShape(8.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Cyan.copy(alpha = 0.2f), contentColor = Cyan)
    ) {
        Text(label, fontWeight = FontWeight.Bold, fontSize = 11.sp)
    }
}

@Composable
private fun SettingToggle(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, enabled: Boolean, onClick: suspend () -> Unit) {
    val scope = rememberCoroutineScope()
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Cyan.copy(alpha = 0.05f), RoundedCornerShape(10.dp))
            .clickable(enabled = enabled) { scope.launch { onClick() } }
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = if (enabled) Cyan else Muted, modifier = Modifier.size(20.dp))
        Text(label, color = if (enabled) Color.White else Muted, fontSize = 12.sp, fontWeight = FontWeight.Medium, modifier = Modifier.padding(start = 12.dp).weight(1f))
        Box(modifier = Modifier.size(20.dp).background(if (enabled) Cyan else Muted, RoundedCornerShape(4.dp))) {
            Text(">", color = Ink, fontSize = 14.sp, fontWeight = FontWeight.Bold, modifier = Modifier.align(Alignment.Center))
        }
    }
}
