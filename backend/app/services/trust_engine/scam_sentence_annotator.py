"""Scam Sentence Annotator — flags sentences for scam-mode analysis."""
import re
from typing import List, Dict
from app.services.trust_engine.fraud_signal_engine import (
    COMPILED_FINANCIAL, COMPILED_IDENTITY, COMPILED_URGENCY,
    COMPILED_PROMISES, COMPILED_IMPERSONATION
)

FLAG_MAP = [
    (COMPILED_FINANCIAL, "upfront_fee", 0.85, "Requests payment or deposit before service/verification"),
    (COMPILED_IDENTITY, "identity_harvesting", 0.9, "Requests sensitive personal data (Aadhaar, OTP, bank details)"),
    (COMPILED_URGENCY, "urgency_pressure", 0.7, "Uses urgency or pressure tactics to force immediate action"),
    (COMPILED_PROMISES, "unrealistic_promise", 0.75, "Makes unrealistic or guaranteed promises"),
    (COMPILED_IMPERSONATION, "impersonation_cue", 0.8, "Impersonates a known brand, bank, or authority"),
]


def annotate_scam_sentences(sentences: List[str]) -> List[Dict]:
    annotations = []
    for sent in sentences:
        if len(sent.strip()) < 15:
            continue
        flags = []
        max_risk = 0.0
        explanations = []
        for patterns, flag_name, base_risk, explanation in FLAG_MAP:
            for p in patterns:
                if p.search(sent):
                    if flag_name not in flags:
                        flags.append(flag_name)
                        max_risk = max(max_risk, base_risk)
                        explanations.append(explanation)
                    break
        if flags:
            annotations.append({
                "sentence": sent[:400],
                "flags": flags,
                "risk_score": round(min(max_risk, 1.0), 2),
                "explanation": "; ".join(explanations),
            })
    return annotations
