import { MapPin, Calendar } from 'lucide-react'
import { WorkExperience } from '@/types/resume'

interface Props {
  experience: WorkExperience[]
}

export default function ExperienceTimeline({ experience }: Props) {
  if (!experience.length) return null

  return (
    <div className="space-y-6">
      {experience.map((job, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline spine */}
          <div className="flex flex-col items-center">
            <div className="mt-1 size-2.5 rounded-full bg-primary ring-4 ring-primary/20 shrink-0" />
            {i < experience.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-2 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold leading-tight">{job.job_title}</p>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>

            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              {(job.start_date || job.end_date) && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 shrink-0" />
                  {[job.start_date, job.end_date].filter(Boolean).join(' – ')}
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  {job.location}
                </span>
              )}
            </div>

            {job.responsibilities.length > 0 && (
              <ul className="mt-2 space-y-1">
                {job.responsibilities.map((r, j) => (
                  <li key={j} className="flex gap-2 text-sm">
                    <span className="mt-1.5 size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
