"""Source profiler for SENTINEL"""
import re
from typing import Optional, Dict

# Known source reputation hints (simplified heuristics)
KNOWN_SOURCE_PROFILES = {
    "reuters": {"trust": 88, "type": "Wire Service", "notes": "Internationally recognized wire service with strong editorial standards."},
    "bbc": {"trust": 84, "type": "Public Broadcaster", "notes": "UK public broadcaster. Generally high journalistic standards."},
    "ap": {"trust": 87, "type": "Wire Service", "notes": "Associated Press — nonpartisan wire service with rigorous standards."},
    "nytimes": {"trust": 78, "type": "Legacy Newspaper", "notes": "Major U.S. newspaper. Generally reliable; partisan perception on opinion sections."},
    "washingtonpost": {"trust": 76, "type": "Legacy Newspaper", "notes": "Major U.S. newspaper. Generally reliable."},
    "theguardian": {"trust": 75, "type": "Legacy Newspaper", "notes": "UK-based newspaper. Left-leaning perspective, generally factual."},
    "foxnews": {"trust": 55, "type": "Cable News", "notes": "Right-leaning U.S. cable news. Mixed factual record on opinion vs news."},
    "cnn": {"trust": 65, "type": "Cable News", "notes": "U.S. cable news network. Generally factual reporting; some partisan framing."},
    "breitbart": {"trust": 30, "type": "Partisan Media", "notes": "Far-right media outlet. Frequent factual rating issues."},
    "infowars": {"trust": 10, "type": "Conspiracy Media", "notes": "Consistently rated as a source of conspiracy theories and misinformation."},
    "snopes": {"trust": 85, "type": "Fact-Checker", "notes": "Established fact-checking organization."},
    "factcheck": {"trust": 85, "type": "Fact-Checker", "notes": "FactCheck.org — nonpartisan fact-checking site."},
}


def profile_source(source_url: Optional[str], text: str) -> Dict:
    if not source_url:
        # Try to extract from text
        url_match = re.search(r'https?://(?:www\.)?([a-zA-Z0-9\-]+)\.[a-zA-Z]{2,}', text)
        if url_match:
            source_url = url_match.group(0)
            domain = url_match.group(1).lower()
        else:
            # No source found
            return {
                "detected": False,
                "source_name": None,
                "source_type": None,
                "trust_score": 50,
                "notes": "No verifiable source metadata detected. Trust score defaulted to neutral.",
                "url": None,
            }
    else:
        domain_match = re.search(r'https?://(?:www\.)?([a-zA-Z0-9\-]+)\.', source_url)
        domain = domain_match.group(1).lower() if domain_match else source_url.lower()

    # Check known profiles
    for key, profile in KNOWN_SOURCE_PROFILES.items():
        if key in domain:
            return {
                "detected": True,
                "source_name": key.capitalize(),
                "source_type": profile["type"],
                "trust_score": profile["trust"],
                "notes": profile["notes"],
                "url": source_url,
            }

    # Unknown source — heuristic scoring
    trust = 50
    notes_parts = ["Source not in known profile database."]

    if re.search(r'\.(gov|edu)$', domain):
        trust = 70
        notes_parts.append("Government or educational domain detected — generally higher baseline trust.")
    elif re.search(r'blog|free|truth|real|pure|awaken|patriot|alert', domain, re.IGNORECASE):
        trust = 28
        notes_parts.append("Domain name contains high-risk indicators (e.g., 'truth', 'awaken', 'patriot').")
    elif len(domain) < 4:
        trust = 35
        notes_parts.append("Short, opaque domain name — limited transparency.")

    return {
        "detected": True,
        "source_name": domain,
        "source_type": "Unknown",
        "trust_score": trust,
        "notes": " ".join(notes_parts),
        "url": source_url,
    }
