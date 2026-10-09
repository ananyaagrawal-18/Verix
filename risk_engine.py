"""
Risk Analysis Module for RECHECK-X / Veritas
Assesses risks with severity, likelihood (or unknown), impact, evidence, mitigation.
Does not invent numerical probabilities.
"""

from typing import Dict, Any, List, Optional


def assess_risks(
    product: Dict[str, Any],
    query: str,
    contradictions: List[str],
    assumptions: List[str],
    budget_inr: Optional[int],
    claims: List[Dict[str, Any]],
    verdict: str,
) -> List[Dict[str, Any]]:
    risks: List[Dict[str, Any]] = []
    p = product or {}
    q = (query or "").lower()

    def add(title, severity, likelihood, impact, evidence, mitigation, category):
        risks.append({
            "title": title,
            "category": category,
            "severity": severity,  # Low | Medium | High
            "likelihood": likelihood,  # Low | Medium | High | Unknown
            "impact": impact,
            "evidence": evidence,
            "mitigation": mitigation,
        })

    # Incorrect / variant specs
    if p.get("ram_soldered"):
        add(
            "Non-upgradable (soldered) RAM",
            "Medium",
            "High",
            "Cannot increase memory later; may force full device replacement.",
            f"{p.get('name')} lists soldered RAM in catalog.",
            "Buy sufficient RAM at purchase or choose an upgradable model (e.g. Framework).",
            "Incorrect specifications / upgrade limits",
        )

    # Outdated prices
    add(
        "Outdated or approximate prices",
        "High",
        "High",
        "Sticker price may differ from live retailer price; budget decisions can be wrong.",
        "Catalog stores static USD prices converted at a fixed FX rate.",
        "Verify current price and taxes on official/retailer sites before buying.",
        "Outdated prices",
    )

    # Availability uncertainty
    add(
        "Product availability uncertainty",
        "Medium",
        "Unknown",
        "Recommended SKU may be out of stock or region-locked.",
        "Catalog does not track live inventory.",
        "Check stock and delivery estimates with the seller.",
        "Product availability uncertainty",
    )

    # Unsupported claims
    unsupported = [c for c in (claims or []) if c.get("status") in ("Unverified", "Verification Unavailable")]
    if unsupported:
        add(
            "Unsupported or unverified claims",
            "Medium",
            "Medium",
            "Decision may rest on claims that were not independently confirmed.",
            f"{len(unsupported)} claim(s) lack full verification.",
            "Treat unverified claims as provisional; confirm critical ones manually.",
            "Unsupported claims",
        )

    # Marketing vs reality
    strengths = p.get("strengths") or []
    if strengths:
        add(
            "Misleading marketing claims risk",
            "Low",
            "Medium",
            "Catalog strengths may reflect marketing language more than measured performance.",
            f"Strengths listed: {', '.join(strengths[:2])}…",
            "Prefer independent reviews and measured benchmarks for critical workloads.",
            "Misleading marketing claims",
        )

    # Warranty missing
    if not p.get("warranty"):
        add(
            "Missing warranty information",
            "Medium",
            "Unknown",
            "Unknown after-sales support duration and coverage.",
            "Catalog entry has no warranty field.",
            "Confirm warranty terms with manufacturer/seller before purchase.",
            "Missing warranty information",
        )

    # Poor suitability
    pitfalls = p.get("pitfalls") or []
    for pit in pitfalls[:2]:
        add(
            f"Suitability concern: {pit[:80]}",
            "Medium",
            "Medium",
            "Known pitfall may conflict with user needs.",
            pit,
            "Match pitfall against your actual usage; choose alternative if mismatch is severe.",
            "Poor suitability for user needs",
        )

    # Budget overrun
    if budget_inr and p.get("price") is not None:
        inr = int(round(float(p["price"]) * 83))
        if inr > budget_inr:
            add(
                "Budget overrun",
                "High",
                "High",
                f"Product ≈₹{inr:,} exceeds budget ₹{budget_inr:,}.",
                "Price vs stated budget comparison.",
                "Select a product within budget or consciously raise the budget.",
                "Potential hidden costs",
            )

    # Contradictions
    for c in (contradictions or [])[:3]:
        add(
            "Conflicting product information",
            "Medium",
            "Medium",
            "Audit found a contradiction that may undermine the recommendation.",
            c,
            "Resolve the contradiction with primary sources or choose a safer alternative.",
            "Conflicting product information",
        )

    # Assumptions
    if assumptions:
        add(
            "Unconfirmed user-preference assumptions",
            "Medium",
            "Medium",
            "Recommendation depends on assumptions that may be wrong.",
            "; ".join(assumptions[:3]),
            "Answer clarifying questions or restate priorities explicitly.",
            "Poor suitability for user needs",
        )

    # UNCERTAIN verdict elevates overall uncertainty risk
    if verdict == "UNCERTAIN":
        add(
            "Insufficient or unreliable evidence for a firm decision",
            "High",
            "High",
            "System could not confidently endorse or replace the recommendation.",
            "Final status is UNCERTAIN.",
            "Gather more requirements or primary-source data before purchasing.",
            "Unsupported claims",
        )

    return risks
