@echo off
title NCTU Tra Cuu System - Running NestJS and Next.js
echo ========================================================
echo    HE THONG TRA CUU VAN BANG & CHUNG CHI - DH NAM CAN THO
echo    - Backend: NestJS (http://localhost:3001)
echo    - Frontend: Next.js (http://localhost:3000)
echo ========================================================

start "NCTU Backend (NestJS)" cmd /k "cd backend && npm run start"
start "NCTU Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo Dang khoi dong ca 2 ung dung...
echo Mo trinh duyet tai: http://localhost:3000
pause
