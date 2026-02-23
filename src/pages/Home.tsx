import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useInfiniteProducts, useCategories } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard'
import { Settings } from 'lucide-react'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { data: categories } = useCategories()
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(selectedCategory)

  const observerRef = useRef<IntersectionObserver>()
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

  const products = data?.pages.flat() ?? []
  const allCategories = categories ?? []

  return (
    <div className="min-h-screen">
      {/* Logo */}
      <div className="flex items-center justify-center pt-10 pb-8 relative">
        <Link to="/">
          <img src="/logo.png" alt="한양티앤씨" className="h-16" />
        </Link>
        <Link
          to="/admin"
          className="absolute right-6 top-10 text-gray-300 hover:text-gray-500 transition"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="border-b">
        <div className="mx-auto max-w-5xl flex items-center justify-center gap-8 px-4 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap py-3 text-sm font-medium border-b-2 transition ${
              selectedCategory === null
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            전체
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap py-3 text-sm font-medium border-b-2 transition ${
                selectedCategory === cat
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product count */}
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-2">
        <p className="text-sm text-gray-500">
          {selectedCategory ?? '전체'}{' '}
          <span className="text-gray-400">{products.length}</span>
        </p>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-5xl px-4 pb-20">
        {isLoading ? (
          <p className="py-20 text-center text-gray-400">로딩 중...</p>
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-gray-400">등록된 상품이 없습니다.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
  )
}
