'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseResume } from '@/lib/api'
import { ParsedResume } from '@/types/resume'
import { cn } from '@/lib/utils'

const PROGRESS_STEPS = [
  'Extracting text from PDF…',
  'Sending to AI for analysis…',
  'Validating structured output…',
]

interface Props {
  onSuccess: (resume: ParsedResume, file: File) => void
}

export default function ResumeUploader({ onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progressStep, setProgressStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
  })

  const rejectionError = fileRejections[0]?.errors[0]?.message

  async function handleParse() {
    if (!file) return
    setLoading(true)
    setError(null)
    setProgressStep(0)

    const interval = setInterval(() => {
      setProgressStep((s) => (s < PROGRESS_STEPS.length - 1 ? s + 1 : s))
    }, 3000)

    try {
      const resume = await parseResume(file)
      clearInterval(interval)
      onSuccess(resume, file)
    } catch (err) {
      clearInterval(interval)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setProgressStep(0)
    }
  }

  return (
    <div className="w-full max-w-lg space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/40',
          loading && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="size-10 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-sm font-medium text-primary">Drop the PDF here…</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">Drag &amp; drop your resume here</p>
            <p className="text-xs text-muted-foreground">or click to browse — PDF only</p>
          </div>
        )}
      </div>

      {/* Rejection error */}
      {rejectionError && !file && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {rejectionError}
        </p>
      )}

      {/* Selected file */}
      {file && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(0)} KB
          </span>
        </div>
      )}

      {/* Parse button */}
      <Button
        className="w-full"
        size="lg"
        disabled={!file || loading}
        onClick={handleParse}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            {PROGRESS_STEPS[progressStep]}
          </>
        ) : (
          'Parse Resume'
        )}
      </Button>

      {/* API error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
