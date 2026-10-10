import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import OrderSummary from '../components/OrderSummary'

export default function Cart() {
  const { items, coupon, applyCoupon, removeCoupon, setQty, removeItem } = useCart()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Add something you like.</p>
        <Link to="/shop" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
          Start shopping
        </Link>
      </div>
    )
  }

  const handleCoupon = () => {
    setMessage(applyCoupon(code) ? '' : 'Invalid coupon code.')
    setCode('')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4">
              <img src={item.thumbnail} alt={item.title} className="w-24 h-24 rounded-lg object-cover bg-slate-100" />
              <div className="flex-1">
                <Link to={`/product/${item.id}`} className="font-semibold hover:text-indigo-600">{item.title}</Link>
                <p className="text-slate-500 text-sm">{formatPrice(item.price)} each</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-slate-300 rounded-lg">
                    <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity" className="p-2 hover:bg-slate-100">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity" className="p-2 hover:bg-slate-100">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold">{formatPrice(item.price * item.qty)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`} className="text-slate-400 hover:text-red-600 self-start">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit space-y-5">
          <h2 className="text-xl font-bold">Summary</h2>

          {coupon ? (
            <div className="flex items-center justify-between bg-green-50 text-green-700 rounded-lg px-3 py-2 text-sm">
              <span>{coupon.code} applied ({coupon.percent}% off)</span>
              <button onClick={removeCoupon} className="underline">Remove</button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={handleCoupon} className="bg-slate-900 text-white px-4 rounded-lg text-sm hover:bg-slate-700">
                  Apply
                </button>
              </div>
              {message && <p className="text-sm text-red-600 mt-1">{message}</p>}
              <p className="text-xs text-slate-400 mt-1">Try SAVE10 or SAVE20</p>
            </div>
          )}

          <OrderSummary />

          <Link to="/checkout" className="block text-center bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700">
            Go to checkout
          </Link>
        </div>
      </div>
    </div>
  )
}   