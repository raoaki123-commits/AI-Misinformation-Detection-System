"""Analysis API routes for SENTINEL"""
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session

from app.schemas.schemas import AnalyzeRequest, AnalysisResult
from app.services.analysis_pipeline.pipeline import run_pipeline
from app.db.database import get_session
from app.models.models import AnalysisSession

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_text(request: AnalyzeRequest, session: Session = Depends(get_session)):
    """Run full analysis pipeline on submitted text."""
    if not request.text or len(request.text.strip()) < 30:
        raise HTTPException(status_code=422, detail="Input text must be at least 30 characters.")

    if len(request.text) > 50000:
        raise HTTPException(status_code=422, detail="Input text exceeds maximum length of 50,000 characters.")

    result = run_pipeline(
        text=request.text,
        mode=request.mode,
        source_url=request.source_url,
        analysis_mode=request.analysis_mode,
    )

    # Persist to DB
    db_record = AnalysisSession(
        analysis_id=result["analysis_id"],
        analysis_mode=result.get("analysis_mode", "misinformation"),
        input_type=result["input_type"],
        headline=result["headline"][:500] if result["headline"] else "",
        raw_text=request.text[:5000],
        verdict=result["verdict"],
        risk_level=result["risk_level"],
        overall_risk_score=result.get("overall_risk_score", 0.0),
        credibility_score=result.get("credibility_score") or 0.0,
        evidence_score=result.get("evidence_score") or 0.0,
        manipulation_score=result.get("manipulation_score") or 0.0,
        propaganda_score=result.get("propaganda_score") or 0.0,
        source_trust_score=result.get("source_trust_score") or 0.0,
        trust_score=result.get("trust_score") or 50.0,
        confidence=result["confidence"],
        topic_tags=json.dumps(result["topic_tags"]),
        analyst_summary=result["analyst_summary"],
        top_reasons=json.dumps(result["top_reasons"]),
        result_json=json.dumps(result),
    )
    session.add(db_record)
    session.commit()

    return result


@router.post("/analyze/file")
async def analyze_file(file: UploadFile = File(...), session: Session = Depends(get_session)):
    """Analyze uploaded text or PDF file."""
    if file.content_type not in ["text/plain", "application/pdf"]:
        raise HTTPException(status_code=422, detail="Only .txt and .pdf files are supported.")

    content = await file.read()

    if file.content_type == "text/plain":
        text = content.decode("utf-8", errors="replace")
    else:
        try:
            import pdfplumber
            import io
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"PDF parsing failed: {str(e)}")

    request = AnalyzeRequest(text=text)
    result = run_pipeline(text=text)

    db_record = AnalysisSession(
        analysis_id=result["analysis_id"],
        input_type=result["input_type"],
        headline=result["headline"][:500] if result["headline"] else "",
        raw_text=text[:5000],
        verdict=result["verdict"],
        risk_level=result["risk_level"],
        credibility_score=result["credibility_score"],
        evidence_score=result["evidence_score"],
        manipulation_score=result["manipulation_score"],
        propaganda_score=result["propaganda_score"],
        source_trust_score=result["source_trust_score"],
        confidence=result["confidence"],
        topic_tags=json.dumps(result["topic_tags"]),
        analyst_summary=result["analyst_summary"],
        top_reasons=json.dumps(result["top_reasons"]),
        result_json=json.dumps(result),
    )
    session.add(db_record)
    session.commit()

    return result
