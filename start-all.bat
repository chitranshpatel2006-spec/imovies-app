@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
echo ========================================================
echo   Launching IMovies Platform (Server + Client)
echo ========================================================
start "IMovies Backend Server" cmd /k "set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH% & cd server & node server.js"
timeout /t 2 >nul
start "IMovies Frontend Client" cmd /k "set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH% & cd client & npm run dev"
echo IMovies is launching!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
