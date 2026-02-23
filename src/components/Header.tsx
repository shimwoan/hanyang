import { Link } from 'react-router-dom'

const categories = ['수예', '고무']

export default function Header({
  selectedCategory,
  onSelectCategory,
  showCategories = false,
}: {
  selectedCategory?: string | null
  onSelectCategory?: (cat: string | null) => void
  showCategories?: boolean
}) {
  return (
    <header>
      {/* Logo */}
      <div className="relative flex items-center justify-center px-4 pt-8 pb-4 sm:pt-8 sm:pb-8 md:pt-8 md:pb-8">
        <Link to="/">
          <img src="/logo2.png" alt="한양티앤씨" className="h-14 sm:h-16 md:h-16" />
        </Link>
      </div>

      {/* Category Tabs */}
      {showCategories && onSelectCategory && (
        <nav className="flex justify-center overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-6 sm:gap-8 md:gap-10">
            <button
              onClick={() => onSelectCategory(null)}
              className={`whitespace-nowrap pb-2.5 text-[14px] sm:text-[15px] font-medium border-b-[2.5px] transition-colors ${
                selectedCategory === null
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap pb-2.5 text-[14px] sm:text-[15px] font-medium border-b-[2.5px] transition-colors ${
                  selectedCategory === cat
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
