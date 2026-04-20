import { Application } from '../types'

const KEY_PREFIX = 'job_applications'

function storageKey(userId?: string): string {
  return userId ? `${KEY_PREFIX}_${userId}` : KEY_PREFIX
}

export function loadApplications(userId?: string): Application[] {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveApplications(apps: Application[], userId?: string): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(apps))
}

export function exportToCSV(apps: Application[]): void {
  const headers = [
    'Company', 'Role', 'Status', 'Likelihood', 'Applied Date',
    'Location', 'Location Type', 'Source', 'Salary Min', 'Salary Max',
    'Recruiter Name', 'Recruiter Email', 'Follow Up Date', 'Job URL', 'Notes',
  ]
  const rows = apps.map(a => [
    a.company, a.role, a.status, a.likelihood, a.appliedDate,
    a.location, a.locationType, a.source, a.salaryMin, a.salaryMax,
    a.recruiterName, a.recruiterEmail, a.followUpDate, a.jobUrl,
    `"${a.notes.replace(/"/g, '""')}"`,
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
