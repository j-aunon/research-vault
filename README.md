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

## Docker Setup
Run full stack (Postgres + backend + frontend) with one command:

1. Copy compose env template:

```bash
cp .env.example .env
```

2. Edit `.env` and set strong values for:
- `POSTGRES_PASSWORD`
- `JWT_SECRET`

```bash
docker compose up -d --build
```

App URL:
- `http://localhost:8080`

Useful commands:
- Stop: `docker compose down`
- Stop + remove DB volume: `docker compose down -v`
- Logs: `docker compose logs -f`

Notes:
- Backend runs `prisma migrate deploy` automatically on startup.
- Frontend is served by Nginx and proxies `/api` to backend internally.
- Uploaded PDFs are persisted in Docker volume `backend_uploads`.

## Auto-start On Boot
If Docker daemon is enabled on boot, this stack can auto-start because services use `restart: unless-stopped`.

Enable Docker on boot (Linux):

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

Then start stack once:

```bash
docker compose up -d
```

After next reboot, containers will come back automatically.

## Quick Local Scripts
To run the non-Docker dev stack with one command:

```bash
./scripts/start-dev.sh
```

Stop:

```bash
./scripts/stop-dev.sh
```

Status:

```bash
./scripts/status-dev.sh
```

Logs are written to:
- `.run/backend.log`
- `.run/frontend.log`

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
