import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import ProductGrid from '../components/ProductGrid'

const headingWords = ['Everything', 'you', 'need,']

export default function Home() {
  const { products, loading, error, retry } = useProducts()

  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8)
  const categories = [...new Set(products.map((p) => p.category))].slice(0, 8)

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white">
        {/* Soft floating circles */}
        <div className="float-slow absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="float-slow absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-pink-200/20 blur-2xl" style={{ animationDelay: '2s' }} />
        <div className="float-slow absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-white/10 blur-xl" style={{ animationDelay: '4s' }} />

        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
          <span
            className="fade-up inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur"
          >
            <Sparkles size={16} /> Fresh picks every day
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            {headingWords.map((word, i) => (
              <span
                key={word}
                className="fade-up mr-3 inline-block"
                style={{ animationDelay: `${0.2 + i * 0.18}s` }}
              >
                {word}
              </span>
            ))}
            <span
              className="fade-up inline-block"
              style={{ animationDelay: `${0.2 + headingWords.length * 0.18}s` }}
            >
              <span className="shimmer-text">delivered.</span>
            </span>
          </h1>

          <p className="fade-up mx-auto mt-5 max-w-xl text-lg text-white/90" style={{ animationDelay: '1s' }}>
            Shop top-rated products with simple, fast checkout.
          </p>

          <div className="fade-up mt-8 flex flex-wrap justify-center gap-4" style={{ animationDelay: '1.2s' }}>
            <Link
              to="/shop"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              Shop now
            </Link>
            <a
              href="#top-rated"
              className="rounded-lg border border-white/70 px-8 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              See top rated
            </a>
          </div>

          <div className="fade-up mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-white/90" style={{ animationDelay: '1.4s' }}>
            <span>100+ products</span>
            <span>Fast checkout</span>
            <span>Secure login</span>
          </div>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">Shop by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/shop?category=${c}`}
                className="capitalize bg-white border border-slate-200 px-4 py-2 rounded-full text-sm hover:border-indigo-600 hover:text-indigo-600"
              >
                {c.replace('-', ' ')}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Top rated ---------- */}
      <section id="top-rated" className="mx-auto max-w-6xl px-4 mt-12 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-4">Top rated</h2>
        <ProductGrid products={featured} loading={loading} error={error} retry={retry} />
      </section>
    </div>
  )
}