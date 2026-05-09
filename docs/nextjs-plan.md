# Next.js Migration Plan

## Overview

Replace the Streamlit UI with a polished Next.js frontend that shows the PDF and parsed data side by side. The FastAPI backend stays completely unchanged — it is consumed as-is via its existing API.

**The Next.js app lives in `frontend/` inside the existing repo.**

Each phase is independently testable. Never proceed to the next phase until the current one is validated.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Best-in-class React, optimal Vercel deploy |
| Language | TypeScript | Type-safe API response handling |
| Styling | Tailwind CSS | Utility-first, ships with Next.js scaffold |
| Components | shadcn/ui | Accessible, polished, Tailwind-based |
| PDF viewer | react-pdf + pdfjs-dist | Renders PDF inline in browser |
| File upload | react-dropzone | Drag-and-drop with file preview |
| Icons | lucide-react | Included with shadcn |
| API calls | native fetch | No extra dependencies needed |

---

## Prerequisites

FastAPI backend must be running for end-to-end tests:
```bash
# In the repo root
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## PHASE 1 — Foundation ✅ COMPLETE

*Goal: Next.js app boots with correct config. No UI yet.*

### Step 1 — Scaffold the Next.js app

```bash
cd /Users/hargurjeetsinghganger/programming_local/resume-parser-nextjs
npx create-next-app@latest frontend \
  --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*"
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

**Validate:**
```bash
npm run dev
```
Open http://localhost:3000 → default Next.js welcome page, no terminal errors.

---

### Step 2 — Install dependencies

```bash
# shadcn init (style: Default, base color: Slate)
npx shadcn@latest init

# shadcn components
npx shadcn@latest add card badge button separator skeleton tabs

# Other packages
npm install react-dropzone react-pdf pdfjs-dist lucide-react
```

**Validate:**
```bash
npm run build
```
Build must complete with 0 errors. TypeScript compilation clean.

---

### Step 3 — Define TypeScript types + mock data

Create `types/resume.ts`:
```typescript
export interface Skill {
  name: string
  category?: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other'
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}
export interface WorkExperience {
  job_title: string; company: string; location?: string
  start_date?: string; end_date?: string
  responsibilities: string[]
}
export interface Education {
  degree: string; institution: string
  field_of_study?: string; graduation_year?: number
}
export interface Certification {
  name: string; issuing_organization?: string; issue_date?: string
}
export interface Project {
  title: string; description?: string
  technologies: string[]; url?: string
}
export interface ParsedResume {
  full_name: string; email?: string; phone?: string; location?: string
  linkedin_url?: string; github_url?: string; portfolio_url?: string
  summary?: string; current_job_title?: string; years_of_experience?: number
  work_experience: WorkExperience[]; education: Education[]
  skills: Skill[]; certifications: Certification[]
  projects: Project[]; languages: string[]
}
```

Create `lib/mock.ts` with sample data for component testing without a real PDF. (See the working mock in the plan file at `.claude/plans/`.)

**Validate:**
```bash
npm run build
```
0 TypeScript errors.

---

## PHASE 2 — API Integration ✅ COMPLETE

*Goal: Frontend can call the backend and receive a parsed resume.*

### Step 4 — API client

Create `lib/api.ts`:
```typescript
import { ParsedResume } from '@/types/resume'

export async function parseResume(file: File): Promise<ParsedResume> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/resume/parse`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail ?? 'Parsing failed')
  }
  return res.json()
}
```

**Validate (with backend running):**

From browser console at http://localhost:3000:
```javascript
const f = new File(['dummy'], 'test.pdf', { type: 'application/pdf' })
const fd = new FormData(); fd.append('file', f)
fetch('http://localhost:8000/resume/parse', { method: 'POST', body: fd })
  .then(r => r.json()).then(console.log)
```
Expect a 400 error (PDF too short) — confirms CORS is open and the endpoint is reachable.

---

## PHASE 3 — Upload Component ✅ COMPLETE

*Goal: Drag-and-drop upload works and calls the API.*

### Step 5 — ResumeUploader component

Create `components/ResumeUploader.tsx`:
- Drag-and-drop zone via `react-dropzone` (PDF only)
- Shows selected filename + file size
- "Parse Resume" button with loading spinner
- Progress text: "Extracting text…" → "Sending to AI…" → "Validating…"
- Calls `parseResume()` from `lib/api.ts`
- On success: calls `onSuccess(resume, file)` callback
- On error: shows error message inline

**Validate:**
1. `npm run dev` → open http://localhost:3000
2. Drag a real PDF → filename appears
3. Click "Parse Resume" → progress text animates → console shows full `ParsedResume` JSON after ~5–10s
4. Try uploading a non-PDF → rejected with error message

---

## PHASE 4 — Display Components ✅ COMPLETE

*Goal: Each resume section renders correctly using mock data. Build and test each component independently.*

### Step 6 — CandidateHeader

`components/resume/CandidateHeader.tsx`:
- Large name heading, current role + years-of-experience badge
- Location, email, phone on one line
- Icon links for LinkedIn, GitHub, Portfolio (lucide icons, new tab)

**Validate:** Render with `MOCK_RESUME` in page.tsx. Name, role, badge, location, email, icons all visible.

---

### Step 7 — SkillTags

`components/resume/SkillTags.tsx`:
- Groups skills by category with category heading above each group
- Colored pills: technical→blue, framework→purple, tool→green, soft→orange, language/other→gray

**Validate:** Python/ML/SQL blue, FastAPI purple, AWS green.

---

### Step 8 — ExperienceTimeline

`components/resume/ExperienceTimeline.tsx`:
- Vertical timeline with dot/line on the left
- Each entry: job title (bold), company, date range, location
- Bullet list of responsibilities

**Validate:** BT entry shows with timeline dot, dates, and responsibility bullets.

---

### Step 9 — EducationCards

`components/resume/EducationCards.tsx`:
- One card per education entry
- Degree, institution, field of study, graduation year
- Graduation cap icon (lucide)

**Validate:** M.S. from Liverpool JMU renders as a card.

---

### Step 10 — ProjectGrid, CertificationList, LanguageTags

Three small components:

**`components/resume/ProjectGrid.tsx`** — 2-column card grid; title, description, tech badges, optional link icon

**`components/resume/CertificationList.tsx`** — horizontal badge list; cert name + issuer

**`components/resume/LanguageTags.tsx`** — simple badge list of language strings

**Validate:** All three render correctly with mock data. Projects are a 2-column grid.

---

## PHASE 5 — PDF Viewer ✅ COMPLETE

*Goal: PDF renders inline in the browser from a local File object.*

### Step 11 — PdfViewer component

`components/PdfViewer.tsx`:
- Accepts `file: File` prop
- Uses `react-pdf` to render pages
- Configure worker (required):
  ```typescript
  import { pdfjs } from 'react-pdf'
  pdfjs.GlobalWorkerOptions.workerSrc =
    `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
  ```
