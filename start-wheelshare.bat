@echo off
echo Starting WheelShare Full-Stack Application...
echo.

echo Starting Backend API...
start "WheelShare API" cmd /k "cd /d C:\Users\sumit\OneDrive\Desktop\CDAC\WheelShare2\WheelShare\Backend\CabBookingSystem\CabBooking.API && dotnet run"

timeout /t 5

echo Starting Admin Frontend...
start "Admin Frontend" cmd /k "cd /d C:\Users\sumit\OneDrive\Desktop\CDAC\WheelShare2\frontend\wheelshare-admin && npm start"

timeout /t 3

echo Starting Customer Frontend...
start "Customer Frontend" cmd /k "cd /d C:\Users\sumit\OneDrive\Desktop\CDAC\WheelShare2\frontend\wheelshare-customer && npm start"

timeout /t 3

echo Starting Driver Frontend...
start "Driver Frontend" cmd /k "cd /d C:\Users\sumit\OneDrive\Desktop\CDAC\WheelShare2\frontend\wheelshare-driver && npm start"

echo.
echo All applications are starting...
echo.
echo Access URLs:
echo - Backend API: http://localhost:5052
echo - Admin Panel: http://localhost:3000
echo - Customer App: http://localhost:3001
echo - Driver App: http://localhost:3002
echo.
echo Press any key to exit...
pause