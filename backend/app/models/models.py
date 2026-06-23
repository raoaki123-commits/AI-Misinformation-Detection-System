"""SQLModel DB models for SENTINEL"""
import json
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class AnalysisSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: str = Field(index=True)
    analysis_mode: str = Field(default="misinformation", index=True)
    input_type: str = Field(default="article")
    headline: Optional[str] = None
    raw_text: str
    verdict: str
    risk_level: str
    overall_risk_score: float = Field(default=0.0)
    credibility_score: float = Field(default=0.0)
    evidence_score: float = Field(default=0.0)
    manipulation_score: float = Field(default=0.0)
    propaganda_score: float = Field(default=0.0)
    source_trust_score: float = Field(default=0.0)
    trust_score: float = Field(default=50.0)
    confidence: float
    topic_tags: str  # JSON list stored as string
    analyst_summary: str
    top_reasons: str  # JSON list stored as string
    result_json: str  # Full result stored as JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def get_topic_tags(self):
        return json.loads(self.topic_tags)

    def get_top_reasons(self):
        return json.loads(self.top_reasons)

    def get_result(self):
        return json.loads(self.result_json)

