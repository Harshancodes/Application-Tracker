import { Application, ApplicationStatus } from '../types'

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getLikelihoodColor(score: number): string {
  if (score >= 8) return 'text-emerald-600 bg-emerald-50'
  if (score >= 6) return 'text-indigo-600 bg-indigo-50'
  if (score >= 4) return 'text-amber-600 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

export function getLikelihoodBarColor(score: number): string {
  if (score >= 8) return 'bg-emerald-500'
  if (score >= 6) return 'bg-indigo-500'
  if (score >= 4) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getStatusColor(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    Wishlist: 'bg-slate-100 text-slate-600',
    Applied: 'bg-indigo-100 text-indigo-700',
    Screening: 'bg-purple-100 text-purple-700',
    Interview: 'bg-violet-100 text-violet-700',
    Technical: 'bg-cyan-100 text-cyan-700',
    Offer: 'bg-emerald-100 text-emerald-700',
    Accepted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-600',
    Withdrawn: 'bg-slate-100 text-slate-400',
  }
  return map[status]
}

export function getStatusDotColor(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    Wishlist: 'bg-slate-400',
    Applied: 'bg-indigo-500',
    Screening: 'bg-purple-500',
    Interview: 'bg-violet-500',
    Technical: 'bg-cyan-500',
    Offer: 'bg-emerald-500',
    Accepted: 'bg-green-500',
    Rejected: 'bg-red-500',
    Withdrawn: 'bg-slate-300',
  }
  return map[status]
}

export function getDashboardStats(apps: Application[]) {
  const total = apps.length
  const active = apps.filter(a =>
    ['Applied', 'Screening', 'Interview', 'Technical', 'Offer'].includes(a.status)
  ).length
  const offers = apps.filter(a => a.status === 'Offer' || a.status === 'Accepted').length
  const rejected = apps.filter(a => a.status === 'Rejected').length
  const avgLikelihood = apps.length
    ? Math.round((apps.reduce((sum, a) => sum + a.likelihood, 0) / apps.length) * 10) / 10
    : 0
  const responseRate = total > 0
    ? Math.round(((total - apps.filter(a => a.status === 'Applied').length) / total) * 100)
    : 0

  return { total, active, offers, rejected, avgLikelihood, responseRate }
}

export const ALL_STATUSES: ApplicationStatus[] = [
  'Wishlist', 'Applied', 'Screening', 'Interview', 'Technical', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'
]

export const ACTIVE_STATUSES: ApplicationStatus[] = [
  'Wishlist', 'Applied', 'Screening', 'Interview', 'Technical', 'Offer'
]
