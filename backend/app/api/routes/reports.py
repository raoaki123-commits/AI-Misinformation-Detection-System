"""Reports API routes for SENTINEL"""
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from typing import List, Optional

from app.db.database import get_session
from app.models.models import AnalysisSession
from app.schemas.schemas import ReportListItem, ReportDetail

router = APIRouter()


@router.get("/reports", response_model=List[ReportListItem])
async def list_reports(
    session: Session = Depends(get_session),
    mode: Optional[str] = Query(None, description="Filter by analysis_mode"),
    risk_level: Optional[str] = Query(None, description="Filter by risk_level"),
    limit: int = Query(50, le=200),
):
    stmt = select(AnalysisSession).order_by(AnalysisSession.created_at.desc())
    records = session.exec(stmt).all()

    # Apply filters
    if mode:
        records = [r for r in records if r.analysis_mode == mode]
    if risk_level:
        records = [r for r in records if r.risk_level.lower() == risk_level.lower()]
    records = records[:limit]

    return [
        ReportListItem(
            id=r.id,
            analysis_id=r.analysis_id,
            analysis_mode=r.analysis_mode,
            headline=r.headline or r.raw_text[:80],
            verdict=r.verdict,
            risk_level=r.risk_level,
            overall_risk_score=r.overall_risk_score,
            credibility_score=r.credibility_score if r.analysis_mode == "misinformation" else None,
            created_at=r.created_at.isoformat(),
        )
        for r in records
    ]


@router.get("/reports/{analysis_id}", response_model=ReportDetail)
async def get_report(analysis_id: str, session: Session = Depends(get_session)):
    record = session.exec(
        select(AnalysisSession).where(AnalysisSession.analysis_id == analysis_id)
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found")
    return ReportDetail(
        id=record.id,
        analysis_id=record.analysis_id,
        result=json.loads(record.result_json),
        created_at=record.created_at.isoformat(),
    )


@router.get("/reports/{analysis_id}/export")
async def export_report(analysis_id: str, session: Session = Depends(get_session)):
    """Export a report as JSON download."""
    record = session.exec(
        select(AnalysisSession).where(AnalysisSession.analysis_id == analysis_id)
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found")
    result_data = json.loads(record.result_json)
    return JSONResponse(
        content=result_data,
        headers={"Content-Disposition": f"attachment; filename=sentinel-report-{analysis_id[:8]}.json"},
    )


@router.delete("/reports/{analysis_id}")
async def delete_report(analysis_id: str, session: Session = Depends(get_session)):
    record = session.exec(
        select(AnalysisSession).where(AnalysisSession.analysis_id == analysis_id)
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found")
    session.delete(record)
    session.commit()
    return {"deleted": True}
