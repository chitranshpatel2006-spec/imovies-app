@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo        Push IMovies Platform to GitHub
echo ========================================================
echo.

git remote -v | findstr "origin" >nul
if %ERRORLEVEL% equ 0 (
    echo Remote 'origin' is already configured:
    git remote -v
    echo.
    echo Pushing to main branch...
    git push -u origin main
    goto end
)

echo Please enter your GitHub repository URL:
echo (Example: https://github.com/chitranshpatel2006-spec/imovies-app.git)
echo.
set /p REPO_URL="Repository URL: "

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL provided. Aborting.
    goto end
)

echo Adding remote origin %REPO_URL%...
git remote add origin %REPO_URL%
git branch -M main

echo Pushing codebase to GitHub...
git push -u origin main

:end
echo.
pause
