import { GraduationCap, MapPin } from 'lucide-react'
import { Education } from '@/types/resume'

interface Props {
  education: Education[]
}

export default function EducationCards({ education }: Props) {
  if (!education.length) return null

  return (
    <div className="space-y-3">
      {education.map((edu, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-2xl border border-border bg-[#F5F5F7] dark:bg-[#2C2C2E] px-5 py-4"
        >
          {/* Icon */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="size-4 text-primary" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold leading-snug text-foreground">
              {edu.degree}
              {edu.field_of_study && (
                <span className="font-normal text-muted-foreground"> — {edu.field_of_study}</span>
              )}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{edu.institution}</p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {edu.graduation_year && <span>{edu.graduation_year}</span>}
              {edu.gpa && <span>GPA {edu.gpa.toFixed(1)}</span>}
              {edu.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  {edu.location}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
