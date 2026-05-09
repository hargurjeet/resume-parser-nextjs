'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { Download, RotateCcw, Sun, Moon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import ResumeUploader from '@/components/ResumeUploader'
import CandidateHeader from '@/components/resume/CandidateHeader'
import SkillTags from '@/components/resume/SkillTags'
import ExperienceTimeline from '@/components/resume/ExperienceTimeline'
import EducationCards from '@/components/resume/EducationCards'
import ProjectGrid from '@/components/resume/ProjectGrid'
import CertificationList from '@/components/resume/CertificationList'
import LanguageTags from '@/components/resume/LanguageTags'
import { ParsedResume } from '@/types/resume'

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 rounded-2xl bg-muted animate-pulse" />
  ),
})

// ─── Theme toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Toggle theme"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <div className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onReset, showReset }: { onReset: () => void; showReset: boolean }) {
  return (
    <header className="shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-[52px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold tracking-tight">Resume Parser</span>
        </div>
        <div className="flex items-center gap-2">
          {showReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Parse another</span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

// ─── Upload view ──────────────────────────────────────────────────────────────

function UploadView({ onSuccess }: { onSuccess: (r: ParsedResume, f: File) => void }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#F5F5F7] dark:bg-[#111111] p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resume Parser</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Upload a PDF resume and get structured data in seconds
          </p>
        </div>
        <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] p-5 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:p-6">
          <ResumeUploader onSuccess={onSuccess} />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Powered by Llama 3.3 · 70B via Fireworks AI
        </p>
      </div>
    </div>
  )
}

// ─── Split view ───────────────────────────────────────────────────────────────

function SplitView({ resume, file, onReset }: { resume: ParsedResume; file: File; onReset: () => void }) {
  function downloadJson() {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.full_name.replace(/\s+/g, '_')}_resume.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-[#F5F5F7] dark:bg-[#111111]">

      {/* Left — PDF viewer, desktop only */}
      <div className="hidden w-2/5 shrink-0 overflow-hidden p-4 lg:flex lg:flex-col">
        <PdfViewer file={file} className="flex-1 min-h-0" />
      </div>

      <Separator orientation="vertical" className="hidden lg:block" />

      {/* Right — parsed data, always visible */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">

          {/* Header */}
          <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] px-6 py-6 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:px-8 sm:py-7">
            <CandidateHeader resume={resume} />
          </div>

          {/* Skills + Languages/Certs */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-3xl bg-white dark:bg-[#1C1C1E] px-6 py-6 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:px-7">
              <Section title="Skills">
                <SkillTags skills={resume.skills} />
              </Section>
            </div>
            <div className="flex flex-col gap-5">
              {resume.languages.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] px-6 py-6 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:px-7">
                  <Section title="Languages">
                    <LanguageTags languages={resume.languages} />
                  </Section>
                </div>
              )}
              {resume.certifications.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] px-6 py-6 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:px-7">
                  <Section title="Certifications">
                    <CertificationList certifications={resume.certifications} />
                  </Section>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          {resume.work_experience.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] px-6 py-6 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:px-7">
              <Section title="Experience">
                <ExperienceTimeline experience={resume.work_experience} />
              </Section>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] px-6 py-6 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:px-7">
              <Section title="Education">
                <EducationCards education={resume.education} />
              </Section>
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] px-6 py-6 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08] sm:px-7">
              <Section title="Projects">
                <ProjectGrid projects={resume.projects} />
              </Section>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pb-6">
            <Button onClick={downloadJson} className="gap-2">
              <Download className="size-4" />
              Download JSON
            </Button>
            <Button variant="outline" onClick={onReset} className="gap-2">
              <RotateCcw className="size-4" />
              Parse another
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [resume, setResume] = useState<ParsedResume | null>(null)
  const [file, setFile] = useState<File | null>(null)

  function handleSuccess(r: ParsedResume, f: File) { setResume(r); setFile(f) }
  function handleReset() { setResume(null); setFile(null) }

  const parsed = resume && file

  return (
    <div className="flex h-screen flex-col">
      <Navbar onReset={handleReset} showReset={!!parsed} />
      {parsed
        ? <SplitView resume={resume} file={file} onReset={handleReset} />
        : <UploadView onSuccess={handleSuccess} />
      }
    </div>
  )
}
