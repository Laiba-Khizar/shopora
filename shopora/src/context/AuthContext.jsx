import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('shopora-token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!localStorage.getItem('shopora-token'))

  // When the page opens with a saved token, ask the server who it belongs to
  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    apiFetch('/auth/me', { token })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('shopora-token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const save = (data) => {
    localStorage.setItem('shopora-token', data.token)
    setUser(data.user)
    setToken(data.token)
  }

  const signup = async (name, email, password) =>
    save(await apiFetch('/auth/signup', { method: 'POST', body: { name, email, password } }))

  const login = async (email, password) =>
    save(await apiFetch('/auth/login', { method: 'POST', body: { email, password } }))

  const logout = () => {
    localStorage.removeItem('shopora-token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)