'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { ChevronLeft, ChevronRight, FileX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Worker must be configured on the client before any Document is rendered.
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Track container width so the PDF fills its column
  useEffect(() => {
    const el = containerRef.current
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

  const onLoadError = useCallback(() => {
    setError(true)
  }, [])

  return (
    <div className={cn('flex flex-col', className)}>
      {/* PDF canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto rounded-2xl bg-[#F5F5F7] ring-1 ring-black/[0.06]"
      >
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
              width={containerWidth ? containerWidth - 32 : undefined}
              renderTextLayer
              renderAnnotationLayer
              className="shadow-md rounded"
            />
          </Document>
        )}
      </div>

      {/* Page navigation */}
      {numPages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-[6rem] text-center text-xs text-muted-foreground">
            Page {page} of {numPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= numPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
