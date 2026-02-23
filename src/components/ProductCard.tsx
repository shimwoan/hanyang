import { Link } from 'react-router-dom'
import type { Product } from '@/lib/supabase'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={product.main_image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-2 px-1">
        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
        {product.price > 0 && (
          <p className="text-sm text-gray-500">{product.price.toLocaleString()}원</p>
        )}
      </div>
    </Link>
  )
}
