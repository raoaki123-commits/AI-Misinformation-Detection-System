"""Scam / Trust Analyst Summary Generator for SENTINEL."""
from typing import Dict, List

MODE_LABELS = {
    "job_scam": "Job / Recruitment Scam",
    "phishing": "Phishing / Impersonation Scam",
    "investment_scam": "Investment / Crypto Scam",
    "marketplace_fraud": "Marketplace / Offer Fraud",
    "scholarship_scam": "Scholarship / Visa / Opportunity Scam",
    "general_trust": "General Trust & Fraud Risk",
}


def generate_scam_summary(
    mode: str, verdict: str, risk_score: float, risk_level: str,
    red_flags: List[Dict], mode_scores: Dict, top_reasons: List[str],
) -> str:
    mode_label = MODE_LABELS.get(mode, "Unknown Mode")
    flag_count = len(red_flags)
    critical_flags = [f for f in red_flags if f.get("severity") in ("critical", "high")]

    if risk_level == "Critical":
        opening = f"SENTINEL has assessed this content as a CRITICAL-risk {mode_label} threat with a fraud risk score of {risk_score:.0f}/100."
    elif risk_level == "High":
        opening = f"SENTINEL analysis indicates HIGH-risk fraud signals consistent with {mode_label} patterns. Risk score: {risk_score:.0f}/100."
    elif risk_level == "Moderate":
        opening = f"SENTINEL detected MODERATE {mode_label} indicators. The content warrants scrutiny before engagement. Risk score: {risk_score:.0f}/100."
    else:
        opening = f"SENTINEL analysis found LOW {mode_label} risk signals in this content. Risk score: {risk_score:.0f}/100."

    if flag_count == 0:
        flag_text = "No specific scam indicators were detected."
    elif flag_count == 1:
        flag_text = f"One scam indicator was identified: {red_flags[0].get('description', 'see details')}."
    else:
        high_types = ", ".join(f.get("type", "").replace("_", " ").title() for f in critical_flags[:3])
        flag_text = f"{flag_count} deception indicators detected, including: {high_types or 'multiple risk categories'}."

    mode_text = ""
    if mode == "job_scam":
        rt = mode_scores.get("recruiter_trust_score", 50)
        fee = mode_scores.get("fee_fraud_risk", 0)
        mode_text = f" Recruiter trust: {rt:.0f}/100. Fee fraud risk: {fee:.0f}/100."
    elif mode == "phishing":
        imp = mode_scores.get("impersonation_confidence", 0)
        cred = mode_scores.get("credential_theft_risk", 0)
        mode_text = f" Impersonation confidence: {imp:.0f}/100. Credential theft risk: {cred:.0f}/100."
    elif mode == "investment_scam":
        ret = mode_scores.get("unrealistic_return_score", 0)
        mlm = mode_scores.get("ponzi_mlm_risk", 0)
        mode_text = f" Unrealistic return score: {ret:.0f}/100. Ponzi/MLM risk: {mlm:.0f}/100."
    elif mode == "marketplace_fraud":
        pay = mode_scores.get("payment_scam_risk", 0)
        sell = mode_scores.get("seller_trust_score", 50)
        mode_text = f" Payment scam risk: {pay:.0f}/100. Seller trust: {sell:.0f}/100."
    elif mode == "scholarship_scam":
        inst = mode_scores.get("institution_trust_score", 50)
        fee = mode_scores.get("fee_fraud_score", 0)
        mode_text = f" Institution trust: {inst:.0f}/100. Fee fraud risk: {fee:.0f}/100."

    if risk_level in ("Critical", "High"):
        rec = " RECOMMENDATION: Do not engage, transfer money, or share personal data. Verify independently through official channels."
    elif risk_level == "Moderate":
        rec = " RECOMMENDATION: Proceed with caution. Verify the sender's identity and official contact details before responding."
    else:
        rec = " RECOMMENDATION: Content appears relatively safe, though standard due diligence is always advised."

    return f"{opening} {flag_text}{mode_text}{rec}"


