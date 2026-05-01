# FairPayy

FairPayy is a modern expense tracking application with user authentication, expense entry, and filtered/paginated reporting. It combines a Clerk-protected Next.js frontend with a FastAPI backend and SQLite persistence.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Auth: Clerk (`@clerk/nextjs`) for login/signup and session handling
- Backend: FastAPI, SQLAlchemy, SQLite
- Testing: pytest, FastAPI `TestClient`
- Deployment-ready features: CORS support, environment-based config, API request validation

## Features

- User authentication via Clerk
- Protected dashboard for creating expenses
- Expense form with amount, category, description, date, and note
- Backend persistence using SQLite
- Paginated expense listing
- Category filtering and date sorting
- Backend unit and integration tests

## Repository Structure

- `frontend/` — Next.js application
  - `app/layout.tsx` — Clerk provider and layout
  - `app/page.tsx` — public login/signup landing page
  - `app/dashboard/` — protected dashboard and expense UI
- `backend/` — FastAPI service
  - `app/main.py` — API routes and CORS configuration
  - `app/crud/` — database CRUD logic
  - `app/models/` — SQLAlchemy models
  - `app/schemas/` — request/response validation schemas
  - `app/core/` — config and database setup
  - `tests/` — pytest fixtures and API test coverage

## Local Setup

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run tests:
   ```bash
   pytest -q
   ```
4. Start the API:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` from `.env.local.example` and add:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_API_BASE_URL`
4. Start the app:
   ```bash
   npm run dev
   ```

## Production Readiness

This project includes several production-focused considerations:

- Authenticated access with Clerk protects the frontend and ensures each user only sees their own data
- CORS is configured on the backend for secure browser access from the frontend origin
- Request validation is enforced by FastAPI and Pydantic schemas
- The backend supports environment-driven configuration for database and API settings
- Backend tests verify expense creation and listing behavior, including pagination and filtering

## Notes

- The backend currently uses SQLite for persistence. For a production deployment, migrate to a managed database service and update `DATABASE_URL` in `backend/app/core/config.py`.
- Keep sensitive keys out of source control by using environment variables for Clerk and API configuration.

#