@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
echo Starting IMovies Server...
cd server
node server.js
pause
