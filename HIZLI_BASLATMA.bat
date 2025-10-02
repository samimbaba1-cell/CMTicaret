@echo off
echo 🚀 CMTicaret E-Ticaret Sitesi Başlatılıyor...
echo.

echo 📦 Backend başlatılıyor...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 📦 Frontend başlatılıyor...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ✅ Site hazır!
echo 🌐 Frontend: http://localhost:3001
echo 🔧 Backend: http://localhost:3000
echo.
echo Tarayıcıda http://localhost:3001 adresine git!
echo.
pause
