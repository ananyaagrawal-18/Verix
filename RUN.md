# VERIX — Quick Start (Windows / Mac / Linux)

## Path example (Windows)
```
C:\Users\HP\Documents\ting
```

## 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## What was fixed in this build
- **Hover**: Full datasheet stays open while cursor is on image OR popup (no layout jump)
- **Hover details include**: Brand/OEM, Model, Category, Device Type, HQ, Origin/Assembly, Warranty, CPU, GPU, TGP, RAM, RAM type, expandable?, Storage, Display (size/res/Hz/panel/nits/gamut), Battery, Thermals, Ports, Buy links (Amazon/Flipkart/Croma)
- **Settings + Profile**: Cleaner profile dropdown with stats columns + more menu items (Settings, Dashboard, Limitations, Account, Clear History)
- **Budget laptops under ₹40k**: Dataset expanded (68 products total, ~28 under 40k INR)
- **Data tab**: Upload media/files from device
- **Machine tab**: LLM connect + category filter
- **Currency**: ₹ INR everywhere
