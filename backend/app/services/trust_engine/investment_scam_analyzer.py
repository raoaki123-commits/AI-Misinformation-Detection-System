"""Investment / Crypto Scam Analyzer for SENTINEL."""
import re
from typing import Dict
from app.services.trust_engine.fraud_signal_engine import (
    detect_unrealistic_promises, detect_urgency_pressure
)

GUARANTEED_RETURN = [
    r'\bguaranteed?\s+(return|profit|income|earning|yield|gain|interest)\b',
    r'\b(100|200|300|500|1000|\d+)\s*%\s*(guaranteed?|assured?|fixed)\b',
    r'\b(double|triple|10x|100x)\s+(your\s+)?(money|investment|capital|crypto|bitcoin)\b',
    r'\bno\s+(loss|risk|downside)\b',
    r'\b(fixed|daily|weekly|monthly)\s+(return|interest|profit|payout)\s+of\s+(\d+|[₹$])\b',
    r'\b(risk.free|zero.risk|loss.free)\s+(investment|trade|return|profit)\b',
]
COMPILED_RETURN = [re.compile(p, re.IGNORECASE) for p in GUARANTEED_RETURN]

MLM_REFERRAL = [
    r'\b(refer|invite|recruit)\s+(and|to)\s+(earn|get|make|receive)\b',
    r'\b(downline|upline|team|network)\s+(earn|income|commission|bonus)\b',
    r'\b(mlm|multi.level|network marketing|pyramid)\b',
    r'\b(join|recruit)\s+(\d+\s+)?(members?|people|friends|family)\s+(to\s+)?(unlock|get|earn|receive)\b',
]
COMPILED_MLM = [re.compile(p, re.IGNORECASE) for p in MLM_REFERRAL]

CELEB_ENDORSEMENT = [
    r'\b(endorsed?|recommended?|approved?|used?)\s+(by\s+)?(elon|warren|modi|ambani|mukesh|jeff|bezos|bill gates)\b',
    r'\b(as seen|featured)\s+(on|in)\s+(tv|bbc|cnn|forbes|times|shark tank)\b',
    r'\b(celebrity|billionaire|expert)\s+(endorsed?|recommended?|approved?)\b',
]
COMPILED_CELEB = [re.compile(p, re.IGNORECASE) for p in CELEB_ENDORSEMENT]

FOMO_PATTERNS = [
    r'\b(limited|exclusive|vip|private)\s+(access|offer|group|signal|invite)\b',
    r'\bonly\s+\d+\s+(spots?|seats?|slots?|positions?)\s+(left|available|remaining)\b',
    r'\b(miss|missing)\s+(out|this)\b',
    r'\bthe\s+(next|upcoming)\s+(bull\s+run|pump|opportunity|wave)\b',
]
COMPILED_FOMO = [re.compile(p, re.IGNORECASE) for p in FOMO_PATTERNS]

NO_DISCLOSURE = [
    r'\bno\s+(risk|loss|downside|fine print|terms)\b',
    r'\b(secret|hidden|insider)\s+(signal|tip|strategy|formula|method|hack)\b',
    r'\bour\s+(algorithm|bot|ai|system)\s+(generates?|produces?|gives?)\b',
]
COMPILED_DISCLOSURE = [re.compile(p, re.IGNORECASE) for p in NO_DISCLOSURE]

CRYPTO_SIGNALS = [
    r'\b(bitcoin|btc|ethereum|eth|usdt|crypto|defi|nft|token|coin|wallet)\b',
    r'\b(trade|trading)\s+(signal|group|tip|call)\b',
    r'\b(pump|dump|moon|lambo|to the moon)\b',
]
COMPILED_CRYPTO = [re.compile(p, re.IGNORECASE) for p in CRYPTO_SIGNALS]


def analyze_investment_scam(text: str) -> Dict:
    ret_hits = sum(1 for p in COMPILED_RETURN if p.search(text))
    mlm_hits = sum(1 for p in COMPILED_MLM if p.search(text))
    celeb_hits = sum(1 for p in COMPILED_CELEB if p.search(text))
    fomo_hits = sum(1 for p in COMPILED_FOMO if p.search(text))
    disclosure_hits = sum(1 for p in COMPILED_DISCLOSURE if p.search(text))
    crypto_hits = sum(1 for p in COMPILED_CRYPTO if p.search(text))

    promise_sig = detect_unrealistic_promises(text)
    urg = detect_urgency_pressure(text)

    unrealistic_return = min(ret_hits * 0.3 + promise_sig["score"] * 0.7, 1.0)
    ponzi_mlm = min(mlm_hits * 0.35 + disclosure_hits * 0.2 + ret_hits * 0.15, 1.0)
    greed_appeal = min(fomo_hits * 0.25 + urg["score"] * 0.35 + celeb_hits * 0.25 + crypto_hits * 0.05, 1.0)

    investment_scam_risk = min(
        unrealistic_return * 0.4 +
        ponzi_mlm * 0.25 +
        greed_appeal * 0.25 +
        celeb_hits * 0.1,
        1.0
    )

    return {
        "investment_scam_risk": round(investment_scam_risk * 100, 1),
        "ponzi_mlm_risk": round(ponzi_mlm * 100, 1),
        "unrealistic_return_score": round(unrealistic_return * 100, 1),
        "greed_appeal_score": round(greed_appeal * 100, 1),
        "celeb_endorsement_hits": celeb_hits,
        "crypto_signal_hits": crypto_hits,
        "mlm_hits": mlm_hits,
    }
