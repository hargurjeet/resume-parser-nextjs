# Setup Guide

## Prerequisites

- Python 3.10+
- `uv` package manager (`pip install uv`)
- Node.js 18+ and npm (for Next.js frontend)
- Fireworks AI account and API key (get one at fireworks.ai)
- No cloud subscription needed beyond Fireworks — pay-per-token, ~$0.20/M tokens

## Local Setup — Backend (FastAPI)

The backend must be running for any frontend work (Streamlit or Next.js).

```bash
# 1. Install Python dependencies
uv sync

# 2. Create .env file (git-ignored — never committed)
cat > .env <<EOF
FIREWORKS_API_KEY=your_fireworks_api_key_here
FIREWORKS_MODEL_ID=accounts/fireworks/models/llama-v3p3-70b-instruct
EOF

# 3. Start backend
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

FastAPI interactive docs available at `http://localhost:8000/docs`.

## Local Setup — Legacy Streamlit Frontend

```bash
# Terminal 2 (backend must be running first)
uv run streamlit run streamlit_ui/ui.py --server.port 8501
```

Open `http://localhost:8501` to use the Streamlit UI.

## Local Setup — Next.js Frontend (new)

```bash
# 1. Navigate to frontend directory (after it is scaffolded — see docs/nextjs-plan.md Phase 1)
cd frontend

# 2. Install Node dependencies
npm install

# 3. Create env file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 4. Start dev server
npm run dev
```

Open `http://localhost:3000` for the Next.js UI. The backend must be running on port 8000.

### Next.js build check
```bash
cd frontend
npm run build   # must complete with 0 errors
npm run start   # test production build locally
```

## Restarting the Backend

```bash
# If running — press Ctrl+C, then:
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# If port 8000 is stuck from a previous run:
lsof -ti:8000 | xargs kill -9
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Docker Setup (local — Streamlit container)

```bash
# Build
docker build -t resume-parser .

# Run — pass Fireworks API key as env var
docker run -p 8000:8000 -p 8501:8501 \
  -e FIREWORKS_API_KEY=your_fireworks_api_key_here \
  resume-parser
```

The container runs both services via `start.sh`:
- FastAPI starts first, waits 3 seconds
- Streamlit starts after with XSRF/CORS protection disabled

## Hugging Face Spaces Deployment (current — Streamlit)

The app is live at: https://huggingface.co/spaces/Hargurjeet/Resume_parser

### How auto-sync works
Every push to `main` on GitHub triggers `.github/workflows/sync-to-hf.yml`, which uses `huggingface_hub.upload_folder()` to push files to the HF Space. HF then rebuilds the Docker image automatically.

### One-time setup (already done)
1. HF Space created with `sdk: docker` and `app_port: 8501` in `README.md` frontmatter
2. `HF_TOKEN` added as a GitHub repository secret (Settings → Secrets → Actions)
3. `FIREWORKS_API_KEY` added as an HF Space secret (Space Settings → Variables and secrets)

### Files excluded from HF sync
`.git/`, `.venv/`, `__pycache__/`, `*.pyc`, `*.pdf`, `.env`, `uv.lock`

### Triggering a manual sync
```bash
git commit --allow-empty -m "chore: trigger HF sync" && git push origin main
```

## Planned Deployment (Next.js + Railway)

Once the Next.js frontend is complete and validated locally:

### Frontend → Vercel (free)
1. Push `frontend/` folder to GitHub (already in the repo)
2. Go to vercel.com → New Project → import `hargurjeet/resume-parser-nextjs`
3. Set **Root Directory** to `frontend`
4. Add env var: `NEXT_PUBLIC_API_URL=https://your-railway-backend-url`
5. Deploy → get a `*.vercel.app` URL

### Backend → Railway (~$5/month)
1. Go to railway.app → New Project → Deploy from GitHub repo
2. Select `hargurjeet/resume-parser-nextjs`, set root to `/` (uses existing Dockerfile)
3. Add env var: `FIREWORKS_API_KEY=your_key`
4. Railway gives you a public URL → paste into Vercel's `NEXT_PUBLIC_API_URL`

## Environment Variables

| Variable | Default (in code) | Required |
|----------|--------------------|----------|
| `FIREWORKS_API_KEY` | `""` | Yes |
| `FIREWORKS_MODEL_ID` | `accounts/fireworks/models/llama-v3p3-70b-instruct` | No — override to swap model |
| `FIREWORKS_BASE_URL` | `https://api.fireworks.ai/inference/v1` | No — override for proxy |
| `NEXT_PUBLIC_API_URL` | — | Yes (Next.js only) — set in `frontend/.env.local` |

> `.env` is git-ignored. Never commit it — it contains the API key.

## Troubleshooting

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `Connection refused on port 8000` | Backend not running | Start uvicorn in a separate terminal |
| `Extra inputs are not permitted` on startup | Stale env var (e.g. `BEDROCK_MODEL_ID`) in shell | Already fixed via `extra="ignore"` in config — restart shell if it persists |
| `401 Unauthorized` | Invalid or missing Fireworks API key | Check `FIREWORKS_API_KEY` in `.env` or HF Space secrets |
| `404 model not found` | Wrong model ID | Verify model ID at fireworks.ai/models |
| `PDF extraction failed` | Encrypted or corrupted PDF | Try a different PDF; ensure poppler-utils is installed |
| `Address already in use` | Port 8000 or 8501 taken | `lsof -ti:8000 \| xargs kill -9` |
| `Resume text is empty or too short` | Image-based (scanned) PDF | pdfplumber can't extract text from scanned PDFs |
| `Schema validation failed` | Model returned malformed JSON | instructor retries up to 3 times automatically; if it still fails, retry the upload |
| `AxiosError 403` on HF Spaces file upload | Streamlit XSRF vs HF proxy conflict | Fixed via `.streamlit/config.toml` + `start.sh` flags. If it recurs, ensure `COPY .streamlit ./.streamlit` is in Dockerfile |
| `CORS error` in Next.js browser console | Backend CORS not allowing localhost:3000 | Backend has `allow_origins=["*"]` — should not occur; check the backend is actually running |
| Next.js `Module not found` | Missing npm dependency | `cd frontend && npm install` |
| Next.js PDF worker error | pdfjs worker not configured | Ensure `pdfjs.GlobalWorkerOptions.workerSrc` is set in `PdfViewer.tsx` |
