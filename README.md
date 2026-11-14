# Failure Prediction AI – Startup & Project Risk Analyzer
### Milestone 1: Information Collection, Market Intelligence, Competitor Analysis & PostgreSQL Storage

---

## 1. Project Overview

**Failure Prediction AI** is an intelligent web application designed for entrepreneurs, students, researchers, startups, and project teams to submit ideas and proposals to evaluate target market dynamics, assess competitive intensity, uncover market opportunities, and benchmark competitors.

**Milestone 1 Scope:**
- **Project Information Collection**: Structured multi-category intake form for Startups, College Projects, Hackathons, Business Proposals, Innovations, and Other concepts. Dynamic category-specific fields.
- **Market Intelligence**: Target market overview, structural characteristics, audience behavior analysis, opportunities, industry challenges, and growth potential.
- **Competitor Analysis**: Identification of direct/indirect competitors, strengths, weaknesses, competitive moats, landscape overview, competition level, and differentiation vectors.
- **PostgreSQL Database Storage**: Persistent storage of users, projects, details, market intelligence, and competitor benchmarks.
- **Google Gemini AI Integration**: Live market reasoning via Google Gemini API (`gemini-2.5-flash`), with an intelligent domain fallback engine when an API key is not provided.
- **Executive Strategic Report**: Printable/downloadable PDF dossier synthesizing market positioning and competitive intelligence.

---

## 2. Technology Stack

### Frontend
- **React.js 18** with **TypeScript**
- **Vite** (Next-generation frontend tooling and bundler)
- **Tailwind CSS** (Modern SaaS dashboard styling and responsive layouts)
- **Lucide React** (Clean, semantic icon set)
- **Print Optimization** (`@media print` stylesheet for executive report PDF generation)

### Backend
- **Python 3.11**
- **FastAPI** (High-performance asynchronous REST API framework)
- **SQLAlchemy 2.0 ORM** (Relational model definitions and query engine)
- **Psycopg 3 / Psycopg2** (Robust PostgreSQL driver)
- **Pydantic v2 & Pydantic-Settings** (Strict request/response validation and settings management)
- **HTTPX** (Async client for Google Gemini API communication)

### Database
- **PostgreSQL 18 / 17** (Relational database management system)
- SQLAlchemy database initialization (`Base.metadata.create_all`) without Alembic.

### AI Integration
- **Google Gemini API** (`gemini-2.5-flash` / `gemini-1.5-flash`)
- **Intelligent Fallback Engine**: Rule-based domain intelligence ensuring the app functions seamlessly and realistically even when an API key is absent or network-restricted.

---

## 3. Project Folder Structure

```
failure_prediction/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py              # Settings & environment variable configuration
│   │   ├── database.py            # SQLAlchemy engine, session maker, init_db
│   │   ├── models/                # SQLAlchemy database entities
│   │   │   ├── __init__.py
│   │   │   ├── user.py            # User entity (anonymous / registered)
│   │   │   ├── project.py         # Project & ProjectDetail entities
│   │   │   ├── market_analysis.py # Market intelligence entity
│   │   │   └── competitor.py      # Competitor benchmark entity
│   │   ├── schemas/               # Pydantic validation schemas
│   │   │   ├── __init__.py
│   │   │   ├── project.py         # Project input & response schemas
│   │   │   └── analysis.py        # Market, competitor & report schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── ai_service.py      # Gemini API caller & intelligent fallback engine
│   │   ├── routers/               # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── projects.py        # Ingestion & retrieval endpoints
│   │   │   └── analysis.py        # Intelligence & report endpoints
│   │   └── main.py                # FastAPI app entry point & CORS configuration
│   ├── requirements.txt           # Python backend dependencies
│   ├── test_backend_e2e.py        # End-to-end API verification suite
│   ├── .env                       # Local environment variables
│   └── .env.example               # Template environment configuration
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.tsx         # Navigation header & live health indicator
│   │   │   ├── Footer.tsx         # Platform footer & tech credits
│   │   │   ├── StatusBadge.tsx    # Analysis readiness pill
│   │   │   ├── CategoryBadge.tsx  # Dynamic category badges
│   │   │   ├── CompetitionGauge.tsx # Visual intensity indicator
│   │   │   ├── AiVerificationBanner.tsx # Data source & verification notice
│   │   │   └── LoadingSkeleton.tsx# Modern loading skeletons
│   │   ├── pages/                 # Full-page views
│   │   │   ├── LandingPage.tsx    # Marketing, hero & system architecture
│   │   │   ├── SubmitProjectPage.tsx # Intake form with category-specific fields
│   │   │   ├── MarketIntelligencePage.tsx # 6 market intelligence sections
│   │   │   ├── CompetitorAnalysisPage.tsx # Competitor profiles & landscape
│   │   │   ├── MyProjectsPage.tsx # PostgreSQL project catalog & details modal
│   │   │   └── ReportPage.tsx     # Executive printable dossier
│   │   ├── services/
│   │   │   └── api.ts             # Typed REST API client
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript interfaces & types
│   │   ├── App.tsx                # Master state & tab router
│   │   ├── main.tsx               # React mount root
│   │   └── index.css              # Tailwind base & print styles
│   ├── index.html                 # HTML entry point with fonts & meta
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tailwind.config.js         # Tailwind theme & color extensions
│   ├── postcss.config.js          # PostCSS configuration
│   ├── tsconfig.json              # TypeScript root config
│   └── vite.config.ts             # Vite development server config
├── run_backend.bat                # One-click Windows batch launcher (Backend)
├── run_frontend.bat               # One-click Windows batch launcher (Frontend)
├── run_backend.ps1                # PowerShell launcher (Backend)
├── run_frontend.ps1               # PowerShell launcher (Frontend)
└── README.md                      # Comprehensive project documentation
```

