import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, Minus, Plus, ArrowLeft } from 'lucide-react'
import { getProduct } from '../api/products'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setQty(1)
    getProduct(id)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-center py-24 text-slate-500">Loading product...</p>

  if (error || !product) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-600 mb-4">We could not find this product.</p>
        <Link to="/shop" className="text-indigo-600 font-medium">Back to shop</Link>
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600 mb-6">
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-slate-100 rounded-xl overflow-hidden aspect-square">
          <img src={product.images?.[0] || product.thumbnail} alt={product.title} className="w-full h-full object-contain" />
        </div>

        <div>
          <p className="text-sm text-indigo-600 font-medium capitalize">{product.category.replace('-', ' ')}</p>
          <h1 className="text-3xl font-bold mt-1">{product.title}</h1>
          <div className="flex items-center gap-1 mt-2 text-slate-600">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </div>
          <p className="text-3xl font-bold mt-4">{formatPrice(product.price)}</p>
          <p className="text-slate-600 mt-4">{product.description}</p>
          <p className="text-sm mt-3 text-slate-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="p-3 hover:bg-slate-100">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="p-3 hover:bg-slate-100">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300"
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>

          {added && (
            <Link to="/cart" className="inline-block mt-4 text-indigo-600 font-medium">
              Go to cart
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}