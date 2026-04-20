import { User } from '../types/auth'

const USERS_KEY = 'jobtrackr_users'
const SESSION_KEY = 'jobtrackr_session'

function hashPassword(password: string): string {
  let hash = 5381
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) ^ password.charCodeAt(i)
    hash = hash >>> 0
  }
  return hash.toString(36)
}

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  const userId = getSession()
  if (!userId) return null
  return getUsers().find(u => u.id === userId) ?? null
}

export function register(
  username: string,
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Username already taken' }
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered' }
  }
  const user: User = {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    username,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, user])
  localStorage.setItem(SESSION_KEY, user.id)
  return { success: true, user }
}

export function login(
  usernameOrEmail: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  const user = users.find(
    u =>
      u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
      u.email.toLowerCase() === usernameOrEmail.toLowerCase()
  )
  if (!user) return { success: false, error: 'No account found with that username or email' }
  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password' }
  }
  localStorage.setItem(SESSION_KEY, user.id)
  return { success: true, user }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
