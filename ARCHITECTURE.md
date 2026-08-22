# Architecture Documentation - REDZON

## System Overview

REDZON is a sophisticated performance optimization application for Android devices that leverages ROOT access to provide system-level performance tuning for gaming and demanding applications.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     REDZON Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Presentation Layer                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │SplashActivity│  │MainActivity  │  │    Compose   │  │ │
│  │  │              │  │              │  │   Components │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            △                                  │
│                            │ Updates UI                       │
│                            │                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Business Logic Layer                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │SystemMonitor │  │RootCommand   │  │Monitoring   │  │ │
│  │  │              │  │              │  │Service      │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            △                                  │
│                            │                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    System Interface Layer               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │/proc/stat    │  │/sys/devices  │  │Battery API   │  │ │
│  │  │/sys/class    │  │Kernel API    │  │ActivityMgr   │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            △                                  │
│                            │ ROOT Access                      │
│                            │                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Android Kernel / System                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │    CPU       │  │    GPU       │  │   Memory     │  │ │
│  │  │ Governor     │  │ Frequency    │  │ Management   │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## File Components

### 1. SplashActivity.kt

**Purpose**: Initial app launcher with ROOT verification

**Key Features**:
- Animated loading screen
- ROOT availability check
- Smooth transition to MainActivity

**Key Composables**:
- `SplashScreen()`: Main UI container
- Progress animation with Tween
- Status text updates

**Flow**:
```
User Launches App
      ↓
SplashActivity.onCreate()
      ↓
RootCommand.isRootAvailable()
      ↓
Show status (connected/limited)
      ↓
Delay 500ms
      ↓
Navigate to MainActivity
```

### 2. MainActivity.kt

**Purpose**: Main application dashboard and control center

**Key Features**:
- Real-time system metrics display
- FPS lock controls (30/60/90/120)
- Performance mode selection
- Advanced settings

**State Management**:
```kotlin
var rootReady: Boolean              // ROOT status
var metrics: SystemMetrics          // CPU, GPU, RAM, Temp
var currentMode: String             // normal/balanced/extreme
var actionStatus: String            // Last action result
var thermaling: Boolean             // Thermal throttling state
var cpuPrevious: SystemMonitor.CpuStats  // For calculating delta
```

**Key Composables**:
- `RedzonApp()`: Main container
- `StatusPill()`: ROOT status indicator
- `MetricCard()`: CPU/GPU/RAM display
- `MetricSmall()`: Frequency/Temperature display
- `FPSButton()`: Quick FPS selection
- `SettingToggle()`: Advanced settings buttons

**Update Frequency**: 1 second (via LaunchedEffect with delay)

### 3. RootCommand.kt

**Purpose**: All ROOT command execution and optimization functions

**Key Functions**:

| Function | Command | Purpose |
|----------|---------|---------|
| `isRootAvailable()` | `id` | Check ROOT access |
| `lockFPS(fps)` | settings put system | Lock FPS rate |
| `unlockFPS()` | settings delete system | Unlock FPS |
| `setCPUPerformance()` | echo performance > scaling_governor | Max CPU performance |
| `setCPUPowersave()` | echo powersave > scaling_governor | Power saving mode |
| `lockGPUFrequency()` | Set max/min GPU freq | Lock GPU to max |
| `unlockGPU()` | Reset GPU freq | Normal GPU operation |
| `optimizeRAM()` | sysctl -w vm.drop_caches=3 | Clear memory caches |
| `optimizeIO()` | echo noop > scheduler | Fast I/O |
| `disableThermalThrottling()` | echo 0 > thermal_enabled | Disable heat throttle |
| `enableThermalThrottling()` | echo 1 > thermal_enabled | Enable heat protection |

**Execution Pattern**:
```kotlin
RootCommand.execute(command: String) → String?
    ↓
ProcessBuilder("su", "-c", command)
    ↓
Wait for process completion
    ↓
Return output if exit code == 0
```

### 4. SystemMonitor.kt

**Purpose**: Real-time system metrics collection

**Data Class**: `SystemMetrics`
```kotlin
data class SystemMetrics(
    val cpuUsage: Float,        // 0-100%
    val gpuUsage: Float,        // 0-100%
    val gpuFrequency: Long,     // MHz
    val ramUsage: Float,        // 0-100%
    val ramAvailable: Long,     // MB
    val batteryTemp: Float,     // °C
    val isCharging: Boolean     // Power status
)
```

**Key Functions**:

| Function | Source | Purpose |
|----------|--------|---------|
| `readCpuStats()` | /proc/stat | Raw CPU timing |
| `calculateCpuUsage()` | Delta calculation | CPU percentage |
| `readRamUsage()` | ActivityManager | Memory percentage |
| `readAvailableRam()` | ActivityManager | Free memory in MB |
| `readGpuFrequency()` | /sys/class/kgsl/ | Current GPU MHz |
| `readGpuUsage()` | GPU freq ratio | GPU percentage |
| `readBatteryTemperature()` | BatteryManager | Temperature in °C |
| `isDeviceCharging()` | BatteryManager | Charging status |

