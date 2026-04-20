import { Application } from '../types'

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
