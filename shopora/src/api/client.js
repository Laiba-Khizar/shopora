const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// One helper for every request to our server
export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  let res

  try {
    res = await fetch(API + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Is it running?')
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}