- Shows current page / total pages
- Prev / Next page buttons
- Fits width to container

**Validate:** Use a file input to pick a PDF → renders inline with working page nav.

---

## PHASE 6 — Full Integration ✅ COMPLETE

*Goal: Complete split-view page wired end-to-end.*

### Step 12 — Main page (split-view layout)

Rewrite `app/page.tsx`:

**Before upload:** centered `ResumeUploader` with app title and tagline.

**After successful parse:** 2-column layout:
- Left 40%: `PdfViewer` (sticky, scrolls independently)
- Right 60%: scrollable panel — CandidateHeader → SkillTags → ExperienceTimeline → EducationCards → ProjectGrid → CertificationList → LanguageTags → Download JSON button

**Error state:** inline error banner with "Try again" button that resets to upload view.

**Validate (full end-to-end):**
1. Upload a real PDF resume → progress steps animate
2. Split view appears: PDF left, parsed data right
3. All sections populated: skills as colored pills, experience as timeline, projects as cards
4. Click "Download JSON" → file downloads with correct data
5. Click "Try again" → resets to upload view

---

## PHASE 7 — Polish ✅ COMPLETE

*Goal: Dark mode, responsive layout, loading skeletons.*

### Step 13 — Theme + polish

- Add `ThemeProvider` from shadcn to `app/layout.tsx`
- Add dark/light toggle button in navbar (top right)
- Add `Skeleton` loading placeholders in right panel while parsing
- Responsive: on mobile (<768px), stack PDF viewer above parsed result
- Add `<title>` and `<meta description>` to layout

**Validate:**
1. Dark/light toggle switches entire UI cleanly
2. Mobile width → layout stacks vertically
3. Slow connection (Chrome DevTools Slow 3G) → skeleton loaders appear during parsing

---

## PHASE 8 — Production Build + Deploy

*Goal: Ship it.*

### Step 14 — Production build check

```bash
cd frontend
npm run build
npm run start   # test on :3000
```

**Validate:** Build completes with 0 errors, 0 TypeScript errors. Production build works identically to dev.

---

### Step 15 — Deploy

**Frontend → Vercel (free)**
1. Push `frontend/` to GitHub
2. vercel.com → New Project → import `hargurjeet/resume-parser-nextjs`
3. Root Directory: `frontend`
4. Add env var: `NEXT_PUBLIC_API_URL=https://your-railway-url`
5. Deploy → `*.vercel.app` URL

**Backend → Railway (~$5/month)**
1. railway.app → New Project → Deploy from GitHub
2. Select `hargurjeet/resume-parser-nextjs`, root: `/` (uses existing Dockerfile)
3. Add env var: `FIREWORKS_API_KEY=your_key`
4. Public Railway URL → paste into Vercel's `NEXT_PUBLIC_API_URL`

**Validate:** Upload a PDF on the Vercel URL → full parse flow works against Railway backend.

---

## Files to Create

```
frontend/          (no src/ — scaffolded with --no-src-dir)
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ResumeUploader.tsx       ✅
│   ├── PdfViewer.tsx            🔄 Phase 5
│   ├── resume/
│   │   ├── CandidateHeader.tsx  ✅
│   │   ├── SkillTags.tsx        ✅
│   │   ├── ExperienceTimeline.tsx ✅
│   │   ├── EducationCards.tsx   ✅
│   │   ├── ProjectGrid.tsx      ✅
│   │   ├── CertificationList.tsx ✅
│   │   └── LanguageTags.tsx     ✅
│   └── ui/                      ✅ (shadcn: badge, button, card, separator, skeleton, tabs)
├── lib/
│   ├── api.ts                   ✅
│   ├── mock.ts                  ✅
│   └── utils.ts                 ✅
├── types/
│   └── resume.ts                ✅
├── .env.local
└── package.json
```

**Backend files — NO changes needed.** CORS is already wide open (`allow_origins=["*"]`).

---

## Key Principles

- Each phase is independently testable — never need Phase N+1 to validate Phase N
- Mock data (`lib/mock.ts`) lets you build all display components without a real PDF or backend
- The backend is untouched — Streamlit UI can keep running in parallel while building Next.js
- HF Spaces Dockerfile update (Node build stage) is a separate task — do not touch until Next.js is validated end-to-end locally
