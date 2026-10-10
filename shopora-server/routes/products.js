import { Router } from 'express'
import { products } from '../productsData.js'

const router = Router()

// GET /api/products   (?search=phone  ?category=beauty  ?limit=10)
router.get('/', (req, res) => {
  const { search, category, limit } = req.query
  let list = products

  if (search) {
    list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
  }

  if (category) {
    list = list.filter((p) => p.category === category)
  }

  if (limit) {
    list = list.slice(0, Number(limit))
  }

  res.json({ total: list.length, products: list })
})

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id))

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.json(product)
})

export default router