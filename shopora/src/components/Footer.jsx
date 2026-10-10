import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col items-center text-center">
        <Link to="/" aria-label="Shopora home">
          <Logo light />
        </Link>
        <p className="text-sm mt-3">Everything you need, delivered.</p>
      </div>
    </footer>
  )
}