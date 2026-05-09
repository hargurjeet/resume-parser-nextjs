import { Award } from 'lucide-react'
import { Certification } from '@/types/resume'

interface Props {
  certifications: Certification[]
}

export default function CertificationList({ certifications }: Props) {
  if (!certifications.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {certifications.map((cert, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 rounded-lg border bg-muted/40 px-3 py-1.5 text-sm"
        >
          <Award className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="font-medium">{cert.name}</span>
          {cert.issuing_organization && (
            <span className="text-xs text-muted-foreground">· {cert.issuing_organization}</span>
          )}
          {cert.issue_date && (
            <span className="text-xs text-muted-foreground">· {cert.issue_date}</span>
          )}
        </div>
      ))}
    </div>
  )
}
