import { Link, useLocation } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'

export default function OrderSuccess() {
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-600 mb-4">No recent order found.</p>
        <Link to="/shop" className="text-indigo-600 font-medium">Go to shop</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg text-center py-20 px-4">
      <CheckCircle size={64} className="mx-auto text-green-500" />
      <h1 className="text-3xl font-bold mt-4">Thank you for your order!</h1>
      <p className="text-slate-600 mt-2">Order number: <strong>{state.orderNumber}</strong></p>
      <p className="text-slate-600">Total paid: <strong>{formatPrice(state.total)}</strong></p>
      <p className="text-slate-500 text-sm mt-2">A confirmation would be sent to {state.email}.</p>
      <Link to="/shop" className="inline-block mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
        Continue shopping
      </Link>
    </div>
  )
}