---

## 4. PostgreSQL Database Schema

The database utilizes relational integrity with foreign keys, cascading deletes, and JSON columns for dynamic parameters.

### 1. `users` Table
- `id`: `INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`
- `email`: `VARCHAR(255) UNIQUE NULL` (Optional for registered submitters)
- `full_name`: `VARCHAR(255) DEFAULT 'Anonymous Visitor'`
- `is_anonymous`: `BOOLEAN DEFAULT TRUE`
- `created_at`: `TIMESTAMP DEFAULT NOW()`

### 2. `projects` Table
- `id`: `INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`
- `user_id`: `INTEGER REFERENCES users(id) ON DELETE SET NULL`
- `name`: `VARCHAR(255) NOT NULL`
- `category`: `VARCHAR(100) NOT NULL` (Startup, College Project, Hackathon, Business Proposal, Innovation, Other)
- `project_type`: `VARCHAR(150) NOT NULL`
- `description`: `TEXT NOT NULL`
- `problem_statement`: `TEXT NOT NULL`
- `proposed_solution`: `TEXT NOT NULL`
- `target_audience`: `TEXT NOT NULL`
- `target_market`: `VARCHAR(255) NOT NULL`
- `industry`: `VARCHAR(150) NOT NULL`
- `estimated_budget`: `VARCHAR(100) NOT NULL`
- `available_resources`: `TEXT NOT NULL`
- `project_objectives`: `TEXT NOT NULL`
- `status`: `VARCHAR(50) DEFAULT 'pending'` (`pending`, `analyzing`, `completed`, `failed`)
- `created_at`: `TIMESTAMP DEFAULT NOW()`
- `updated_at`: `TIMESTAMP DEFAULT NOW()`

### 3. `project_details` Table (1-to-1 with `projects`)
- `id`: `INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`
- `project_id`: `INTEGER UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE`
- `category_specific_data`: `JSON NOT NULL DEFAULT '{}'` (Stores category-specific parameters such as funding stage, academic mentor, TRL level, hackathon deadline, or ROI metrics)
- `created_at`: `TIMESTAMP DEFAULT NOW()`

### 4. `market_analyses` Table (1-to-1 with `projects`)
- `id`: `INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`
- `project_id`: `INTEGER UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE`
- `target_market_overview`: `TEXT NOT NULL`
- `market_characteristics`: `JSON NOT NULL DEFAULT '[]'` (Array of key ecosystem characteristics)
- `target_audience_analysis`: `TEXT NOT NULL`
- `market_opportunities`: `JSON NOT NULL DEFAULT '[]'` (Array of expansion opportunities)
- `industry_challenges`: `JSON NOT NULL DEFAULT '[]'` (Array of headwinds and barriers)
- `market_growth_potential`: `TEXT NOT NULL`
- `is_simulated`: `BOOLEAN NOT NULL DEFAULT FALSE`
- `ai_model`: `VARCHAR(100) NOT NULL` (`gemini-2.5-flash` or `heuristic-intelligence-fallback`)
- `analysis_notes`: `TEXT NULL`
- `created_at`: `TIMESTAMP DEFAULT NOW()`

### 5. `competitors` Table (1-to-Many with `projects`)
- `id`: `INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`
- `project_id`: `INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE`
- `name`: `VARCHAR(255) NOT NULL`
- `description`: `TEXT NOT NULL`
- `main_products`: `JSON NOT NULL DEFAULT '[]'` (Array of products/services)
- `strengths`: `JSON NOT NULL DEFAULT '[]'` (Array of strengths)
- `weaknesses`: `JSON NOT NULL DEFAULT '[]'` (Array of vulnerabilities)
- `competitive_advantages`: `JSON NOT NULL DEFAULT '[]'`
- `landscape_overview`: `TEXT NULL`
- `market_competition_level`: `VARCHAR(50) DEFAULT 'Medium'` (`Low`, `Medium`, `High`, `Fierce`)
- `potential_gaps`: `JSON NULL DEFAULT '[]'`
- `differentiation_opportunities`: `JSON NULL DEFAULT '[]'`
- `is_simulated`: `BOOLEAN NOT NULL DEFAULT FALSE`
- `created_at`: `TIMESTAMP DEFAULT NOW()`

