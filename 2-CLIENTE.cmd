@echo off
chcp 65001 >nul
title CLIENTE FRONTEND - Porta 5173
color 0B
cd /d "%~dp0client"
echo.
echo ╔════════════════════════════════════════╗
echo ║   CLIENTE FRONTEND INICIANDO...       ║
echo ║        Porta: 5173                     ║
echo ╚════════════════════════════════════════╝
echo.
npm run dev
pause

