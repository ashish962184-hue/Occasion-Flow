# Alexandria CRM ⚜️

An elegant, high-end, full-stack Gifting Occasion Calendar and Customer Relationship CRM Tracker designed for modern wealth managers and high-touch concierge teams. 

---

## 🏛️ System Architecture

Alexandria CRM utilizes a robust full-stack (Client + Server) layout with automated local data persistence:

- **Frontend (SPA)**: Custom-constructed React single-page application styled using modern Tailwinds, serif Cinzel titles, geometric Inter parameters, and Lucide vector layouts.
- **Backend (Express)**: A solid modular Express server on Port 3000 hosting custom REST endpoints for full-spectrum CRUD manipulation of customers, gift portfolios, occasions, and histories.
- **Database (File-Durable)**: Uses a file-persistent schema located at `/alexandria_db.json`. It automates persistent writes and dynamically spins up a custom **Seeding Engine** on its very first startup compiling exactly:
  - **50 Vetted VIP Profiles** with tags, custom allergies/contact addresses, and private notes.
  - **100 Active Celebrations** (Anniversaries, Promotionals, Birthdays) scattered near the 2026 system timeframe.
  - **200 Curated Gift Orders** ranging from vintage Macallans to custom Italian folder structures.

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

## 🚀 Running Alexandria Core

To start the full-stack system:

```bash
# Install core modules
npm run install_applet_dependencies

# Initiate server & dev tools
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
