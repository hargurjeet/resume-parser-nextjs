import { Languages } from 'lucide-react'

interface Props {
  languages: string[]
}

export default function LanguageTags({ languages }: Props) {
  if (!languages.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Languages className="size-4 shrink-0 text-muted-foreground" />
      {languages.map((lang) => (
        <span
          key={lang}
          className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
        >
          {lang}
        </span>
      ))}
    </div>
  )
}
