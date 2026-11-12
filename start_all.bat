@echo off
echo ========================================================
echo Starting Veritas Tech Decision Assistant (Full Stack)
echo ========================================================
start "Veritas Backend [FastAPI:8003]" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 127.0.0.1 --port 8003 --reload"
timeout /t 2 /nobreak >nul
start "Veritas Frontend [Vite:5173]" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Both services launched!
echo Backend API: http://127.0.0.1:8003
echo Frontend App: http://localhost:5173 (or 5174 if 5173 is occupied)
