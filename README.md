# JobTrackr — Job Application Tracker

A full-featured job application tracker built with React + TypeScript + Vite + Tailwind CSS. All data is stored locally in your browser — no backend, no account required.

![JobTrackr](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## Features

- **Dashboard** — Stats overview with pipeline breakdown bar
- **Table View** — Sortable, filterable list of all applications
- **Kanban View** — Drag-friendly board grouped by status
- **Application Form** — Rich form with all fields: salary, recruiter, interview rounds, tags, notes
- **Likelihood Score** — 1–10 color-coded score to prioritize your pipeline
- **Filters** — Search by company/role, filter by status/source/location type, likelihood range slider
- **CSV Export** — Download all your data as a spreadsheet
- **Auth** — Simple local authentication

## Application Statuses

`Wishlist` → `Applied` → `Screening` → `Interview` → `Technical` → `Offer` → `Accepted` / `Rejected` / `Withdrawn`

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v3 |
| Icons | lucide-react |
| Storage | localStorage (no backend) |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Or connect this repo on [vercel.com](https://vercel.com) for auto-deploy on every push.

## Project Structure

```
src/
  types/index.ts              — TypeScript types
  hooks/useApplications.ts    — Core state: CRUD, filtering, sorting
  utils/
    storage.ts                — localStorage + CSV export
    helpers.ts                — Color helpers, stat calculations
  components/
    Dashboard.tsx             — Stats cards + pipeline bar
    ApplicationForm.tsx       — Add/edit modal
    TableView.tsx             — Sortable table
    KanbanView.tsx            — Kanban board
    Filters.tsx               — Search + filter bar
  App.tsx                     — Root component
```

## License

MIT
