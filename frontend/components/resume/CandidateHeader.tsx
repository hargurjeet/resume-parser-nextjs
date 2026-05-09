import { MapPin, Mail, Phone, ExternalLink, Globe, Briefcase } from 'lucide-react'
import { ParsedResume } from '@/types/resume'

interface Props {
  resume: ParsedResume
}

export default function CandidateHeader({ resume }: Props) {
  return (
    <div className="space-y-5">
      {/* Name + role — Apple large-type treatment */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {resume.full_name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {resume.current_job_title && (
            <span className="text-lg font-medium text-primary">
              {resume.current_job_title}
            </span>
          )}
          {resume.years_of_experience != null && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="size-3.5" />
                {resume.years_of_experience} years of experience
              </span>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Contact + links row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {resume.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            {resume.location}
          </span>
        )}
        {resume.email && (
          <a
            href={`mailto:${resume.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-primary"
          >
            <Mail className="size-3.5 shrink-0" />
            {resume.email}
          </a>
        )}
        {resume.phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="size-3.5 shrink-0" />
            {resume.phone}
          </span>
        )}

        {/* Profile links — Apple pill button style */}
        {(resume.linkedin_url || resume.github_url || resume.portfolio_url) && (
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {resume.linkedin_url && (
              <a
                href={resume.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-85"
              >
                <ExternalLink className="size-3" />
                LinkedIn
              </a>
            )}
            {resume.github_url && (
              <a
                href={resume.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#F5F5F7] px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ExternalLink className="size-3" />
                GitHub
              </a>
            )}
            {resume.portfolio_url && (
              <a
                href={resume.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#F5F5F7] px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Globe className="size-3" />
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {resume.summary && (
        <p className="text-base leading-relaxed text-muted-foreground">
          {resume.summary}
        </p>
      )}
    </div>
  )
}
