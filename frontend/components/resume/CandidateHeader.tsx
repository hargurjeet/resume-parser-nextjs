import { MapPin, Mail, Phone, ExternalLink, Globe, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ParsedResume } from '@/types/resume'

interface Props {
  resume: ParsedResume
}

export default function CandidateHeader({ resume }: Props) {
  return (
    <div className="space-y-3">
      {/* Name + role */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">{resume.full_name}</h2>
          {resume.current_job_title && (
            <p className="text-muted-foreground mt-0.5">{resume.current_job_title}</p>
          )}
        </div>
        {resume.years_of_experience != null && (
          <Badge variant="secondary" className="shrink-0 mt-1">
            <Briefcase className="mr-1 size-3" />
            {resume.years_of_experience} yrs experience
          </Badge>
        )}
      </div>

      {/* Contact row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        {resume.location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0" />
            {resume.location}
          </span>
        )}
        {resume.email && (
          <a href={`mailto:${resume.email}`} className="flex items-center gap-1 hover:text-foreground">
            <Mail className="size-3.5 shrink-0" />
            {resume.email}
          </a>
        )}
        {resume.phone && (
          <span className="flex items-center gap-1">
            <Phone className="size-3.5 shrink-0" />
            {resume.phone}
          </span>
        )}
      </div>

      {/* Profile links */}
      {(resume.linkedin_url || resume.github_url || resume.portfolio_url) && (
        <div className="flex flex-wrap gap-2">
          {resume.linkedin_url && (
            <a
              href={resume.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors"
            >
              <ExternalLink className="size-3.5" />
              LinkedIn
            </a>
          )}
          {resume.github_url && (
            <a
              href={resume.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors"
            >
              <ExternalLink className="size-3.5" />
              GitHub
            </a>
          )}
          {resume.portfolio_url && (
            <a
              href={resume.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors"
            >
              <Globe className="size-3.5" />
              Portfolio
            </a>
          )}
        </div>
      )}

      {/* Summary */}
      {resume.summary && (
        <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
          {resume.summary}
        </p>
      )}
    </div>
  )
}
