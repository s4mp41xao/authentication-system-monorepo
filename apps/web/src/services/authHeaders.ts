export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const userStr = localStorage.getItem('user')

  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      if (user?.token) {
        return user.token
      }
      if (user?.session?.token) {
        return user.session.token
      }
      if (user?.sessionToken) {
        return user.sessionToken
      }
    } catch (error) {
      console.warn('[authHeaders] Falha ao ler user do localStorage:', error)
    }
  }

  const fallback = localStorage.getItem('session_token')
  return fallback || null
}

function normalizeHeaders(baseHeaders?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {}

  if (!baseHeaders) {
    return headers
  }

  if (Array.isArray(baseHeaders)) {
    for (const [key, value] of baseHeaders) {
      headers[key] = value
    }
    return headers
  }

  if (baseHeaders instanceof Headers) {
    baseHeaders.forEach((value, key) => {
      headers[key] = value
    })
    return headers
  }

  return { ...baseHeaders }
}

export function buildAuthHeaders(
  baseHeaders?: HeadersInit
): Record<string, string> {
  const headers = normalizeHeaders(baseHeaders)

  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getStoredAuthToken()

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}
