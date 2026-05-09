'use client'

import ResumeUploader from '@/components/ResumeUploader'
import { ParsedResume } from '@/types/resume'

export default function Page() {
  function handleSuccess(resume: ParsedResume, file: File) {
    console.log('Parsed resume:', resume)
    console.log('File:', file.name)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Resume Parser</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a PDF resume and get structured data in seconds
        </p>
      </div>
      <ResumeUploader onSuccess={handleSuccess} />
    </main>
  )
}
