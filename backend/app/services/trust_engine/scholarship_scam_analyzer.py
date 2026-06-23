"""Scholarship / Visa / Opportunity Scam Analyzer for SENTINEL."""
import re
from typing import Dict
from app.services.trust_engine.fraud_signal_engine import (
    detect_financial_fraud_signals, detect_urgency_pressure, detect_identity_harvesting
)

GUARANTEED_OPPT = [
    r'\bguaranteed?\s+(visa|scholarship|admission|fellowship|internship|placement|approval)\b',
    r'\b(100|200)\s*%\s*(visa|scholarship|admission|approval)\s*(guaranteed?|assured?|success)\b',
    r'\bno\s+(rejection|refusal|denial)\b',
]
COMPILED_GUAR = [re.compile(p, re.IGNORECASE) for p in GUARANTEED_OPPT]

FEE_DEMANDS = [
    r'\b(processing|application|registration|documentation|courier|translation|evaluation|verification)\s+(fee|fees|charge|charges|cost)\b',
    r'\bpay\s+.{0,30}(before|to)\s+(apply|process|submit|receive|get)\b',
    r'\brefundable\s+(fee|deposit|amount)\b',
    r'\btoken\s+(amount|money|fee)\b',
]
COMPILED_FEE = [re.compile(p, re.IGNORECASE) for p in FEE_DEMANDS]

SELECTED_WITHOUT_APPLY = [
    r'\byou\s+(have\s+been|are|were)\s+(selected|chosen|shortlisted|awarded|nominated)\b',
    r'\bcongratulations.{0,60}(selected|won|awarded|chosen)\b',
    r'\bexclusive\s+(offer|invitation|selection|opportunity)\b',
    r'\bwe\s+(are\s+)?(pleased|happy|delighted)\s+to\s+(inform|announce|offer)\b',
]
COMPILED_SELECTED = [re.compile(p, re.IGNORECASE) for p in SELECTED_WITHOUT_APPLY]

INSTITUTION_VAGUE = [
    r'\b(renowned|prestigious|leading|top|global|international|world.?class)\s+(university|institution|college|school|organization)\b',
    r'\b(government|ministry)\s+(approved|recognized|certified)\s+(scholarship|program|university)\b',
]
COMPILED_VAGUE = [re.compile(p, re.IGNORECASE) for p in INSTITUTION_VAGUE]

DOCUMENT_DEMANDS = [
    r'\b(send|share|submit|upload|email)\s+.{0,30}(passport|aadhaar|pan|birth certificate|degree|marksheet|bank statement)\b',
    r'\b(original|certified|notarized)\s+(document|certificate|copy)\s+(required|needed|mandatory)\b',
    r'\b(document|certificate)\s+(verification|processing)\s+(fee|charge|cost)\b',
]
COMPILED_DOCS = [re.compile(p, re.IGNORECASE) for p in DOCUMENT_DEMANDS]


def analyze_scholarship_scam(text: str) -> Dict:
    guar_hits = sum(1 for p in COMPILED_GUAR if p.search(text))
    fee_hits = sum(1 for p in COMPILED_FEE if p.search(text))
    selected_hits = sum(1 for p in COMPILED_SELECTED if p.search(text))
    vague_hits = sum(1 for p in COMPILED_VAGUE if p.search(text))
    doc_hits = sum(1 for p in COMPILED_DOCS if p.search(text))

    fin = detect_financial_fraud_signals(text)
    urg = detect_urgency_pressure(text)
    ident = detect_identity_harvesting(text)

    fee_fraud = min(fee_hits * 0.35 + fin["score"] * 0.65, 1.0)
    institution_penalty = min(vague_hits * 0.3 + selected_hits * 0.2, 1.0)
    institution_trust = max(1.0 - institution_penalty, 0.0)
    documentation_risk = min(doc_hits * 0.35 + ident["score"] * 0.65, 1.0)

    opportunity_scam_risk = min(
        fee_fraud * 0.35 +
        (1 - institution_trust) * 0.2 +
        guar_hits * 0.15 +
        documentation_risk * 0.15 +
        selected_hits * 0.1 +
        urg["score"] * 0.05,
        1.0
    )

    return {
        "opportunity_scam_risk": round(opportunity_scam_risk * 100, 1),
        "institution_trust_score": round(institution_trust * 100, 1),
        "fee_fraud_score": round(fee_fraud * 100, 1),
        "documentation_risk": round(documentation_risk * 100, 1),
        "guaranteed_hits": guar_hits,
        "selected_without_apply_hits": selected_hits,
    }
