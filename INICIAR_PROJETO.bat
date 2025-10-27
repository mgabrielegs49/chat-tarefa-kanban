@echo off
chcp 65001 >nul
color 0A
title Chat + TaskBoard - Iniciando Projeto

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║        INICIANDO CHAT + TASKBOARD EM TEMPO REAL          ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js não encontrado!
    echo Por favor, instale o Node.js em https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Verificando Node.js...
node --version
echo.

echo [2/4] Iniciando SERVIDOR BACKEND (porta 3001)...
start "🖥️ SERVIDOR BACKEND - Porta 3001" cmd /k "cd /d "%~dp0server" && echo Iniciando servidor... && node index.js"
timeout /t 2 /nobreak >nul
echo.

echo [3/4] Iniciando CLIENTE FRONTEND (porta 5173)...
start "🌐 CLIENTE FRONTEND - Porta 5173" cmd /k "cd /d "%~dp0client" && echo Iniciando cliente... && npm run dev"
timeout /t 2 /nobreak >nul
echo.

echo [4/4] Aguardando servidores iniciarem...
timeout /t 5 /nobreak >nul
echo.

echo ╔═══════════════════════════════════════════════════════════╗
echo ║                   SERVIDORES INICIADOS!                   ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║  Backend:  http://localhost:3001                          ║
echo ║  Frontend: http://localhost:5173                          ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║  Abra o navegador em: http://localhost:5173               ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:5173

echo.
echo Para fechar o projeto, feche as janelas do servidor e cliente.
echo.
pause

