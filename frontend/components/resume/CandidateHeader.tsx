import { MapPin, Mail, Phone, ExternalLink, Globe, Briefcase } from 'lucide-react'
import { ParsedResume } from '@/types/resume'
import { cn } from '@/lib/utils'

interface Props {
  resume: ParsedResume
  /** Pass true when rendered on the dark gradient hero — forces white text */
  inverted?: boolean
}

export default function CandidateHeader({ resume, inverted = false }: Props) {
  const muted = inverted ? 'text-white/70' : 'text-muted-foreground'
  const base = inverted ? 'text-white' : 'text-foreground'
  const link = inverted
    ? 'border-white/30 text-white/90 hover:bg-white/10'
    : 'border-border text-foreground hover:bg-muted'
  const badge = inverted
    ? 'bg-white/20 text-white border-white/30'
    : 'bg-secondary text-secondary-foreground border-transparent'

  return (
    <div className="space-y-4">
      {/* Name + role + badge */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className={cn('text-2xl font-bold tracking-tight', base)}>{resume.full_name}</h2>
          {resume.current_job_title && (
            <p className={cn('mt-0.5 text-base', muted)}>{resume.current_job_title}</p>
          )}
        </div>
        {resume.years_of_experience != null && (
          <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shrink-0 mt-1', badge)}>
            <Briefcase className="size-3" />
            {resume.years_of_experience} yrs experience
          </span>
        )}
      </div>

      {/* Contact row */}
      <div className={cn('flex flex-wrap gap-x-4 gap-y-1.5 text-sm', muted)}>
        {resume.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            {resume.location}
          </span>
        )}
        {resume.email && (
          <a href={`mailto:${resume.email}`} className={cn('flex items-center gap-1.5 transition-opacity hover:opacity-80', muted)}>
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
      </div>

      {/* Profile links */}
      {(resume.linkedin_url || resume.github_url || resume.portfolio_url) && (
        <div className="flex flex-wrap gap-2">
          {resume.linkedin_url && (
            <a href={resume.linkedin_url} target="_blank" rel="noopener noreferrer"
              className={cn('flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors', link)}>
              <ExternalLink className="size-3.5" />
              LinkedIn
            </a>
          )}
          {resume.github_url && (
            <a href={resume.github_url} target="_blank" rel="noopener noreferrer"
              className={cn('flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors', link)}>
              <ExternalLink className="size-3.5" />
              GitHub
            </a>
          )}
          {resume.portfolio_url && (
            <a href={resume.portfolio_url} target="_blank" rel="noopener noreferrer"
              className={cn('flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors', link)}>
              <Globe className="size-3.5" />
              Portfolio
            </a>
          )}
        </div>
      )}

      {/* Summary */}
      {resume.summary && (
        <p className={cn('text-sm leading-relaxed border-l-2 pl-3', inverted ? 'border-white/40 text-white/80' : 'border-primary/30 text-muted-foreground')}>
          {resume.summary}
        </p>
      )}
    </div>
  )
}
