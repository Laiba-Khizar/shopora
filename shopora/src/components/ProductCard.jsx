import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition">
      <Link to={`/product/${product.id}`} className="block bg-slate-100 aspect-square">
        <img src={product.thumbnail} alt={product.title} loading="lazy" className="w-full h-full object-cover" />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/product/${product.id}`}
          className="font-semibold text-slate-800 line-clamp-1 hover:text-indigo-600"
        >
          {product.title}
        </Link>
        <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          {product.rating.toFixed(1)}
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          <button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.title} to cart`}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}