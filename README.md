---
title: Resume Parser
emoji: 📄
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 8501
tags:
  - resume
  - nlp
  - llm
  - fastapi
  - nextjs
pinned: false
short_description: AI-powered PDF resume parser with Next.js UI
license: mit
---

# Resume Parser

An AI-powered PDF resume parsing application. Upload a PDF → text is extracted → **Llama 3.3 70B** on Fireworks AI parses it into structured JSON → results are displayed in a polished split-view UI showing the original PDF alongside the parsed data.

**Live demo**: [hargurjeet-resume-ui.fly.dev](https://hargurjeet-resume-ui.fly.dev) (Next.js UI on Fly.io)

---

## What it does

- Drag-and-drop a PDF resume
- Animated progress steps while the AI processes it
- Split view: original PDF on the left, structured data on the right
- Color-coded skill tags (technical, frameworks, tools, soft skills)
- Experience timeline, education cards, project cards, certifications
- Download the parsed result as JSON
- Dark / light mode toggle

---

## Tech Stack

### Backend
| | |
|---|---|
| **Framework** | FastAPI + uvicorn |
| **AI** | Fireworks AI — Llama 3.3 70B Instruct (`accounts/fireworks/models/llama-v3p3-70b-instruct`) |
| **Structured output** | `instructor` library with `Mode.JSON` |
| **PDF extraction** | `pdfplumber` |
| **Validation** | Pydantic v2 |
| **Package manager** | `uv` |

### Frontend
| | |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **PDF viewer** | react-pdf + pdfjs-dist |
| **File upload** | react-dropzone |
| **Design** | Apple-inspired (SF Pro font, #007AFF blue, dark mode) |

---

## Project Structure

```
resume-parser-nextjs/
├── app/                        # FastAPI backend
│   ├── main.py                 # App entry point, CORS config
│   ├── api/routes.py           # POST /resume/parse endpoint
│   ├── services/parser.py      # FireworksResumeParser — all AI logic
│   ├── models/resume.py        # Pydantic schema (ParsedResume)
│   └── core/config.py          # Settings via pydantic-settings
├── streamlit_ui/ui.py          # Legacy Streamlit frontend (HF Spaces only)
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx          # ThemeProvider, SF Pro font, metadata
│   │   ├── page.tsx            # Main split-view page
│   │   └── globals.css         # Apple color tokens, dark mode
│   ├── components/
│   │   ├── ResumeUploader.tsx  # Drag-and-drop + progress steps
│   │   ├── PdfViewer.tsx       # Inline PDF renderer, page nav
│   │   ├── ThemeProvider.tsx   # next-themes wrapper
│   │   └── resume/             # CandidateHeader, SkillTags, ExperienceTimeline,
│   │                           # EducationCards, ProjectGrid, CertificationList,
│   │                           # LanguageTags
│   ├── lib/
│   │   ├── api.ts              # parseResume() fetch wrapper
│   │   └── mock.ts             # Sample data for development
│   ├── types/resume.ts         # TypeScript interfaces (mirrors Pydantic models)
│   ├── Dockerfile              # Multi-stage Node build for Fly.io
│   └── fly.toml                # Frontend Fly.io config (hargurjeet-resume-ui)
├── Dockerfile                  # HF Spaces — uvicorn + streamlit via uv
├── Dockerfile.api              # Fly.io backend — uvicorn only, port 8080
├── fly.toml                    # Backend Fly.io config (hargurjeet-resume-api)
├── start.sh                    # Starts uvicorn + streamlit (HF Spaces)
├── pyproject.toml              # Python deps managed by uv
└── .github/workflows/          # Auto-sync to HF Spaces on push to main
```

---

## Running Locally

### 1. Backend (required for all frontend work)

```bash
# Install Python dependencies
uv sync

# Create .env file (never committed)
echo "FIREWORKS_API_KEY=your_key_here" > .env

# Start FastAPI on port 8000
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

FastAPI docs available at `http://localhost:8000/docs`.

### 2. Next.js frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

### 3. Legacy Streamlit frontend (optional)

```bash
uv run streamlit run streamlit_ui/ui.py --server.port 8501
```

### Docker (both services in one container)

```bash
docker build -t resume-parser .
docker run -p 8000:8000 -p 8501:8501 \
  -e FIREWORKS_API_KEY=your_key_here \
  resume-parser
```

---

## API

### `POST /resume/parse`

Upload a PDF and receive structured JSON.

```bash
curl -X POST "http://localhost:8000/resume/parse" \
  -F "file=@/path/to/resume.pdf"
```

**Response** (excerpt):
```json
{
  "full_name": "Hargurjeet Singh Ganger",
  "email": "gurjeet333@gmail.com",
  "current_job_title": "Senior Data Scientist",
  "years_of_experience": 15,
  "skills": [
    { "name": "Python", "category": "technical", "proficiency": "expert" }
  ],
  "work_experience": [...],
  "education": [...],
  "projects": [...],
  "certifications": [...],
  "languages": ["English", "Hindi"]
}
```

See `docs/api.md` for full reference and error codes.

---

## Environment Variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `FIREWORKS_API_KEY` | Yes | — | Get one at [fireworks.ai](https://fireworks.ai) |
| `FIREWORKS_MODEL_ID` | No | `accounts/fireworks/models/llama-v3p3-70b-instruct` | Override to swap model |
| `FIREWORKS_BASE_URL` | No | `https://api.fireworks.ai/inference/v1` | Override for proxy |
| `NEXT_PUBLIC_API_URL` | Yes (frontend) | — | Set in `frontend/.env.local` for local dev; baked into the Fly.io build via `frontend/fly.toml` |

---

## Deployment

### Live — Fly.io (Next.js + FastAPI)

Both services run on Fly.io in the Mumbai (`bom`) region.

| Service | App name | URL |
|---|---|---|
| Next.js frontend | `hargurjeet-resume-ui` | https://hargurjeet-resume-ui.fly.dev |
| FastAPI backend | `hargurjeet-resume-api` | https://hargurjeet-resume-api.fly.dev |

To redeploy after changes:
```bash
# Backend (from project root)
fly deploy --config fly.toml

# Frontend (from frontend/ directory)
fly deploy --config fly.toml
```

To update the API key:
```bash
fly secrets set FIREWORKS_API_KEY=your_key --app hargurjeet-resume-api
```

### Also live — Hugging Face Spaces (Streamlit)

The legacy Streamlit UI remains running at [huggingface.co/spaces/Hargurjeet/Resume_parser](https://huggingface.co/spaces/Hargurjeet/Resume_parser).
Every push to `main` triggers `.github/workflows/sync-to-hf.yml`, which syncs to the HF Space automatically.

**Required secrets for HF Spaces:**
- GitHub: `HF_TOKEN` (Hugging Face write token)
- HF Space: `FIREWORKS_API_KEY`

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Connection refused` on port 8000 | Start uvicorn in a separate terminal |
| `401 Unauthorized` | Check `FIREWORKS_API_KEY` in `.env` |
| `Resume text is empty` | PDF is image-based (scanned); pdfplumber needs text-layer PDFs |
| `Address already in use` | `lsof -ti:8000 \| xargs kill -9` |
| Next.js PDF viewer crash | `pdfjs-dist` requires `ssr: false` dynamic import — already wired in `page.tsx` |

---

## License

MIT — see [LICENSE](LICENSE).
