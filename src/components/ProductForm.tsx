import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateProduct } from '@/hooks/useProducts'
import { useState, useRef, useCallback, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

type FormData = {
  name: string
  category: string
  description: string
  price: number
}

function ImagePreviewModal({
  src,
  onClose,
}: {
  src: string
  onClose: () => void
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/90 p-2 shadow"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt="미리보기"
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

function ImageDropZone({
  id,
  label,
  files,
  onAdd,
  onRemove,
  showBadge,
  fullWidth,
}: {
  id: string
  label: string
  files: File[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  showBadge?: boolean
  fullWidth?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const dropped = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      )
      if (dropped.length > 0) onAdd(dropped)
    },
    [onAdd]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  return (
    <div>
      <Label>{label}</Label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition cursor-pointer ${
          dragging
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-6 w-6 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          드래그하여 이미지를 추가하거나{' '}
          <span className="font-medium text-orange-500">클릭하여 업로드</span>
        </p>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? [])
            if (selected.length > 0) onAdd(selected)
            e.target.value = ''
          }}
        />
      </div>
      {files.length > 0 && (
        fullWidth ? (
          <div className="mt-3 space-y-3">
            {files.map((file, i) => (
              <div key={i} className="relative rounded-lg border overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full max-h-[400px] object-contain bg-gray-50 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setPreviewSrc(URL.createObjectURL(file)) }}
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(i) }}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-20 w-20 rounded border object-cover cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setPreviewSrc(URL.createObjectURL(file)) }}
                />
                {showBadge && i === 0 && (
                  <span className="absolute top-0 left-0 rounded-br rounded-tl bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    대표
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(i) }}
                  className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 p-0.5 text-white shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )
      )}
      {previewSrc && (
        <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
      )}
    </div>
  )
}

export default function ProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const createProduct = useCreateProduct()
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([])
  const [detailImages, setDetailImages] = useState<File[]>([])

  const onSubmit = async (data: FormData) => {
    if (thumbnailFiles.length === 0) return alert('썸네일 이미지를 최소 1장 선택하세요.')

    await createProduct.mutateAsync({
      name: data.name,
      category: data.category,
      description: data.description,
      price: Number(data.price),
      thumbnailFiles,
      detailImageFiles: detailImages,
    })

    reset()
    setThumbnailFiles([])
    setDetailImages([])
    alert('상품이 등록되었습니다.')
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">상품명 *</Label>
        <Input
          id="name"
          {...register('name', { required: '상품명을 입력하세요' })}
          placeholder="상품명"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="category">카테고리 *</Label>
        <Input
          id="category"
          {...register('category', { required: '카테고리를 입력하세요' })}
          placeholder="예: 고무줄, 밴드, 끈"
        />
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">상품 설명</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="상품 설명을 입력하세요"
          rows={3}
        />
      </div>

      <ImageDropZone
        id="thumbnails"
        label="썸네일 이미지 * (여러장 가능, 첫 번째가 대표)"
        files={thumbnailFiles}
        onAdd={(files) => setThumbnailFiles((prev) => [...prev, ...files])}
        onRemove={(i) => setThumbnailFiles((prev) => prev.filter((_, idx) => idx !== i))}
        showBadge
      />

      <ImageDropZone
        id="detailImages"
        label="상세 이미지 (복수 선택 가능)"
        files={detailImages}
        onAdd={(files) => setDetailImages((prev) => [...prev, ...files])}
        onRemove={(i) => setDetailImages((prev) => prev.filter((_, idx) => idx !== i))}
        fullWidth
      />

      <Button
        type="submit"
        disabled={createProduct.isPending}
        className="w-full bg-[#f07d1a] hover:bg-[#d86c10]"
      >
        {createProduct.isPending ? '등록 중...' : '상품 등록'}
      </Button>
    </form>
  )
}
