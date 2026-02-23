import { useState, useRef, useCallback } from 'react'
import { useIsRestoring } from '@tanstack/react-query'
import { useFirstPageProducts, useMoreProducts, useProductCount } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const isRestoring = useIsRestoring()
  const { data: totalCount } = useProductCount(selectedCategory)
  const { data: firstPage, isLoading } = useFirstPageProducts(selectedCategory)
  const firstPageFull = (firstPage?.length ?? 0) >= 20

  const {
    data: moreData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMoreProducts(selectedCategory, firstPageFull)

  const products = [
    ...(firstPage ?? []),
    ...(moreData?.pages.flat() ?? []),
  ]

  const observerRef = useRef<IntersectionObserver>(null)
  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  )

  return (
    <div className="min-h-screen">
      <Header
        showCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Container 1280px */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        {/* Product count */}
        <div className="pt-6 pb-4 sm:pt-8 sm:pb-5">
          <p className="text-[14px] sm:text-[15px] text-gray-800 font-medium">
            {selectedCategory ?? '전체'}{' '}
            <span className="text-gray-400 font-normal">{totalCount ?? products.length}</span>
          </p>
        </div>

        {/* Product Grid - max 5 columns */}
        <div className="pb-20">
          {isRestoring || (isLoading && products.length === 0) ? (
            <div className="py-20" />
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-gray-400 text-sm">등록된 상품이 없습니다.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-x-5 lg:gap-x-4 lg:gap-y-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div ref={bottomRef} className="h-10" />
              {isFetchingNextPage && (
                <p className="py-4 text-center text-gray-400 text-sm">불러오는 중...</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
