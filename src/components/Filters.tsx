import { Filters as FiltersType, ApplicationStatus, LocationType, JobSource } from '../types'
import { ALL_STATUSES } from '../utils/helpers'
import { Search, X } from 'lucide-react'

interface Props {
  filters: FiltersType
  onChange: (f: FiltersType) => void
}

export function FiltersBar({ filters, onChange }: Props) {
  const set = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) =>
    onChange({ ...filters, [key]: value })

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'All' ||
    filters.locationType !== 'All' ||
    filters.source !== 'All' ||
    filters.minLikelihood > 1 ||
    filters.maxLikelihood < 10

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
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
          onChange={e => set('status', e.target.value as ApplicationStatus | 'All')}
          className="select-filter">
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>

        <select
          value={filters.locationType}
          onChange={e => set('locationType', e.target.value as LocationType | 'All')}
          className="select-filter">
          <option value="All">All Locations</option>
          {(['Remote', 'Hybrid', 'Onsite'] as LocationType[]).map(l => <option key={l}>{l}</option>)}
        </select>

        <select
          value={filters.source}
          onChange={e => set('source', e.target.value as JobSource | 'All')}
          className="select-filter">
          <option value="All">All Sources</option>
          {(['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Glassdoor', 'AngelList', 'Other'] as JobSource[]).map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={() =>
              onChange({ search: '', status: 'All', locationType: 'All', source: 'All', minLikelihood: 1, maxLikelihood: 10 })
            }
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Score range:</span>
        <input
          type="range"
          min={1}
          max={10}
          value={filters.minLikelihood}
          onChange={e => set('minLikelihood', Math.min(Number(e.target.value), filters.maxLikelihood))}
          className="flex-1 accent-indigo-500"
        />
        <span className="text-xs font-semibold text-slate-700 w-4 text-center">{filters.minLikelihood}</span>
        <span className="text-xs text-slate-400">–</span>
        <input
          type="range"
          min={1}
          max={10}
          value={filters.maxLikelihood}
          onChange={e => set('maxLikelihood', Math.max(Number(e.target.value), filters.minLikelihood))}
          className="flex-1 accent-indigo-500"
        />
        <span className="text-xs font-semibold text-slate-700 w-4 text-center">{filters.maxLikelihood}</span>
      </div>
    </div>
  )
}
