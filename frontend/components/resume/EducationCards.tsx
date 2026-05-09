import { GraduationCap, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Education } from '@/types/resume'

interface Props {
  education: Education[]
}

export default function EducationCards({ education }: Props) {
  if (!education.length) return null

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {education.map((edu, i) => (
        <Card key={i} size="sm">
          <CardHeader>
            <div className="flex items-start gap-2">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <CardTitle className="leading-snug">
                  {edu.degree}
                  {edu.field_of_study && ` — ${edu.field_of_study}`}
                </CardTitle>
                <CardDescription>{edu.institution}</CardDescription>
              </div>
            </div>
          </CardHeader>
          {(edu.graduation_year || edu.gpa || edu.location) && (
            <CardContent>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {edu.graduation_year && <span>{edu.graduation_year}</span>}
                {edu.gpa && <span>GPA {edu.gpa.toFixed(1)}</span>}
                {edu.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 shrink-0" />
                    {edu.location}
                  </span>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
