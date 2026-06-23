"""
Shared Fraud Signal Engine — cross-cutting scam signal detection reused by all analyzers.
"""
import re
from typing import Dict, List

# ── Financial fraud patterns ──────────────────────────────────────────────────
FINANCIAL_FRAUD_PATTERNS = [
    r'\b(registration|onboarding|training|processing|admin|security|laptop|kit|uniform|exam)\s+(fee|fees|charge|charges|deposit|payment|cost)\b',
    r'\b(pay|deposit|transfer|send)\s+(\w+\s+)?before\s+(join|start|get|receive|confirm|unlock)\b',
    r'\b(refundable|fully refundable)\s+(deposit|fee|amount|security)\b',
    r'\b(upfront|advance)\s+(payment|fee|amount|deposit|money)\b',
    r'\bunlock\s+(salary|payment|offer|job|account|wallet)\b',
    r'\bsecurity\s+deposit\b',
    r'\bpay\s+(now|immediately|today|first|before)\b',
    r'\bsend\s+(money|cash|amount|fee)\s+(via|through|on|to)\b',
    r'\b(google|amazon|flipkart|swiggy)\s+(pay|gift card)\b',
    r'\bqr\s+code\b',
    r'\bupi\s+(id|payment|transfer)\b',
    r'\b(neft|rtgs|imps|wire transfer)\b',
]
COMPILED_FINANCIAL = [re.compile(p, re.IGNORECASE) for p in FINANCIAL_FRAUD_PATTERNS]

# ── Identity harvesting patterns ──────────────────────────────────────────────
IDENTITY_PATTERNS = [
    r'\b(aadhaar|aadhar|aadhar card|aadhar number)\b',
    r'\b(pan card|pan number|pan details)\b',
    r'\b(passport\s+(number|details|copy|scan))\b',
    r'\botp\b',
    r'\b(cvv|cvc|card\s+(number|details|pin))\b',
    r'\b(bank\s+(account|details|number|passbook))\b',
    r'\b(net banking|online banking)\s+(password|credentials|login)\b',
    r'\b(user\s?name|password|pin|mpin)\s+(share|send|provide|submit|enter)\b',
    r'\b(login|credential|username|password)\s+(detail|info|information)\b',
    r'\b(ifsc|micr)\s+code\b',
    r'\bdriving\s+licen[cs]e\b',
    r'\b(voter\s+id|election\s+card)\b',
]
COMPILED_IDENTITY = [re.compile(p, re.IGNORECASE) for p in IDENTITY_PATTERNS]

# ── Urgency / pressure patterns ───────────────────────────────────────────────
URGENCY_PATTERNS = [
    r'\b(act|apply|respond|register|pay|confirm|click|verify)\s+(now|immediately|today|urgently|asap|right now)\b',
    r'\b(last|final)\s+(chance|slot|seat|opportunity|call|day|hour)\b',
    r'\blimited\s+(seats|slots|spots|offer|time|positions)\b',
    r'\b(offer|slot|position|seat)\s+(expires?|expiring|closing|ends?)\b',
    r'\b(account|kyc|card|service)\s+(blocked|suspended|expired|deactivated|frozen)\b',
    r'\b(immediate|urgent|emergency)\s+(action|response|payment|verification)\b',
    r'\btoday only\b',
    r'\bdon.t (miss|delay|wait|ignore)\b',
    r'\bexpires?\s+in\s+\d+\s+(hour|minute|day)\b',
]
COMPILED_URGENCY = [re.compile(p, re.IGNORECASE) for p in URGENCY_PATTERNS]

# ── Unrealistic promise patterns ──────────────────────────────────────────────
PROMISE_PATTERNS = [
    r'\bguaranteed?\s+(job|placement|salary|return|profit|income|visa|scholarship|admission|result)\b',
    r'\b(earn|make|get)\s+(\d+[k₹$]?|lakhs?|crore)\s+(per|a|in)\s+(day|week|month|hour|minute)\b',
    r'\bno\s+(experience|interview|skill|qualification|degree|effort)\s+(required|needed|necessary)\b',
    r'\b(100|200|300|500|1000)\s*%\s*(return|profit|growth|guarantee)\b',
    r'\bdouble\s+(your\s+)?(money|investment|income|salary)\b',
    r'\b(work|earn)\s+from\s+home\b',
    r'\bpassive\s+income\b',
    r'\b(zero|no)\s+risk\b',
    r'\bget\s+rich\s+(quick|fast|overnight)\b',
    r'\b(easy|simple|quick)\s+(money|cash|income|earnings)\b',
]
COMPILED_PROMISES = [re.compile(p, re.IGNORECASE) for p in PROMISE_PATTERNS]

