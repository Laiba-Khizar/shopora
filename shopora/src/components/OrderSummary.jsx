import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

export default function OrderSummary() {
  const { subtotal, discount, tax, total, coupon } = useCart()

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
      {coupon && (
        <div className="flex justify-between text-green-600">
          <span>Discount ({coupon.code})</span><span>-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between"><span className="text-slate-600">Tax (8%)</span><span>{formatPrice(tax)}</span></div>
      <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
        <span>Total</span><span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}