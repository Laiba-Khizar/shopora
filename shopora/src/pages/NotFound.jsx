import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-slate-600 mt-2 mb-6">This page does not exist.</p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
        Back to home
      </Link>
    </div>
  )
}