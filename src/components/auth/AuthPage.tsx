import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Briefcase, Eye, EyeOff, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

type Mode = 'login' | 'register'

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const set = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'register') {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }
      if (form.username.trim().length < 2) {
        setError('Username must be at least 2 characters')
        setLoading(false)
        return
      }
      const result = await register(form.username.trim(), form.email, form.password)
      if (!result.success) {
        setError(result.error ?? 'Registration failed')
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.')
        switchMode('login')
      }
    } else {
      const result = await login(form.email, form.password)
      if (!result.success) setError(result.error ?? 'Login failed')
    }
    setLoading(false)
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setError('')
    setSuccess('')
    setForm({ username: '', email: '', password: '', confirmPassword: '' })
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-1 ring-white/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">JobTrackr</span>
          </div>

          <div className="mb-3">
            <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span className="text-xs text-indigo-200 font-medium">Free · Syncs across all your devices</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Land your<br />dream job faster
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed max-w-xs">
            Track every application, interview, and opportunity in one beautiful dashboard.
          </p>
        </div>

        <div className="relative z-10 space-y-3.5">
          {[
            'Track applications across all job boards',
            'Visualize your hiring pipeline with Kanban',
            'Score and prioritize your best opportunities',
            'Never miss a follow-up with date reminders',
          ].map(feature => (
            <div key={feature} className="flex items-center gap-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-indigo-300 flex-shrink-0" />
              <span className="text-indigo-100 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">JobTrackr</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                  mode === 'login'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}>
                Sign In
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                  mode === 'register'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}>
                Create Account
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                {mode === 'login' ? 'Welcome back 👋' : 'Get started today'}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                {mode === 'login'
                  ? 'Sign in to continue tracking your applications'
                  : 'Create your free account in seconds'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Username
                    </label>
                    <input
                      required
                      value={form.username}
                      onChange={e => set('username', e.target.value)}
                      className="auth-input"
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className="auth-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      className="auth-input pr-10"
                      placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Confirm Password
                    </label>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={e => set('confirmPassword', e.target.value)}
                      className="auth-input"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Your data syncs securely across all your devices
          </p>
        </div>
      </div>
    </div>
  )
}
