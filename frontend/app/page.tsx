'use client'

import { MOCK_RESUME } from '@/lib/mock'
import { Separator } from '@/components/ui/separator'
import CandidateHeader from '@/components/resume/CandidateHeader'
import SkillTags from '@/components/resume/SkillTags'
import ExperienceTimeline from '@/components/resume/ExperienceTimeline'
import EducationCards from '@/components/resume/EducationCards'
import ProjectGrid from '@/components/resume/ProjectGrid'
import CertificationList from '@/components/resume/CertificationList'
import LanguageTags from '@/components/resume/LanguageTags'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{title}</h3>
        <Separator className="flex-1" />
      </div>
      {children}
    </section>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      {/* Navbar */}
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center gap-2">
          <div className="size-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
            R
          </div>
          <span className="font-semibold text-sm tracking-tight">Resume Parser</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* Header card with gradient */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-px shadow-lg shadow-indigo-200">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-6 text-white">
            <CandidateHeader resume={MOCK_RESUME} inverted />
          </div>
        </div>

        {/* Content card */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 divide-y divide-border">
          <div className="p-6 space-y-8">
            <Section title="Skills">
              <SkillTags skills={MOCK_RESUME.skills} />
            </Section>

            <Section title="Experience">
              <ExperienceTimeline experience={MOCK_RESUME.work_experience} />
            </Section>

            <Section title="Education">
              <EducationCards education={MOCK_RESUME.education} />
            </Section>

            <Section title="Projects">
              <ProjectGrid projects={MOCK_RESUME.projects} />
            </Section>

            <Section title="Certifications">
              <CertificationList certifications={MOCK_RESUME.certifications} />
            </Section>

            <Section title="Languages">
              <LanguageTags languages={MOCK_RESUME.languages} />
            </Section>
          </div>
        </div>
      </main>
    </div>
  )
}
