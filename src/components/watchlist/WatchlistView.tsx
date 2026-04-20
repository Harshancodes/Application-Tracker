import { useState } from 'react'
import { WatchlistEntry, WatchlistFilters } from '../../types/watchlist'
import { WatchlistFiltersBar } from './WatchlistFilters'
import { WatchlistForm } from './WatchlistForm'
import { getLikelihoodColor } from '../../utils/helpers'
import { Plus, Pencil, Trash2, ExternalLink, ArrowRight, Eye, Bookmark, CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  entries: WatchlistEntry[]
  filtered: WatchlistEntry[]
  filters: WatchlistFilters
  setFilters: (f: WatchlistFilters) => void
  loading: boolean
  onAdd: (data: Omit<WatchlistEntry, 'id' | 'createdAt' | 'updatedAt' | 'linkedApplicationId'>) => void
  onEdit: (id: string, data: Partial<WatchlistEntry>) => void
  onDelete: (id: string) => void
  onConvertToApplication: (entry: WatchlistEntry) => void
}

const STATUS_CONFIG = {
  Watching: { color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', icon: Eye },
  Opened:   { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', icon: Bookmark },
  Applied:  { color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500', icon: CheckCircle2 },
  Passed:   { color: 'bg-red-100 text-red-600', dot: 'bg-red-400', icon: XCircle },
}

export function WatchlistView({ entries, filtered, filters, setFilters, loading, onAdd, onEdit, onDelete, onConvertToApplication }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<WatchlistEntry | null>(null)
  const [convertConfirm, setConvertConfirm] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <WatchlistFiltersBar filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {entries.length} targets
        </p>
        <button
          onClick={() => { setEditingEntry(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-lg transition-all shadow-md shadow-indigo-500/30">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Target</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Bookmark className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="font-semibold text-slate-700">No target companies yet</p>
              <p className="text-slate-400 text-sm max-w-xs">Add companies you want to apply to when they open hiring.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg">
                <Plus className="w-4 h-4" /> Add your first target
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No entries match your filters.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Opens</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(entry => {
                  const cfg = STATUS_CONFIG[entry.status]
                  const isConfirming = convertConfirm === entry.id
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{entry.company}</span>
                          {entry.careersUrl && (
                            <a href={entry.careersUrl} target="_blank" rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-opacity">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{entry.notes}</p>
                        )}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-gray-600 text-sm">{entry.roleInterested || '—'}</td>
                      <td className="px-4 py-3">
                        {isConfirming ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-600">Create application?</span>
                            <button onClick={() => { onConvertToApplication(entry); setConvertConfirm(null) }}
                              className="text-xs px-2 py-1 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700">
                              Yes
                            </button>
                            <button onClick={() => { onEdit(entry.id, { status: 'Watching' }); setConvertConfirm(null) }}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded font-medium hover:bg-gray-200">
                              No
                            </button>
                          </div>
                        ) : (
                          <select
                            value={entry.status}
                            onChange={e => {
                              const val = e.target.value as WatchlistEntry['status']
                              if (val === 'Applied' && !entry.linkedApplicationId) {
                                onEdit(entry.id, { status: val })
                                setConvertConfirm(entry.id)
                              } else {
                                onEdit(entry.id, { status: val })
                              }
                            }}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${cfg.color}`}>
                            {(['Watching', 'Opened', 'Applied', 'Passed'] as WatchlistEntry['status'][]).map(s => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${getLikelihoodColor(entry.priority)}`}>
                          {entry.priority}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-gray-500 text-xs">
                        {entry.expectedOpenDate || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {entry.status === 'Opened' && !entry.linkedApplicationId && (
                            <button
                              onClick={() => { onEdit(entry.id, { status: 'Applied' }); setConvertConfirm(entry.id) }}
                              title="Convert to Application"
                              className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => { setEditingEntry(entry); setShowForm(true) }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onDelete(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <WatchlistForm
          initial={editingEntry ?? undefined}
          onSave={data => {
            if (editingEntry) onEdit(editingEntry.id, data)
            else onAdd(data)
          }}
          onClose={() => { setShowForm(false); setEditingEntry(null) }}
        />
      )}
    </div>
  )
}
