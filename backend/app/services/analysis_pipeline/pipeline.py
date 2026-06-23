"""
SENTINEL Analysis Pipeline Orchestrator
Routes to misinformation engine or scam/trust engine based on analysis_mode.
"""
import uuid
from datetime import datetime

from app.services.claim_extractor.extractor import extract_claims
from app.services.propaganda_detector.detector import detect_propaganda
from app.services.emotion_detector.detector import detect_emotions
from app.services.evidence_analyzer.analyzer import analyze_evidence
from app.services.narrative_analyzer.analyzer import analyze_narrative
from app.services.credibility_engine.scorer import compute_credibility_score
from app.services.summary_generator.generator import generate_summary
from app.services.source_profiler.profiler import profile_source
from app.utils.text_utils import preprocess_text, segment_sentences, extract_headline

# Trust engine imports
from app.services.trust_engine.fraud_signal_engine import run_shared_signals
from app.services.trust_engine.job_scam_analyzer import analyze_job_scam
from app.services.trust_engine.phishing_analyzer import analyze_phishing
from app.services.trust_engine.investment_scam_analyzer import analyze_investment_scam
from app.services.trust_engine.marketplace_fraud_analyzer import analyze_marketplace_fraud
from app.services.trust_engine.scholarship_scam_analyzer import analyze_scholarship_scam
from app.services.trust_engine.general_trust_analyzer import analyze_general_trust
from app.services.trust_engine.scam_verdict_engine import get_verdict
from app.services.trust_engine.scam_sentence_annotator import annotate_scam_sentences
from app.services.trust_engine.scam_summary_generator import (
    generate_scam_summary, build_red_flags, build_top_reasons_scam
)


def run_pipeline(text: str, mode: str = "deep", source_url: str = None,
                 analysis_mode: str = "misinformation") -> dict:
    """
    Main pipeline entry point. Routes to misinformation or scam engine
    based on analysis_mode.
    """
    if analysis_mode == "misinformation":
        return _run_misinfo_pipeline(text, mode, source_url)
    else:
        return _run_scam_pipeline(text, analysis_mode)


def _run_scam_pipeline(text: str, analysis_mode: str) -> dict:
    """Trust / Scam intelligence pipeline for all non-misinformation modes."""
    analysis_id = str(uuid.uuid4())
    clean_text = preprocess_text(text)
    sentences = segment_sentences(clean_text)
    headline = extract_headline(clean_text)

    # Run shared signals
    signals = run_shared_signals(clean_text)

    # Run mode-specific analyzer
    ANALYZERS = {
        "job_scam": analyze_job_scam,
        "phishing": analyze_phishing,
        "investment_scam": analyze_investment_scam,
        "marketplace_fraud": analyze_marketplace_fraud,
        "scholarship_scam": analyze_scholarship_scam,
        "general_trust": analyze_general_trust,
    }
    analyzer_fn = ANALYZERS.get(analysis_mode, analyze_general_trust)
    mode_scores = analyzer_fn(clean_text)

    # Primary risk score
    primary_key = {
        "job_scam": "job_scam_risk",
        "phishing": "phishing_risk_score",
        "investment_scam": "investment_scam_risk",
        "marketplace_fraud": "offer_fraud_risk",
        "scholarship_scam": "opportunity_scam_risk",
        "general_trust": "fraud_risk_score",
    }.get(analysis_mode, "fraud_risk_score")
    overall_risk_score = mode_scores.get(primary_key, 0.0)

    # Trust score
    trust_score_key = {
        "job_scam": "recruiter_trust_score",
        "phishing": None,
        "investment_scam": None,
        "marketplace_fraud": "seller_trust_score",
        "scholarship_scam": "institution_trust_score",
        "general_trust": "trust_score",
    }.get(analysis_mode)
    trust_score = mode_scores.get(trust_score_key, max(100 - overall_risk_score, 0)) if trust_score_key else max(100 - overall_risk_score, 0)

    # Manipulation score from urgency/promises
    manipulation_score = min(
        signals["urgency_pressure"]["score"] * 50 +
        signals["unrealistic_promises"]["score"] * 30 +
        signals["impersonation"]["score"] * 20,
        100.0
    )

    # Verdict
    verdict, risk_level = get_verdict(analysis_mode, overall_risk_score)

    # Red flags
    red_flags = build_red_flags(analysis_mode, mode_scores, signals)

    # Sentence annotations
    sentence_annotations = annotate_scam_sentences(sentences)

    # Top reasons
    top_reasons = build_top_reasons_scam(analysis_mode, mode_scores, red_flags)

    # Summary
    analyst_summary = generate_scam_summary(
        mode=analysis_mode,
        verdict=verdict,
        risk_score=overall_risk_score,
        risk_level=risk_level,
        red_flags=red_flags,
        mode_scores=mode_scores,
        top_reasons=top_reasons,
    )

    # Topic tags
    topic_tags = _infer_topic_tags_scam(analysis_mode)

    # Confidence
    confidence = round(min(0.55 + overall_risk_score / 200, 0.97), 2)

    # Build mode_specific dict from mode_scores
    mode_specific = {k: v for k, v in mode_scores.items()
                     if isinstance(v, (int, float)) and not k.endswith("_hits")}

    return {
        "analysis_id": analysis_id,
        "analysis_mode": analysis_mode,
        "input_type": "text",
        "headline": headline,
        "verdict": verdict,
        "risk_level": risk_level,
        "overall_risk_score": round(overall_risk_score, 1),
        "trust_score": round(trust_score, 1),
        "manipulation_score": round(manipulation_score, 1),
        "confidence": confidence,
        "topic_tags": topic_tags,
        "analyst_summary": analyst_summary,
        "top_reasons": top_reasons,
        "sentence_annotations": sentence_annotations,
        "red_flags": red_flags,
        "mode_specific": mode_specific,
        # Null out misinformation-only fields
        "credibility_score": None,
        "evidence_score": None,
        "propaganda_score": None,
        "source_trust_score": None,
        "narrative_frame": None,
        "claims": None,
        "evidence_map": None,
        "propaganda_markers": None,
        "emotion_profile": None,
    }


