@echo off
cd /d "C:\Users\NCC-2026\Desktop\Android"
echo ========== GIT STATUS ==========
git status
echo.
echo ========== GIT LOG ==========
git log -1 --oneline
echo.
echo ========== ATTEMPTING PUSH ==========
git push origin main -v
echo.
echo ========== PUSH COMPLETE ==========
pause
