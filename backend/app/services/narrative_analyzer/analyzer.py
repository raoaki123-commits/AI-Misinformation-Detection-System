"""Narrative framing analyzer for SENTINEL"""
import re
from typing import List, Dict

NARRATIVE_FRAMES = {
    "anti_institution": {
        "keywords": ["government", "authorities", "officials", "establishment", "system", "institution", "elite", "bureaucrats", "deep state", "corrupt officials"],
        "antagonist_patterns": [r'\b(government|authorities?|officials?)\s+(are|is|have|has)\s+(corrupt|lying|hiding|covering|failing)\b'],
        "primary": "Anti-Institution Panic Framing",
        "secondary": "Authority Distrust Amplification",
        "explanation": "The content consistently frames institutional actors as adversarial, corrupt, or deceptive — a classic pattern in content designed to erode trust in legitimate governance and expertise.",
    },
    "panic_collapse": {
        "keywords": ["collapse", "collapse of", "end of", "doomed", "catastrophe", "no going back", "point of no return", "spiral", "crisis"],
        "antagonist_patterns": [r'\b(everything|society|economy|country|civilization)\s+(is|are)\s+(collapsing|failing|doomed|falling apart)\b'],
        "primary": "Societal Collapse / Panic Framing",
        "secondary": "Catastrophism",
        "explanation": "The content employs catastrophic framing that portrays current events as unprecedented, irreversible crises — a technique designed to trigger fear-based responses and discourage critical evaluation.",
    },
    "victim_enemy": {
        "keywords": ["victims", "persecuted", "targeted", "attacked", "oppressed", "suppressed", "silenced", "censored", "they don't want"],
        "antagonist_patterns": [r'\b(they|the (government|media|elite))\s+(are|is|want to)\s+(silence|suppress|censor|target|persecute)\b'],
        "primary": "Victim-vs-Enemy Framing",
        "secondary": "Persecution Narrative",
        "explanation": "The content positions one group as innocent victims being actively targeted by a malevolent enemy — a polarizing framing technique common in partisan and conspiratorial content.",
    },
    "conspiratorial": {
        "keywords": ["cover-up", "conspiracy", "hidden", "secret", "they hide", "what they don't tell", "suppressed", "staged", "false flag", "orchestrated"],
        "antagonist_patterns": [r'\b(cover.?up|conspiracy|orchestrated|false flag|staged)\b'],
        "primary": "Conspiratorial Narrative",
        "secondary": "Hidden Truth Framing",
        "explanation": "The content asserts or strongly implies that powerful actors are deliberately hiding the truth — a hallmark of conspiratorial communication designed to circumvent fact-checking by making any counter-evidence part of the 'conspiracy.'",
    },
    "communal_polarization": {
        "keywords": ["them", "those people", "immigrants", "foreigners", "the left", "the right", "liberals", "conservatives", "patriots", "traitors"],
        "antagonist_patterns": [r'\b(liberals?|conservatives?|immigrants?|foreigners?)\s+(are|have|will|want)\b'],
        "primary": "Communal Polarization Framing",
        "secondary": "Identity-Based Threat Narrative",
        "explanation": "The content draws sharp identity boundaries between in-groups and out-groups, attributing threat or blame along communal lines — a strategy associated with incitement and division.",
    },
    "outrage_betrayal": {
        "keywords": ["betrayal", "betrayed", "sold out", "lied to", "deceived", "treason", "traitors", "scandal"],
        "antagonist_patterns": [r'\b(betrayed?|sold out|lied to|deceived|treason|traitor)\b'],
        "primary": "Outrage / Betrayal Framing",
        "secondary": "Moral Indignation Amplification",
        "explanation": "The content is structured around a sense of moral betrayal, designed to generate outrage and emotional investment in a narrative of wrongdoing — often at the cost of factual accuracy.",
    },
}


def analyze_narrative(sentences: List[str], full_text: str, propaganda_result: Dict) -> Dict:
    text_lower = full_text.lower()
    frame_scores = {}

    for frame_key, frame_data in NARRATIVE_FRAMES.items():
        score = 0
        # Keyword scoring
        for kw in frame_data["keywords"]:
            if kw in text_lower:
                score += 1
        # Pattern scoring
        for pat in frame_data.get("antagonist_patterns", []):
            if re.search(pat, full_text, re.IGNORECASE):
                score += 3
        frame_scores[frame_key] = score

    # Sort by score
    sorted_frames = sorted(frame_scores.items(), key=lambda x: x[1], reverse=True)

    if not sorted_frames or sorted_frames[0][1] == 0:
        # Fallback from propaganda
        dominant_prop = propaganda_result.get("dominant_type")
        if dominant_prop == "fear_appeal":
            primary_key = "panic_collapse"
        elif dominant_prop in ["us_vs_them", "scapegoating"]:
            primary_key = "communal_polarization"
        elif dominant_prop == "conspiracy_framing":
            primary_key = "conspiratorial"
        else:
            primary_key = "anti_institution"
        frame_data = NARRATIVE_FRAMES[primary_key]
        return {
            "primary": frame_data["primary"],
            "secondary": "General Credibility Concern",
            "explanation": "Limited narrative framing signals detected. Content shows general credibility concerns without dominant conspiratorial or polarizing patterns.",
        }

    primary_key = sorted_frames[0][0]
    secondary_key = sorted_frames[1][0] if len(sorted_frames) > 1 and sorted_frames[1][1] > 0 else None

    primary_frame = NARRATIVE_FRAMES[primary_key]
    secondary_label = NARRATIVE_FRAMES[secondary_key]["primary"] if secondary_key else "Credibility Risk"

    return {
        "primary": primary_frame["primary"],
        "secondary": secondary_label,
        "explanation": primary_frame["explanation"],
    }
