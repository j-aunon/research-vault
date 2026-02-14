# Research Library

Full-stack research resource manager for papers, books, and websites with project/folder tree navigation, tags, favorites, and search.

## Stack
- Frontend: React 18 + Vite + Tailwind + React Router + Axios
- Backend: Node.js + Express + TypeScript + Zod + JWT + bcrypt + Pino
- Database: PostgreSQL + Prisma

## Project Structure
- `frontend/` React app
- `backend/` Express API + Prisma

## Setup
1. Copy env files:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Start PostgreSQL and create database `research_library`.
3. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`
4. Run migrations and Prisma client:
   - `cd backend && npx prisma migrate dev`
   - `cd backend && npx prisma generate`
5. Start apps:
   - Backend: `cd backend && npm run dev` (port `4000`)
   - Frontend: `cd frontend && npm run dev` (port `5173`)

## Environment Variables
### Backend (`backend/.env`)
- `NODE_ENV`
- `PORT`
- `FRONTEND_ORIGIN` (comma-separated allowed origins, e.g. `http://127.0.0.1:5173,http://localhost:5173`)
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`

### Frontend (`frontend/.env`)
- `VITE_API_URL` (e.g. `http://127.0.0.1:4000/api`)

## API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Folders
- `GET /api/projects/:projectId/folders`
- `POST /api/projects/:projectId/folders`
- `PUT /api/folders/:id`
- `DELETE /api/folders/:id`

### Resources
- `GET /api/resources?projectId=...&folderId=...&type=...&starred=...&search=...&sortBy=...`
- `POST /api/resources`
- `GET /api/resources/:id`
- `PUT /api/resources/:id`
- `DELETE /api/resources/:id`
- `PATCH /api/resources/:id/star`
- `POST /api/resources/:id/file` (multipart form-data, field `file`, PDF only)
- `GET /api/resources/:id/file` (stream attached PDF)

### Tags
- `GET /api/tags`
- `GET /api/tags/search?q=...`

## Notes
- Projects are required to view resources (no global all-project view).
- Folder filter is optional and resets when changing projects.
- Search, type filter, starred filter, and sort persist across project/folder changes.
