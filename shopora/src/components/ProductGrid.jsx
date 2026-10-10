import ProductCard from './ProductCard'

export default function ProductGrid({ products, loading, error, retry }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
            <div className="aspect-square bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 mb-4">Could not load products. Check your internet connection.</p>
        <button onClick={retry} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700">
          Try again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return <p className="text-center py-16 text-slate-500">No products found. Try changing your filters.</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}