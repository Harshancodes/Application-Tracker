import { useState } from 'react'
import { WatchlistEntry, WatchlistStatus } from '../../types/watchlist'
import { X } from 'lucide-react'

interface Props {
  initial?: WatchlistEntry
  onSave: (data: Omit<WatchlistEntry, 'id' | 'createdAt' | 'updatedAt' | 'linkedApplicationId'>) => void
  onClose: () => void
}

const empty = (): Omit<WatchlistEntry, 'id' | 'createdAt' | 'updatedAt' | 'linkedApplicationId'> => ({
  company: '',
  roleInterested: '',
  careersUrl: '',
  expectedOpenDate: '',
  notes: '',
  priority: 5,
  status: 'Watching',
})

export function WatchlistForm({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState(
    initial
      ? { company: initial.company, roleInterested: initial.roleInterested, careersUrl: initial.careersUrl,
          expectedOpenDate: initial.expectedOpenDate, notes: initial.notes, priority: initial.priority, status: initial.status }
      : empty()
  )

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? 'Edit Target Company' : 'Add Target Company'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company *">
              <input required value={form.company} onChange={e => set('company', e.target.value)}
                className="input" placeholder="e.g. Google" />
            </Field>
            <Field label="Role Interested In">
              <input value={form.roleInterested} onChange={e => set('roleInterested', e.target.value)}
                className="input" placeholder="e.g. Software Engineer" />
            </Field>
          </div>

          <Field label="Careers Page URL">
            <input type="url" value={form.careersUrl} onChange={e => set('careersUrl', e.target.value)}
              className="input" placeholder="https://careers.company.com" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Expected Opening Date">
              <input type="date" value={form.expectedOpenDate} onChange={e => set('expectedOpenDate', e.target.value)}
                className="input" />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value as WatchlistStatus)} className="input">
                {(['Watching', 'Opened', 'Applied', 'Passed'] as WatchlistStatus[]).map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={`Priority: ${form.priority}/10`}>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={10} value={form.priority}
                onChange={e => set('priority', Number(e.target.value))}
                className="flex-1 accent-indigo-500" />
              <span className="text-lg font-bold w-8 text-center text-indigo-600">{form.priority}</span>
            </div>
          </Field>

          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              className="input resize-none" rows={3} placeholder="Why you want to work here, contacts, etc." />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg transition-all shadow-sm">
              {initial ? 'Save Changes' : 'Add to Watchlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}
