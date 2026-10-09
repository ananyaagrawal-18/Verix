"""
Alternative Comparison Engine
Compares original recommendation with alternatives using transparent, adjustable criteria.
"""

from typing import Dict, Any, List, Optional


DEFAULT_WEIGHTS = {
    "price_budget_fit": 0.25,
    "specs_performance": 0.25,
    "use_case_fit": 0.20,
    "evidence_reliability": 0.15,
    "portability_battery": 0.15,
}


def _score_price(product: Dict[str, Any], budget_inr: Optional[int]) -> float:
    price = float(product.get("price") or 0)
    inr = price * 83
    if not budget_inr or budget_inr <= 0:
        return 0.6
    if inr <= budget_inr * 0.7:
        return 1.0
    if inr <= budget_inr:
        return 0.85
    if inr <= budget_inr * 1.1:
        return 0.4
    return 0.1


def _score_specs(product: Dict[str, Any]) -> float:
    ram = int(product.get("ram_gb") or 0)
    score = 0.4
    if ram >= 32:
        score += 0.3
    elif ram >= 16:
        score += 0.2
    elif ram >= 8:
        score += 0.1
    if product.get("gpu") and "integrated" not in str(product.get("gpu")).lower():
        score += 0.2
    if product.get("gpu_tgp_w") and int(product.get("gpu_tgp_w") or 0) >= 100:
        score += 0.1
    return min(1.0, score)


def _score_portability(product: Dict[str, Any]) -> float:
    w = product.get("weight_kg")
    bat = str(product.get("battery") or "").lower()
    score = 0.5
    if w is not None:
        if float(w) <= 1.2:
            score += 0.3
        elif float(w) <= 1.6:
            score += 0.15
        elif float(w) >= 2.5:
            score -= 0.2
    if any(x in bat for x in ("15", "18", "20", "all-day", "long")):
        score += 0.2
    return max(0.0, min(1.0, score))


def _score_evidence(product: Dict[str, Any]) -> float:
    # Catalog completeness proxy
    keys = ["cpu", "gpu", "ram_gb", "display", "battery", "weight_kg", "pitfalls", "strengths"]
    filled = sum(1 for k in keys if product.get(k))
    return filled / len(keys)


def compare_alternatives(
    primary: Dict[str, Any],
    candidates: List[Dict[str, Any]],
    query: str,
    budget_inr: Optional[int] = None,
    weights: Optional[Dict[str, float]] = None,
    max_alts: int = 3,
) -> Dict[str, Any]:
    """
    Build a comparison table for primary + up to max_alts alternatives.
    If insufficient data, explain instead of inventing products.
    """
    w = dict(DEFAULT_WEIGHTS)
    if weights:
        w.update({k: float(v) for k, v in weights.items() if k in w})
    # normalize
    total_w = sum(w.values()) or 1.0
    w = {k: v / total_w for k, v in w.items()}

    pool = []
    seen = {primary.get("id")}
    for c in candidates:
        if c and c.get("id") not in seen:
            pool.append(c)
            seen.add(c.get("id"))
        if len(pool) >= max_alts:
            break

    if not pool:
        return {
            "primary": primary,
            "alternatives": [],
            "weights": w,
            "rows": [],
            "note": "Insufficient verified alternatives in catalog for a meaningful comparison. Expand the product database or relax filters.",
            "sufficient_data": False,
        }

    def row_for(prod: Dict[str, Any], is_primary: bool = False) -> Dict[str, Any]:
        s_price = _score_price(prod, budget_inr)
        s_specs = _score_specs(prod)
        s_port = _score_portability(prod)
        s_evid = _score_evidence(prod)
        # use-case fit: simple heuristic from query keywords
        s_use = 0.55
        ql = (query or "").lower()
        if any(x in ql for x in ("edit", "video", "4k", "render", "3d")) and prod.get("gpu"):
            s_use += 0.25
        if any(x in ql for x in ("travel", "light", "ultrabook", "portable")) and (prod.get("weight_kg") or 99) <= 1.5:
            s_use += 0.2
        if any(x in ql for x in ("game", "gaming")) and prod.get("gpu_tgp_w"):
            s_use += 0.2
        s_use = min(1.0, s_use)

        overall = (
            w["price_budget_fit"] * s_price
            + w["specs_performance"] * s_specs
            + w["use_case_fit"] * s_use
            + w["evidence_reliability"] * s_evid
            + w["portability_battery"] * s_port
        )
        price = float(prod.get("price") or 0)
        return {
            "id": prod.get("id"),
            "name": prod.get("name"),
            "brand": prod.get("brand"),
            "is_primary": is_primary,
            "price_usd": price,
            "price_inr_approx": int(round(price * 83)),
            "budget_fit": "Within budget" if budget_inr and price * 83 <= budget_inr else (
                "Over budget" if budget_inr else "Budget not specified"
            ),
            "specs_summary": {
                "cpu": prod.get("cpu"),
                "gpu": prod.get("gpu"),
                "ram_gb": prod.get("ram_gb"),
                "display": prod.get("display"),
                "battery": prod.get("battery"),
                "weight_kg": prod.get("weight_kg"),
            },
            "pros": (prod.get("strengths") or [])[:3],
            "cons": (prod.get("pitfalls") or [])[:3],
            "missing_info": [
                k for k in ("warranty", "ports", "thermals") if not prod.get(k)
            ],
            "scores": {
                "price_budget_fit": round(s_price, 2),
                "specs_performance": round(s_specs, 2),
                "use_case_fit": round(s_use, 2),
                "evidence_reliability": round(s_evid, 2),
                "portability_battery": round(s_port, 2),
                "overall": round(overall, 3),
            },
            "bias_indicators": [],
        }

    rows = [row_for(primary, True)] + [row_for(a) for a in pool]

    return {
        "primary": primary,
        "alternatives": pool,
        "weights": w,
        "rows": rows,
        "note": "Scores use transparent, user-adjustable weights. They are relative ranking aids, not absolute truth.",
        "sufficient_data": True,
        "criteria_labels": {
            "price_budget_fit": "Price & budget fit",
            "specs_performance": "Specifications & performance",
            "use_case_fit": "Performance for intended use",
            "evidence_reliability": "Reliability of available evidence",
            "portability_battery": "Portability & battery",
        },
    }
