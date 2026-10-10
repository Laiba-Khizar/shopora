import { Router } from 'express'
import Order from '../models/Order.js'
import { products } from '../productsData.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const round = (n) => Math.round(n * 100) / 100
const COUPONS = { SAVE10: 10, SAVE20: 20 }

// Shape the order the same way the frontend already expects it
const format = (o) => ({
  id: o.orderId,
  items: o.items,
  shipping: o.shipping,
  couponCode: o.couponCode,
  subtotal: o.subtotal,
  discount: o.discount,
  tax: o.tax,
  total: o.total,
  createdAt: o.createdAt,
})

// POST /api/orders
router.post('/', requireAuth, async (req, res) => {
  const { items, couponCode, shipping } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' })
  }
  if (!shipping || !shipping.name || !shipping.address || !shipping.city || !shipping.zip) {
    return res.status(400).json({ message: 'Shipping details are incomplete' })
  }

  // Prices come from OUR product list, never from the browser
  const orderItems = []

  for (const item of items) {
    const product = products.find((p) => p.id === Number(item.id))
    const qty = Number(item.qty)

    if (!product || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: 'One of the items is invalid' })
    }

    orderItems.push({ id: product.id, title: product.title, price: product.price, qty })
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const code = (couponCode || '').toUpperCase()
  const percent = COUPONS[code] || 0
  const discount = (subtotal * percent) / 100
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + tax

  try {
    const order = await Order.create({
      orderId: 'SH-' + Math.floor(100000 + Math.random() * 900000),
      user: req.user.id,
      items: orderItems,
      shipping: {
        name: shipping.name,
        email: shipping.email,
        address: shipping.address,
        city: shipping.city,
        zip: shipping.zip,
      },
      couponCode: percent ? code : null,
      subtotal: round(subtotal),
      discount: round(discount),
      tax: round(tax),
      total: round(total),
    })

    res.status(201).json(format(order))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not save your order' })
  }
})

// GET /api/orders (my orders, newest first)
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(orders.map(format))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not load your orders' })
  }
})

export default router