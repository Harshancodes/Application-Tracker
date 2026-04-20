import { useState, useEffect, useCallback } from 'react'
import { WatchlistEntry, WatchlistFilters, WatchlistStatus } from '../types/watchlist'
import { supabase } from '../lib/supabase'

const defaultFilters: WatchlistFilters = {
  search: '',
  status: 'All',
  minPriority: 1,
  maxPriority: 10,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): WatchlistEntry {
  return {
    id: row.id,
    company: row.company,
    roleInterested: row.role_interested ?? '',
    careersUrl: row.careers_url ?? '',
    expectedOpenDate: row.expected_open_date ?? '',
    notes: row.notes ?? '',
    priority: row.priority,
    status: row.status,
    linkedApplicationId: row.linked_application_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function useWatchlist(userId: string) {
  const [entries, setEntries] = useState<WatchlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<WatchlistFilters>(defaultFilters)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: false })
      .then(({ data }) => {
        setEntries(data ? data.map(fromRow) : [])
        setLoading(false)
      })
  }, [userId])

  const addEntry = useCallback(async (data: Omit<WatchlistEntry, 'id' | 'createdAt' | 'updatedAt' | 'linkedApplicationId'>) => {
    const { data: row } = await supabase
      .from('watchlist')
      .insert({
        user_id: userId,
        company: data.company,
        role_interested: data.roleInterested,
        careers_url: data.careersUrl,
        expected_open_date: data.expectedOpenDate || null,
        notes: data.notes,
        priority: data.priority,
        status: data.status,
      })
      .select()
      .single()
    if (row) setEntries(prev => [fromRow(row), ...prev])
  }, [userId])

  const updateEntry = useCallback(async (id: string, data: Partial<WatchlistEntry>) => {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (data.company !== undefined) updates.company = data.company
    if (data.roleInterested !== undefined) updates.role_interested = data.roleInterested
    if (data.careersUrl !== undefined) updates.careers_url = data.careersUrl
    if (data.expectedOpenDate !== undefined) updates.expected_open_date = data.expectedOpenDate || null
    if (data.notes !== undefined) updates.notes = data.notes
    if (data.priority !== undefined) updates.priority = data.priority
    if (data.status !== undefined) updates.status = data.status
    if (data.linkedApplicationId !== undefined) updates.linked_application_id = data.linkedApplicationId

    await supabase.from('watchlist').update(updates).eq('id', id)
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    await supabase.from('watchlist').delete().eq('id', id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const filtered = entries.filter(e => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!e.company.toLowerCase().includes(q) && !e.roleInterested.toLowerCase().includes(q)) return false
    }
    if (filters.status !== 'All' && e.status !== filters.status) return false
    if (e.priority < filters.minPriority || e.priority > filters.maxPriority) return false
    return true
  })

  const statusCounts: Record<WatchlistStatus, number> = {
    Watching: entries.filter(e => e.status === 'Watching').length,
    Opened: entries.filter(e => e.status === 'Opened').length,
    Applied: entries.filter(e => e.status === 'Applied').length,
    Passed: entries.filter(e => e.status === 'Passed').length,
  }

  return { entries, filtered, loading, filters, setFilters, addEntry, updateEntry, deleteEntry, statusCounts }
}
