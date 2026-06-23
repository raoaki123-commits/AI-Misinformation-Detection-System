"""Credibility scoring engine for SENTINEL"""
from typing import Dict, List


def compute_credibility_score(
    evidence_result: Dict,
    propaganda_result: Dict,
    emotion_result: Dict,
    claims: List[Dict],
    source_trust: float = 50.0,
) -> Dict:
    """
    Compute composite credibility and sub-scores.
    Returns a dict of normalized scores (0-100 scale).
    """
    # Evidence score (0-100)
    evidence_score = evidence_result.get("evidence_score", 20.0)

    # Propaganda score (0-100)
    propaganda_score = propaganda_result.get("propaganda_score", 0.0)

    # Manipulation score (0-100)
    manipulation_score = emotion_result.get("manipulation_score", 0.0)

    # Claim risk: average risk of top claims
    if claims:
        avg_claim_risk = sum(c["risk_score"] for c in claims[:5]) / min(len(claims), 5)
        claim_score = avg_claim_risk * 100  # 0-100
    else:
        claim_score = 20.0

    # Source trust: passed in as 0-100
    source_score = source_trust

    # Credibility = weighted combination
    # High evidence → higher credibility
    # High propaganda/manipulation/claim risk → lower credibility
    credibility = (
        evidence_score * 0.25
        + source_score * 0.15
        + (100 - propaganda_score) * 0.25
        + (100 - manipulation_score) * 0.20
        + (100 - claim_score) * 0.15
    )
    credibility = max(min(credibility, 100), 0)

    # Confidence (model certainty) — based on signal density
    n_markers = len(propaganda_result.get("markers", []))
    n_claims = len(claims)
    confidence = min(0.5 + (n_markers * 0.05) + (n_claims * 0.03), 0.97)

    return {
        "credibility": round(credibility, 1),
        "evidence": round(evidence_score, 1),
        "manipulation": round(manipulation_score, 1),
        "propaganda": round(propaganda_score, 1),
        "source_trust": round(source_score, 1),
        "confidence": round(confidence, 2),
    }
