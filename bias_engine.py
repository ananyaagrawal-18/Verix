"""
Bias Detection Engine for RECHECK-X / Veritas
Detects potential decision biases with evidence, severity, and recommended corrections.
Does not flag merely because a brand or price appears — requires reasoning evidence.
"""

from typing import Dict, Any, List, Optional


BIAS_TYPES = [
    "brand_bias",
    "price_bias",
    "popularity_bias",
    "confirmation_bias",
    "availability_bias",
    "recency_bias",
    "specification_bias",
    "source_bias",
    "preference_bias",
]


def _sev(level: str) -> str:
    return level if level in ("Low", "Medium", "High") else "Low"


def detect_biases(
    query: str,
    first_pick: Dict[str, Any],
    top_pick: Dict[str, Any],
    verdict: str,
    contradictions: List[str],
    assumptions: List[str],
    budget_inr: Optional[int],
    device_catalog: List[Dict[str, Any]],
    cheaper_balance: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """
    Return a list of bias findings. Each finding includes:
    type, severity, evidence, affected_claims, recommended_correction, status.
    """
    findings: List[Dict[str, Any]] = []
    q = (query or "").lower()
    fp = first_pick or {}
    tp = top_pick or {}
    brand_fp = (fp.get("brand") or "").lower()
    brand_tp = (tp.get("brand") or "").lower()
    price_fp = float(fp.get("price") or 0)
    price_tp = float(tp.get("price") or 0)

    # --- Brand bias ---
    premium_brands = {"apple", "sony", "bose"}
    if brand_fp in premium_brands and verdict == "CHANGED" and brand_tp != brand_fp:
        findings.append({
            "bias_type": "Brand Bias",
            "bias_key": "brand_bias",
            "severity": _sev("Medium"),
            "evidence": (
                f"Initial recommendation favored {fp.get('name')} ({fp.get('brand')}) "
                f"while a different brand ({tp.get('brand')}) better matched constraints after audit."
            ),
            "affected_claims": [f"Initial pick: {fp.get('name')}", f"Final pick: {tp.get('name')}"],
            "recommended_correction": "Evaluate candidates by fit-to-requirements and verified specs, not brand prestige alone.",
            "status": "Detected",
            "limitations": "Brand preference can be legitimate if user explicitly requires ecosystem lock-in.",
        })
    elif brand_fp in premium_brands and verdict == "AGREES" and "apple" not in q and "mac" not in q and "iphone" not in q:
        findings.append({
            "bias_type": "Brand Bias",
            "bias_key": "brand_bias",
            "severity": _sev("Low"),
            "evidence": (
                f"Recommended {fp.get('brand')} product without an explicit brand requirement in the query. "
                "Could indicate defaulting to a well-known brand."
            ),
            "affected_claims": [f"Recommended: {fp.get('name')}"],
            "recommended_correction": "Confirm whether the user requires this brand/ecosystem before finalizing.",
            "status": "Detected",
            "limitations": "Absence of brand mention does not prove bias; the product may still be the best fit.",
        })

    # --- Price bias ---
    if budget_inr and price_fp * 83 > budget_inr * 1.15:
        findings.append({
            "bias_type": "Price Bias",
            "bias_key": "price_bias",
            "severity": _sev("High"),
            "evidence": (
                f"Initial pick price (≈₹{int(price_fp * 83):,}) exceeds stated budget (₹{budget_inr:,}) by >15%. "
                "Risk of assuming higher price equals better fit."
            ),
            "affected_claims": [f"Budget: ₹{budget_inr:,}", f"Initial price: ${price_fp}"],
            "recommended_correction": "Filter strictly by budget first, then rank by capability within the ceiling.",
            "status": "Detected" if verdict != "CHANGED" else "Resolved",
            "limitations": "Some users stretch budgets intentionally; confirm priority of price vs capability.",
        })
    cb = cheaper_balance
    if isinstance(cb, dict):
        cb_prod = cb.get("product") if isinstance(cb.get("product"), dict) else cb
        cb_price = float(cb_prod.get("price") or cb.get("price") or 0) if isinstance(cb_prod, dict) else 0
        cb_name = (cb_prod.get("name") if isinstance(cb_prod, dict) else None) or cb.get("name") or "cheaper option"
        if price_tp > 0 and cb_price > 0 and cb_price < price_tp * 0.7:
            findings.append({
                "bias_type": "Price Bias",
                "bias_key": "price_bias",
                "severity": _sev("Medium"),
                "evidence": (
                    f"A substantially cheaper alternative ({cb_name}) exists. "
                    "Higher-priced pick may over-weight premium positioning."
                ),
                "affected_claims": [f"Final: {tp.get('name')}", f"Cheaper alt: {cb_name}"],
                "recommended_correction": "Show value comparison and let the user decide if the premium is justified.",
                "status": "Detected",
                "limitations": "Cheaper is not always better; performance gaps may justify the premium.",
            })

    # --- Popularity / availability bias ---
    popular_ids = {
        "macbook-air-m2-8gb", "iphone-15-pro", "sony-wh-1000xm5",
        "macbook-pro-14-m3-pro", "galaxy-s24-ultra",
    }
    if fp.get("id") in popular_ids and verdict in ("CHANGED", "UNCERTAIN"):
        findings.append({
            "bias_type": "Popularity Bias",
            "bias_key": "popularity_bias",
            "severity": _sev("Medium"),
            "evidence": (
                f"Initial recommendation ({fp.get('name')}) is a widely marketed product; "
                "audit found a better fit or insufficient evidence, suggesting popularity may have influenced the first pass."
            ),
            "affected_claims": [f"Initial: {fp.get('name')}"],
            "recommended_correction": "Rank by verified fit to stated use-case, not market share or review volume.",
            "status": "Detected",
            "limitations": "Popular products are often popular for good reasons; this is a signal, not proof of error.",
        })

    # --- Confirmation bias ---
    if contradictions and len(contradictions) >= 2 and verdict == "AGREES":
        findings.append({
            "bias_type": "Confirmation Bias",
            "bias_key": "confirmation_bias",
            "severity": _sev("High"),
            "evidence": (
                f"Multiple contradictions were flagged ({len(contradictions)}) yet the verdict remained AGREES. "
                "Possible under-weighting of contrary evidence."
            ),
            "affected_claims": contradictions[:4],
            "recommended_correction": "Re-examine each contradiction and require explicit resolution before agreeing.",
            "status": "Detected",
            "limitations": "Some contradictions may be minor or already mitigated by other strengths.",
        })
    elif contradictions and verdict == "CHANGED":
        findings.append({
            "bias_type": "Confirmation Bias",
            "bias_key": "confirmation_bias",
            "severity": _sev("Low"),
            "evidence": "Contradictions were raised and the recommendation was revised — confirmation bias partially mitigated.",
            "affected_claims": contradictions[:3],
            "recommended_correction": "Continue challenging remaining assumptions on the final pick.",
            "status": "Reviewed",
            "limitations": "Mitigation does not guarantee the new pick is free of residual bias.",
        })

    # --- Specification bias ---
    if any(k in q for k in ("best", "flagship", "most powerful", "highest")):
        findings.append({
            "bias_type": "Specification Bias",
            "bias_key": "specification_bias",
            "severity": _sev("Medium"),
            "evidence": (
                "Query emphasizes peak/best specs. Risk of prioritizing impressive numbers "
                "over actual user needs (battery, weight, budget, software)."
            ),
            "affected_claims": ["User query emphasizes peak performance language"],
            "recommended_correction": "Map each spec to a concrete user task and discard vanity metrics.",
            "status": "Detected",
            "limitations": "For some professional workloads, peak specs are the actual requirement.",
        })
    ram_fp = int(fp.get("ram_gb") or 0)
    if ram_fp >= 32 and "ram" not in q and "memory" not in q and "32" not in q:
        findings.append({
            "bias_type": "Specification Bias",
            "bias_key": "specification_bias",
            "severity": _sev("Low"),
            "evidence": f"Initial pick has {ram_fp}GB RAM without an explicit high-memory requirement in the query.",
            "affected_claims": [f"RAM: {ram_fp}GB"],
            "recommended_correction": "Confirm workload needs high RAM before paying the premium.",
            "status": "Detected",
            "limitations": "Higher RAM can still be a reasonable future-proofing choice.",
        })

    # --- Preference bias (assumptions about user) ---
    if assumptions:
        findings.append({
            "bias_type": "Preference Bias",
            "bias_key": "preference_bias",
            "severity": _sev("Medium" if len(assumptions) >= 2 else "Low"),
            "evidence": (
                f"System made {len(assumptions)} assumption(s) about user needs without explicit confirmation: "
                + "; ".join(assumptions[:3])
            ),
            "affected_claims": assumptions[:4],
            "recommended_correction": "Ask clarifying questions before locking the recommendation.",
            "status": "Detected",
            "limitations": "Some assumptions are necessary to produce any recommendation from sparse queries.",
        })

    # --- Source bias ---
    findings.append({
        "bias_type": "Source Bias",
        "bias_key": "source_bias",
        "severity": _sev("Low"),
        "evidence": (
            "Primary evidence comes from the internal product catalog and optional Wikipedia/LLM summaries. "
            "Limited independent multi-source cross-check in this MVP."
        ),
        "affected_claims": ["Evidence base: catalog + optional live APIs"],
        "recommended_correction": "Cross-check critical specs and prices with manufacturer and retailer sources before purchase.",
        "status": "Detected",
        "limitations": "Full multi-source verification requires live retailer APIs which may be unavailable.",
    })

    # --- Availability / recency (honest defaults when data is thin) ---
    if not device_catalog or len(device_catalog) < 3:
        findings.append({
            "bias_type": "Availability Bias",
            "bias_key": "availability_bias",
            "severity": _sev("High"),
            "evidence": "Very few products available in catalog for this device type — recommendation may over-rely on limited options.",
            "affected_claims": ["Catalog coverage"],
            "recommended_correction": "Expand catalog or mark recommendation as constrained by available data.",
            "status": "Detected",
            "limitations": "Catalog size is a known MVP constraint.",
        })

    return findings
