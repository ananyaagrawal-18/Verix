"""
FastAPI Server for Veritas Tech - Adversarial Double-Checking AI Decision Assistant
Stealth Pitch Black & Red Edition
"""

import os
import json

# Auto-load .env file if present
for env_dir in [os.path.dirname(__file__), os.path.join(os.path.dirname(__file__), "..")]:
    env_file = os.path.join(env_dir, ".env")
    if os.path.exists(env_file):
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip("'").strip('"')
                    if k and v and k not in os.environ:
                        os.environ[k] = v

from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine.verifier import (
    ProductCatalog,
    AdversarialAuditor,
    call_gemini_api,
    call_groq_api,
    call_llm_api
)
from engine.scenarios import get_all_scenarios, get_scenario_by_id

app = FastAPI(
    title="Veritas Tech API",
    description="Adversarial decision assistant that interrogates contradictions, assumptions, and verifies before recommending.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuditRequest(BaseModel):
    query: str
    category: Optional[str] = "all"
    clarified_specs: Optional[Dict[str, str]] = None
    api_key: Optional[str] = None

class TestApiKeyRequest(BaseModel):
    api_key: str

class ConsultRequest(BaseModel):
    category: str = "laptop"
    purpose: str = ""
    budget: str = ""
    priority: str = ""
    raw_query: str = ""
    api_key: Optional[str] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "Veritas Tech - Stealth Adversarial Auditor",
        "products_count": len(ProductCatalog.get_all()),
        "version": "2.0.0"
    }

@app.post("/api/test-key")
def test_key(req: TestApiKeyRequest):
    if not req.api_key.strip():
        return {"valid": False, "message": "API key is empty"}
    res = call_llm_api("Verify connection. Reply in one short sentence: RECHECK-X AI Live Connection Verified.", req.api_key)
    if res:
        key_type = "Groq Cloud LLM" if req.api_key.strip().startswith("gsk_") else "Google Gemini API"
        return {"valid": True, "message": f"{key_type} connected successfully!", "response": res.strip()}
    return {"valid": False, "message": "Failed to connect to LLM API. Please check key validity and network."}

@app.get("/api/products")
def get_products(category: Optional[str] = None):
    products = ProductCatalog.get_all()
    if category:
        return [p for p in products if p.get("category") == category]
    return products

@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    product = ProductCatalog.find_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/scenarios")
def get_scenarios():
    return get_all_scenarios()

@app.post("/api/audit")
def audit_purchase(req: AuditRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return AdversarialAuditor.audit(
        query=req.query,
        category=req.category,
        clarified_specs=req.clarified_specs,
        api_key=req.api_key
    )

@app.post("/api/consult")
def consult_purchase(req: ConsultRequest):
    query_composed = req.raw_query or f"{req.category} for {req.purpose} budget {req.budget} {req.priority}"
    return AdversarialAuditor.audit(
        query=query_composed,
        clarified_specs={"priority": req.priority} if req.priority else None,
        api_key=req.api_key
    )

@app.post("/api/evaluate")
def evaluate_purchase(req: AuditRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return AdversarialAuditor.audit(
        query=req.query,
        clarified_specs=req.clarified_specs,
        api_key=req.api_key
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
