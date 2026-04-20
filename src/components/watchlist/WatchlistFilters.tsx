import { WatchlistFilters as FiltersType, WatchlistStatus } from '../../types/watchlist'
import { Search, X } from 'lucide-react'

interface Props {
  filters: FiltersType
  onChange: (f: FiltersType) => void
}

export function WatchlistFiltersBar({ filters, onChange }: Props) {
  const set = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) =>
    onChange({ ...filters, [key]: value })

  const hasActive =
    filters.search || filters.status !== 'All' || filters.minPriority > 1 || filters.maxPriority < 10

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-full sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            placeholder="Search company or role..."
          />
        </div>

        <select
          value={filters.status}
          onChange={e => set('status', e.target.value as WatchlistStatus | 'All')}
          className="select-filter">
          <option value="All">All Statuses</option>
          {(['Watching', 'Opened', 'Applied', 'Passed'] as WatchlistStatus[]).map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {hasActive && (
          <button
            onClick={() => onChange({ search: '', status: 'All', minPriority: 1, maxPriority: 10 })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Priority:</span>
        <input type="range" min={1} max={10} value={filters.minPriority}
          onChange={e => set('minPriority', Math.min(Number(e.target.value), filters.maxPriority))}
          className="flex-1 accent-indigo-500" />
        <span className="text-xs font-semibold text-slate-700 w-4 text-center">{filters.minPriority}</span>
        <span className="text-xs text-slate-400">–</span>
        <input type="range" min={1} max={10} value={filters.maxPriority}
          onChange={e => set('maxPriority', Math.max(Number(e.target.value), filters.minPriority))}
          className="flex-1 accent-indigo-500" />
        <span className="text-xs font-semibold text-slate-700 w-4 text-center">{filters.maxPriority}</span>
      </div>
    </div>
  )
}