---

## 5. API Endpoint Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status, database connection, and AI mode |
| `POST` | `/api/projects` | Ingests project, creates database records, triggers intelligence |
| `GET` | `/api/projects` | Lists all submitted projects (newest first) |
| `GET` | `/api/projects/{id}` | Retrieves full submitted project data and category fields |
| `POST` | `/api/projects/{id}/market-analysis` | Re-triggers/refreshes AI analysis for a project |
| `GET` | `/api/projects/{id}/market-analysis` | Retrieves the 6 market intelligence sections |
| `GET` | `/api/projects/{id}/competitors` | Retrieves competitor profiles, landscape, gaps, and differentiation |
| `GET` | `/api/projects/{id}/analysis` | Combined market intelligence and competitor payload |
| `GET` | `/api/projects/{id}/report` | Executive structured report with synthesis and insights |

---

## 6. Environment Variables (`backend/.env`)

```ini
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:1234@localhost:5432/failure_prediction_db

# Google Gemini API Key (Optional: leave empty to use the intelligent fallback engine)
GEMINI_API_KEY=

# Gemini Model Identifier
GEMINI_MODEL=gemini-2.5-flash

# Backend Server Configuration
HOST=127.0.0.1
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

---

## 7. Step-by-Step Setup & Run Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL running on localhost:5432 (default user `postgres`, password `1234`)

### Option A: Quick Launch with Batch Files (Windows)
1. Double-click `run_backend.bat` to launch the FastAPI server on `http://127.0.0.1:8000`.
2. Double-click `run_frontend.bat` to launch the Vite dev server on `http://localhost:5173`.
3. Open your browser at `http://localhost:5173`.

### Option B: Manual Terminal Execution

#### Backend Terminal:
```bash
cd backend
# Activate virtual environment
..\.venv\Scripts\activate
# Start FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend Terminal:
```bash
cd frontend
# Start React development server
npm run dev
```

---

## 8. Step-by-Step Demonstration Procedure

Follow this walkthrough to demonstrate all Milestone 1 features during an evaluation:

1. **Open Landing Page (`http://localhost:5173`)**:
   - Observe the SaaS interface, system architecture pipeline, category cards, and live PostgreSQL connection status badge in the top right.
2. **Click "Submit Your Idea" or Navigate to "Submit Idea"**:
   - Notice the category selector with 6 options (*Startup, College Project, Hackathon, Business Proposal, Innovation, Other*).
   - Click one of the quick demo buttons (e.g., **"HealthTech Startup"** or **"College Project"**) to instantly pre-fill realistic parameters, or fill in custom values.
   - Switch categories to observe the dynamic category-specific fields adapt automatically.
   - Choose whether to submit anonymously or provide an email.
3. **Submit the Project**:
   - Click **"Submit & Run Analysis"**.
   - Watch the loading state while the backend creates records in PostgreSQL and analyzes the submission.
4. **Explore Market Intelligence Page**:
   - Inspect the 6 generated sections:
     1. Target Market Overview
     2. Market Characteristics (card tags)
     3. Target Audience Analysis
     4. Market Opportunities
     5. Industry Challenges
     6. Market Growth Potential
   - Note the **AI Verification Banner** clearly stating the analysis status.
5. **Navigate to Competitor Analysis**:
   - Click **"View Competitors"**.
   - Review the **Overall Competitive Landscape**, the **Competition Intensity Gauge**, **Potential Market Gaps**, and **Opportunities for Differentiation**.
   - Inspect the competitor cards displaying descriptions, products, strengths, weaknesses, and competitive moats.
6. **Browse "My Projects"**:
   - Navigate to the **"My Projects"** page.
   - Observe the table of submitted projects fetched directly from PostgreSQL.
   - Use the search bar or category dropdown to filter projects.
   - Click **"Details"** on any project to open a modal showing all original submitted parameters and category-specific data.
7. **Generate & Print Strategic Report**:
   - Click **"Report"** on any project.
   - Review the complete multi-section executive dossier.
   - Click **"Print or Save as PDF"** to trigger the clean print-optimized layout.

---

## 9. Verification & Automated Test Suite

An automated end-to-end verification script is included in `backend/test_backend_e2e.py`. It verifies database persistence, all 8 endpoints, and data validation:

```bash
cd backend
..\.venv\Scripts\python.exe test_backend_e2e.py
```
*(All 8 API tests pass with exit code 0)*.

