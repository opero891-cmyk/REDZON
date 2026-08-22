@echo off
REM REDZON Project Build and Deploy Script (Windows)
REM Run this script to build, test, and deploy the app

setlocal enabledelayedexpansion

set PROJECT_NAME=REDZON
set PACKAGE_NAME=com.redzon.app
set BUILD_DIR=app\build\outputs\apk

echo ====================================
echo %PROJECT_NAME% - Build ^& Deploy Tool
echo ====================================
echo.

REM Check if gradle exists
if not exist "gradlew.bat" (
    echo Error: gradlew.bat not found!
    echo Make sure you're in the project root directory
    exit /b 1
)

REM Step 1: Clean
echo [i] Cleaning project...
call gradlew clean
if errorlevel 1 (
    echo Error: Clean failed!
    exit /b 1
)
echo [+] Clean complete!
echo.

REM Step 2: Build
echo [i] Building Debug APK...
call gradlew assembleDebug
if errorlevel 1 (
    echo Error: Build failed!
    exit /b 1
)
echo [+] Build successful!
echo.

REM Step 3: Check APK
if not exist "%BUILD_DIR%\debug\app-debug.apk" (
    echo Error: APK not found at %BUILD_DIR%\debug\app-debug.apk
    exit /b 1
)
echo [+] APK created: %BUILD_DIR%\debug\app-debug.apk
echo.

REM Step 4: Check devices
echo [i] Checking connected devices...
for /f %%A in ('adb devices ^| find /c "device"') do set DEVICE_COUNT=%%A

if %DEVICE_COUNT% lss 1 (
    echo Error: No connected devices found!
    echo Please connect a device via USB or start an emulator
    exit /b 1
)
echo [+] Device found! Proceeding with installation...
echo.

REM Step 5: Install APK
echo [i] Installing app on device...
adb install -r "%BUILD_DIR%\debug\app-debug.apk"
if errorlevel 1 (
    echo Error: Installation failed!
    exit /b 1
)
echo [+] App installed successfully!
echo.

REM Step 6: Launch app
echo [i] Launching application...
adb shell am start -n "%PACKAGE_NAME%/.SplashActivity"
if errorlevel 1 (
    echo Error: Failed to launch app!
    exit /b 1
)
echo.

REM Step 7: Show logs
echo [+] Setup complete!
echo [i] Showing application logs (Press Ctrl+C to stop)...
timeout /t 2 /nobreak
adb logcat | find "REDZON"

endlocal
exit /b 0