def _infer_topic_tags_scam(analysis_mode: str) -> list:
    return {
        "job_scam": ["recruitment", "job fraud", "employment scam"],
        "phishing": ["phishing", "impersonation", "cyber fraud"],
        "investment_scam": ["investment fraud", "crypto scam", "financial fraud"],
        "marketplace_fraud": ["marketplace fraud", "online shopping", "seller scam"],
        "scholarship_scam": ["scholarship fraud", "visa scam", "opportunity fraud"],
        "general_trust": ["general fraud", "deception", "trust risk"],
    }.get(analysis_mode, ["general"])



def _run_misinfo_pipeline(text: str, mode: str = "deep", source_url: str = None) -> dict:
    """Original misinformation / propaganda analysis pipeline."""
    analysis_id = str(uuid.uuid4())

    # 1. Preprocess
    clean_text = preprocess_text(text)
    sentences = segment_sentences(clean_text)
    headline = extract_headline(clean_text)

    # 2. Run individual services
    claims = extract_claims(sentences, clean_text)
    propaganda_result = detect_propaganda(sentences, clean_text)
    emotion_result = detect_emotions(clean_text, sentences)
    evidence_result = analyze_evidence(sentences, clean_text)
    narrative_result = analyze_narrative(sentences, clean_text, propaganda_result)
    source_result = profile_source(source_url, clean_text)

    # 3. Sentence-level annotations
    sentence_annotations = build_sentence_annotations(
        sentences, propaganda_result, emotion_result, claims
    )

    # 4. Aggregate scores
    scores = compute_credibility_score(
        evidence_result=evidence_result,
        propaganda_result=propaganda_result,
        emotion_result=emotion_result,
        claims=claims,
        source_trust=source_result.get("trust_score", 50),
    )

    # 5. Verdict
    verdict, risk_level = determine_verdict(scores)

    # 6. Topic tags
    topic_tags = infer_topic_tags(clean_text, propaganda_result)

    # 7. Analyst summary
    analyst_summary = generate_summary(
        verdict=verdict,
        scores=scores,
        propaganda_result=propaganda_result,
        evidence_result=evidence_result,
        narrative_result=narrative_result,
        top_claims=claims[:3],
    )

    # 8. Top reasons
    top_reasons = build_top_reasons(
        scores=scores,
        propaganda_result=propaganda_result,
        evidence_result=evidence_result,
        emotion_result=emotion_result,
    )

    result = {
        "analysis_id": analysis_id,
        "input_type": "article",
        "headline": headline,
        "verdict": verdict,
        "risk_level": risk_level,
        "credibility_score": round(scores["credibility"], 1),
        "evidence_score": round(scores["evidence"], 1),
        "manipulation_score": round(scores["manipulation"], 1),
        "propaganda_score": round(scores["propaganda"], 1),
        "source_trust_score": round(source_result.get("trust_score", 50), 1),
        "confidence": round(scores["confidence"], 2),
        "topic_tags": topic_tags,
        "analyst_summary": analyst_summary,
        "top_reasons": top_reasons,
        "narrative_frame": narrative_result,
        "sentence_annotations": sentence_annotations,
        "claims": claims,
        "evidence_map": evidence_result["evidence_map"],
        "propaganda_markers": propaganda_result["markers"],
        "emotion_profile": emotion_result["profile"],
        # Universal multi-mode fields
        "analysis_mode": "misinformation",
        "overall_risk_score": round(100 - scores["credibility"], 1),
        "trust_score": round(scores["credibility"], 1),
        "manipulation_score": round(scores["manipulation"], 1),
        "red_flags": [],
        "mode_specific": None,
    }
    return result


