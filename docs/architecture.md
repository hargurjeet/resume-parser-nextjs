# Architecture

## System Overview

```
User (browser)
    │
    ├── http://localhost:8501  ──► Streamlit UI (legacy — streamlit_ui/ui.py)
    │                                   │
    │                                   │ POST /resume/parse (multipart/form-data)
    │                                   ▼
    ├── http://localhost:3000  ──► Next.js UI (frontend/ — in progress)
    │                                   │
    │                                   │ POST /resume/parse (multipart/form-data)
    │                                   ▼
    └── http://localhost:8000  ──► FastAPI Backend (app/main.py)
                                        │
                                        ▼
                                  routes.py
                                  - validates file is PDF
                                  - saves to /tmp/<uuid>.pdf
                                        │
                                        ▼
                                  FireworksResumeParser (app/services/parser.py)
                                  - pdfplumber extracts raw text
                                  - builds prompt
                                  - calls Fireworks AI via instructor
                                        │
                                        ▼
                                  Fireworks AI (Llama 3.3 70B Instruct)
                                  - JSON-mode structured output
                                        │
                                        ▼
                                  instructor validates response
                                  against ParsedResume (Pydantic)
                                        │
                                        ▼
                                  JSON response returned to UI
```

## Component Breakdown

### FastAPI Backend (`app/`) — unchanged throughout UI migration

```
app/
├── main.py          # App factory — mounts router, adds CORS middleware
├── api/
│   └── routes.py    # POST /resume/parse — file upload handler
├── services/
│   └── parser.py    # FireworksResumeParser — all AI logic lives here
├── models/
│   └── resume.py    # Pydantic models (ParsedResume and nested types)
├── core/
│   └── config.py    # Settings loaded from .env via pydantic-settings (Fireworks API key, model, base URL)
└── utils/
    └── pdf.py       # Standalone PDF extraction helper (not currently used by parser)
```

### Legacy Streamlit Frontend (`streamlit_ui/`)

Single file (`ui.py`). Responsibilities:
- File uploader widget (PDF only)
- POSTs to `http://localhost:8000/resume/parse`
- Renders: name, experience, role, location, email, summary, work history, skills, education, certifications
- Download button for raw JSON

**Status**: functional and deployed to HF Spaces. Being replaced by Next.js.

### Next.js Frontend (`frontend/`) — in progress

Split-view layout: PDF viewer on the left (40%), parsed data on the right (60%).

```
frontend/src/
├── app/
│   ├── layout.tsx              # ThemeProvider, metadata
│   ├── page.tsx                # Main split-view page
│   └── globals.css
├── components/
│   ├── ResumeUploader.tsx      # Drag-and-drop + API call + progress steps
│   ├── PdfViewer.tsx           # react-pdf inline viewer (page nav)
│   └── resume/
│       ├── CandidateHeader.tsx # Name, role badge, location, email, icon links
│       ├── SkillTags.tsx       # Skills grouped by category with colored pills
│       ├── ExperienceTimeline.tsx  # Vertical timeline of work history
│       ├── EducationCards.tsx  # One card per education entry
│       ├── ProjectGrid.tsx     # 2-column card grid with tech badges
│       ├── CertificationList.tsx   # Horizontal badge list
│       └── LanguageTags.tsx    # Language badge list
├── lib/
│   ├── api.ts                  # parseResume() fetch wrapper
│   └── mock.ts                 # Sample data for component testing
└── types/
    └── resume.ts               # TypeScript interfaces (mirrors Pydantic models)
```

**Target UI layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Resume Parser                                 [Dark/Light toggle]│
├──────────────────────────┬───────────────────────────────────────┤
│  PDF VIEWER (40%)        │  PARSED RESULT (60%)                  │
│                          │                                        │
│  [PDF rendered inline,   │  Hargurjeet Singh Ganger              │
│   scrollable, with       │  Senior Data Scientist · 15 yrs       │
│   prev/next page nav]    │  Bangalore · email · phone             │
│                          │  [LinkedIn] [GitHub] [Portfolio]       │
│                          │                                        │
│                          │  ── Skills ──────────────────────     │
│                          │  [Python🔵][ML🔵][FastAPI🟣][AWS🟢]  │
│                          │                                        │
│                          │  ── Experience ───────────────────    │
│                          │  ● BT · Senior Data Scientist          │
│                          │    May 2022 – Present                  │
│                          │                                        │
│                          │  ── Education ────────────────────    │
│                          │  M.S. ML & AI · Liverpool JMU          │
│                          │                                        │
│                          │  ── Projects ─────────────────────    │
│                          │  [Agentic Search] [Blog Generator]     │
│                          │                                        │
│                          │  ── Certifications ───────────────    │
│                          │  [Azure] [GCP]                         │
│                          │                                        │
│                          │  [Download JSON]                       │
└──────────────────────────┴───────────────────────────────────────┘
```

### Docker / Current Deployment

Both services run in a single container:
- `start.sh` launches `uvicorn` (FastAPI) on port 8000, then `streamlit` on port 8501
- `Dockerfile` uses `python:3.10-slim` with `poppler-utils` for PDF support
- `.streamlit/config.toml` is copied into the image — required to disable XSRF/CORS for HF Spaces

### Hugging Face Spaces (current)

Deployed at: https://huggingface.co/spaces/Hargurjeet/Resume_parser

```
GitHub repo (main branch)
    │
    │  push triggers
    ▼
.github/workflows/sync-to-hf.yml
    │  huggingface_hub.upload_folder() — REST API, not git
    ▼
HF Space (Docker)
    │  builds from Dockerfile
    ▼
Container: uvicorn :8000 + streamlit :8501
    │  HF proxies only port 8501
    ▼
User browser → https://hargurjeet-resume-parser.hf.space
```

**HF Spaces 403 fix**: Streamlit's XSRF protection conflicts with HF's reverse proxy. Disabled via `.streamlit/config.toml` AND `--server.enableXsrfProtection false` flag in `start.sh`. The Dockerfile must include `COPY .streamlit ./.streamlit` or the config file is never picked up.

### Planned Deployment (after Next.js is complete)

```
Next.js frontend  →  Vercel (free tier)
                      NEXT_PUBLIC_API_URL=<Railway URL>

FastAPI backend   →  Railway (~$5/mo)
                      Dockerfile — same container, add FIREWORKS_API_KEY
```

The Dockerfile will eventually need a Node.js build stage added to serve Next.js. Do not modify the Dockerfile until Next.js is fully validated end-to-end locally.

## How `instructor` Works Here

`instructor` wraps the OpenAI-compatible Fireworks client. When `client.create()` is called with `response_model=ParsedResume`, instructor:
1. Converts the Pydantic model to a JSON Schema
2. Sends it to Fireworks with `Mode.JSON` — the model is instructed to return valid JSON matching the schema
3. instructor parses the response and validates it against the Pydantic model

`Mode.JSON` is used (rather than `Mode.TOOLS`) for broader compatibility across open-source models.

## Fireworks AI Integration

- Client: `openai.OpenAI(base_url="https://api.fireworks.ai/inference/v1", api_key=...)`
- Model: `accounts/fireworks/models/llama-v3p3-70b-instruct` (Llama 3.3 70B — open-source, ~$0.20/M tokens)
- API key set via `FIREWORKS_API_KEY` in `.env`
- Previously used AWS Bedrock (Claude 3.7 Sonnet) — switched due to cost/access constraints
