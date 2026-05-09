# Resume Parser — Claude Context

## What This Project Does

A PDF resume parsing application. Users upload a PDF resume → text is extracted → Llama 3.3 70B on Fireworks AI parses it into structured JSON → results are displayed in a UI. The output is validated against a strict Pydantic schema.

**Frontend status**: Streamlit UI exists and works (legacy). A Next.js frontend is being built in `frontend/` to replace it — see `docs/nextjs-plan.md` for the full 8-phase migration plan.

**Next.js build progress**: Phase 1 (foundation) ✅ · Phase 2 (API client) ✅ · Phase 3 (upload component) ✅ · Phase 4 (display components) 🔄

## Stack

- **Backend**: FastAPI (port 8000) + `uvicorn` — unchanged throughout migration
- **Frontend (legacy)**: Streamlit (port 8501) — functional, being replaced
- **Frontend (new)**: Next.js 15 (App Router) in `frontend/` — TypeScript, Tailwind CSS, shadcn/ui, react-pdf, react-dropzone
- **AI**: Fireworks AI, model `accounts/fireworks/models/llama-v3p3-70b-instruct` (Llama 3.3 70B — open-source, ~$0.20/M tokens)
- **Structured output**: `instructor` library with `Mode.JSON` via OpenAI-compatible Fireworks client
- **PDF extraction**: `pdfplumber`
- **Package manager**: `uv` for Python (`pyproject.toml` + `uv.lock`), `npm` for Next.js frontend
- **Deployment (current)**: Single Docker container (HF Spaces) + GitHub Action for auto-sync
- **Deployment (planned)**: Next.js → Vercel (free), FastAPI → Railway ($5/mo)

> **Migration note**: Originally used AWS Bedrock (Claude 3.7 Sonnet). Switched to Fireworks AI for cost — Bedrock subscription was unavailable.

## Key Files

### Backend (FastAPI — do not modify during UI migration)
| File | Role |
|------|------|
| `app/main.py` | FastAPI app entrypoint, CORS config |
| `app/api/routes.py` | Single POST endpoint `/resume/parse` |
| `app/services/parser.py` | Core logic — `FireworksResumeParser` class |
| `app/models/resume.py` | Pydantic schema for structured output |
| `app/core/config.py` | Settings (Fireworks API key, model ID, base URL) via pydantic-settings |

### Legacy Streamlit Frontend
| File | Role |
|------|------|
| `streamlit_ui/ui.py` | Streamlit frontend — upload PDF, call API, display results |
| `.streamlit/config.toml` | Disables XSRF + CORS protection — required for file upload on HF Spaces |

### Next.js Frontend (in progress — see `docs/nextjs-plan.md`)
| File | Role |
|------|------|
| `frontend/src/app/page.tsx` | Main split-view page (upload → parse → PDF left / data right) |
| `frontend/src/app/layout.tsx` | ThemeProvider, metadata |
| `frontend/src/components/ResumeUploader.tsx` | Drag-and-drop upload + API call with progress steps |
| `frontend/src/components/PdfViewer.tsx` | Inline PDF viewer (react-pdf, page nav) |
| `frontend/src/components/resume/` | CandidateHeader, SkillTags, ExperienceTimeline, EducationCards, ProjectGrid, CertificationList, LanguageTags |
| `frontend/src/lib/api.ts` | `parseResume()` fetch wrapper |
| `frontend/src/lib/mock.ts` | Sample data for component testing without a real PDF |
| `frontend/src/types/resume.ts` | TypeScript interfaces mirroring the Pydantic models |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:8000` |

### Infrastructure
| File | Role |
|------|------|
| `Dockerfile` | Python 3.10-slim, copies `.streamlit/`, exposes 8000 + 8501 |
| `start.sh` | Starts uvicorn + streamlit with XSRF/CORS flags disabled |
| `README.md` | Contains HF Spaces YAML frontmatter (sdk: docker, app_port: 8501) |
| `.github/workflows/sync-to-hf.yml` | GitHub Action — syncs repo to HF Spaces on every push to main using `huggingface_hub.upload_folder()` (REST API, not git — avoids binary file restrictions) |
| `.env` | Git-ignored — must be created locally with `FIREWORKS_API_KEY` |
| `.gitignore` | Excludes `.env`, `__pycache__`, `.venv`, `.ipynb_checkpoints`, `*.pdf` |
| `uv.lock` | Locked dependency tree for reproducible installs |

## Data Flow

```
POST /resume/parse (PDF upload)
  → save to /tmp/<uuid>.pdf
  → pdfplumber extracts raw text
  → prompt built in FireworksResumeParser._create_prompt()
  → instructor.client.create() sends to Fireworks AI (Llama 3.3 70B)
  → model responds as JSON → instructor validates against ParsedResume
  → parsed result returned as JSON / delete temp file
