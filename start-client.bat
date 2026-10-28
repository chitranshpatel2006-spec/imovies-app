@echo off
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
echo Starting IMovies Client...
cd client
npm run dev
pause
