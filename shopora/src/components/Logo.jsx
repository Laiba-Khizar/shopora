import { ShoppingBag } from 'lucide-react'

export default function Logo({ light = false }) {
  return (
    <span className="group inline-flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-700 text-white shadow-md transition duration-300 group-hover:rotate-6 group-hover:scale-110">
        <ShoppingBag size={20} strokeWidth={2.2} />
      </span>

      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-800'}`}>
        Shop<span className={light ? 'text-indigo-300' : 'text-indigo-600'}>ora</span>
      </span>
    </span>
  )
}