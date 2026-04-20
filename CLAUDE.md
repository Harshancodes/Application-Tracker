# JobTrackr — Application Tracker

## Project Overview
A full-featured job application tracker built with React + TypeScript + Vite + Tailwind CSS. Data is persisted in `localStorage`. Deployed on Vercel.

## Stack
- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v3
- **Icons**: lucide-react
- **Storage**: localStorage (no backend)
- **Deployment**: Vercel

## Project Structure
```
src/
  types/index.ts        — All TypeScript types (Application, Status, Filters, etc.)
  hooks/
    useApplications.ts  — Core state: CRUD, filtering, sorting
  utils/
    storage.ts          — localStorage read/write, CSV export
    helpers.ts          — Color helpers, stat calculations, constants
  components/
    Dashboard.tsx       — Stats cards + pipeline breakdown bar
    ApplicationForm.tsx — Add/edit modal form (all fields)
    TableView.tsx       — Sortable table with inline actions
    KanbanView.tsx      — Kanban board grouped by status
    Filters.tsx         — Search + filter bar + likelihood range slider
  App.tsx               — Root: tabs, header, view toggle, form modal
  main.tsx              — Entry point
  index.css             — Tailwind directives + .input/.select-filter classes
```

## Application Fields
| Field | Type | Notes |
|---|---|---|
| company | string | Required |
| role | string | Required |
| status | ApplicationStatus | Wishlist → Applied → Screening → Interview → Technical → Offer → Accepted/Rejected/Withdrawn |
| likelihood | number 1–10 | Color coded: ≥8 green, ≥6 blue, ≥4 amber, <4 red |
| appliedDate | string (YYYY-MM-DD) | |
| followUpDate | string (YYYY-MM-DD) | |
| jobUrl | string | |
| salaryMin / salaryMax | string | |
| location | string | |
| locationType | Remote / Hybrid / Onsite | |
| source | LinkedIn / Indeed / Company Website / Referral / Glassdoor / AngelList / Other | |
| recruiterName / recruiterEmail | string | |
| interviewRounds | InterviewRound[] | type, date, notes per round |
| tags | string[] | |
| notes | string | |

## Key Design Decisions
- **No backend**: localStorage keeps it zero-cost to host; export CSV for backup
- **Likelihood score 1–10**: Color-coded with bar indicators everywhere
- **Two views**: Table (sortable) and Kanban (by status column)
- **Dashboard tab**: Stats + pipeline breakdown bar chart

## Dev Commands
```bash
npm install       # install dependencies
npm run dev       # start dev server (localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Deployment (Vercel)
```bash
npm install -g vercel
vercel            # follow prompts — framework: Vite, build: npm run build, output: dist
```
Or connect the GitHub repo on vercel.com for auto-deploy on push.

## Adding Features
- **New status**: Add to `ApplicationStatus` union in `types/index.ts`, add color entries in `helpers.ts`, add to `COLUMNS` in `KanbanView.tsx` if needed
- **New field**: Add to `Application` interface, update `ApplicationForm.tsx`, `TableView.tsx`, and `exportToCSV` in `storage.ts`
- **Analytics**: `getDashboardStats` in `helpers.ts` computes all dashboard numbers
