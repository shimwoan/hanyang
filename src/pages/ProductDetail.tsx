import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import ImageSlider from '@/components/ImageSlider'
import Header from '@/components/Header'

function DetailSkeleton() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        <div className="pt-4 pb-6 sm:pb-8">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-4 w-12 rounded bg-gray-200" />
            <div className="h-4 w-4 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 w-4 rounded bg-gray-100" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-12 lg:gap-16 animate-pulse">
          <div className="w-full md:w-1/2 md:max-w-[520px] shrink-0">
            <div className="aspect-square rounded bg-gray-200" />
          </div>
          <div className="mt-6 md:mt-0 flex-1 space-y-4">
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-5 w-1/3 rounded bg-gray-200" />
            <div className="h-px w-full bg-gray-200 my-5" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-4/5 rounded bg-gray-200" />
          </div>
        </div>

        {/* 상세 정보 하단 스켈레톤 */}
        <div className="mt-16 pb-20 animate-pulse">
          <div className="h-6 w-24 rounded bg-gray-200 mb-4" />
          <div className="mx-auto max-w-[1000px]">
            <div className="w-full rounded bg-gray-200" style={{ height: '2400px' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useProduct(id!)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  useEffect(() => {
    if (!product) return
    document.title = `${product.name} | 한양티앤씨`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', `한양티앤씨 ${product.category} - ${product.name}${product.description ? '. ' + product.description.slice(0, 100) : ''}`)
    return () => { document.title = '한양티앤씨 | 고무줄·밴드·끈 제조 전문업체' }
  }, [product])

  if (isLoading && !product) {
    return <DetailSkeleton />
  }

  if (!product) {
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

  const thumbnails = product.thumbnail_images?.length ? product.thumbnail_images : [product.main_image]
  const detailImages = product.detail_images ?? []

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
            <ImageSlider images={thumbnails} alt={product.name} />
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

        {/* Detail Images - bottom section */}
        {detailImages.length > 0 && (
          <div className="mt-16 pb-20">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">상세 정보</h2>
            <div className="mx-auto max-w-[1000px] space-y-0">
              {detailImages.map((src, i) => (
                <DetailImage key={i} src={src} alt={`${product.name} 상세 ${i + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative">
      {!loaded && (
        <div className="animate-pulse">
          <div className="w-full rounded bg-gray-200" style={{ height: '800px' }} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
