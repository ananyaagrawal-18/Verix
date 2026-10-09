"""
Honest limitations & reliability statements for the Limitations page.
"""

LIMITATIONS = [
    {
        "title": "AI-generated verification can still be wrong",
        "impact": "Incorrect final recommendations or missed risks.",
        "mitigation": "Treat outputs as decision support. Re-check critical specs and prices with primary sources.",
    },
    {
        "title": "External sources may be unavailable or outdated",
        "impact": "Claims may be marked Verification Unavailable; confidence is reduced.",
        "mitigation": "The system labels missing external checks explicitly instead of inventing results.",
    },
    {
        "title": "Product specifications can differ between variants",
        "impact": "Wrong SKU assumptions (RAM, display, region).",
        "mitigation": "Confirm the exact configuration code with the seller before purchase.",
    },
    {
        "title": "Prices and stock can change",
        "impact": "Budget fit and availability conclusions may become invalid quickly.",
        "mitigation": "Catalog prices are approximate; always verify live retailer price and stock.",
    },
    {
        "title": "Source credibility is difficult to assess perfectly",
        "impact": "Bias toward catalog or a single encyclopedic source.",
        "mitigation": "Cross-check with manufacturer datasheets and independent reviews for high-stakes buys.",
    },
    {
        "title": "Bias detection can produce false positives and false negatives",
        "impact": "Over-flagging or under-flagging brand/price/popularity effects.",
        "mitigation": "Each bias finding includes evidence and limitations; review status can be updated by the user.",
    },
    {
        "title": "Different users can reasonably choose different products",
        "impact": "No single 'correct' answer for all preference profiles.",
        "mitigation": "Criteria weights are transparent and adjustable; final choice remains with the user.",
    },
    {
        "title": "Numerical confidence scores are not calibrated probabilities",
        "impact": "A 90% score is not a 90% chance of correctness.",
        "mitigation": "Use confidence as a relative signal alongside claims, risks, and evidence status.",
    },
    {
        "title": "The system cannot guarantee a completely unbiased or correct decision",
        "impact": "Residual uncertainty always remains.",
        "mitigation": "Full audit trail, challenge mode, and explicit UNCERTAIN status when evidence is weak.",
    },
    {
        "title": "Missing data limits the strength of any conclusion",
        "impact": "Sparse queries force assumptions; sparse catalogs limit alternatives.",
        "mitigation": "Answer Socratic counter-questions and expand catalog coverage over time.",
    },
]

NOTICE = (
    "This system supports decision-making; it does not guarantee correctness. "
    "Verify important details with the original source or seller."
)
