# VERITAS TECH 🛡️
### *An AI That Double-Checks Its First Answer*
**Hackathon Decision Support Assistant for Consumer Electronics & Gadget Purchases**

---

## 🚀 Quick Start (One-Click)

### Option 1: Double-Click Startup
Simply double-click:
```bash
start_all.bat
```
This automatically launches:
- **FastAPI Backend**: `http://127.0.0.1:8001`
- **React Frontend**: `http://localhost:5173` (or `http://localhost:5174`)

---

### Option 2: Manual Terminal Commands

#### 1. Backend (Terminal 1)
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

#### 2. Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```

Open your browser to: **`http://localhost:5174`** (or `http://localhost:5173`).

---

## 🎯 The Hackathon Problem Solved

Standard AI chatbots answer incomplete prompts with immediate, unjustified confidence:
> *"I need a laptop for 4K video editing under $1200"*  
> ➔ Standard AI: *"Get the MacBook Air M2 8GB! It's super fast and has Apple Silicon!"*

**The Costly Mistake**:
The customer buys it, only to discover:
1. **Thermal Choking**: Fanless passive cooling drops clocks by 35% on multi-layer timelines.
2. **Memory Paging Trap**: 8GB unified RAM causes severe scratch disk thrashing.
3. **No Discrete GPU**: No CUDA acceleration for DaVinci Resolve or Premiere Pro.

### How Veritas Double-Checks:
1. **Stage 1 (First-Pass)**: Proposes initial option, logs implicit assumptions, sets initial baseline confidence.
2. **Stage 2 (Red-Team Challenge)**: Argues *against* its own first answer, audits cooling/RAM/display, asks focused **Socratic Counter-Questions** with interactive choice chips.
3. **Stage 3 (Reconciliation)**: Shifts confidence before/after, outputs an auditable verdict: **`AGREES`**, **`CHANGED`**, or **`UNCERTAIN`**.
4. **Baseline Comparison**: Side-by-side card contrasting Single-Pass AI vs Veritas Double-Check AI.

---

## 🧪 Judge Showcase Scenarios (1-Click Test in UI)

Top of the screen features 4 benchmark presets ready for judges:
- **The 4K Video Editor Trap**: First-pass MacBook Air 8GB red-teamed for thermal choke & memory swap ➔ Pivots to ASUS ROG Zephyrus G14 (RTX 4060, OLED). Verdict: **`CHANGED`**.
- **The College CS Student Dilemma**: First-pass Legion Pro 5 (2.5kg brick, 3.8h battery) ➔ Pivots to 1.5kg Zephyrus G14 with 8.5h battery. Verdict: **`CHANGED`**.
- **The Road Warrior Stress-Test**: ThinkPad X1 Carbon Gen 12 stress-tested and confirmed optimal. Verdict: **`AGREES`**.
- **The Budget Machine Learning Paradox**: Local LLM training under $750 identified as mathematically impossible on 6GB VRAM. Confidence drops to 42%. Verdict: **`UNCERTAIN`**.

---

## 📊 Automated Verification Tests

Run the built-in test suite:
```powershell
cd backend
python test_api.py
```
Outputs:
```text
--- 1. Testing /api/health --- Status: 200 (15 products loaded)
--- 2. Testing /api/scenarios --- Loaded 4 scenarios
--- 3. Testing /api/products --- Loaded 15 products
--- 4. Testing /api/evaluate --- Verdict: CHANGED (0.76 -> 0.92)
--- 5. Testing /api/reconcile-answers --- Dynamic recalculation confirmed
All API tests PASSED perfectly!
```

---

## 📁 Repository Structure
```
d:\ting\
├── backend\
│   ├── database\
│   │   └── products.json          # 15+ benchmarked laptops with telemetry & gotchas
│   ├── engine\
│   │   ├── verifier.py            # 3-Stage Verification Engine & Baseline Comparator
│   │   └── scenarios.py           # 4 Pre-packaged Judge Showcase Scenarios
│   ├── main.py                    # FastAPI server (Endpoints on port 8001)
│   └── test_api.py                # Automated endpoint test suite
├── frontend\
│   ├── src\
│   │   ├── components\
│   │   │   ├── Navbar.jsx                  # Header with hackathon badge & action triggers
│   │   │   ├── JudgePresetBar.jsx          # 1-Click judge test scenarios
│   │   │   ├── DoubleCheckStepper.jsx      # Live 3-stage progress indicator
│   │   │   ├── ConfidenceShiftMeter.jsx    # Visual before/after delta gauge
│   │   │   ├── ProductCard.jsx             # Hardware spec cards with memory & gotchas
│   │   │   ├── RedTeamCritique.jsx         # Devil's Advocate audit accordion
│   │   │   ├── SocraticCounterQuestions.jsx# Interactive customer chip questions
│   │   │   ├── BaselineComparisonModal.jsx # Head-to-Head Single-Pass vs Veritas
│   │   │   ├── ProductCatalogModal.jsx     # Spec Explorer Drawer
│   │   │   └── ArchitectureModal.jsx       # System Architecture & State Machine
│   │   ├── App.jsx                         # Main reactive interface
│   │   └── index.css                       # Obsidian slate theme styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── HACKATHON_REPORT.md            # Complete hackathon project report
├── README.md                      # Project documentation
├── run_backend.bat                # Start backend
├── run_frontend.bat               # Start frontend
└── start_all.bat                  # One-click start all services
```
