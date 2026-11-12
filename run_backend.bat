@echo off
echo ========================================================
echo Starting Veritas Tech - FastAPI Backend (Port 8003)
echo ========================================================
cd /d "%~dp0backend"
python -m uvicorn main:app --host 127.0.0.1 --port 8003 --reload
