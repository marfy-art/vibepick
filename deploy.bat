@echo off
set GIT_PATH="C:\Users\marfy\AppData\Local\GitHubDesktop\app-3.5.7\resources\app\git\cmd\git.exe"

echo [1/3] Staging changes...
%GIT_PATH% add .

echo [2/3] Committing changes...
%GIT_PATH% commit -m "Development update - %date% %time%"

echo [3/3] Pushing to GitHub...
%GIT_PATH% push origin dev-workspace

echo.
echo ===============================
echo Deployment Successful!
echo ===============================
pause
