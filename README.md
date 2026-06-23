# SENTINEL — AI Misinformation Detection & Narrative Intelligence System

A production-grade intelligence platform that analyzes news articles, social media posts, public claims, and transcripts for **misinformation risk**, **propaganda patterns**, **emotional manipulation**, **evidence quality**, and **credibility**.

---

## 🛡️ Architecture

```
sentinel/
├── backend/                 # FastAPI backend (Python)
│   ├── app/
│   │   ├── main.py          # Application entry point + CORS
│   │   ├── api/routes/      # analyze + reports REST endpoints
│   │   ├── services/        # 8 independent analysis modules
│   │   │   ├── claim_extractor/
│   │   │   ├── propaganda_detector/
│   │   │   ├── emotion_detector/
│   │   │   ├── evidence_analyzer/
│   │   │   ├── narrative_analyzer/
│   │   │   ├── credibility_engine/
│   │   │   ├── summary_generator/
│   │   │   ├── source_profiler/
│   │   │   └── analysis_pipeline/  # orchestrates all services
│   │   ├── models/          # SQLModel DB models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── db/              # SQLite engine + session
│   │   └── utils/           # text preprocessing utilities
│   └── requirements.txt
│
└── frontend/                # Vite + React + TypeScript
    └── src/
        ├── pages/
        │   ├── HomePage.tsx       # Landing page
        │   ├── AnalyzePage.tsx    # Main intelligence console
        │   ├── ReportsPage.tsx    # Past analyses archive
        │   └── ComparePage.tsx    # Side-by-side comparison
        ├── components/
        │   ├── layout/AppShell.tsx
        │   ├── analysis/          # 6 dashboard panels
        │   ├── charts/RadarChart.tsx
        │   └── shared/            # ScoreGauge, Badge, etc.
        ├── services/api.ts        # Axios API layer
        ├── types/index.ts         # Full TypeScript types
        └── utils/index.ts         # Score helpers + demo text
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔬 Analysis Pipeline

SENTINEL runs every submission through a **6-stage pipeline**:

| Stage | Service | What It Does |
|---|---|---|
| 1 | **Claim Extractor** | Identifies factual assertions using 10 regex patterns, scores risk and evidence support |
| 2 | **Propaganda Detector** | Matches 10+ rhetorical techniques: fear appeal, scapegoating, us-vs-them, false urgency, etc. |
| 3 | **Emotion Detector** | Profiles fear, outrage, urgency, panic, disgust using keyword lexicons |
| 4 | **Evidence Analyzer** | Counts named sources, statistics, anonymous claims, unsupported assertions |
| 5 | **Narrative Analyzer** | Classifies dominant narrative frame (panic, conspiracy, victimization, etc.) |
| 6 | **Credibility Engine** | Aggregates all signals into a weighted 0–100 credibility score + verdict |

Final output also includes an **AI analyst summary** and **sentence-level highlights**.

---

## 📊 Output Scores

| Score | Range | Meaning |
|---|---|---|
| **Credibility** | 0–100 | Higher = more credible |
| **Evidence** | 0–100 | Higher = better sourcing |
| **Manipulation** | 0–100 | Higher = more emotionally manipulative |
| **Propaganda** | 0–100 | Higher = more propaganda techniques |
| **Source Trust** | 0–100 | Domain reputation estimate |

### Verdicts

- ✅ **Likely Reliable** — High credibility, low manipulation
- ⚠️ **Mixed / Unverified** — Some concerns, but not conclusive
- 🔴 **Propaganda-Heavy** — Dominated by rhetorical manipulation
- 🔴 **Emotionally Manipulative** — High emotion, low evidence
- 🔴 **Misleading Framing** — Narrative distortion detected
- 🚨 **High-Risk Misinformation** — Critical across all dimensions

---

## 🎨 Design System

Built on a **Victorian London Intelligence Console** aesthetic:

- **Colors**: Obsidian (#0a0a0c), Royal Blue (#3b5bdb), Electric (#4dabf7), Gold (#c9a84c), Crimson (#c92a2a)
- **Typography**: Cinzel (display), EB Garamond (editorial), Inter (body), JetBrains Mono (code)
- **Components**: Glassmorphism panels, score gauges, radar charts, sentence highlights, animated progress

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/analyze` | Submit text for analysis |
| `POST` | `/api/v1/analyze/file` | Upload .txt or .pdf file |
| `GET` | `/api/v1/reports` | List all past analyses |
| `GET` | `/api/v1/reports/{id}` | Get full report by analysis_id |
| `DELETE` | `/api/v1/reports/{id}` | Delete a report |
| `GET` | `/health` | Health check |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Your news article or post text here...", "mode": "deep"}'
```

---

## 🔧 Configuration

| Variable | Default | Description |
|---|---|---|
| Backend port | `8000` | Uvicorn bind port |
| Frontend port | `5173` | Vite dev server |
| DB path | `backend/sentinel.db` | SQLite database file |
| Max text length | `50,000 chars` | Per-request input limit |

---

## 📝 Notes

- **No external AI API required** — All analysis runs locally using heuristic NLP, regex, and lexicon-based scoring
- **SQLite persistence** — All analyses are saved and browsable in the Reports archive
- **PDF support** — Upload .pdf files via the file endpoint (requires `pdfplumber`)
- **Compare mode** — Side-by-side analysis of two content pieces

---

*SENTINEL — Intelligence beyond classification.*
