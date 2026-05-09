import { ExternalLink, FolderOpen } from 'lucide-react'
import { Project } from '@/types/resume'

interface Props {
  projects: Project[]
}

export default function ProjectGrid({ projects }: Props) {
  if (!projects.length) return null

  return (
    <div className="space-y-3">
      {projects.map((project, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-2xl border border-border bg-[#F5F5F7] dark:bg-[#2C2C2E] px-5 py-4"
        >
          {/* Icon */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FolderOpen className="size-4 text-primary" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold leading-snug text-foreground">{project.title}</p>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>

            {project.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{project.description}</p>
            )}

            {project.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full bg-white dark:bg-[#3A3A3C] px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
