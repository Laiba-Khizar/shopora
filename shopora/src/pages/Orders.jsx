import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/formatPrice'

export default function Orders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/orders', { token })
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <p className="text-center py-24 text-slate-500">Loading your orders...</p>
  if (error) return <p className="text-center py-24 text-red-600">{error}</p>

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <Link to="/shop" className="text-indigo-600 font-medium">Start shopping</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex flex-wrap justify-between gap-2 mb-3">
              <div>
                <p className="font-bold">{order.id}</p>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <p className="text-lg font-bold">{formatPrice(order.total)}</p>
            </div>

            <ul className="text-sm text-slate-600 divide-y divide-slate-200">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-1.5">
                  <span>{item.title} x {item.qty}</span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-slate-400 mt-3">
              Ship to: {order.shipping.address}, {order.shipping.city} {order.shipping.zip}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}