import { Skill } from '@/types/resume'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Technical',
  framework: 'Frameworks',
  tool: 'Tools',
  soft: 'Soft Skills',
  language: 'Languages',
  other: 'Other',
}

const CATEGORY_CLASSES: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  framework: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  tool: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  soft: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  language: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  other: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

interface Props {
  skills: Skill[]
}

export default function SkillTags({ skills }: Props) {
  if (!skills.length) return null

  // Group by category; uncategorised goes into 'other'
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category ?? 'other'
    ;(acc[key] ??= []).push(skill)
    return acc
  }, {})

  const categoryOrder = ['technical', 'framework', 'tool', 'soft', 'language', 'other']
  const sortedKeys = [
    ...categoryOrder.filter((k) => grouped[k]),
    ...Object.keys(grouped).filter((k) => !categoryOrder.includes(k)),
  ]

  return (
    <div className="space-y-3">
      {sortedKeys.map((category) => (
        <div key={category}>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {CATEGORY_LABELS[category] ?? category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {grouped[category].map((skill) => (
              <span
                key={skill.name}
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  CATEGORY_CLASSES[category] ?? CATEGORY_CLASSES.other
                )}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
