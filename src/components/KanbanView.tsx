import { Application, ApplicationStatus } from '../types'
import { getLikelihoodColor, getStatusDotColor } from '../utils/helpers'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'

interface Props {
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
}

const COLUMNS: ApplicationStatus[] = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Technical', 'Offer', 'Accepted', 'Rejected']

export function KanbanView({ applications, onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(status => {
        const cards = applications.filter(a => a.status === status)
        return (
          <div key={status} className="flex-shrink-0 w-56 sm:w-64">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(status)}`} />
              <span className="text-sm font-semibold text-gray-700">{status}</span>
              <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {cards.length}
              </span>
            </div>
            <div className="space-y-2">
              {cards.map(app => (
                <KanbanCard key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} />
              ))}
              {cards.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl h-16 flex items-center justify-center">
                  <span className="text-xs text-gray-300">Empty</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KanbanCard({ app, onEdit, onDelete }: { app: Application; onEdit: (a: Application) => void; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{app.company}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{app.role}</p>
        </div>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${getLikelihoodColor(app.likelihood)}`}>
          {app.likelihood}/10
        </span>
      </div>

      {app.location && (
        <p className="text-xs text-gray-400 mb-2">{app.location} · {app.locationType}</p>
      )}

      {(app.salaryMin || app.salaryMax) && (
        <p className="text-xs text-gray-500 mb-2">
          {app.salaryMin}{app.salaryMin && app.salaryMax ? ' – ' : ''}{app.salaryMax}
        </p>
      )}

      {app.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {app.tags.map(tag => (
            <span key={tag} className="px-1.5 bg-gray-100 text-gray-500 rounded text-xs">{tag}</span>
          ))}
        </div>
      )}

      {app.followUpDate && (
        <p className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded mb-2">
          Follow up: {app.followUpDate}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">{app.appliedDate || 'No date'}</span>
        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {app.jobUrl && (
            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
              className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={() => onEdit(app)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(app.id)}
            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
