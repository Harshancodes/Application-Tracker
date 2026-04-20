import { Application } from '../types'
import { getDashboardStats, getStatusColor } from '../utils/helpers'
import { TrendingUp, Briefcase, CheckCircle2, XCircle, Activity, Target, Plus } from 'lucide-react'

interface Props {
  applications: Application[]
}

export function Dashboard({ applications }: Props) {
  const stats = getDashboardStats(applications)

  const statusBreakdown = [
    'Wishlist', 'Applied', 'Screening', 'Interview', 'Technical', 'Offer', 'Accepted', 'Rejected', 'Withdrawn',
  ]
    .map(s => ({
      status: s as Application['status'],
      count: applications.filter(a => a.status === s).length,
    }))
    .filter(s => s.count > 0)

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">No applications yet</h3>
        <p className="text-slate-400 text-sm mb-6">Start tracking your job search by adding your first application.</p>
        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" />
          Click "Add Job" in the header to get started
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={<Briefcase className="w-4.5 h-4.5" />}
          label="Total"
          value={stats.total}
          gradient="from-indigo-500 to-indigo-600"
          light="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={<Activity className="w-4.5 h-4.5" />}
          label="Active"
          value={stats.active}
          gradient="from-violet-500 to-violet-600"
          light="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4.5 h-4.5" />}
          label="Offers"
          value={stats.offers}
          gradient="from-emerald-500 to-emerald-600"
          light="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={<XCircle className="w-4.5 h-4.5" />}
          label="Rejected"
          value={stats.rejected}
          gradient="from-red-500 to-red-600"
          light="bg-red-50 text-red-600"
        />
        <StatCard
          icon={<TrendingUp className="w-4.5 h-4.5" />}
          label="Avg Score"
          value={stats.avgLikelihood}
          gradient="from-amber-500 to-amber-600"
          light="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<Target className="w-4.5 h-4.5" />}
          label="Response %"
          value={`${stats.responseRate}%`}
          gradient="from-purple-500 to-purple-600"
          light="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Pipeline breakdown */}
      {statusBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Pipeline Breakdown</h3>

          {/* Progress bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-5">
            {statusBreakdown.map(({ status, count }) => (
              <div
                key={status}
                className={`h-full transition-all ${getBarColor(status)}`}
                style={{ width: `${(count / applications.length) * 100}%` }}
                title={`${status}: ${count}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {statusBreakdown.map(({ status, count }) => (
              <div
                key={status}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                <span>{status}</span>
                <span className="opacity-70">·</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon, label, value, gradient, light,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  gradient: string
  light: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-0.5">{value}</div>
      <div className={`text-xs font-semibold uppercase tracking-wide ${light}`}>{label}</div>
    </div>
  )
}

function getBarColor(status: Application['status']): string {
  const map: Record<string, string> = {
    Wishlist: 'bg-slate-300',
    Applied: 'bg-indigo-400',
    Screening: 'bg-purple-400',
    Interview: 'bg-violet-400',
    Technical: 'bg-cyan-400',
    Offer: 'bg-emerald-400',
    Accepted: 'bg-green-500',
    Rejected: 'bg-red-400',
    Withdrawn: 'bg-slate-200',
  }
  return map[status] ?? 'bg-slate-300'
}