def build_sentence_annotations(sentences, propaganda_result, emotion_result, claims):
    """Build per-sentence annotation list."""
    annotations = []
    high_emotion_sentences = {s for s in emotion_result.get("high_emotion_sentences", [])}
    prop_sentences = {ex for m in propaganda_result["markers"] for ex in m.get("examples", [])}
    claim_texts = {c["claim"] for c in claims if c["risk_score"] > 0.6}

    for sent in sentences:
        if len(sent.strip()) < 15:
            continue
        flags = []
        risk = 0.0
        explanation_parts = []

        if sent in high_emotion_sentences or any(s in sent for s in high_emotion_sentences):
            flags.append("emotional_escalation")
            risk = max(risk, 0.65)
            explanation_parts.append("Contains emotionally charged language")

        for marker_ex in prop_sentences:
            if marker_ex in sent or sent in marker_ex:
                flags.append("propaganda_cue")
                risk = max(risk, 0.75)
                explanation_parts.append("Detected propaganda rhetoric pattern")
                break

        if any(c in sent for c in claim_texts):
            flags.append("unsupported_claim")
            risk = max(risk, 0.7)
            explanation_parts.append("Asserts a high-risk claim without clear evidence")

        if flags:
            annotations.append({
                "sentence": sent,
                "flags": list(set(flags)),
                "risk_score": round(min(risk, 1.0), 2),
                "explanation": "; ".join(explanation_parts) if explanation_parts else "Flagged by analysis pipeline",
            })

    return annotations


def determine_verdict(scores: dict) -> tuple:
    cred = scores["credibility"]
    manip = scores["manipulation"]
    prop = scores["propaganda"]
    evid = scores["evidence"]

    if cred >= 70 and manip < 30 and prop < 30:
        return "Likely Reliable", "Low"
    elif cred >= 55 and manip < 50:
        return "Mixed / Unverified", "Moderate"
    elif prop >= 65:
        return "Propaganda-Heavy", "High"
    elif manip >= 65:
        return "Emotionally Manipulative", "High"
    elif evid < 30 and cred < 40:
        return "High-Risk Misinformation", "Critical"
    else:
        return "Misleading Framing", "High"


def infer_topic_tags(text: str, propaganda_result: dict) -> list:
    text_lower = text.lower()
    tags = []
    topic_keywords = {
        "politics": ["government", "election", "senate", "congress", "president", "political", "democrat", "republican", "parliament"],
        "health": ["vaccine", "virus", "pandemic", "covid", "disease", "medical", "health", "hospital", "doctor"],
        "finance": ["economy", "stock", "market", "inflation", "bank", "financial", "currency", "trade", "investment"],
        "geopolitics": ["war", "military", "nato", "russia", "china", "ukraine", "conflict", "sanctions", "diplomacy"],
        "public safety": ["crime", "police", "terrorist", "attack", "threat", "safety", "emergency", "danger"],
    }
    for tag, keywords in topic_keywords.items():
        if any(kw in text_lower for kw in keywords):
            tags.append(tag)
    if not tags:
        tags = ["general"]
    return tags[:3]


def build_top_reasons(scores, propaganda_result, evidence_result, emotion_result):
    reasons = []
    if scores["manipulation"] > 60:
        reasons.append(f"High emotional manipulation score ({scores['manipulation']:.0f}/100) — content uses emotionally charged language designed to bypass rational evaluation.")
    if scores["propaganda"] > 55:
        top_markers = [m["type"].replace("_", " ").title() for m in propaganda_result["markers"][:2]]
        reasons.append(f"Detected propaganda techniques: {', '.join(top_markers) if top_markers else 'rhetorical manipulation patterns'}.")
    ev_map = evidence_result["evidence_map"]
    if ev_map["unsupported_assertions"] > 2:
        reasons.append(f"{ev_map['unsupported_assertions']} unsupported assertions detected — claims made without verifiable evidence or named sources.")
    if ev_map["anonymous_claims"] > 1:
        reasons.append(f"{ev_map['anonymous_claims']} anonymous or vague source references detected ('experts say', 'sources claim').")
    if ev_map["named_sources"] == 0:
        reasons.append("No named, verifiable sources identified in the content.")
    if scores["evidence"] < 35:
        reasons.append(f"Evidence quality rated as weak ({scores['evidence']:.0f}/100) — lacks citations, data references, or named expert sources.")
    if not reasons:
        reasons.append("Content analysis indicates moderate credibility concerns requiring further verification.")
    return reasons[:5]
