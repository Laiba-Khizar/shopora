import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function Auth({ mode }) {
  const isSignup = mode === 'signup'
  const { signup, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setServerError('')
    setSubmitting(true)
    try {
      if (isSignup) await signup(data.name, data.email, data.password)
      else await login(data.email, data.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{isSignup ? 'Create account' : 'Welcome back'}</h1>
      <p className="text-slate-500 mb-6">
        {isSignup ? 'Sign up to place orders and see your order history.' : 'Log in to continue.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {serverError && (
          <p className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{serverError}</p>
        )}

        {isSignup && (
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input className={inputClass} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })} />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className={inputClass} {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className={inputClass} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300"
        >
          {submitting ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4 text-center">
        {isSignup ? 'Already have an account?' : 'New here?'}{' '}
        <Link
          to={isSignup ? '/login' : '/signup'}
          state={location.state}
          className="text-indigo-600 font-medium"
        >
          {isSignup ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </div>
  )
}