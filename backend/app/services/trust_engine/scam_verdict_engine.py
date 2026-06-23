"""Scam Verdict Engine — mode-specific verdict classification."""
from typing import Tuple


def job_scam_verdict(risk: float) -> Tuple[str, str]:
    if risk < 20: return "Likely Legitimate", "Low"
    elif risk < 40: return "Unverified Job Posting", "Moderate"
    elif risk < 58: return "Suspicious Recruitment Message", "Moderate"
    elif risk < 70: return "Fee-Based Job Scam Risk", "High"
    elif risk < 82: return "Identity-Harvesting Recruitment Scam", "High"
    else: return "High-Risk Fraudulent Job Offer", "Critical"


def phishing_verdict(risk: float) -> Tuple[str, str]:
    if risk < 20: return "Likely Safe Message", "Low"
    elif risk < 38: return "Suspicious Verification Message", "Moderate"
    elif risk < 55: return "Brand Impersonation Risk", "Moderate"
    elif risk < 70: return "Credential Theft / OTP Scam Risk", "High"
    elif risk < 82: return "Payment / Refund Scam Risk", "High"
    else: return "High-Risk Phishing Attempt", "Critical"


def investment_scam_verdict(risk: float) -> Tuple[str, str]:
    if risk < 20: return "Likely Promotional but Low-Risk", "Low"
    elif risk < 40: return "Unverified Investment Pitch", "Moderate"
    elif risk < 58: return "High-Risk Speculative Promotion", "Moderate"
    elif risk < 72: return "MLM / Referral Scam Risk", "High"
    elif risk < 84: return "Ponzi / Guaranteed Return Scam Risk", "High"
    else: return "High-Risk Crypto Fraud Signal", "Critical"


def marketplace_verdict(risk: float) -> Tuple[str, str]:
    if risk < 20: return "Likely Normal Offer", "Low"
    elif risk < 40: return "Suspicious Seller / Offer", "Moderate"
    elif risk < 60: return "Advance-Payment Fraud Risk", "High"
    elif risk < 80: return "Refund / QR Scam Risk", "High"
    else: return "High-Risk Marketplace Scam", "Critical"


def scholarship_verdict(risk: float) -> Tuple[str, str]:
    if risk < 20: return "Likely Legitimate Opportunity", "Low"
    elif risk < 38: return "Unverified Opportunity Notice", "Moderate"
    elif risk < 55: return "Scholarship / Admission Scam Risk", "Moderate"
    elif risk < 70: return "Visa / Immigration Fraud Risk", "High"
    elif risk < 82: return "Fee-Based Opportunity Scam", "High"
    else: return "High-Risk Impersonation Offer", "Critical"


def general_verdict(risk: float) -> Tuple[str, str]:
    if risk < 25: return "Low Deception Risk", "Low"
    elif risk < 50: return "Moderate Trust Concerns", "Moderate"
    elif risk < 70: return "High Fraud Risk Signals", "High"
    else: return "Critical Deception / Fraud Risk", "Critical"


VERDICT_DISPATCH = {
    "job_scam": job_scam_verdict,
    "phishing": phishing_verdict,
    "investment_scam": investment_scam_verdict,
    "marketplace_fraud": marketplace_verdict,
    "scholarship_scam": scholarship_verdict,
    "general_trust": general_verdict,
}


def get_verdict(analysis_mode: str, risk_score: float) -> Tuple[str, str]:
    fn = VERDICT_DISPATCH.get(analysis_mode, general_verdict)
    return fn(risk_score)
