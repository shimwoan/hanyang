import { useState, useRef, useCallback, useEffect } from 'react'
import { useIsRestoring } from '@tanstack/react-query'
import { useFirstPageProducts, useMoreProducts, useProductCount } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import { Search, X } from 'lucide-react'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // 입력 후 300ms 디바운스
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const isRestoring = useIsRestoring()
  const { data: totalCount } = useProductCount(selectedCategory, search || undefined)
  const { data: firstPage, isLoading } = useFirstPageProducts(selectedCategory, search || undefined)
  const firstPageFull = (firstPage?.length ?? 0) >= 20

  const {
    data: moreData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMoreProducts(selectedCategory, firstPageFull, search || undefined)

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
    <main className="min-h-screen">
      <Header
        showCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Container 1280px */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        {/* Product count + Search */}
        <div className="pt-4 pb-4 sm:pt-5 sm:pb-5 flex items-center justify-between gap-4">
          <p className="text-[14px] sm:text-[15px] text-gray-800 font-medium shrink-0">
            {search ? `"${search}" 검색결과` : (selectedCategory ?? '전체')}{' '}
            <span className="text-gray-400 font-normal">{totalCount ?? products.length}</span>
          </p>
          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="상품명 검색"
              className="w-full border-b border-gray-300 bg-transparent py-1.5 pl-6 pr-6 text-sm text-gray-900 outline-none transition focus:border-gray-900 placeholder:text-gray-400"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearch('') }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="pb-20">
          {isRestoring || (isLoading && products.length === 0) ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 sm:gap-x-5 lg:gap-x-4 lg:gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] rounded bg-gray-200" />
                  <div className="mt-3 flex flex-col items-center gap-1.5">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-gray-400 text-sm">
              {search ? '검색 결과가 없습니다.' : '등록된 상품이 없습니다.'}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 sm:gap-x-5 lg:gap-x-4 lg:gap-y-8">
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
    </main>
  )
}
