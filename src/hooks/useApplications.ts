import { useState, useEffect, useCallback } from 'react'
import { Application, Filters, SortField, SortDirection } from '../types'
import { supabase } from '../lib/supabase'

const defaultFilters: Filters = {
  search: '',
  status: 'All',
  locationType: 'All',
  source: 'All',
  minLikelihood: 1,
  maxLikelihood: 10,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): Application {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status,
    likelihood: row.likelihood,
    appliedDate: row.applied_date ?? '',
    lastUpdated: row.last_updated ?? '',
    followUpDate: row.follow_up_date ?? '',
    jobUrl: row.job_url ?? '',
    salaryMin: row.salary_min ?? '',
    salaryMax: row.salary_max ?? '',
    location: row.location ?? '',
    locationType: row.location_type ?? 'Remote',
    source: row.source ?? 'LinkedIn',
    recruiterName: row.recruiter_name ?? '',
    recruiterEmail: row.recruiter_email ?? '',
    interviewRounds: row.interview_rounds ?? [],
    notes: row.notes ?? '',
    tags: row.tags ?? [],
  }
}

function toRow(data: Omit<Application, 'id' | 'lastUpdated'>, userId: string) {
  return {
    user_id: userId,
    company: data.company,
    role: data.role,
    status: data.status,
    likelihood: data.likelihood,
    applied_date: data.appliedDate || null,
    last_updated: new Date().toISOString().split('T')[0],
    follow_up_date: data.followUpDate || null,
    job_url: data.jobUrl,
    salary_min: data.salaryMin,
    salary_max: data.salaryMax,
    location: data.location,
    location_type: data.locationType,
    source: data.source,
    recruiter_name: data.recruiterName,
    recruiter_email: data.recruiterEmail,
    interview_rounds: data.interviewRounds,
    notes: data.notes,
    tags: data.tags,
  }
}

export function useApplications(userId: string) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sortField, setSortField] = useState<SortField>('lastUpdated')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false })
      .then(({ data }) => {
        setApplications(data ? data.map(fromRow) : [])
        setLoading(false)
      })
  }, [userId])

  const addApplication = useCallback(async (data: Omit<Application, 'id' | 'lastUpdated'>) => {
    const { data: row } = await supabase
      .from('applications')
      .insert(toRow(data, userId))
      .select()
      .single()
    if (row) setApplications(prev => [fromRow(row), ...prev])
    return row ? fromRow(row) : null
  }, [userId])

  const updateApplication = useCallback(async (id: string, data: Partial<Application>) => {
    const today = new Date().toISOString().split('T')[0]
    const updates: Record<string, unknown> = { last_updated: today }
    if (data.company !== undefined) updates.company = data.company
    if (data.role !== undefined) updates.role = data.role
    if (data.status !== undefined) updates.status = data.status
    if (data.likelihood !== undefined) updates.likelihood = data.likelihood
    if (data.appliedDate !== undefined) updates.applied_date = data.appliedDate || null
    if (data.followUpDate !== undefined) updates.follow_up_date = data.followUpDate || null
    if (data.jobUrl !== undefined) updates.job_url = data.jobUrl
    if (data.salaryMin !== undefined) updates.salary_min = data.salaryMin
    if (data.salaryMax !== undefined) updates.salary_max = data.salaryMax
    if (data.location !== undefined) updates.location = data.location
    if (data.locationType !== undefined) updates.location_type = data.locationType
    if (data.source !== undefined) updates.source = data.source
    if (data.recruiterName !== undefined) updates.recruiter_name = data.recruiterName
    if (data.recruiterEmail !== undefined) updates.recruiter_email = data.recruiterEmail
    if (data.interviewRounds !== undefined) updates.interview_rounds = data.interviewRounds
    if (data.notes !== undefined) updates.notes = data.notes
    if (data.tags !== undefined) updates.tags = data.tags

    await supabase.from('applications').update(updates).eq('id', id)
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, ...data, lastUpdated: today } : a)
    )
  }, [])

  const deleteApplication = useCallback(async (id: string) => {
    await supabase.from('applications').delete().eq('id', id)
    setApplications(prev => prev.filter(a => a.id !== id))
  }, [])

  const handleSort = useCallback((field: SortField) => {
    setSortDir(prev => sortField === field && prev === 'asc' ? 'desc' : 'asc')
    setSortField(field)
  }, [sortField])

  const filtered = applications
    .filter(a => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!a.company.toLowerCase().includes(q) && !a.role.toLowerCase().includes(q)) return false
      }
      if (filters.status !== 'All' && a.status !== filters.status) return false
      if (filters.locationType !== 'All' && a.locationType !== filters.locationType) return false
      if (filters.source !== 'All' && a.source !== filters.source) return false
      if (a.likelihood < filters.minLikelihood || a.likelihood > filters.maxLikelihood) return false
      return true
    })
    .sort((a, b) => {
      let valA: string | number = a[sortField] as string | number
      let valB: string | number = b[sortField] as string | number
      if (sortField === 'likelihood') { valA = a.likelihood; valB = b.likelihood }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  return {
    applications,
    filtered,
    loading,
    filters,
    setFilters,
    sortField,
    sortDir,
    handleSort,
    addApplication,
    updateApplication,
    deleteApplication,
  }
}
