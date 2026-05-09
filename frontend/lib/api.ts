import { ParsedResume } from '@/types/resume'

export async function parseResume(file: File): Promise<ParsedResume> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/resume/parse`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Request failed with status ${res.status}`)
  }

  return res.json()
}
