import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Shopora home">
          <Logo />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <NavLink to="/" end className={(s) => `hidden sm:inline ${linkClass(s)}`}>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>

          {user ? (
            <>
              <NavLink to="/orders" className={linkClass}>My orders</NavLink>
              <span className="hidden md:inline text-sm text-slate-500">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} aria-label="Log out" title="Log out" className="text-slate-600 hover:text-indigo-600">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>Log in</NavLink>
          )}

          <Link to="/cart" aria-label="Cart" className="relative text-slate-700 hover:text-indigo-600">
            <ShoppingCart size={24} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}