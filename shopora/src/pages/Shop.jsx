import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import ProductGrid from '../components/ProductGrid'
import { formatPrice } from '../utils/formatPrice'

export default function Shop() {
  const { products, loading, error, retry } = useProducts()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'all'

  const [search, setSearch] = useState('')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [sort, setSort] = useState('default')

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products])

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === 'all' || p.category === category) &&
        p.price <= maxPrice,
    )
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'name') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [products, search, category, maxPrice, sort])

  const setCategory = (value) => {
    if (value === 'all') setParams({})
    else setParams({ category: value })
  }

  const box = 'rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className={`${box} w-full pl-10`}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" className={`${box} capitalize`}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c.replace('-', ' ')}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className={box}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="rating">Top rated</option>
          <option value="name">Name A to Z</option>
        </select>

        <div className="md:col-span-4">
          <label className="text-sm text-slate-600">
            Max price: <strong>{formatPrice(maxPrice)}</strong>
          </label>
          <input
            type="range"
            min="10"
            max="5000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      {!loading && !error && (
        <p className="text-sm text-slate-500 mb-4">{filtered.length} products</p>
      )}
      <ProductGrid products={filtered} loading={loading} error={error} retry={retry} />
    </div>
  )
}