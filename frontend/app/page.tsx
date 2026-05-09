'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Download, RotateCcw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ResumeUploader from '@/components/ResumeUploader'
import CandidateHeader from '@/components/resume/CandidateHeader'
import SkillTags from '@/components/resume/SkillTags'
import ExperienceTimeline from '@/components/resume/ExperienceTimeline'
import EducationCards from '@/components/resume/EducationCards'
import ProjectGrid from '@/components/resume/ProjectGrid'
import CertificationList from '@/components/resume/CertificationList'
import LanguageTags from '@/components/resume/LanguageTags'
import { ParsedResume } from '@/types/resume'

// PdfViewer uses browser-only APIs — must be dynamically imported with ssr:false
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full flex-col gap-3 p-4">
      <Skeleton className="h-full w-full rounded-2xl" />
    </div>
  ),
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
        <div className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ onReset, showReset }: { onReset: () => void; showReset: boolean }) {
  return (
    <header className="shrink-0 border-b border-border/60 bg-white/80 backdrop-blur-xl">
      <div className="flex h-[52px] items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold tracking-tight">Resume Parser</span>
        </div>
        {showReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[#F5F5F7] hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Parse another
          </button>
        )}
      </div>
    </header>
  )
}

// ─── Upload view ──────────────────────────────────────────────────────────────

function UploadView({ onSuccess }: { onSuccess: (resume: ParsedResume, file: File) => void }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#F5F5F7] p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Resume Parser</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Upload a PDF resume and get structured data in seconds
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/[0.06]">
          <ResumeUploader onSuccess={onSuccess} />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Powered by Llama 3.3 · 70B via Fireworks AI
        </p>
      </div>
    </div>
  )
}

// ─── Split-view (after parse) ─────────────────────────────────────────────────

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
    <div className="flex flex-1 overflow-hidden bg-[#F5F5F7]">

      {/* Left — PDF viewer (40%) */}
      <div className="hidden w-2/5 shrink-0 overflow-hidden p-4 lg:flex lg:flex-col">
        <PdfViewer file={file} className="flex-1" />
      </div>

      <Separator orientation="vertical" className="hidden lg:block" />

      {/* Right — Parsed data (60%) */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 p-6">

          {/* Header card */}
          <div className="rounded-3xl bg-white px-8 py-7 shadow-sm ring-1 ring-black/[0.06]">
            <CandidateHeader resume={resume} />
          </div>

          {/* Skills + Languages/Certs */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-3xl bg-white px-7 py-6 shadow-sm ring-1 ring-black/[0.06]">
              <Section title="Skills">
                <SkillTags skills={resume.skills} />
              </Section>
            </div>
            <div className="flex flex-col gap-5">
              {resume.languages.length > 0 && (
                <div className="rounded-3xl bg-white px-7 py-6 shadow-sm ring-1 ring-black/[0.06]">
                  <Section title="Languages">
                    <LanguageTags languages={resume.languages} />
                  </Section>
                </div>
              )}
              {resume.certifications.length > 0 && (
                <div className="rounded-3xl bg-white px-7 py-6 shadow-sm ring-1 ring-black/[0.06]">
                  <Section title="Certifications">
                    <CertificationList certifications={resume.certifications} />
                  </Section>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          {resume.work_experience.length > 0 && (
            <div className="rounded-3xl bg-white px-7 py-6 shadow-sm ring-1 ring-black/[0.06]">
              <Section title="Experience">
                <ExperienceTimeline experience={resume.work_experience} />
              </Section>
            </div>
          )}

          {/* Education + Projects */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {resume.education.length > 0 && (
              <div className="rounded-3xl bg-white px-7 py-6 shadow-sm ring-1 ring-black/[0.06]">
                <Section title="Education">
                  <EducationCards education={resume.education} />
                </Section>
              </div>
            )}
            {resume.projects.length > 0 && (
              <div className="rounded-3xl bg-white px-7 py-6 shadow-sm ring-1 ring-black/[0.06]">
                <Section title="Projects">
                  <ProjectGrid projects={resume.projects} />
                </Section>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pb-6">
            <Button onClick={downloadJson} className="gap-2">
              <Download className="size-4" />
              Download JSON
            </Button>
            <Button variant="outline" onClick={onReset} className="gap-2">
              <RotateCcw className="size-4" />
              Parse another resume
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [resume, setResume] = useState<ParsedResume | null>(null)
  const [file, setFile] = useState<File | null>(null)

  function handleSuccess(parsedResume: ParsedResume, uploadedFile: File) {
    setResume(parsedResume)
    setFile(uploadedFile)
  }

  function handleReset() {
    setResume(null)
    setFile(null)
  }

  const parsed = resume && file

  return (
    <div className="flex h-screen flex-col">
      <Navbar onReset={handleReset} showReset={!!parsed} />
      {parsed ? (
        <SplitView resume={resume} file={file} onReset={handleReset} />
      ) : (
        <UploadView onSuccess={handleSuccess} />
      )}
    </div>
  )
}
