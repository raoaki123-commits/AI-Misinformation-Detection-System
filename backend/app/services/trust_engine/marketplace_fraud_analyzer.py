"""Marketplace / Offer Fraud Analyzer for SENTINEL."""
import re
from typing import Dict
from app.services.trust_engine.fraud_signal_engine import (
    detect_financial_fraud_signals, detect_urgency_pressure
)

TOO_GOOD_OFFER = [
    r'\b(\d+|[0-9]+)\s*%\s*(off|discount|sale|deal|offer)\b',
    r'\b(free|complimentary)\s+(delivery|shipping|product|item|gift)\b',
    r'\b(clearance|closing|going out of business|stock clearance)\s+(sale|deal|offer)\b',
    r'\b(below|under)\s+(mrp|market|cost|wholesale)\b',
]
COMPILED_TOO_GOOD = [re.compile(p, re.IGNORECASE) for p in TOO_GOOD_OFFER]

ADVANCE_PAYMENT = [
    r'\b(advance|upfront|token|partial)\s+(payment|amount|deposit|money)\b',
    r'\bpay\s+(advance|first|before\s+(delivery|shipping|receiving))\b',
    r'\bonline\s+payment\s+(only|mandatory|required)\b',
    r'\btransfer\s+(the\s+)?amount\s+to\b',
]
COMPILED_ADVANCE = [re.compile(p, re.IGNORECASE) for p in ADVANCE_PAYMENT]

QR_SCAM = [
    r'\bscan\s+(the\s+)?qr\s+(code\s+)?to\s+(pay|transfer|send|receive|get)\b',
    r'\b(receive|get|collect)\s+(money|payment|refund|amount)\s+(via|by|through|using)\s+qr\b',
    r'\bi.ll\s+send\s+(you\s+)?the\s+qr\b',
]
COMPILED_QR = [re.compile(p, re.IGNORECASE) for p in QR_SCAM]

FAKE_REFUND = [
    r'\b(refund|cashback|return)\s+(of|worth)?\s*(rs\.?|inr|₹)?\s*\d+\s+(initiated|processed|sent|transferred)\b',
    r'\bclaim\s+(your|the)\s+(refund|cashback|money\s+back)\b',
    r'\brefund\s+link\b',
    r'\b(wrong|excess|extra)\s+(amount|payment|money)\s+(transferred|sent|received)\b',
]
COMPILED_REFUND = [re.compile(p, re.IGNORECASE) for p in FAKE_REFUND]

COURIER_SCAM = [
    r'\b(parcel|package|shipment|courier|delivery)\s+(held|stuck|detained|seized|blocked|stopped)\b',
    r'\bpay\s+(customs|duty|tax|clearance|release)\s+(fee|charge|amount)\b',
    r'\byour\s+(parcel|package).{0,40}(held|detained|seized)\b',
]
COMPILED_COURIER = [re.compile(p, re.IGNORECASE) for p in COURIER_SCAM]

NO_SELLER_IDENTITY = [
    r'\b(no|without)\s+(invoice|receipt|bill|warranty|guarantee)\b',
    r'\bdm\s+(me|us|to)\s+(buy|order|purchase)\b',
    r'\bwhatsapp\s+(to\s+)?(order|buy|purchase|get)\b',
]
COMPILED_NO_ID = [re.compile(p, re.IGNORECASE) for p in NO_SELLER_IDENTITY]


def analyze_marketplace_fraud(text: str) -> Dict:
    too_good_hits = sum(1 for p in COMPILED_TOO_GOOD if p.search(text))
    advance_hits = sum(1 for p in COMPILED_ADVANCE if p.search(text))
    qr_hits = sum(1 for p in COMPILED_QR if p.search(text))
    refund_hits = sum(1 for p in COMPILED_REFUND if p.search(text))
    courier_hits = sum(1 for p in COMPILED_COURIER if p.search(text))
    no_id_hits = sum(1 for p in COMPILED_NO_ID if p.search(text))

    fin = detect_financial_fraud_signals(text)
    urg = detect_urgency_pressure(text)

    payment_scam = min(advance_hits * 0.3 + qr_hits * 0.5 + fin["score"] * 0.3, 1.0)
    seller_penalty = min(no_id_hits * 0.3 + too_good_hits * 0.1 + urg["score"] * 0.2, 1.0)
    seller_trust = max(1.0 - seller_penalty, 0.0)
    courier_refund = min(courier_hits * 0.4 + refund_hits * 0.3, 1.0)

    offer_fraud_risk = min(
        payment_scam * 0.4 +
        (1 - seller_trust) * 0.25 +
        courier_refund * 0.2 +
        (too_good_hits * 0.08) +
        urg["score"] * 0.1,
        1.0
    )

    return {
        "offer_fraud_risk": round(offer_fraud_risk * 100, 1),
        "payment_scam_risk": round(payment_scam * 100, 1),
        "seller_trust_score": round(seller_trust * 100, 1),
        "courier_refund_risk": round(courier_refund * 100, 1),
        "qr_scam_hits": qr_hits,
        "advance_payment_hits": advance_hits,
    }
