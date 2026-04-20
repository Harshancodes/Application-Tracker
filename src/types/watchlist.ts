export type WatchlistStatus = 'Watching' | 'Opened' | 'Applied' | 'Passed'

export interface WatchlistEntry {
  id: string
  company: string
  roleInterested: string
  careersUrl: string
  expectedOpenDate: string
  notes: string
  priority: number
  status: WatchlistStatus
  linkedApplicationId: string | null
  createdAt: string
  updatedAt: string
}

export interface WatchlistFilters {
  search: string
  status: WatchlistStatus | 'All'
  minPriority: number
  maxPriority: number
}
