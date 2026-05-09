'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { FileText, FolderOpen, X } from 'lucide-react'

// PdfViewer uses pdfjs-dist which requires browser APIs (DOMMatrix, canvas).
// ssr: false prevents it from running during server-side prerender.
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false })

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  function clearFile() {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-8">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* File picker card */}
        <div className="rounded-2xl bg-white px-6 py-6 shadow-sm ring-1 ring-black/[0.06]">
          <p className="mb-4 text-sm font-semibold text-foreground">
            PDF Viewer — Phase 5 Test
          </p>

          {/* Hidden native input */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFile}
          />

          {!file ? (
            /* Browse button */
            <button
              onClick={() => inputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-10 transition-colors hover:border-primary hover:bg-[#F5F5F7]"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <FolderOpen className="size-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Browse PDF</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Click to select a PDF file from your computer</p>
              </div>
            </button>
          ) : (
            /* Selected file chip */
            <div className="flex items-center gap-3 rounded-xl bg-[#F5F5F7] px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                onClick={clearFile}
                className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* PDF viewer */}
        {file && <PdfViewer file={file} className="h-[80vh]" />}

      </div>
    </div>
  )
}
