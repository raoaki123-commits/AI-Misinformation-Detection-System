"""General Trust & Risk Analyzer — fallback mode for SENTINEL."""
from typing import Dict
from app.services.trust_engine.fraud_signal_engine import run_shared_signals


def analyze_general_trust(text: str) -> Dict:
    signals = run_shared_signals(text)
    fin = signals["financial_fraud"]["score"]
    ident = signals["identity_harvesting"]["score"]
    urg = signals["urgency_pressure"]["score"]
    prom = signals["unrealistic_promises"]["score"]
    imp = signals["impersonation"]["score"]
    trust_def = signals["trust_deficiency"]["score"]

    fraud_risk = min(fin * 0.25 + ident * 0.2 + prom * 0.2 + imp * 0.15 + urg * 0.1 + trust_def * 0.1, 1.0)
    manipulation = min(urg * 0.5 + prom * 0.3 + imp * 0.2, 1.0)
    trust_score = max(1.0 - fraud_risk * 0.8 - trust_def * 0.2, 0.0)

    return {
        "fraud_risk_score": round(fraud_risk * 100, 1),
        "manipulation_score": round(manipulation * 100, 1),
        "trust_score": round(trust_score * 100, 1),
        "signals": signals,
    }
