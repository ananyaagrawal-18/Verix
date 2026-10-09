# RECHECK-X / Veritas Tech — AI Decision Verification MVP

Adversarial system that challenges its own product recommendations: bias detection, claim verification, risk analysis, alternative comparison, and transparent final status (AGREES / CHANGED / UNCERTAIN).

## Stack

- **Backend:** Python FastAPI, SQLite, product catalog JSON, optional Groq/Gemini LLM
- **Frontend:** React 19 + Vite + Tailwind CSS 4

## Setup

```bash
# Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # add GROQ_API_KEY or GEMINI_API_KEY if desired
python main.py            # http://0.0.0.0:8002

# Frontend (new terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173 (proxies /api → :8002)
```

## Demo credentials

- Email: `demo@recheckx.ai`
- Password: `demo1234`

## Implemented MVP features

1. Landing page  
2. Login / registration (SQLite sessions)  
3. User dashboard + decision flow  
4. Create decision / submit query  
5. Initial recommendation  
6. Claim extraction & verification statuses  
7. Bias detection dashboard  
8. Challenge This Decision  
9. Risk analysis  
10. Alternative comparison (weighted, transparent)  
11. Final decision status (AGREES / CHANGED / UNCERTAIN)  
12. Evidence explorer  
13. Full audit trail  
14. Decision history (local + server persistence)  
15. Report export API (`GET /api/decisions/{id}/export`)  
16. Settings + Limitations & Reliability page  
17. Responsive UI  

## Limitations (honest)

See in-app **Limitations & Reliability** or `GET /api/limitations`.  
This system supports decisions; it does not guarantee correctness.

## API highlights

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health + feature list |
| POST | `/api/audit` | Full adversarial audit |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/decisions` | History |
| GET | `/api/limitations` | Limitations payload |

## Tests

```bash
cd backend
python -c "from engine.verifier import AdversarialAuditor; print(AdversarialAuditor.audit('laptop under 50k')['verdict'])"
```
