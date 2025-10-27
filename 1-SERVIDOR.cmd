@echo off
chcp 65001 >nul
title SERVIDOR BACKEND - Porta 3001
color 0A
cd /d "%~dp0server"
echo.
echo ╔════════════════════════════════════════╗
echo ║   SERVIDOR BACKEND INICIANDO...       ║
echo ║        Porta: 3001                     ║
echo ╚════════════════════════════════════════╝
echo.
node index.js
pause

