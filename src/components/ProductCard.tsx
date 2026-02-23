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
      <div className="mt-2 sm:mt-3 text-center">
        <h3 className="text-[14px] sm:text-[15px] font-medium text-gray-900 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-0.5 text-[13px] sm:text-[14px] text-gray-400">
          {product.price > 0 ? `${product.price.toLocaleString()}원` : '판매가 비공개'}
        </p>
      </div>
    </Link>
  )
}
