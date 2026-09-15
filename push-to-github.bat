@echo off
title Push Water Heater Website to GitHub
cd /d "%~dp0"
echo ===================================================
echo Pushing your website to GitHub...
echo ===================================================
echo.
git push -u origin main
echo.
echo ===================================================
echo Done! You can close this window now.
echo ===================================================
pause
