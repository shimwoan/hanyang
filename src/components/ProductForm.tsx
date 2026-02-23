import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateProduct } from '@/hooks/useProducts'
import { useState } from 'react'

type FormData = {
  name: string
  category: string
  description: string
  price: number
}

export default function ProductForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const createProduct = useCreateProduct()
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [detailImages, setDetailImages] = useState<File[]>([])

  const onSubmit = async (data: FormData) => {
    if (!mainImage) return alert('메인 이미지를 선택하세요.')

    await createProduct.mutateAsync({
      name: data.name,
      category: data.category,
      description: data.description,
      price: Number(data.price),
      mainImageFile: mainImage,
      detailImageFiles: detailImages,
    })

    reset()
    setMainImage(null)
    setDetailImages([])
    alert('상품이 등록되었습니다.')
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

      <div>
        <Label htmlFor="price">가격 (원)</Label>
        <Input
          id="price"
          type="number"
          {...register('price', { valueAsNumber: true })}
          placeholder="0"
        />
      </div>

      <div>
        <Label htmlFor="mainImage">메인 이미지 * (1장)</Label>
        <Input
          id="mainImage"
          type="file"
          accept="image/*"
          onChange={(e) => setMainImage(e.target.files?.[0] ?? null)}
        />
        {mainImage && (
          <p className="mt-1 text-sm text-muted-foreground">{mainImage.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="detailImages">상세 이미지 (복수 선택 가능)</Label>
        <Input
          id="detailImages"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setDetailImages(Array.from(e.target.files ?? []))}
        />
        {detailImages.length > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {detailImages.length}개 파일 선택됨
          </p>
        )}
      </div>

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
