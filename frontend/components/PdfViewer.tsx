'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { ChevronLeft, ChevronRight, FileX } from 'lucide-react'
import { cn } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  file: File
  className?: string
}

export default function PdfViewer({ file, className }: Props) {
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [error, setError] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Keep canvas width in sync with container size
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPage(1)
    setError(false)
  }, [])

  const onLoadError = useCallback(() => setError(true), [])

  return (
    <div className={cn('flex flex-col overflow-hidden rounded-2xl bg-[#F5F5F7] ring-1 ring-black/[0.06]', className)}>

      {/* Navigation bar — always visible at top */}
      <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] bg-white/70 px-4 py-2 backdrop-blur-sm">
        <span className="text-xs font-medium text-muted-foreground truncate max-w-[60%]">
          {file.name}
        </span>
        {numPages > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex size-7 items-center justify-center rounded-lg border border-border bg-white text-foreground transition-colors hover:bg-[#F5F5F7] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="min-w-[5rem] text-center text-xs text-muted-foreground">
              {page} / {numPages}
            </span>
            <button
              disabled={page >= numPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex size-7 items-center justify-center rounded-lg border border-border bg-white text-foreground transition-colors hover:bg-[#F5F5F7] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable PDF canvas */}
      <div ref={canvasRef} className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileX className="size-8" />
            <p className="text-sm">Could not render PDF</p>
          </div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                Loading PDF…
              </div>
            }
            className="flex justify-center py-4"
          >
            <Page
              pageNumber={page}
              width={containerWidth ? containerWidth - 24 : undefined}
              renderTextLayer
              renderAnnotationLayer
              className="shadow-md"
            />
          </Document>
        )}
      </div>

    </div>
  )
}
