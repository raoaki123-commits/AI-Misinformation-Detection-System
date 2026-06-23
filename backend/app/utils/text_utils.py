"""Text preprocessing utilities for SENTINEL"""
import re


def preprocess_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r'\r\n|\r', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text


def segment_sentences(text: str) -> list:
    """Simple but reliable sentence segmenter using regex."""
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z\'\"\(\[])', text)
    result = []
    for s in sentences:
        s = s.strip()
        if len(s) > 10:
            result.append(s)
    return result


def extract_headline(text: str) -> str:
    """Extract the first line or first sentence as headline."""
    lines = text.strip().split('\n')
    for line in lines:
        line = line.strip()
        if len(line) > 10:
            return line[:200]
    return text[:100]


def word_count(text: str) -> int:
    return len(text.split())


def contains_url(text: str) -> bool:
    return bool(re.search(r'https?://', text))
