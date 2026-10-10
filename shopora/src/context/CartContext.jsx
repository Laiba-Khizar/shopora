import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const CartContext = createContext()

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, qty } = action
      const exists = state.find((i) => i.id === product.id)
      if (exists) {
        return state.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [
        ...state,
        { id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, qty },
      ]
    }
    case 'SET_QTY':
      return state.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i))
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

function load() {
  try {
    return JSON.parse(localStorage.getItem('shopora-cart')) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], load)
  const [coupon, setCoupon] = useState(null)

  useEffect(() => {
    localStorage.setItem('shopora-cart', JSON.stringify(items))
  }, [items])

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + tax

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase()
    if (c === 'SAVE10') { setCoupon({ code: c, percent: 10 }); return true }
    if (c === 'SAVE20') { setCoupon({ code: c, percent: 20 }); return true }
    return false
  }

  const value = {
    items, count, subtotal, discount, tax, total, coupon,
    applyCoupon,
    removeCoupon: () => setCoupon(null),
    addToCart: (product, qty = 1) => dispatch({ type: 'ADD', product, qty }),
    setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    removeItem: (id) => dispatch({ type: 'REMOVE', id }),
    clearCart: () => { dispatch({ type: 'CLEAR' }); setCoupon(null) },
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)