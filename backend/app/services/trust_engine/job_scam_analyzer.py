"""Job / Recruitment Scam Analyzer for SENTINEL."""
import re
from typing import Dict
from app.services.trust_engine.fraud_signal_engine import (
    detect_financial_fraud_signals, detect_identity_harvesting,
    detect_urgency_pressure, detect_unrealistic_promises, detect_trust_deficiency
)

GENERIC_EMAIL_DOMAINS = ['gmail', 'yahoo', 'hotmail', 'outlook', 'rediffmail', 'ymail']

FEE_PATTERNS = [
    r'\b(registration|onboarding|training|security|laptop|kit|exam|admin)\s+(fee|fees|deposit|charge|payment)\b',
    r'\bpay\s+(\w+\s+)?to\s+(get|start|join|unlock|receive|confirm)\b',
    r'\b(refundable|non.refundable)\s+(fee|deposit|amount)\b',
    r'\bpay\s+(rs\.?|inr|₹)?\s*\d+\b',
]
COMPILED_FEE = [re.compile(p, re.IGNORECASE) for p in FEE_PATTERNS]

SALARY_EXAGGERATION = [
    r'\b(earn|make|get|receive)\s+(rs\.?|inr|₹|\$)?\s*\d{4,}\s*(per\s+(day|hour|week)|daily|hourly)\b',
    r'\b(guaranteed?|assured?)\s+(salary|income|earning|pay|wage)\b',
    r'\bno\s+(interview|experience|skill|qualification)\s+(required|needed)\b',
    r'\b(earn|make)\s+(₹|\$|rs\.?)?\s*\d+[,.]?\d*\s*(k|lakh|crore)?\s+(in|per)\s+(\d+\s+)?(hour|day|week|month)\b',
]
COMPILED_SALARY = [re.compile(p, re.IGNORECASE) for p in SALARY_EXAGGERATION]

RECRUITER_VAGUE = [
    r'\b(top|leading|reputed|international|global|multinational)\s+(mnc|company|firm|corporation)\b',
    r'\bamazon\s+partner\b',
    r'\b(undisclosed|confidential)\s+company\b',
]
COMPILED_VAGUE = [re.compile(p, re.IGNORECASE) for p in RECRUITER_VAGUE]

DATA_HARVEST_EARLY = [
    r'\b(share|send|provide|submit|upload)\s+.{0,30}(aadhaar|pan|passport|bank\s+account|otp|card\s+details)\b',
    r'\b(personal|kyc|identity)\s+(document|details|info|data)\s+(now|immediately|first|before)\b',
]
COMPILED_HARVEST = [re.compile(p, re.IGNORECASE) for p in DATA_HARVEST_EARLY]


def analyze_job_scam(text: str) -> Dict:
    tl = text.lower()

    fee_hits = sum(1 for p in COMPILED_FEE if p.search(text))
    fin_signals = detect_financial_fraud_signals(text)
    fee_risk = min((fee_hits * 0.3 + fin_signals["score"] * 0.7), 1.0)

    generic_email = any(d in tl for d in GENERIC_EMAIL_DOMAINS)
    vague_hits = sum(1 for p in COMPILED_VAGUE if p.search(text))
    trust_def = detect_trust_deficiency(text)
    recruiter_penalty = (0.3 if generic_email else 0) + min(vague_hits * 0.25, 0.5) + trust_def["score"] * 0.3
    recruiter_trust = max(1.0 - min(recruiter_penalty, 1.0), 0.0)

    salary_hits = sum(1 for p in COMPILED_SALARY if p.search(text))
    promise_sig = detect_unrealistic_promises(text)
    comp_penalty = min(salary_hits * 0.35 + promise_sig["score"] * 0.5, 1.0)
    compensation_realism = max(1.0 - comp_penalty, 0.0)

    harvest_hits = sum(1 for p in COMPILED_HARVEST if p.search(text))
    ident = detect_identity_harvesting(text)
    identity_theft = min(harvest_hits * 0.4 + ident["score"] * 0.6, 1.0)

    has_responsibilities = bool(re.search(r'\b(responsibilities|duties|role|tasks|requirements|qualifications|skills required)\b', text, re.I))
    has_interview = bool(re.search(r'\b(interview|round|assessment|test|screening)\b', text, re.I))
    has_location = bool(re.search(r'\b(location|office|city|remote|onsite|wfh|work from home)\b', text, re.I))
    has_company_name = bool(re.search(r'\b(pvt\.?\s*ltd|private limited|llp|inc\.?|corporation|technologies|solutions|services)\b', text, re.I))
    role_clarity = (int(has_responsibilities) * 0.35 + int(has_interview) * 0.25 + int(has_location) * 0.2 + int(has_company_name) * 0.2)

    urg = detect_urgency_pressure(text)

    job_scam_risk = min(
        fee_risk * 0.35 +
        (1 - recruiter_trust) * 0.2 +
        (1 - compensation_realism) * 0.2 +
        identity_theft * 0.15 +
        urg["score"] * 0.1,
        1.0
    )

    return {
        "job_scam_risk": round(job_scam_risk * 100, 1),
        "recruiter_trust_score": round(recruiter_trust * 100, 1),
        "fee_fraud_risk": round(fee_risk * 100, 1),
        "identity_theft_risk": round(identity_theft * 100, 1),
        "compensation_realism_score": round(compensation_realism * 100, 1),
        "role_clarity_score": round(role_clarity * 100, 1),
        "urgency_score": round(urg["score"] * 100, 1),
    }
