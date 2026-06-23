"""Emotion and manipulation intensity detector for SENTINEL"""
import re
from typing import List, Dict

EMOTION_LEXICONS = {
    "fear": [
        "fear", "afraid", "terrified", "terror", "scared", "frightened", "dread",
        "panic", "paranoia", "alarming", "threatening", "danger", "deadly",
        "death", "die", "kill", "destroy", "catastrophe", "collapse", "nightmare",
        "risk", "hazard", "lethal", "fatal", "peril", "threat"
    ],
    "outrage": [
        "outrage", "outrageous", "furious", "angry", "anger", "rage", "enrage",
        "disgusting", "disgusted", "appalling", "appalled", "shocking", "shocked",
        "unacceptable", "betrayal", "betrayed", "scandal", "shameful", "disgrace",
        "corrupt", "corruption", "criminal", "atrocity"
    ],
    "urgency": [
        "urgent", "immediately", "now", "breaking", "developing", "critical",
        "emergency", "alert", "warning", "action required", "act now",
        "before it's too late", "running out of time", "must act"
    ],
    "panic": [
        "panic", "chaotic", "chaos", "spiraling", "out of control",
        "collapse", "collapsing", "end of", "doomed", "lost control",
        "no hope", "catastrophic", "apocalyptic", "unprecedented crisis"
    ],
    "disgust": [
        "disgusting", "revolting", "repulsive", "nauseating", "vile",
        "sickening", "repugnant", "abhorrent", "monstrous", "horrifying",
        "hideous", "foul", "loathsome"
    ],
}


def detect_emotions(full_text: str, sentences: List[str]) -> Dict:
    text_lower = full_text.lower()
    word_count = max(len(full_text.split()), 1)
    profile = {}

    for emotion, words in EMOTION_LEXICONS.items():
        hits = sum(text_lower.count(w) for w in words)
        # Normalize: hits per 100 words, capped at 1.0
        score = min((hits / word_count) * 40, 1.0)
        profile[emotion] = round(score, 2)

    # Identify high-emotion sentences
    high_emotion_sentences = []
    for sent in sentences:
        sent_lower = sent.lower()
        sent_hits = sum(
            sum(sent_lower.count(w) for w in words)
            for words in EMOTION_LEXICONS.values()
        )
        if sent_hits >= 2:
            high_emotion_sentences.append(sent)

    # Overall manipulation score: weighted average of emotion scores
    weights = {"fear": 0.3, "outrage": 0.25, "urgency": 0.2, "panic": 0.15, "disgust": 0.1}
    manipulation_score = sum(profile.get(k, 0) * w for k, w in weights.items()) * 100

    return {
        "profile": profile,
        "manipulation_score": round(min(manipulation_score, 100), 1),
        "high_emotion_sentences": high_emotion_sentences[:10],
    }
