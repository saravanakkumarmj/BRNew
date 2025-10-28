"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import type { UploadedReport } from "@/components/blood-report-analyzer"
import { Upload, FileText, X, ChevronLeft } from "lucide-react"

type ReportUploadProps = {
  onUpload: (report: UploadedReport) => void
  onBack: () => void
}

export function ReportUpload({ onUpload, onBack }: ReportUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreview(null)
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload({
        file: selectedFile,
        preview: preview || "",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload Blood Report</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload your blood test report in PDF, JPG, or PNG format</p>
      </div>

      {!selectedFile ? (
        <div
          className={`relative rounded-xl border-2 border-dashed transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
          <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center justify-center px-6 py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="mb-2 text-lg font-semibold text-foreground">
              Drop your file here, or <span className="text-primary">browse</span>
            </p>
            <p className="text-sm text-muted-foreground">Supports: PDF, JPG, PNG (Max 10MB)</p>
          </label>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-start gap-4">
            {preview ? (
              <img
                src={preview || "/placeholder.svg"}
                alt="Report preview"
                className="h-24 w-24 rounded-lg border border-border object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-background">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-full bg-accent transition-all duration-300" />
                </div>
                <p className="mt-2 text-sm font-medium text-accent">Upload complete</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedFile} size="lg" className="min-w-[200px]">
          Analyze Report
        </Button>
      </div>
    </div>
  )
}
