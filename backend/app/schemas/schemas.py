"""Pydantic schemas for SENTINEL API — Multi-Mode Trust & Scam Intelligence Platform"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


# ── Request ───────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    text: str
    mode: str = "deep"                        # quick | deep (pipeline depth)
    analysis_mode: str = "misinformation"     # misinformation | job_scam | phishing |
                                              # investment_scam | marketplace_fraud |
                                              # scholarship_scam | general_trust
    source_url: Optional[str] = None


# ── Shared sub-schemas ────────────────────────────────────────────────────────

class SentenceAnnotation(BaseModel):
    sentence: str
    flags: List[str]
    risk_score: float
    explanation: str


class Claim(BaseModel):
    claim: str
    risk_score: float
    support_score: float
    evidence_notes: str
    manipulation_notes: str
    confidence: float


class EvidenceMap(BaseModel):
    named_sources: int
    statistics_references: int
    citation_like_references: int
    anonymous_claims: int
    unsupported_assertions: int
    evidence_quality: str


class PropagandaMarker(BaseModel):
    type: str
    intensity: float
    examples: List[str]
    description: str = ""


class EmotionProfile(BaseModel):
    fear: float
    outrage: float
    urgency: float
    panic: float
    disgust: float


class NarrativeFrame(BaseModel):
    primary: str
    secondary: str
    explanation: str


# ── Scam / Trust schemas ──────────────────────────────────────────────────────

class RedFlag(BaseModel):
    type: str
    severity: str          # "critical" | "high" | "medium" | "low"
    description: str


class ModeSpecificData(BaseModel):
    # Job scam
    recruiter_trust_score: Optional[float] = None
    fee_fraud_risk: Optional[float] = None
    identity_theft_risk: Optional[float] = None
    compensation_realism_score: Optional[float] = None
    role_clarity_score: Optional[float] = None
    # Phishing
    phishing_risk_score: Optional[float] = None
    impersonation_confidence: Optional[float] = None
    credential_theft_risk: Optional[float] = None
    urgency_fear_score: Optional[float] = None
    link_suspicion_score: Optional[float] = None
    # Investment scam
    investment_scam_risk: Optional[float] = None
    ponzi_mlm_risk: Optional[float] = None
    unrealistic_return_score: Optional[float] = None
    greed_appeal_score: Optional[float] = None
    # Marketplace fraud
    offer_fraud_risk: Optional[float] = None
    payment_scam_risk: Optional[float] = None
    seller_trust_score: Optional[float] = None
    courier_refund_risk: Optional[float] = None
    # Scholarship/visa scam
    opportunity_scam_risk: Optional[float] = None
    institution_trust_score: Optional[float] = None
    fee_fraud_score: Optional[float] = None
    documentation_risk: Optional[float] = None
    # General trust
    fraud_risk_score: Optional[float] = None
    extra: Optional[Dict[str, Any]] = None


# ── Main result ───────────────────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    analysis_id: str
    analysis_mode: str = "misinformation"
    input_type: str
    headline: str
    verdict: str
    risk_level: str
    confidence: float
    topic_tags: List[str]
    analyst_summary: str
    top_reasons: List[str]
    sentence_annotations: List[SentenceAnnotation]
    red_flags: List[RedFlag] = []
    # Universal scores
    overall_risk_score: float = 0.0
    trust_score: float = 50.0
    manipulation_score: float = 0.0
    # Mode-specific sub-scores
    mode_specific: Optional[ModeSpecificData] = None
    # Misinformation-only (optional for scam modes)
    credibility_score: Optional[float] = None
    evidence_score: Optional[float] = None
    propaganda_score: Optional[float] = None
    source_trust_score: Optional[float] = None
    narrative_frame: Optional[NarrativeFrame] = None
    claims: Optional[List[Claim]] = None
    evidence_map: Optional[EvidenceMap] = None
    propaganda_markers: Optional[List[PropagandaMarker]] = None
    emotion_profile: Optional[EmotionProfile] = None


# ── Report list / detail ──────────────────────────────────────────────────────

class ReportListItem(BaseModel):
    id: int
    analysis_id: str
    analysis_mode: str
    headline: str
    verdict: str
    risk_level: str
    overall_risk_score: float
    credibility_score: Optional[float] = None
    created_at: str


class ReportDetail(BaseModel):
    id: int
    analysis_id: str
    result: dict
    created_at: str

