# RECHECK-X (Veritas AI) 🛡️
### *An AI Decision Intelligence Assistant That Double-Checks Its First Answer*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fananyaagrawal-18%2FVerix&env=GROQ_API_KEY&envDescription=Your%20Groq%20Cloud%20API%20Key%20from%20console.groq.com%2Fkeys&project-name=verix-ai)
[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.14-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20TailwindCSS-61DAFB.svg)](https://react.dev/)
[![Groq Cloud](https://img.shields.io/badge/LLM-Groq%20Cloud%20(qwen%2Fqwen3.8--27b)-F55036.svg)](https://groq.com/)
[![Wikipedia API](https://img.shields.io/badge/Data-Wikipedia%20Knowledge%20Graph%20REST%20API-grey.svg)](https://en.wikipedia.org/api/rest_v1/)

> **Problem Statement**: AI often gives a confident first answer, even when the proof is weak or a better option was missed. When the decision is about money, hardware, or operations, an unchecked first answer can be costly. RECHECK-X makes AI more careful, not just more confident.

---

## 🌟 Key Features

1. **3-Stage Autonomous Adversarial Auditing**:
   - **Stage 1 (First-Pass)**: Proposes a baseline recommendation with initial confidence score.
   - **Stage 2 (Red-Team Challenge)**: Argues *against* its own first answer, searching for physical contradictions, thermal limits, soldered memory traps, and overpriced alternatives.
   - **Stage 3 (Reconciled Verdict)**: Dynamic confidence delta recalculation resulting in an auditable verdict: **`AGREES`**, **`CHANGED`**, or **`UNCERTAIN`**.
2. **Real-World Live Telemetry (Dual Engine)**:
   - **Groq Cloud LLM (`qwen/qwen3.8-27b`)**: Ultra-fast (~300 tokens/sec) adversarial reasoning producing 3-point technical audits (Blindspots & Traps Caught, Hardware Superiority Breakdown, Buyer Regret Prevention).
   - **Wikipedia Knowledge Graph REST API**: Live real-world hardware verification without hallucinated claims.
3. **Interactive Socratic Red-Team Lab**:
   - Generates interactive counter-questions with 1-click option chips.
   - Dynamically recomputes the recommendation live when constraints change.
4. **Unified Dark & Light Themes**:
   - High-tech pitch black (`#080B11`) stealth aesthetic and crisp slate-50 (`#F8FAFC`) light mode with persistent theme switching.
5. **Unified Top Navigation Bar**:
   - Synchronized header across Landing Page, QC Dashboard, and Socratic Lab.

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm
- (Optional) Free Groq API key from [Groq Console](https://console.groq.com/keys)

### Option 1: One-Click Startup (Windows)
Double-click:
```bash
start_all.bat
```
This automatically launches:
- **Backend (FastAPI)**: `http://127.0.0.1:8003`
- **Frontend (Vite Dev Server)**: `http://localhost:5173`

---

### Option 2: Manual Terminal Startup

#### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env and paste your GROQ_API_KEY if desired
```

#### 2. Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8003 --reload
```

#### 3. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🎯 Real-World Benchmark Scenarios

| Scenario | Standard AI First-Pass | The Hidden Trap Caught | RECHECK-X Double-Check | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **4K DaVinci Video Editing** | MacBook Air M2 (8GB) | Fanless thermal throttle (-45% clocks) & 8GB swap memory lockup | **ASUS ROG Zephyrus G14** (OLED, Ryzen 9, RTX 4060) | **`CHANGED`** *(Saves $450)* |
| **Heavy Gaming Flagship** | Samsung Galaxy S24 Ultra | 256GB storage ceiling & conservative thermal envelope | **OnePlus 12** (16GB/512GB, Dual Cryo-Velocity VC) | **`CHANGED`** *(Saves $500)* |
| **Long-Haul ANC Audio** | Sony WH-1000XM5 | Verified dual processors, 30h battery, soft-fit leather | **Sony WH-1000XM5** (Certified Winner) | **`AGREES`** *(100% Match)* |

---

## 📁 Repository Structure

```
Verix/
├── backend/
│   ├── database/
│   │   └── products.json          # 23+ hardware products with verified thermal & memory telemetry
│   ├── engine/
│   │   ├── verifier.py            # Adversarial double-check auditor & Groq/Wikipedia live engine
│   │   └── scenarios.py           # Pre-packaged benchmark scenarios
│   ├── main.py                    # FastAPI application server (Port 8003)
│   └── test_api.py                # Automated backend test suite
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI widgets & gauges
│   │   ├── App.jsx                # Unified multi-view app (Landing, QC Dashboard, Socratic Lab)
│   │   └── index.css              # Custom styling & Dark/Light mode theme engine
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git exclusions (no secrets, no node_modules)
├── HACKATHON_REPORT.md            # Detailed architecture and engineering report
├── README.md                      # Project documentation
├── run_backend.bat                # Windows script to run backend
├── run_frontend.bat               # Windows script to run frontend
└── start_all.bat                  # One-click dual launcher
```

---

## 🧪 Testing

Run the automated test suite:
```bash
cd backend
python test_api.py
```

---

## 📄 License
MIT License. Created by [Ananya Agrawal](https://github.com/ananyaagrawal-18).
