import { Application, SortField, SortDirection } from '../types'
import { getLikelihoodColor, getLikelihoodBarColor, getStatusColor } from '../utils/helpers'
import { ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink, Pencil, Trash2 } from 'lucide-react'

interface Props {
  applications: Application[]
  sortField: SortField
  sortDir: SortDirection
  onSort: (field: SortField) => void
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
}

export function TableView({ applications, sortField, sortDir, onSort, onEdit, onDelete }: Props) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-400 text-sm">No applications match your filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <SortHeader label="Company" field="company" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader label="Role" field="role" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader label="Status" field="status" current={sortField} dir={sortDir} onSort={onSort} />
              <SortHeader label="Score" field="likelihood" current={sortField} dir={sortDir} onSort={onSort} />
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <SortHeader label="Applied" field="appliedDate" current={sortField} dir={sortDir} onSort={onSort} className="hidden sm:table-cell" />
              <SortHeader label="Updated" field="lastUpdated" current={sortField} dir={sortDir} onSort={onSort} className="hidden lg:table-cell" />
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map(app => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{app.company}</span>
                    {app.jobUrl && (
                      <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-opacity">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {app.tags.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1 mt-1">
                      {app.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0 bg-gray-100 text-gray-500 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700 max-w-[120px] truncate">{app.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${getLikelihoodColor(app.likelihood)}`}>
                      {app.likelihood}
                    </span>
                    <div className="hidden sm:block w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getLikelihoodBarColor(app.likelihood)}`}
                        style={{ width: `${app.likelihood * 10}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-gray-500">
                  <div className="text-xs">{app.location || '—'}</div>
                  <div className="text-xs text-gray-400">{app.locationType}</div>
                </td>
                <td className="hidden sm:table-cell px-4 py-3 text-gray-500 text-xs">{app.appliedDate || '—'}</td>
                <td className="hidden lg:table-cell px-4 py-3 text-gray-500 text-xs">{app.lastUpdated}</td>
                <td className="hidden lg:table-cell px-4 py-3 text-gray-500 text-xs">
                  {app.salaryMin || app.salaryMax
                    ? `${app.salaryMin}${app.salaryMin && app.salaryMax ? ' – ' : ''}${app.salaryMax}`
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(app)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(app.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortHeader({ label, field, current, dir, onSort, className = '' }: {
  label: string; field: SortField; current: SortField; dir: SortDirection; onSort: (f: SortField) => void; className?: string
}) {
  const active = current === field
  return (
    <th className={`px-4 py-3 text-left ${className}`}>
      <button onClick={() => onSort(field)}
        className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-800 transition-colors">
        {label}
        {active ? (dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronsUpDown className="w-3 h-3 opacity-40" />}
      </button>
    </th>
  )
}
