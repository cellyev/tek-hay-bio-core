/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  UploadCloud,
  FileImage,
  Video,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
} from 'lucide-react'

export interface UploadQueueItem {
  id: string
  file: File
  previewUrl: string
  mediaType: 'image' | 'video'
  status: 'waiting' | 'uploading' | 'success' | 'error'
  progress: number
  errorMessage?: string
  resultDoc?: any
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB

export function BulkMediaUploader({
  onUploadSuccess,
  collection = 'gallery-media',
  defaultTitle,
}: {
  onUploadSuccess: (newDocs: any[]) => void
  collection?: string
  defaultTitle?: string
}) {
  const [queue, setQueue] = useState<UploadQueueItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): { valid: boolean; error?: string; mediaType: 'image' | 'video' } => {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type) || file.type.startsWith('image/')
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type) || file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return {
        valid: false,
        error: `Format file "${file.name}" tidak didukung. Gunakan JPG, PNG, WebP, atau video MP4, WebM.`,
        mediaType: 'image',
      }
    }

    if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Ukuran foto "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas 25MB.`,
        mediaType: 'image',
      }
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
      return {
        valid: false,
        error: `Ukuran video "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas 100MB.`,
        mediaType: 'video',
      }
    }

    return {
      valid: true,
      mediaType: isVideo ? 'video' : 'image',
    }
  }

  const addFilesToQueue = (files: FileList | File[]) => {
    const newItems: UploadQueueItem[] = []

    Array.from(files).forEach((file) => {
      const validation = validateFile(file)
      const previewUrl = URL.createObjectURL(file)

      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl,
        mediaType: validation.mediaType,
        status: validation.valid ? 'waiting' : 'error',
        progress: 0,
        errorMessage: validation.error,
      })
    })

    setQueue((prev) => [...prev, ...newItems])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files)
      e.target.value = ''
    }
  }

  const removeFromQueue = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  const uploadSingleItem = async (item: UploadQueueItem): Promise<any | null> => {
    const filenameTitle = item.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    const mediaTitle = defaultTitle?.trim() || filenameTitle
    const formData = new FormData()
    formData.append('file', item.file)
    formData.append('title', mediaTitle)
    formData.append('alt', mediaTitle)
    formData.append('mediaType', item.mediaType)

    try {
      const res = await fetch(`/api/${collection}`, {
        method: 'POST',
        body: formData,
      })

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.errors?.[0]?.message || json?.message || `Gagal mengunggah (${res.status})`)
      }

      return json.doc || json
    } catch (err: any) {
      throw new Error(err.message || 'Terjadi kesalahan jaringan saat upload.')
    }
  }

  const startUpload = async () => {
    const itemsToUpload = queue.filter((i) => i.status === 'waiting' || i.status === 'error')
    if (itemsToUpload.length === 0) return

    setIsProcessing(true)
    const successfulDocs: any[] = []

    for (const item of itemsToUpload) {
      // Mark as uploading
      setQueue((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 50, errorMessage: undefined } : i))
      )

      try {
        const doc = await uploadSingleItem(item)
        successfulDocs.push(doc)

        setQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'success', progress: 100, resultDoc: doc } : i))
        )
      } catch (error: any) {
        setQueue((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'error', progress: 0, errorMessage: error.message } : i
          )
        )
      }
    }

    setIsProcessing(false)

    if (successfulDocs.length > 0) {
      onUploadSuccess(successfulDocs)
    }
  }

  const retryItem = async (id: string) => {
    const item = queue.find((i) => i.id === id)
    if (!item) return

    setQueue((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'uploading', progress: 50, errorMessage: undefined } : i))
    )

    try {
      const doc = await uploadSingleItem(item)
      setQueue((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'success', progress: 100, resultDoc: doc } : i))
      )
      onUploadSuccess([doc])
    } catch (error: any) {
      setQueue((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'error', progress: 0, errorMessage: error.message } : i))
      )
    }
  }

  const clearCompleted = () => {
    setQueue((prev) => {
      prev.filter((i) => i.status === 'success').forEach((i) => URL.revokeObjectURL(i.previewUrl))
      return prev.filter((i) => i.status !== 'success')
    })
  }

  const waitingCount = queue.filter((i) => i.status === 'waiting').length
  const successCount = queue.filter((i) => i.status === 'success').length
  const errorCount = queue.filter((i) => i.status === 'error').length

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm border border-slate-200">
            <UploadCloud className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Tarik & lepas file foto atau video ke sini, atau klik untuk memilih
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Mendukung banyak file sekaligus. Foto (JPG, PNG, WebP maks 25MB) dan Video (MP4, WebM maks 100MB).
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-900 text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Pilih File dari Komputer
          </button>
        </div>
      </div>

      {/* Upload Queue List */}
      {queue.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Antrean Upload Media ({queue.length} file)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {successCount > 0 && <span className="text-emerald-600 font-medium">{successCount} Berhasil </span>}
                {waitingCount > 0 && <span>• {waitingCount} Menunggu </span>}
                {errorCount > 0 && <span className="text-rose-600 font-medium">• {errorCount} Perlu Perhatian</span>}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {successCount > 0 && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50"
                >
                  Bersihkan yang Berhasil
                </button>
              )}
              <button
                type="button"
                onClick={startUpload}
                disabled={isProcessing || (waitingCount === 0 && errorCount === 0)}
                className="inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" /> Mulai Unggah Semua
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs"
              >
                {/* Thumbnail Preview */}
                <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-200 relative shrink-0 border border-slate-300">
                  {item.mediaType === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-white">
                      <Video className="w-5 h-5 text-amber-400" />
                      <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Video</span>
                    </div>
                  )}

                  {/* Icon Badge */}
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white rounded p-0.5">
                    {item.mediaType === 'image' ? (
                      <FileImage className="w-3 h-3" />
                    ) : (
                      <Video className="w-3 h-3 text-amber-400" />
                    )}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-6 space-y-1">
                  <div className="font-medium text-slate-900 truncate" title={item.file.name}>
                    {item.file.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {item.status === 'waiting' && (
                      <span className="text-slate-500 text-[11px]">Siap diunggah</span>
                    )}
                    {item.status === 'uploading' && (
                      <span className="text-blue-600 font-medium text-[11px] flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Mengunggah...
                      </span>
                    )}
                    {item.status === 'success' && (
                      <span className="text-emerald-600 font-medium text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Berhasil
                      </span>
                    )}
                    {item.status === 'error' && (
                      <div className="space-y-0.5">
                        <span className="text-rose-600 font-medium text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Gagal
                        </span>
                        {item.errorMessage && (
                          <div className="text-[10px] text-rose-500 line-clamp-1" title={item.errorMessage}>
                            {item.errorMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove / Retry Button */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {item.status === 'error' && (
                    <button
                      type="button"
                      onClick={() => retryItem(item.id)}
                      className="p-1 text-slate-500 hover:text-blue-600 rounded"
                      title="Coba lagi"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {item.status !== 'uploading' && (
                    <button
                      type="button"
                      onClick={() => removeFromQueue(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Hapus dari antrean"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
