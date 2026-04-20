import { useState } from 'react'
import { Application, ViewMode } from './types'
import { useApplications } from './hooks/useApplications'
import { useAuth } from './context/AuthContext'
import { AuthPage } from './components/auth/AuthPage'
import { Dashboard } from './components/Dashboard'
import { TableView } from './components/TableView'
import { KanbanView } from './components/KanbanView'
import { ApplicationForm } from './components/ApplicationForm'
import { FiltersBar } from './components/Filters'
import { exportToCSV } from './utils/storage'
import {
  LayoutList, Kanban, Plus, Download, Briefcase,
  LogOut, ChevronDown, BarChart2,
} from 'lucide-react'

export default function App() {
  const { user, logout } = useAuth()

  if (!user) return <AuthPage />

  return <AuthenticatedApp userId={user.id} username={user.username} onLogout={logout} />
}

function AuthenticatedApp({
  userId,
  username,
  onLogout,
}: {
  userId: string
  username: string
  onLogout: () => void
}) {
  const {
    applications, filtered, filters, setFilters,
    sortField, sortDir, handleSort,
    addApplication, updateApplication, deleteApplication,
  } = useApplications(userId)

  const [view, setView] = useState<ViewMode>('table')
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications'>('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleEdit = (app: Application) => {
    setEditingApp(app)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this application?')) deleteApplication(id)
  }

  const handleSave = (data: Omit<Application, 'id' | 'lastUpdated'>) => {
    if (editingApp) {
      updateApplication(editingApp.id, data)
    } else {
      addApplication(data)
    }
    setEditingApp(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingApp(null)
  }

  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-none tracking-tight">JobTrackr</h1>
                <p className="text-xs text-indigo-300/70 leading-none mt-0.5">Application Tracker</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToCSV(applications)}
                disabled={applications.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={() => { setEditingApp(null); setShowForm(true) }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-lg transition-all shadow-md shadow-indigo-500/30">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Job</span>
              </button>

              <div className="relative ml-1">
                <button
                  onClick={() => setShowUserMenu(p => !p)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </div>
                  <span className="text-sm text-slate-200 hidden sm:block">{username}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{username}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{applications.length} applications tracked</p>
                      </div>
                      <button
                        onClick={() => { setShowUserMenu(false); onLogout() }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 mb-6 border-b border-slate-200">
          <TabBtn
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<BarChart2 className="w-4 h-4" />}>
            Dashboard
          </TabBtn>
          <TabBtn
            active={activeTab === 'applications'}
            onClick={() => setActiveTab('applications')}
            icon={<Briefcase className="w-4 h-4" />}>
            Applications
            {applications.length > 0 && (
              <span className="ml-1.5 text-xs font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                {applications.length}
              </span>
            )}
          </TabBtn>
        </div>

        {activeTab === 'dashboard' && <Dashboard applications={applications} />}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            <FiltersBar filters={filters} onChange={setFilters} />

            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
                {applications.length} applications
              </p>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <ViewToggle active={view === 'table'} onClick={() => setView('table')}>
                  <LayoutList className="w-4 h-4" />
                </ViewToggle>
                <ViewToggle active={view === 'kanban'} onClick={() => setView('kanban')}>
                  <Kanban className="w-4 h-4" />
                </ViewToggle>
              </div>
            </div>

            {view === 'table' ? (
              <TableView
                applications={filtered}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <KanbanView applications={filtered} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        )}
      </main>

      {showForm && (
        <ApplicationForm
          initial={editingApp ?? undefined}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

function TabBtn({
  active, onClick, icon, children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors -mb-px ${
        active
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}>
      {icon}
      {children}
    </button>
  )
}

function ViewToggle({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        active ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
      }`}>
      {children}
    </button>
  )
}
