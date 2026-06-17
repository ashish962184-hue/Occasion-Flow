# Gifting Occasion Calendar & Customer Relationship Tracker ⚜️

An elegant, high-end, full-stack application designed specifically for modern wealth managers, high-touch concierges, and luxury sales professionals.

---

## 🏛️ Project Architecture

This application utilizes a robust full-stack (Client + Server) layout with automated local data persistence:

- **Frontend (SPA)**: Custom-constructed React single-page application styled using modern Tailwinds, serif Cinzel titles, geometric Inter parameters, and Lucide vector layouts.
- **Backend (Express)**: A solid modular Express server on Port 5000 hosting custom REST endpoints for full-spectrum CRUD manipulation of customers, gift portfolios, occasions, and histories.
- **Database (SQLite)**: Uses a relational SQLite database located at `backend/database/database.sqlite`. It includes seeding and clearing scripts to populate mock data:
  - Run `npm run seed:mock` to generate clients, events, and purchases.
  - Run `npm run clear:mock` to reset the database.

---

## ⚙️ Core Modules & Features

1. **Dashboard Overviews**: At-a-glance analytics monitoring active C-suite heads, upcoming 30-day priorities, pending notification queues, and estimated pipelines paired with chronological feed timelines.
2. **Customer CRM Directory**: Standard Ledger lists documenting client tiers, tags, and profiles. Click details panels or slide-outs, search by tags or text, and complete CRUD updates.
3. **Milestones Calendar**: Elegant toggle month grids or linear calendars showing days. Click any element to slide in detailed messaging coordinates.
4. **Curation Ledger (Gift History)**: Real-time finance portfolios showing lifetime total investments, shipping/dispatching lines (Processing, Shipped, Delivered), and invoice previews.
5. **Reminder Center Queue**: Follows strict algorithms checking `today >= occasion_date - reminder_days` to trigger actions. Features editable draft copy fields and direct dispatch send indicators.
6. **Executive Boardroom**: Displays SVG graphs outlining categorical velocities, acquisition pricing lines, and outreach conversion audits.
7. **Customer detail Profile**: Deep tab folders mapping timeline chronologies, curated AI recommendation lists, notes, and milestones.

---

## 🚀 Running Application Core

To start the full-stack system:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Initiate server & dev tools (runs frontend & backend concurrently)
npm run dev

# Compile production bundles
npm run build
```

---

## 📋 Acceptance Checklist

- [x] Full CRUD operations (Create, Edit, Delete, Retrieve) on Customer and Occasion records.
- [x] Dynamic upcoming occasions month calendar & timeline views.
- [x] Interactive Gift History Ledger with sidebar detail slates and fulfillment tracks.
- [x] Automation engine generating alerts T-days prior to client milestones.
- [x] Real-time metrics calculations for spend summaries and active rosters on the dashboard.
- [x] Interactive tab panels inside Deep Profiles for logging comments.
- [x] Exportable CSV data sheets and system printing guidelines.
- [x] Robust files structure with 100% type safety and Zero build/linting warnings.
- [x] Believable pre-populated seed volumes (50 clients, 100 events, 200 purchases).
