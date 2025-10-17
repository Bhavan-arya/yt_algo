@echo off
echo Starting YouTube Algorithm Analyzer...
echo.

echo Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

echo Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Starting the application...
echo Server will run on http://localhost:5000
echo Client will run on http://localhost:3000
echo.

call npm run dev-all

pause
