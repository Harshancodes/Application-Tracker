export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical'
  | 'Offer'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn'

export type LocationType = 'Remote' | 'Hybrid' | 'Onsite'

export type JobSource =
  | 'LinkedIn'
  | 'Indeed'
  | 'Company Website'
  | 'Referral'
  | 'Glassdoor'
  | 'AngelList'
  | 'Other'

export interface InterviewRound {
  id: string
  type: string
  date: string
  notes: string
}

export interface Application {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  likelihood: number // 1-10
  appliedDate: string
  lastUpdated: string
  jobUrl: string
  salaryMin: string
  salaryMax: string
  location: string
  locationType: LocationType
  source: JobSource
  recruiterName: string
  recruiterEmail: string
  followUpDate: string
  interviewRounds: InterviewRound[]
  notes: string
  tags: string[]
}

export type SortField = 'company' | 'role' | 'status' | 'likelihood' | 'appliedDate' | 'lastUpdated'
export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'table' | 'kanban'

export interface Filters {
  search: string
  status: ApplicationStatus | 'All'
  locationType: LocationType | 'All'
  source: JobSource | 'All'
  minLikelihood: number
  maxLikelihood: number
}
