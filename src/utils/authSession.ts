import { STORAGE_KEYS } from '../constants'
import type { AuthSession, AuthSessionUser, User } from '../types'

export const AUTH_SESSION_EVENT = 'auth-session-changed'

const notifyAuthSessionChanged = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT))
}

const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export const getStoredUser = (): AuthSessionUser | null => {
  const user = safeJsonParse<AuthSessionUser>(localStorage.getItem(STORAGE_KEYS.USER))
  if (!user) return null
  const roles = getStoredRoles()
  return {
    ...user,
    roles,
    is_admin: roles.includes('admin'),
  }
}

export const getStoredRoles = (): string[] => {
  const roles = safeJsonParse<string[]>(localStorage.getItem(STORAGE_KEYS.ROLES))
  if (Array.isArray(roles)) return roles

  const user = safeJsonParse<AuthSessionUser>(localStorage.getItem(STORAGE_KEYS.USER))
  if (Array.isArray(user?.roles)) return user.roles
  if (user?.is_admin === true) return ['admin']
  return []
}

export const getToken = (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN)

export const getTokenExpiresAt = (): number | null => {
  const raw = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT)
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export const isTokenExpired = (): boolean => {
  const expiresAt = getTokenExpiresAt()
  return !!expiresAt && Date.now() >= expiresAt
}

export const isAuthenticated = (): boolean => !!getToken() && !isTokenExpired()

export const isAdmin = (): boolean => getStoredRoles().includes('admin')

export const clearAuthSession = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE)
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT)
  localStorage.removeItem(STORAGE_KEYS.ROLES)
  localStorage.removeItem(STORAGE_KEYS.USER)
  notifyAuthSessionChanged()
}

export const saveAuthSession = (payload: {
  token: string
  tokenType: string
  expiresIn: number
  user: User
  roles: string[]
}): AuthSession => {
  const roles = payload.roles || []
  const expiresAt = Date.now() + payload.expiresIn * 1000
  const sessionUser: AuthSessionUser = {
    ...payload.user,
    roles,
    is_admin: roles.includes('admin'),
  }

  localStorage.setItem(STORAGE_KEYS.TOKEN, payload.token)
  localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, payload.tokenType)
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(expiresAt))
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles))
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser))
  notifyAuthSessionChanged()

  return {
    token: payload.token,
    token_type: payload.tokenType,
    expires_at: expiresAt,
    roles,
    user: sessionUser,
  }
}

export const sanitizeRedirectPath = (value: string | null | undefined, fallback = '/') => {
  if (!value) return fallback
  try {
    const decoded = decodeURIComponent(value)
    if (!decoded.startsWith('/') || decoded.startsWith('//')) return fallback
    if (/^[a-z][a-z\d+.-]*:/i.test(decoded)) return fallback
    return decoded
  } catch {
    return fallback
  }
}
