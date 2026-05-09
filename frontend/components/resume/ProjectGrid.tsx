import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Project } from '@/types/resume'

interface Props {
  projects: Project[]
}

export default function ProjectGrid({ projects }: Props) {
  if (!projects.length) return null

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {projects.map((project, i) => (
        <Card key={i} size="sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="leading-snug">{project.title}</CardTitle>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
            {project.description && (
              <CardDescription>{project.description}</CardDescription>
            )}
          </CardHeader>
          {project.technologies.length > 0 && (
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