# ── Impersonation / authority signals ────────────────────────────────────────
IMPERSONATION_PATTERNS = [
    r'\b(sbi|hdfc|icici|axis|pnb|kotak|rbi|sebi|irdai)\b',
    r'\b(amazon|flipkart|swiggy|zomato|uber|ola|paytm|phonepe|gpay|google pay)\b.*\b(team|support|hr|official)\b',
    r'\b(infosys|tcs|wipro|accenture|ibm|microsoft|google|amazon)\s+(hr|recruiter|hiring|team)\b',
    r'\b(government|govt|ministry|department)\s+(of|scheme|grant|program)\b',
    r'\b(rbi|sebi|income tax|gst)\s+(notice|department|officer|team)\b',
    r'\bofficial\s+(website|email|representative|notification)\b',
    r'\b(customer\s+care|helpline|support\s+team)\s+(of|from|by)\b',
    r'\b(fedex|dhl|bluedart|dtdc|india post)\s+(parcel|package|delivery|notice)\b',
]
COMPILED_IMPERSONATION = [re.compile(p, re.IGNORECASE) for p in IMPERSONATION_PATTERNS]

# ── Trust deficiency signals ──────────────────────────────────────────────────
TRUST_DEFICIENCY_PATTERNS = [
    r'\b(top|leading|reputed|renowned|international|global)\s+(mnc|company|firm|organization)\b',
    r'\b(confidential|private|secret)\s+(offer|opportunity|job|deal)\b',
    r'\b(whatsapp|telegram|signal)\s+(interview|apply|contact|message)\b',
    r'\b(gmail|yahoo|hotmail|outlook)\b.*\b(hr|recruiter|hiring|official)\b',
    r'\bdo not\s+(share|tell|disclose)\s+(this|anyone|others)\b',
]
COMPILED_TRUST_DEF = [re.compile(p, re.IGNORECASE) for p in TRUST_DEFICIENCY_PATTERNS]


def detect_financial_fraud_signals(text: str) -> Dict:
    hits = []
    for p in COMPILED_FINANCIAL:
        m = p.search(text)
        if m:
            hits.append(m.group(0))
    score = min(len(hits) * 0.22, 1.0)
    return {"score": round(score, 2), "hits": hits[:5]}


def detect_identity_harvesting(text: str) -> Dict:
    hits = []
    for p in COMPILED_IDENTITY:
        m = p.search(text)
        if m:
            hits.append(m.group(0))
    score = min(len(hits) * 0.28, 1.0)
    return {"score": round(score, 2), "hits": hits[:5]}


def detect_urgency_pressure(text: str) -> Dict:
    hits = []
    for p in COMPILED_URGENCY:
        m = p.search(text)
        if m:
            hits.append(m.group(0))
    score = min(len(hits) * 0.2, 1.0)
    return {"score": round(score, 2), "hits": hits[:5]}


def detect_unrealistic_promises(text: str) -> Dict:
    hits = []
    for p in COMPILED_PROMISES:
        m = p.search(text)
        if m:
            hits.append(m.group(0))
    score = min(len(hits) * 0.25, 1.0)
    return {"score": round(score, 2), "hits": hits[:5]}


def detect_impersonation_cues(text: str) -> Dict:
    hits = []
    for p in COMPILED_IMPERSONATION:
        m = p.search(text)
        if m:
            hits.append(m.group(0))
    score = min(len(hits) * 0.3, 1.0)
    return {"score": round(score, 2), "hits": hits[:5]}


def detect_trust_deficiency(text: str) -> Dict:
    hits = []
    for p in COMPILED_TRUST_DEF:
        m = p.search(text)
        if m:
            hits.append(m.group(0))
    score = min(len(hits) * 0.25, 1.0)
    return {"score": round(score, 2), "hits": hits[:5]}


def run_shared_signals(text: str) -> Dict:
    """Run all shared signal detectors and return combined results."""
    return {
        "financial_fraud": detect_financial_fraud_signals(text),
        "identity_harvesting": detect_identity_harvesting(text),
        "urgency_pressure": detect_urgency_pressure(text),
        "unrealistic_promises": detect_unrealistic_promises(text),
        "impersonation": detect_impersonation_cues(text),
        "trust_deficiency": detect_trust_deficiency(text),
    }
