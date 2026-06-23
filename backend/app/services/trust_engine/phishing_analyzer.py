"""Phishing / Impersonation Scam Analyzer for SENTINEL."""
import re
from typing import Dict
from app.services.trust_engine.fraud_signal_engine import (
    detect_identity_harvesting, detect_urgency_pressure, detect_impersonation_cues
)

BANK_NAMES = ['sbi', 'hdfc', 'icici', 'axis bank', 'pnb', 'kotak', 'yes bank',
    'bank of baroda', 'canara bank', 'union bank', 'rbl', 'idfc',
    'paytm', 'phonepe', 'gpay', 'google pay', 'bhim', 'upi']
GOVT_NAMES = ['aadhaar', 'uidai', 'income tax', 'gst', 'epfo', 'pf', 'nsdl', 'pan']
BRAND_NAMES = ['amazon', 'flipkart', 'swiggy', 'zomato', 'uber', 'ola', 'netflix',
    'apple', 'microsoft', 'google', 'whatsapp', 'facebook', 'instagram',
    'fedex', 'dhl', 'bluedart', 'india post', 'dtdc']

KYC_PATTERNS = [
    r'\bkyc\s*(update|verify|expired?|fail|pending|complete)\b',
    r'\b(account|card|service)\s+(blocked|suspended|deactivated|freeze|hold)\b',
    r'\bverify\s+(your|account|kyc|identity|details)\s+(now|immediately|today)\b',
]
COMPILED_KYC = [re.compile(p, re.IGNORECASE) for p in KYC_PATTERNS]

CREDENTIAL_REQUEST = [
    r'\benter\s+(your\s+)?(otp|pin|password|card|cvv|account)\b',
    r'\b(share|send|provide)\s+(otp|pin|password|card details|cvv)\b',
    r'\b(click|tap|follow)\s+(the\s+)?link\s+(to\s+)?(verify|login|confirm|update)\b',
    r'\b(login|sign.?in)\s+(to\s+)?(verify|confirm|update|access)\b',
]
COMPILED_CRED = [re.compile(p, re.IGNORECASE) for p in CREDENTIAL_REQUEST]

SUSPICIOUS_LINK = [
    r'\b(bit\.ly|tinyurl|t\.co|goo\.gl|short\.link|rb\.gy|cutt\.ly)\b',
    r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',
    r'\b(free|win|prize|reward|claim|verify)\b.{0,30}\blink\b',
    r'\.xyz\b|\.top\b|\.click\b|\.tk\b|\.ml\b|\.ga\b',
]
COMPILED_LINKS = [re.compile(p, re.IGNORECASE) for p in SUSPICIOUS_LINK]

GRAMMAR_SPOOF = [
    r'\bDear\s+(customer|user|sir|madam|valued)\b',
    r'\bYour\s+(account|card|kyc)\s+(have|has)\s+been\b',
    r'kindly\s+(do|update|verify|confirm|send)\b',
]
COMPILED_GRAMMAR = [re.compile(p, re.IGNORECASE) for p in GRAMMAR_SPOOF]

REFUND_SCAM = [
    r'\b(refund|cashback|reward|prize|winning|lottery)\s+(of|worth|amount)?\s*(rs\.?|inr|₹|\$)?\s*\d+\b',
    r'\bclaim\s+your\s+(refund|prize|reward|cashback)\b',
    r'\bscan\s+(the\s+)?qr\s+(code\s+)?to\s+(receive|get|claim|collect)\b',
]
COMPILED_REFUND = [re.compile(p, re.IGNORECASE) for p in REFUND_SCAM]


def analyze_phishing(text: str) -> Dict:
    tl = text.lower()

    bank_hits = sum(1 for b in BANK_NAMES if b in tl)
    govt_hits = sum(1 for g in GOVT_NAMES if g in tl)
    brand_hits = sum(1 for b in BRAND_NAMES if b in tl)
    imp_sig = detect_impersonation_cues(text)
    impersonation_confidence = min((bank_hits * 0.2 + govt_hits * 0.2 + brand_hits * 0.15 + imp_sig["score"] * 0.5), 1.0)

    kyc_hits = sum(1 for p in COMPILED_KYC if p.search(text))
    cred_hits = sum(1 for p in COMPILED_CRED if p.search(text))
    ident = detect_identity_harvesting(text)
    credential_theft = min(cred_hits * 0.3 + ident["score"] * 0.7, 1.0)

    urg = detect_urgency_pressure(text)
    urgency_fear = min(urg["score"] + kyc_hits * 0.15, 1.0)

    link_hits = sum(1 for p in COMPILED_LINKS if p.search(text))
    link_suspicion = min(link_hits * 0.35, 1.0)

    grammar_hits = sum(1 for p in COMPILED_GRAMMAR if p.search(text))
    refund_hits = sum(1 for p in COMPILED_REFUND if p.search(text))

    phishing_risk = min(
        impersonation_confidence * 0.3 +
        credential_theft * 0.35 +
        urgency_fear * 0.2 +
        link_suspicion * 0.1 +
        (grammar_hits * 0.05) +
        (refund_hits * 0.1),
        1.0
    )

    return {
        "phishing_risk_score": round(phishing_risk * 100, 1),
        "impersonation_confidence": round(impersonation_confidence * 100, 1),
        "credential_theft_risk": round(credential_theft * 100, 1),
        "urgency_fear_score": round(urgency_fear * 100, 1),
        "link_suspicion_score": round(link_suspicion * 100, 1),
        "kyc_threat_hits": kyc_hits,
        "refund_scam_hits": refund_hits,
    }
