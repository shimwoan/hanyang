import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import { ArrowLeft } from 'lucide-react'
import ImageSlider from '@/components/ImageSlider'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useProduct(id!)

  if (isLoading) {
    return <p className="py-20 text-center text-gray-400">로딩 중...</p>
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">상품을 찾을 수 없습니다.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-gray-500 underline">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const allImages = [
    ...(product.detail_images ?? []),
  ]

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <Link to="/" className="mx-auto">
          <img src="/logo.png" alt="한양티앤씨" className="h-8" />
        </Link>
        <div className="w-7" />
      </div>

      {/* Image Slider */}
      <ImageSlider images={allImages.length > 0 ? allImages : [product.main_image]} alt={product.name} />

      {/* Product Info */}
      <div className="px-4 pt-6 pb-20">
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {product.category}
        </span>
        <h1 className="mt-3 text-xl font-bold text-gray-900">{product.name}</h1>
        {product.price > 0 && (
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {product.price.toLocaleString()}원
          </p>
        )}
        {product.description && (
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
            {product.description}
          </p>
        )}
      </div>
    </div>
  )
}
