import { useState, useEffect, useCallback } from 'react'
import { Application, Filters, SortField, SortDirection } from '../types'
import { loadApplications, saveApplications } from '../utils/storage'
import { generateId } from '../utils/helpers'

const defaultFilters: Filters = {
  search: '',
  status: 'All',
  locationType: 'All',
  source: 'All',
  minLikelihood: 1,
  maxLikelihood: 10,
}

export function useApplications(userId?: string) {
  const [applications, setApplications] = useState<Application[]>(() => loadApplications(userId))
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sortField, setSortField] = useState<SortField>('lastUpdated')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  useEffect(() => {
    saveApplications(applications, userId)
  }, [applications, userId])

  const addApplication = useCallback((data: Omit<Application, 'id' | 'lastUpdated'>) => {
    const app: Application = {
      ...data,
      id: generateId(),
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    setApplications(prev => [app, ...prev])
  }, [])

  const updateApplication = useCallback((id: string, data: Partial<Application>) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, ...data, lastUpdated: new Date().toISOString().split('T')[0] } : a)
    )
  }, [])

  const deleteApplication = useCallback((id: string) => {
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
      if (sortField === 'likelihood') {
        valA = a.likelihood
        valB = b.likelihood
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  return {
    applications,
    filtered,
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