def build_red_flags(mode: str, mode_scores: Dict, signals: Dict) -> List[Dict]:
    flags = []

    fin = signals.get("financial_fraud", {})
    ident = signals.get("identity_harvesting", {})
    urg = signals.get("urgency_pressure", {})
    prom = signals.get("unrealistic_promises", {})
    imp = signals.get("impersonation", {})

    if fin.get("score", 0) > 0.3:
        sev = "critical" if fin["score"] > 0.7 else "high" if fin["score"] > 0.4 else "medium"
        flags.append({"type": "upfront_payment", "severity": sev,
            "description": f"Financial fraud signals detected: {', '.join(fin.get('hits', [])[:2]) or 'upfront payment/fee request'}"})

    if ident.get("score", 0) > 0.25:
        sev = "critical" if ident["score"] > 0.6 else "high"
        flags.append({"type": "identity_harvesting", "severity": sev,
            "description": f"Identity data requested: {', '.join(ident.get('hits', [])[:2]) or 'sensitive personal information'}"})

    if urg.get("score", 0) > 0.3:
        flags.append({"type": "urgency_pressure", "severity": "high",
            "description": f"Urgency pressure detected: {', '.join(urg.get('hits', [])[:2]) or 'forced immediate action language'}"})

    if prom.get("score", 0) > 0.3:
        sev = "critical" if prom["score"] > 0.6 else "high"
        flags.append({"type": "unrealistic_promise", "severity": sev,
            "description": f"Unrealistic guarantees: {', '.join(prom.get('hits', [])[:2]) or 'guaranteed returns or outcomes'}"})

    if imp.get("score", 0) > 0.25:
        flags.append({"type": "impersonation", "severity": "high",
            "description": f"Impersonation cues: {', '.join(imp.get('hits', [])[:2]) or 'brand or authority impersonation'}"})

    # Mode-specific extra flags
    if mode == "job_scam":
        if mode_scores.get("fee_fraud_risk", 0) > 55:
            flags.append({"type": "fee_fraud", "severity": "critical",
                "description": "Registration/training fee demanded before employment — classic fee-fraud recruitment scam pattern."})
        if mode_scores.get("compensation_realism_score", 100) < 35:
            flags.append({"type": "unrealistic_salary", "severity": "high",
                "description": "Compensation claims are highly exaggerated — no skill/experience but high pay promised."})
    elif mode == "phishing":
        if mode_scores.get("link_suspicion_score", 0) > 40:
            flags.append({"type": "suspicious_link", "severity": "critical",
                "description": "Suspicious or shortened URLs detected — may redirect to phishing site."})
    elif mode == "investment_scam":
        if mode_scores.get("ponzi_mlm_risk", 0) > 50:
            flags.append({"type": "ponzi_mlm", "severity": "critical",
                "description": "MLM/Referral earnings structure detected — consistent with pyramid or Ponzi scheme."})
    elif mode == "marketplace_fraud":
        if mode_scores.get("payment_scam_risk", 0) > 55:
            flags.append({"type": "advance_payment", "severity": "critical",
                "description": "Advance payment or QR code payment demanded before delivery/service confirmation."})
    elif mode == "scholarship_scam":
        if mode_scores.get("institution_trust_score", 100) < 40:
            flags.append({"type": "fake_institution", "severity": "high",
                "description": "Institution identity is vague or unverifiable — no official contact or registration details."})

    return flags[:7]


def build_top_reasons_scam(mode: str, mode_scores: Dict, red_flags: List[Dict]) -> List[str]:
    reasons = []
    critical = [f for f in red_flags if f["severity"] in ("critical", "high")]
    for f in critical[:3]:
        reasons.append(f"{f['type'].replace('_', ' ').title()}: {f['description']}")

    if mode == "job_scam":
        if mode_scores.get("fee_fraud_risk", 0) > 60:
            reasons.append(f"Fee fraud risk at {mode_scores['fee_fraud_risk']:.0f}/100 — upfront payment before employment confirmation.")
        if mode_scores.get("identity_theft_risk", 0) > 55:
            reasons.append(f"Identity theft risk at {mode_scores['identity_theft_risk']:.0f}/100 — sensitive documents requested prematurely.")
    elif mode == "phishing":
        if mode_scores.get("credential_theft_risk", 0) > 60:
            reasons.append(f"Credential theft risk at {mode_scores['credential_theft_risk']:.0f}/100 — OTP, password, or card details requested.")
        if mode_scores.get("impersonation_confidence", 0) > 55:
            reasons.append(f"Impersonation confidence {mode_scores['impersonation_confidence']:.0f}/100 — mimics a trusted brand or authority.")
    elif mode == "investment_scam":
        if mode_scores.get("unrealistic_return_score", 0) > 50:
            reasons.append(f"Unrealistic return score {mode_scores['unrealistic_return_score']:.0f}/100 — guarantees extreme profits without risk disclosure.")
        if mode_scores.get("ponzi_mlm_risk", 0) > 50:
            reasons.append(f"Ponzi/MLM risk {mode_scores['ponzi_mlm_risk']:.0f}/100 — referral/multi-level earnings structure detected.")
    elif mode == "marketplace_fraud":
        if mode_scores.get("payment_scam_risk", 0) > 55:
            reasons.append(f"Payment scam risk {mode_scores['payment_scam_risk']:.0f}/100 — advance payment or QR code trap patterns detected.")
    elif mode == "scholarship_scam":
        if mode_scores.get("fee_fraud_score", 0) > 55:
            reasons.append(f"Fee fraud score {mode_scores['fee_fraud_score']:.0f}/100 — fees demanded before verification.")

    if not reasons:
        reasons.append("Multiple low-level deception signals detected — content warrants further scrutiny.")
    return reasons[:5]
