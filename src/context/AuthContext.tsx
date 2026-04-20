import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { User } from '../types/auth'
import {
  getCurrentUser,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
} from '../utils/auth'

interface AuthContextType {
  user: User | null
  login: (usernameOrEmail: string, password: string) => { success: boolean; error?: string }
  register: (username: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())

  const login = useCallback((usernameOrEmail: string, password: string) => {
    const result = authLogin(usernameOrEmail, password)
    if (result.success && result.user) setUser(result.user)
    return { success: result.success, error: result.error }
  }, [])

  const register = useCallback((username: string, email: string, password: string) => {
    const result = authRegister(username, email, password)
    if (result.success && result.user) setUser(result.user)
    return { success: result.success, error: result.error }
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
