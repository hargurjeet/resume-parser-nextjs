'use client'

import { MOCK_RESUME } from '@/lib/mock'
import CandidateHeader from '@/components/resume/CandidateHeader'
import SkillTags from '@/components/resume/SkillTags'
import ExperienceTimeline from '@/components/resume/ExperienceTimeline'
import EducationCards from '@/components/resume/EducationCards'
import ProjectGrid from '@/components/resume/ProjectGrid'
import CertificationList from '@/components/resume/CertificationList'
import LanguageTags from '@/components/resume/LanguageTags'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
        <div className="ml-4 h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* Apple-style sticky nav */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              R
            </div>
            <span className="text-sm font-semibold tracking-tight">Resume Parser</span>
          </div>
          <span className="rounded-full bg-[#F5F5F7] px-3 py-1 text-xs font-medium text-[#6E6E73]">
            Powered by Llama 3.3 · 70B
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-5">

        {/* Hero card — white, Apple-style large typography */}
        <div className="rounded-3xl bg-white px-10 py-8 shadow-sm ring-1 ring-black/[0.06]">
          <CandidateHeader resume={MOCK_RESUME} />
        </div>

        {/* Two-column upper section: Skills + Languages stacked left, Certs right */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Skills — takes 2 columns */}
          <div className="lg:col-span-2 rounded-3xl bg-white px-8 py-7 shadow-sm ring-1 ring-black/[0.06]">
            <Section title="Skills">
              <SkillTags skills={MOCK_RESUME.skills} />
            </Section>
          </div>

          {/* Languages + Certifications stacked */}
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl bg-white px-8 py-7 shadow-sm ring-1 ring-black/[0.06]">
              <Section title="Languages">
                <LanguageTags languages={MOCK_RESUME.languages} />
              </Section>
            </div>
            <div className="rounded-3xl bg-white px-8 py-7 shadow-sm ring-1 ring-black/[0.06]">
              <Section title="Certifications">
                <CertificationList certifications={MOCK_RESUME.certifications} />
              </Section>
            </div>
          </div>
        </div>

        {/* Experience — full width */}
        <div className="rounded-3xl bg-white px-8 py-7 shadow-sm ring-1 ring-black/[0.06]">
          <Section title="Experience">
            <ExperienceTimeline experience={MOCK_RESUME.work_experience} />
          </Section>
        </div>

        {/* Education + Projects side by side */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-white px-8 py-7 shadow-sm ring-1 ring-black/[0.06]">
            <Section title="Education">
              <EducationCards education={MOCK_RESUME.education} />
            </Section>
          </div>
          <div className="rounded-3xl bg-white px-8 py-7 shadow-sm ring-1 ring-black/[0.06]">
            <Section title="Projects">
              <ProjectGrid projects={MOCK_RESUME.projects} />
            </Section>
          </div>
        </div>

      </main>
    </div>
  )
}