**CPU Calculation Algorithm**:
```
Previous sample: idle_p, total_p
Current sample:  idle_c, total_c

total_delta = total_c - total_p
idle_delta = idle_c - idle_p
busy_delta = total_delta - idle_delta

usage% = (busy_delta / total_delta) * 100
```

### 5. MonitoringService.kt

**Purpose**: Background monitoring without UI

**Lifecycle**:
- `onStartCommand()`: Starts monitoring loop
- `startMonitoring()`: Periodic system health checks
- `onDestroy()`: Cleanup coroutine scope

**Use Cases**:
- Future: Auto-optimization based on metrics
- Power management in background

## Data Flow

### Initialization Flow

```
App Start
  ↓
SplashActivity.onCreate()
  ├─ Check ROOT (RootCommand.isRootAvailable)
  ├─ Update UI status
  └─ Launch MainActivity
       ↓
MainActivity.onCreate()
  ├─ LaunchedEffect #1: Check ROOT
  │    └─ Set rootReady state
  │
  ├─ LaunchedEffect #2: Start monitoring loop
  │    └─ Every 1 second:
  │         ├─ Read CPU stats
  │         ├─ Call SystemMonitor.getMetrics()
  │         └─ Update metrics state
  │
  └─ Render initial UI
```

### Performance Optimization Flow

```
User clicks "FPS Button"
  ↓
Button onClick handler
  ├─ Update actionStatus to "جاري تطبيق..."
  ├─ Launch coroutine:
  │    ├─ Switch to Dispatchers.IO
  │    ├─ Call RootCommand.lockFPS(fps)
  │    │    └─ Execute via ProcessBuilder("su", "-c", ...)
  │    └─ Update actionStatus to "تم تطبيق بنجاح"
  │
  └─ UI re-renders with new status
```

## Performance Considerations

### Memory Optimization
- `LazyColumn` for scrolling (only renders visible items)
- State management with `remember` (local to composable)
- Efficient data class usage

### CPU Optimization
- Coroutine-based async execution (non-blocking)
- 1-second monitoring interval (minimal overhead)
- Efficient regex split for /proc/stat parsing

### Responsiveness
- `withContext(Dispatchers.IO)` for ROOT commands
- No blocking operations on main thread
- Real-time status updates

## Permission Model

```
AndroidManifest.xml Permissions:
  ├─ android.permission.FOREGROUND_SERVICE
  ├─ android.permission.FOREGROUND_SERVICE_SPECIAL_USE
  └─ android.permission.PACKAGE_USAGE_STATS

Runtime Operations:
  ├─ Read /proc/stat (no permission needed)
  ├─ Read /sys/class/kgsl/ (ROOT required)
  ├─ Execute shell commands (ROOT required)
  └─ Access BatteryManager (ActivityManager API)
```

## Error Handling

### ROOT Command Execution
```kotlin
try {
    ProcessBuilder("su", "-c", command).start()
    return output if exitCode == 0
} catch (e: Exception) {
    return null  // Command failed
}
```

### Graceful Degradation
- App functions in limited mode without ROOT
- FPS buttons disabled without ROOT
- Advanced settings read-only without ROOT
- Status shows "محدود - بدون ROOT" when no access

## Security Considerations

1. **ROOT Verification**: `id` command returns uid=0 only with ROOT
2. **Process Safety**: `redirectErrorStream(true)` for error handling
3. **No Data Persistence**: No sensitive data stored locally
4. **Command Validation**: All commands are predefined (no user input injection)

## Extensibility Points

1. **New Metrics**: Add to `SystemMetrics` data class
2. **New Optimizations**: Add functions to `RootCommand` object
3. **New UI Sections**: Add Compose cards to `RedzonApp()`
4. **Custom Profiles**: Create new functions in `RootCommand` (like `balancedMode()`)

## Testing Checklist

- [ ] ROOT check works correctly
- [ ] Metrics update every second
- [ ] FPS locking changes system settings
- [ ] CPU governor changes successfully
- [ ] GPU frequency locks
- [ ] RAM optimization executes
- [ ] Thermal throttling toggle works
- [ ] UI responsive at all times
- [ ] No crashes on repeated usage
- [ ] Works on multiple device types

## Future Enhancements

1. **Game Detection**: Auto-apply optimizations when game detected
2. **Thermal Monitoring**: Automatic throttling on high temp
3. **Battery Impact**: Show estimated battery drain
4. **Custom Profiles**: User-created optimization sets
5. **History Tracking**: Log of all applied optimizations
6. **Widget Support**: Home screen widget for quick access
7. **System Notifications**: Alert on thermal issues
8. **Performance Benchmarking**: Built-in FPS counter
