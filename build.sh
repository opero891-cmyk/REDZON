#!/bin/bash

# REDZON Project Build and Test Script
# Run this script to build, test, and deploy the app

set -e

PROJECT_NAME="REDZON"
PACKAGE_NAME="com.redzon.app"
BUILD_DIR="app/build/outputs/apk"

echo "===================================="
echo "$PROJECT_NAME - Build & Deploy Tool"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# Step 1: Clean
print_info "Cleaning project..."
./gradlew clean

# Step 2: Build
print_info "Building Debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    print_status "Build successful!"
else
    print_error "Build failed!"
    exit 1
fi

# Step 3: Check APK exists
if [ -f "$BUILD_DIR/debug/app-debug.apk" ]; then
    print_status "APK created: app/build/outputs/apk/debug/app-debug.apk"
else
    print_error "APK not found!"
    exit 1
fi

# Step 4: Check for connected devices
print_info "Checking connected devices..."
DEVICE_COUNT=$(adb devices | grep -c "device$")

if [ $DEVICE_COUNT -eq 0 ]; then
    print_error "No connected devices found!"
    print_info "Connect a device via USB or start an emulator"
    exit 1
fi

print_status "$DEVICE_COUNT device(s) found"

# Step 5: Install APK
print_info "Installing app on device..."
adb install -r "$BUILD_DIR/debug/app-debug.apk"

if [ $? -eq 0 ]; then
    print_status "App installed successfully!"
else
    print_error "Installation failed!"
    exit 1
fi

# Step 6: Launch app
print_info "Launching application..."
adb shell am start -n "$PACKAGE_NAME/.SplashActivity"

# Step 7: Show logs
print_status "Setup complete! Showing application logs..."
print_info "Press Ctrl+C to stop viewing logs"
sleep 2
adb logcat | grep REDZON

echo ""
print_status "Done! The app should now be running on your device."
