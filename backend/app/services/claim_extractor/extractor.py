"""Claim extraction service for SENTINEL"""
import re

# Patterns that indicate factual assertions / claims
CLAIM_PATTERNS = [
    r'\b(proves?|shows?|reveals?|confirms?|admits?|exposes?|warns?)\b',
    r'\b(is|are|was|were)\s+(the|a)\s+\w+\s+(of|for|behind|causing)',
    r'\b(caused?|led to|resulted in|responsible for)\b',
    r'\b(according to|sources say|officials claim|reports suggest)\b',
    r'\b(always|never|all|every|none|no one|everyone|nobody)\b',
    r'\b(shocking|alarming|dangerous|deadly|catastrophic|devastating)\b',
    r'\b(conspiracy|cover.?up|secret|hidden|suppressed)\b',
    r'\b(government|officials?|authorities?)\s+(are|have|did|were)\b',
    r'\b(scientists?|experts?|researchers?|doctors?)\s+(say|claim|warn|find)\b',
    r'\b\d+\s*(percent|%|people|cases|deaths|million|billion)\b',
]

COMPILED_PATTERNS = [re.compile(p, re.IGNORECASE) for p in CLAIM_PATTERNS]

HIGH_RISK_WORDS = [
    'proven', 'confirmed', 'exposed', 'shocking', 'urgent', 'breaking',
    'everyone knows', 'nobody talks about', 'they hide', 'they don\'t want',
    'mainstream media', 'cover-up', 'conspiracy', 'fake', 'hoax',
    'secretly', 'hidden agenda', 'wake up', 'sheeple', 'brainwashed'
]

SUPPORT_KILLERS = [
    'according to', 'cited', 'study', 'research', 'evidence', 'data',
    'published', 'peer-reviewed', 'official', 'verified', 'source'
]


def score_claim_risk(sentence: str) -> float:
    """Heuristic risk score for a claim sentence."""
    text_lower = sentence.lower()
    risk = 0.0
    pattern_hits = sum(1 for p in COMPILED_PATTERNS if p.search(sentence))
    risk += min(pattern_hits * 0.12, 0.48)
    for word in HIGH_RISK_WORDS:
        if word in text_lower:
            risk += 0.15
    risk = min(risk, 1.0)
    return round(risk, 2)


def score_claim_support(sentence: str) -> float:
    """Heuristic support/evidence score for a claim."""
    text_lower = sentence.lower()
    support = 0.0
    for word in SUPPORT_KILLERS:
        if word in text_lower:
            support += 0.15
    # Named entity hints
    if re.search(r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b', sentence):  # Proper name
        support += 0.1
    if re.search(r'\b\d{4}\b', sentence):  # Year
        support += 0.05
    if re.search(r'https?://', sentence):  # URL
        support += 0.2
    return round(min(support, 1.0), 2)


def get_manipulation_notes(sentence: str) -> str:
    text_lower = sentence.lower()
    notes = []
    if any(w in text_lower for w in ['shocking', 'alarming', 'devastating', 'catastrophic']):
        notes.append("Uses sensationalist language")
    if any(w in text_lower for w in ['always', 'never', 'everyone', 'nobody', 'all']):
        notes.append("Contains absolutist phrasing")
    if any(w in text_lower for w in ['they', 'them', 'these people', 'those people']):
        notes.append("Vague 'them vs us' reference")
    if re.search(r'\b(secret|hidden|suppressed|covered up)\b', text_lower):
        notes.append("Conspiracy-type framing")
    return "; ".join(notes) if notes else "Standard assertion"


def get_evidence_notes(sentence: str) -> str:
    text_lower = sentence.lower()
    if re.search(r'\b(study|research|data|evidence|published)\b', text_lower):
        return "References research or data (quality unverifiable without source)"
    if re.search(r'\b(according to|citing|cites)\b', text_lower):
        return "Attributes to a source"
    if re.search(r'experts?|scientists?|doctors?', text_lower):
        if re.search(r'\bnamed?\b|Dr\.|Prof\.', sentence):
            return "Named expert cited"
        return "Anonymous expert reference ('experts say' without names)"
    return "No supporting evidence provided"


def extract_claims(sentences: list, full_text: str) -> list:
    claims = []
    for sent in sentences:
        if len(sent.split()) < 6:
            continue
        pattern_hits = sum(1 for p in COMPILED_PATTERNS if p.search(sent))
        if pattern_hits < 1:
            continue
        risk = score_claim_risk(sent)
        support = score_claim_support(sent)
        confidence = round(0.5 + (risk * 0.3) + (1 - support) * 0.2, 2)
        confidence = min(max(confidence, 0.4), 0.95)
        claims.append({
            "claim": sent[:300],
            "risk_score": risk,
            "support_score": support,
            "evidence_notes": get_evidence_notes(sent),
            "manipulation_notes": get_manipulation_notes(sent),
            "confidence": confidence,
        })
    # Sort by risk descending
    claims.sort(key=lambda x: x["risk_score"], reverse=True)
    return claims[:15]
