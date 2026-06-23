"""Propaganda and rhetorical pattern detector for SENTINEL"""
import re
from typing import List, Dict

PROPAGANDA_RULES = {
    "fear_appeal": {
        "patterns": [
            r'\b(danger|dangerous|threat|threatens?|deadly|fatal|kill|catastrophe|catastrophic|disaster|crisis|emergency|collapse|destroy|destruction|imminent)\b',
            r'\b(you (will|could|might) (die|lose|suffer|be harmed))\b',
            r'\b(we are (under|at) (attack|threat|risk))\b',
        ],
        "description": "Fear Appeal",
    },
    "outrage_bait": {
        "patterns": [
            r'\b(outrage|outrageous|disgusting|shameful|unacceptable|disgrace|scandal|shocking|appalling|absurd|insane)\b',
            r'\b(how dare|this is (unacceptable|wrong|a crime)|they (got away|escaped|betrayed))\b',
        ],
        "description": "Outrage Bait",
    },
    "us_vs_them": {
        "patterns": [
            r'\b(us vs them|us against them|the (elite|establishment|globalists?|deep state|mainstream media|left|right) (want|are|control|hide))\b',
            r'\b(patriots? vs|real (americans?|people)|the (people|citizens) vs)\b',
            r'\b(they (want|don.t want|are trying) (us|you|we) to)\b',
        ],
        "description": "Us-vs-Them Framing",
    },
    "scapegoating": {
        "patterns": [
            r'\b(blame|blaming|responsible for everything|caused all|root (cause|of all))\b',
            r'\b(it.s (the|their) fault|they caused|they are (behind|responsible))\b',
        ],
        "description": "Scapegoating",
    },
    "vague_authority": {
        "patterns": [
            r'\b(experts? say|scientists? say|officials? say|sources? say|insiders? say|they say)\b',
            r'\b(many people (believe|think|say|claim)|people are saying|everyone knows)\b',
            r'\b(studies? show|research (shows?|proves?|finds?)) (?!.*\d)',
        ],
        "description": "Vague Authority Appeal",
    },
    "absolutist_language": {
        "patterns": [
            r'\b(always|never|all|every (single)?|none|no one|nobody|everyone|the only|the entire|without (exception|question))\b',
            r'\b(the truth is|the fact is|undeniably|undoubtedly|clearly|obviously|it.s obvious)\b',
        ],
        "description": "Absolutist Language",
    },
    "conspiracy_framing": {
        "patterns": [
            r'\b(conspiracy|cover.?up|they (don.t|do not|won.t) want you to know|hidden (agenda|truth|plan)|what (they|mainstream media|the government) (hide|hiding|suppress|won.t tell))\b',
            r'\b(wake up|sheeple|brainwashed|sheep|red pill|the (matrix|system|narrative))\b',
            r'\b(planned|orchestrated|coordinated attack|inside job|false flag)\b',
        ],
        "description": "Conspiracy Framing",
    },
    "false_urgency": {
        "patterns": [
            r'\b(act now|urgent|immediately|before it.s too late|running out of time|last chance|now or never|do it (now|today))\b',
            r'\b(time (is|has) (running out|run out)|don.t wait|breaking news|developing story)\b',
        ],
        "description": "False Urgency",
    },
    "distrust_amplification": {
        "patterns": [
            r'\b(can.t trust|do not trust|don.t believe|fake news|lamestream|propaganda|corrupt (media|government|officials?)|biased)\b',
            r'\b(mainstream media (lies?|hides?|ignores?)|government (lies?|hides?|cover))\b',
        ],
        "description": "Distrust Amplification",
    },
    "emotional_loading": {
        "patterns": [
            r'\b(heartbreaking|devastating|horrific|terrifying|horrifying|nauseating|sickening|monstrous|vile|evil|pure evil|satanic)\b',
        ],
        "description": "Emotionally Loaded Wording",
    },
}


def detect_propaganda(sentences: List[str], full_text: str) -> Dict:
    markers = []
    total_score = 0.0
    text_lower = full_text.lower()

    for marker_key, rule in PROPAGANDA_RULES.items():
        hit_sentences = []
        hit_count = 0
        compiled = [re.compile(p, re.IGNORECASE) for p in rule["patterns"]]

        for sent in sentences:
            match_count = sum(1 for p in compiled if p.search(sent))
            if match_count > 0:
                hit_sentences.append(sent[:200])
                hit_count += match_count

        if hit_sentences:
            raw_intensity = min(0.4 + (hit_count * 0.12), 1.0)
            markers.append({
                "type": marker_key,
                "intensity": round(raw_intensity, 2),
                "examples": hit_sentences[:3],
                "description": rule["description"],
            })
            total_score += raw_intensity

    # Normalize overall propaganda score 0-100
    propaganda_score = min((total_score / max(len(PROPAGANDA_RULES), 1)) * 100 * 1.8, 100)

    markers.sort(key=lambda x: x["intensity"], reverse=True)

    return {
        "markers": markers,
        "propaganda_score": round(propaganda_score, 1),
        "dominant_type": markers[0]["type"] if markers else None,
    }
