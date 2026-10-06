@echo off
title NCTU Tra Cuu System - Running NestJS and Next.js
echo ========================================================
echo    HE THONG TRA CUU VAN BANG & CHUNG CHI - DH NAM CAN THO
echo    - Backend: NestJS (http://localhost:3001)
echo    - Frontend: Next.js (http://localhost:3000)
echo ========================================================
echo.

rem Kiem tra va cai dat dependencies cho backend neu chua co
if not exist "backend\node_modules\" (
    echo [Backend] Phat hien chua cai thu vien. Dang chay npm install...
    cd backend
    call npm install
    call npm run build
    cd ..
) else if not exist "backend\dist\" (
    echo [Backend] Phat hien chua co ban build. Dang bien dich TypeScript...
    cd backend
    call npm run build
    cd ..
)

rem Kiem tra va cai dat dependencies cho frontend neu chua co
if not exist "frontend\node_modules\" (
    echo [Frontend] Phat hien chua cai thu vien. Dang chay npm install...
    cd frontend
    call npm install
    cd ..
)

echo Dang khoi dong Backend va Frontend tren 2 cua so rieng biet...
start "NCTU Backend (NestJS - Port 3001)" cmd /k "cd backend && npm run start"
start "NCTU Frontend (Next.js - Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo    Khoi dong thanh cong!
echo    Vui long mo trinh duyet truy cap: http://localhost:3000
echo ========================================================
pause
