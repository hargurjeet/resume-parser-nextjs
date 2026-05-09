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
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <Separator className="mt-1.5" />
      </div>
      {children}
    </section>
  )
}

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <CandidateHeader resume={MOCK_RESUME} />

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
    </main>
  )
}
