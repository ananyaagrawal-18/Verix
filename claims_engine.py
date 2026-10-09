"""
Claim Extraction & Independent Verification Engine
Breaks recommendations into factual claims and assigns verification status.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone


CLAIM_STATUSES = (
    "Verified",
    "Partially Verified",
    "Contradicted",
    "Unverified",
    "Outdated",
    "Not Applicable",
    "Verification Unavailable",
)


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def extract_and_verify_claims(
    product: Dict[str, Any],
    query: str,
    contradictions: List[str],
    wiki_data: Optional[Dict[str, Any]] = None,
    budget_inr: Optional[int] = None,
    verification_live: bool = False,
) -> List[Dict[str, Any]]:
    """
    Extract claims from the recommended product and assign statuses based on
    catalog data, optional live sources, and known contradictions.
    Never fabricates sources — marks Verification Unavailable when no external check.
    """
    claims: List[Dict[str, Any]] = []
    p = product or {}
    name = p.get("name") or "Unknown product"
    now = _now_iso()

    def add(claim: str, status: str, evidence: str, source: str, explanation: str, field: str = ""):
        claims.append({
            "claim": claim,
            "status": status if status in CLAIM_STATUSES else "Unverified",
            "evidence": evidence,
            "source": source,
            "verification_date": now,
            "explanation": explanation,
            "field": field,
        })

    # Price claim
    price = p.get("price")
    if price is not None:
        status = "Partially Verified"
        evidence = f"Catalog lists USD {price}."
        if budget_inr:
            inr = int(round(float(price) * 83))
            if inr > budget_inr:
                status = "Contradicted"
                evidence += f" Converted ≈₹{inr:,} exceeds budget ₹{budget_inr:,}."
            else:
                evidence += f" Converted ≈₹{inr:,} is within budget ₹{budget_inr:,}."
        add(
            f"{name} is priced at approximately ${price}.",
            status,
            evidence,
            "Internal product catalog",
            "Prices change frequently; verify with current retailer listings before purchase.",
            "price",
        )

    # RAM
    ram = p.get("ram_gb")
    if ram is not None:
        soldered = p.get("ram_soldered")
        status = "Verified"
        evidence = f"Catalog: {ram}GB RAM"
        if soldered is True:
            evidence += " (soldered / non-upgradable)."
        elif soldered is False:
            evidence += " (upgradable)."
        add(
            f"{name} has {ram}GB RAM" + (" (soldered)" if soldered else "") + ".",
            status,
            evidence,
            "Internal product catalog",
            "Confirm exact SKU configuration; RAM often varies by model variant.",
            "ram_gb",
        )

    # GPU / TGP
    gpu = p.get("gpu")
    tgp = p.get("gpu_tgp_w")
    if gpu:
        status = "Verified" if gpu else "Unverified"
        evidence = f"Catalog GPU: {gpu}"
        if tgp:
            evidence += f", TGP {tgp}W."
        # Contradiction check
        for c in contradictions or []:
            if "thermal" in c.lower() or "tgp" in c.lower() or "throttl" in c.lower():
                status = "Partially Verified"
                evidence += f" Related concern: {c}"
                break
        add(
            f"{name} uses GPU: {gpu}" + (f" at ~{tgp}W TGP" if tgp else "") + ".",
            status,
            evidence,
            "Internal product catalog",
            "TGP and sustained performance depend on chassis cooling and power limits.",
            "gpu",
        )

    # Battery
    battery = p.get("battery")
    if battery:
        status = "Partially Verified"
        evidence = f"Catalog battery claim: {battery}"
        add(
            f"{name} battery: {battery}.",
            status,
            evidence,
            "Internal product catalog",
            "Battery life is workload-dependent; manufacturer claims are often optimistic.",
            "battery",
        )

    # Weight
    weight = p.get("weight_kg")
    if weight is not None:
        add(
            f"{name} weighs approximately {weight} kg.",
            "Verified",
            f"Catalog weight: {weight} kg.",
            "Internal product catalog",
            "Weight can vary slightly by configuration (display, battery, ports).",
            "weight_kg",
        )

    # Display
    display = p.get("display")
    if display:
        add(
            f"{name} display: {display}.",
            "Verified",
            f"Catalog display: {display}",
            "Internal product catalog",
            "Panel variants (matte/glossy, color coverage) can differ by region/SKU.",
            "display",
        )

    # Strengths / marketing claims
    strengths = p.get("strengths") or []
    for s in strengths[:3]:
        add(
            f"Claimed strength: {s}",
            "Partially Verified",
            "Listed in catalog strengths; not independently lab-tested in this system.",
            "Internal product catalog",
            "Marketing-oriented strengths should be treated as directional, not guarantees.",
            "strengths",
        )

    # Pitfalls as risk claims
    pitfalls = p.get("pitfalls") or []
    for pit in pitfalls[:3]:
        add(
            f"Known limitation: {pit}",
            "Verified",
            "Documented in catalog pitfalls.",
            "Internal product catalog",
            "Known limitations reduce surprise risk if disclosed before purchase.",
            "pitfalls",
        )

    # Live wiki if available
    if wiki_data and wiki_data.get("extract"):
        add(
            f"External encyclopedic summary available for {name}.",
            "Partially Verified",
            (wiki_data.get("extract") or "")[:400],
            wiki_data.get("source") or "Wikipedia Knowledge Graph",
            "Encyclopedic text is not a substitute for current product datasheets or prices.",
            "external_summary",
        )
    else:
        add(
            f"External live verification for {name} specifications.",
            "Verification Unavailable" if not verification_live else "Unverified",
            "No live external source response for this product at audit time.",
            "N/A",
            "When external APIs fail or are unconfigured, claims rely on catalog data only.",
            "external_check",
        )

    # Budget fit claim
    if budget_inr and price is not None:
        inr = int(round(float(price) * 83))
        ok = inr <= budget_inr
        add(
            f"{name} fits within budget of ₹{budget_inr:,}.",
            "Verified" if ok else "Contradicted",
            f"Price ≈₹{inr:,} vs budget ₹{budget_inr:,}.",
            "Derived from catalog price × FX rate",
            "FX rate and retailer discounts change; treat as approximate.",
            "budget_fit",
        )

    return claims
