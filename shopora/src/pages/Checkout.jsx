import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api/client'
import OrderSummary from '../components/OrderSummary'
import { formatPrice } from '../utils/formatPrice'

const steps = ['Shipping', 'Payment', 'Review']
const stepFields = [['name', 'email', 'address', 'city', 'zip'], ['cardNumber', 'expiry', 'cvv'], []]
const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  )
}

export default function Checkout() {
  const { items, coupon, clearCart } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm({
    mode: 'onTouched',
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-600 mb-4">Your cart is empty.</p>
        <Link to="/shop" className="text-indigo-600 font-medium">Go to shop</Link>
      </div>
    )
  }

  const next = async () => {
    const valid = await trigger(stepFields[step])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data) => {
    if (step < 2) {
      next()
      return
    }

    setServerError('')
    setSubmitting(true)

    try {
      const order = await apiFetch('/orders', {
        method: 'POST',
        token,
        body: {
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          couponCode: coupon?.code,
          shipping: {
            name: data.name,
            email: data.email,
            address: data.address,
            city: data.city,
            zip: data.zip,
          },
        },
      })

      navigate('/order-success', {
        state: { orderNumber: order.id, total: order.total, email: data.email },
      })
      clearCart()
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const values = getValues()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <ol className="flex gap-2 mb-8 text-sm">
        {steps.map((name, i) => (
          <li
            key={name}
            className={`flex-1 text-center py-2 rounded-lg font-medium ${
              i === step ? 'bg-indigo-600 text-white' : i < step ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {i + 1}. {name}
          </li>
        ))}
      </ol>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4">

          {step === 0 && (
            <>
              <h2 className="text-xl font-bold">Shipping details</h2>
              <Field label="Full name" error={errors.name}>
                <input className={inputClass} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" className={inputClass} {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
              </Field>
              <Field label="Address" error={errors.address}>
                <input className={inputClass} {...register('address', { required: 'Address is required' })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" error={errors.city}>
                  <input className={inputClass} {...register('city', { required: 'City is required' })} />
                </Field>
                <Field label="ZIP code" error={errors.zip}>
                  <input className={inputClass} {...register('zip', { required: 'ZIP is required', pattern: { value: /^\d{4,6}$/, message: '4 to 6 digits' } })} />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold">Payment (demo only)</h2>
              <p className="text-sm text-slate-500">This is a demo. Do not enter a real card number. Card details are never sent to the server.</p>
              <Field label="Card number" error={errors.cardNumber}>
                <input placeholder="1234567812345678" inputMode="numeric" className={inputClass} {...register('cardNumber', { required: 'Card number is required', pattern: { value: /^\d{16}$/, message: 'Enter 16 digits, no spaces' } })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry (MM/YY)" error={errors.expiry}>
                  <input placeholder="08/28" className={inputClass} {...register('expiry', { required: 'Expiry is required', pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY' } })} />
                </Field>
                <Field label="CVV" error={errors.cvv}>
                  <input placeholder="123" inputMode="numeric" className={inputClass} {...register('cvv', { required: 'CVV is required', pattern: { value: /^\d{3}$/, message: '3 digits' } })} />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold">Review your order</h2>
              <div className="text-sm text-slate-600 space-y-1">
                <p><strong>Name:</strong> {values.name}</p>
                <p><strong>Email:</strong> {values.email}</p>
                <p><strong>Address:</strong> {values.address}, {values.city} {values.zip}</p>
                <p><strong>Card:</strong> ending in {values.cardNumber?.slice(-4)}</p>
              </div>
              <ul className="divide-y divide-slate-200 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between py-2">
                    <span>{i.title} x {i.qty}</span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              {serverError && (
                <p className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{serverError}</p>
              )}
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="px-5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
                Back
              </button>
            ) : <span />}

            {step < 2 ? (
              <button type="button" onClick={next} className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                Next
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-slate-300">
                {submitting ? 'Placing order...' : 'Place order'}
              </button>
            )}
          </div>
        </form>

        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order summary</h2>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}