"""Evidence quality analyzer for SENTINEL"""
import re
from typing import List, Dict

NAMED_SOURCE_PATTERNS = [
    r'\b(?:according to|cited by|reported by)\s+(?:the\s+)?([A-Z][a-zA-Z\s&]+(?:Times|Post|Journal|News|Institute|University|Organization|Agency|Center|Department|Ministry))\b',
    r'\bDr\.\s+[A-Z][a-z]+\b',
    r'\bProf(?:essor)?\.?\s+[A-Z][a-z]+\b',
    r'\b[A-Z][a-z]+\s+[A-Z][a-z]+,\s+(?:a|the)\s+\w+\s+(?:at|from|of)\b',
]

STATISTICS_PATTERNS = [
    r'\b\d+(?:\.\d+)?\s*(?:percent|%|million|billion|thousand)\b',
    r'\bone in \d+\b',
    r'\b\d+(?:\.\d+)?\s*(?:times|fold)\s+(?:more|less|higher|lower)\b',
]

CITATION_PATTERNS = [
    r'\b(?:study|studies|research|report|survey|analysis|data|findings?)\s+(?:published|conducted|released|from)\b',
    r'https?://\S+',
    r'\bpublished in\s+[A-Z]',
    r'\bper\s+(?:the|a)\s+\w+\s+(?:report|study|survey)\b',
]

ANONYMOUS_PATTERNS = [
    r'\b(?:sources?|insiders?|officials?)\s+(?:say|claim|told|report)\b',
    r'\bexperts?\s+(?:say|claim|warn|believe|think)\b(?!.*named)',
    r'\bsome\s+(?:people|experts|officials|scientists)\b',
    r'\bmany\s+(?:people|experts|observers|analysts)\b',
    r'\bpeople\s+are\s+saying\b',
]

UNSUPPORTED_CLAIM_PATTERNS = [
    r'\b(?:everyone knows|it.s obvious|clearly|undoubtedly|definitely|absolutely)\b',
    r'\b(?:proven|confirmed|exposed|revealed)\s+(?:that|to be)\b',
    r'\b(?:the truth is|the fact is|in reality|in fact)\b',
    r'\b(?:always|never)\s+(?:has|have|will|do|does)\b',
]


def analyze_evidence(sentences: List[str], full_text: str) -> Dict:
    named_sources = 0
    stats_refs = 0
    citation_refs = 0
    anonymous_claims = 0
    unsupported_assertions = 0

    compiled_named = [re.compile(p, re.IGNORECASE) for p in NAMED_SOURCE_PATTERNS]
    compiled_stats = [re.compile(p, re.IGNORECASE) for p in STATISTICS_PATTERNS]
    compiled_cite = [re.compile(p, re.IGNORECASE) for p in CITATION_PATTERNS]
    compiled_anon = [re.compile(p, re.IGNORECASE) for p in ANONYMOUS_PATTERNS]
    compiled_unsup = [re.compile(p, re.IGNORECASE) for p in UNSUPPORTED_CLAIM_PATTERNS]

    for sent in sentences:
        if any(p.search(sent) for p in compiled_named):
            named_sources += 1
        if any(p.search(sent) for p in compiled_stats):
            stats_refs += 1
        if any(p.search(sent) for p in compiled_cite):
            citation_refs += 1
        if any(p.search(sent) for p in compiled_anon):
            anonymous_claims += 1
        if any(p.search(sent) for p in compiled_unsup):
            unsupported_assertions += 1

    total_evidence_signals = named_sources + stats_refs + citation_refs
    total_weak_signals = anonymous_claims + unsupported_assertions

    if total_evidence_signals >= 4:
        quality = "Strong"
    elif total_evidence_signals >= 2:
        quality = "Moderate"
    elif total_evidence_signals == 1:
        quality = "Weak"
    else:
        quality = "Very Weak"

    # Evidence score 0-100
    evidence_score = min(
        (named_sources * 15 + stats_refs * 10 + citation_refs * 10)
        - (anonymous_claims * 8 + unsupported_assertions * 5),
        100
    )
    evidence_score = max(evidence_score, 5)

    return {
        "evidence_map": {
            "named_sources": named_sources,
            "statistics_references": stats_refs,
            "citation_like_references": citation_refs,
            "anonymous_claims": anonymous_claims,
            "unsupported_assertions": unsupported_assertions,
            "evidence_quality": quality,
        },
        "evidence_score": round(evidence_score, 1),
    }