```

The Next.js frontend calls this same endpoint — the backend is unchanged.

## ParsedResume Schema (app/models/resume.py)

Top-level fields: `full_name`, `email`, `phone`, `location`, `linkedin_url`, `github_url`, `portfolio_url`, `summary`, `current_job_title`, `years_of_experience`

Nested lists: `work_experience` (WorkExperience), `education` (Education), `skills` (Skill), `certifications` (Certification), `projects` (Project), `languages`

Key schema decisions:
- `Project.description` is `Optional[str]` — resumes often list projects by title only
- `instructor.Mode.JSON` used (not TOOLS) for open-source model compatibility
- `Settings` uses `extra="ignore"` so stale shell env vars don't crash startup

## Fireworks AI / Credentials

- API key set via `FIREWORKS_API_KEY` in `.env` (git-ignored — never committed)
- On HF Spaces: set `FIREWORKS_API_KEY` as a Space secret in Settings → Variables and secrets
- Base URL: `https://api.fireworks.ai/inference/v1` (OpenAI-compatible)
- Model: `accounts/fireworks/models/llama-v3p3-70b-instruct` (override via `FIREWORKS_MODEL_ID`)

## Deployment — Current (Hugging Face Spaces — Streamlit)

- **Space**: https://huggingface.co/spaces/Hargurjeet/Resume_parser
- **SDK**: Docker (`sdk: docker` in README frontmatter)
- **Exposed port**: 8501 (Streamlit) — only this port is accessible from outside
- **Auto-sync**: `.github/workflows/sync-to-hf.yml` uploads files to HF on every push to `main` using `huggingface_hub.upload_folder()` (REST API, not git — avoids binary file restrictions)
- **Required GitHub secret**: `HF_TOKEN` (Hugging Face write token)
- **Required HF Space secret**: `FIREWORKS_API_KEY`

### HF Spaces known issue — file upload 403
HF Spaces proxies Streamlit traffic. Without config, Streamlit's XSRF protection causes a 403 on PDF upload. Fixed in two places:
1. `.streamlit/config.toml` — `enableXsrfProtection = false`, `enableCORS = false`
2. `start.sh` — passes `--server.enableXsrfProtection false --server.enableCORS false`
The Dockerfile must copy `.streamlit/` (`COPY .streamlit ./.streamlit`) — forgetting this was the original root cause.

## Deployment — Planned (Next.js on Vercel + FastAPI on Railway)

Once the Next.js frontend is complete and validated locally:
- **Frontend**: Deploy `frontend/` to Vercel — set Root Directory to `frontend`, add env var `NEXT_PUBLIC_API_URL`
- **Backend**: Deploy to Railway using the existing Dockerfile — add `FIREWORKS_API_KEY` env var
- **HF Spaces**: Dockerfile will need a Node build stage added to serve Next.js instead of Streamlit (do not touch until Next.js is fully validated locally)

## Running Locally

### Backend (required for all frontend work)
```bash
uv sync
echo "FIREWORKS_API_KEY=your_key_here" > .env
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Legacy Streamlit frontend
```bash
uv run streamlit run streamlit_ui/ui.py --server.port 8501
```

### Next.js frontend (after `frontend/` is scaffolded)
```bash
cd frontend
npm run dev   # http://localhost:3000
```

## Known Gaps / Notes

- No tests exist yet
- CORS is wide open (`allow_origins=["*"]`) — tighten for production

## Docs Folder

- `docs/architecture.md` — full system design and data flow (both Streamlit and planned Next.js)
- `docs/data-models.md` — all Pydantic models documented
- `docs/api.md` — API endpoint reference
- `docs/setup.md` — local, Docker, and HF Spaces setup guide
- `docs/nextjs-plan.md` — complete 8-phase, 15-step Next.js migration plan with per-step validation checkpoints
