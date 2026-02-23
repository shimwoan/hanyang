import { useParams, Link } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import ImageSlider from '@/components/ImageSlider'
import Header from '@/components/Header'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error } = useProduct(id!)

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <p className="py-20 text-center text-gray-400 text-sm">로딩 중...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-20 text-center">
          <p className="text-red-500 text-sm">상품을 찾을 수 없습니다.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-gray-500 underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const images = product.detail_images ?? []
  // 마지막 이미지가 상세 이미지, 나머지가 썸네일
  const thumbnails = images.length > 1 ? images.slice(0, -1) : images
  const detailImage = images.length > 1 ? images[images.length - 1] : null

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <div className="pt-4 pb-6 sm:pb-8">
          <nav className="flex items-center gap-2 text-[13px]">
            <Link to="/" className="text-gray-400 hover:text-gray-600 transition">Home</Link>
            <span className="text-gray-300">{'>'}</span>
            <span className="text-gray-400">{product.category}</span>
            <span className="text-gray-300">{'>'}</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Desktop: 2-column / Mobile: stacked */}
        <div className="flex flex-col md:flex-row md:gap-12 lg:gap-16">
          {/* Left - Thumbnail Slider */}
          <div className="w-full md:w-1/2 md:max-w-[520px] shrink-0">
            <ImageSlider images={thumbnails.length > 0 ? thumbnails : [product.main_image]} alt={product.name} />
          </div>

          {/* Right - Info */}
          <div className="mt-6 md:mt-0 flex-1">
            <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            {product.price > 0 ? (
              <p className="mt-2 text-[16px] text-gray-500">
                {product.price.toLocaleString()}원
              </p>
            ) : (
              <p className="mt-2 text-[16px] text-gray-500">판매가 비공개</p>
            )}

            <hr className="my-5 border-gray-200" />

            {product.description && (
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-600">
                {product.description}
              </p>
            )}

          </div>
        </div>

        {/* Detail Image - bottom section */}
        {detailImage && (
          <div className="mt-16 pb-20">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">상세 정보</h2>
            <img
              src={detailImage}
              alt={`${product.name} 상세`}
              className="mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  )
}
