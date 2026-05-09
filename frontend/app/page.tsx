'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// PdfViewer uses pdfjs-dist which requires browser APIs (DOMMatrix, canvas).
// ssr: false prevents it from running during server-side prerender.
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false })

export default function Page() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-black/[0.06]">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select a PDF to test the viewer
          </label>
          <input
            type="file"
            accept=".pdf"
            className="text-sm text-muted-foreground"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {file && (
          <PdfViewer file={file} className="h-[80vh]" />
        )}
      </div>
    </div>
  )
}
