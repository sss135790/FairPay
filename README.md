# FairPayy

FairPayy is a modern expense tracking application with user authentication, expense entry, and filtered/paginated reporting. It combines a Clerk-protected Next.js frontend with a FastAPI backend and SQLite persistence.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Auth: Clerk (`@clerk/nextjs`) for login/signup and session handling
- Backend: FastAPI, SQLAlchemy, SQLite
- Testing: pytest, FastAPI `TestClient`
- Deployment-ready features: CORS support, environment-based config, API request validation