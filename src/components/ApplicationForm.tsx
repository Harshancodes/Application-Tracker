import { useState } from 'react'
import { Application, ApplicationStatus, LocationType, JobSource, InterviewRound } from '../types'
import { generateId, ALL_STATUSES } from '../utils/helpers'
import { X, Plus, Trash2 } from 'lucide-react'

interface Props {
  initial?: Application
  onSave: (data: Omit<Application, 'id' | 'lastUpdated'>) => void
  onClose: () => void
}

const emptyForm = (): Omit<Application, 'id' | 'lastUpdated'> => ({
  company: '',
  role: '',
  status: 'Applied',
  likelihood: 5,
  appliedDate: new Date().toISOString().split('T')[0],
  jobUrl: '',
  salaryMin: '',
  salaryMax: '',
  location: '',
  locationType: 'Remote',
  source: 'LinkedIn',
  recruiterName: '',
  recruiterEmail: '',
  followUpDate: '',
  interviewRounds: [],
  notes: '',
  tags: [],
})

export function ApplicationForm({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Application, 'id' | 'lastUpdated'>>(
    initial ? {
      company: initial.company,
      role: initial.role,
      status: initial.status,
      likelihood: initial.likelihood,
      appliedDate: initial.appliedDate,
      jobUrl: initial.jobUrl,
      salaryMin: initial.salaryMin,
      salaryMax: initial.salaryMax,
      location: initial.location,
      locationType: initial.locationType,
      source: initial.source,
      recruiterName: initial.recruiterName,
      recruiterEmail: initial.recruiterEmail,
      followUpDate: initial.followUpDate,
      interviewRounds: initial.interviewRounds,
      notes: initial.notes,
      tags: initial.tags,
    } : emptyForm()
  )
  const [tagInput, setTagInput] = useState('')

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const addInterviewRound = () => {
    const round: InterviewRound = { id: generateId(), type: 'Phone Screen', date: '', notes: '' }
    set('interviewRounds', [...form.interviewRounds, round])
  }

  const updateRound = (id: string, field: keyof InterviewRound, value: string) => {
    set('interviewRounds', form.interviewRounds.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const removeRound = (id: string) => {
    set('interviewRounds', form.interviewRounds.filter(r => r.id !== id))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => set('tags', form.tags.filter(t => t !== tag))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? 'Edit Application' : 'Add Application'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Core */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company *">
              <input required value={form.company} onChange={e => set('company', e.target.value)}
                className="input" placeholder="e.g. Google" />
            </Field>
            <Field label="Role *">
              <input required value={form.role} onChange={e => set('role', e.target.value)}
                className="input" placeholder="e.g. Software Engineer" />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value as ApplicationStatus)} className="input">
                {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Applied Date">
              <input type="date" value={form.appliedDate} onChange={e => set('appliedDate', e.target.value)} className="input" />
            </Field>
            <Field label="Follow-up Date">
              <input type="date" value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} className="input" />
            </Field>
          </div>

          {/* Likelihood */}
          <Field label={`Likelihood Score: ${form.likelihood}/10`}>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={10} value={form.likelihood}
                onChange={e => set('likelihood', Number(e.target.value))}
                className="flex-1 accent-blue-500" />
              <span className={`text-lg font-bold w-8 text-center ${getLikelihoodTextColor(form.likelihood)}`}>
                {form.likelihood}
              </span>
            </div>
          </Field>

          {/* Job details */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Job URL">
              <input type="url" value={form.jobUrl} onChange={e => set('jobUrl', e.target.value)}
                className="input" placeholder="https://..." />
            </Field>
            <Field label="Source">
              <select value={form.source} onChange={e => set('source', e.target.value as JobSource)} className="input">
                {(['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Glassdoor', 'AngelList', 'Other'] as JobSource[]).map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Location">
              <input value={form.location} onChange={e => set('location', e.target.value)}
                className="input" placeholder="e.g. New York, NY" />
            </Field>
            <Field label="Location Type">
              <select value={form.locationType} onChange={e => set('locationType', e.target.value as LocationType)} className="input">
                {(['Remote', 'Hybrid', 'Onsite'] as LocationType[]).map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-2 col-span-1">
              <Field label="Salary Min">
                <input value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)}
                  className="input" placeholder="$80k" />
              </Field>
              <Field label="Salary Max">
                <input value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)}
                  className="input" placeholder="$120k" />
              </Field>
            </div>
          </div>

          {/* Recruiter */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Recruiter Name">
              <input value={form.recruiterName} onChange={e => set('recruiterName', e.target.value)}
                className="input" placeholder="Jane Doe" />
            </Field>
            <Field label="Recruiter Email">
              <input type="email" value={form.recruiterEmail} onChange={e => set('recruiterEmail', e.target.value)}
                className="input" placeholder="jane@company.com" />
            </Field>
          </div>

          {/* Interview Rounds */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Interview Rounds</label>
              <button type="button" onClick={addInterviewRound}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                <Plus className="w-3.5 h-3.5" /> Add Round
              </button>
            </div>
            <div className="space-y-2">
              {form.interviewRounds.map(round => (
                <div key={round.id} className="bg-gray-50 rounded-lg p-3 grid grid-cols-3 gap-2 items-start">
                  <input value={round.type} onChange={e => updateRound(round.id, 'type', e.target.value)}
                    className="input text-sm" placeholder="Type (e.g. Phone Screen)" />
                  <input type="date" value={round.date} onChange={e => updateRound(round.id, 'date', e.target.value)}
                    className="input text-sm" />
                  <div className="flex gap-2">
                    <input value={round.notes} onChange={e => updateRound(round.id, 'notes', e.target.value)}
                      className="input text-sm flex-1" placeholder="Notes" />
                    <button type="button" onClick={() => removeRound(round.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <Field label="Tags">
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input flex-1" placeholder="Add tag + Enter" />
              <button type="button" onClick={addTag}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              className="input resize-none" rows={3} placeholder="Any additional notes..." />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg transition-all shadow-sm shadow-indigo-200">
              {initial ? 'Save Changes' : 'Add Application'}
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

function getLikelihoodTextColor(score: number): string {
  if (score >= 8) return 'text-emerald-600'
  if (score >= 6) return 'text-indigo-600'
  if (score >= 4) return 'text-amber-600'
  return 'text-red-600'
}
