# Awards Platform

Arabic-first platform for browsing scientific awards in the Arab world, their awarding bodies, and previous winners.

## Structure

- `apps/web`: Next.js App Router frontend
- `apps/api`: FastAPI backend with a SQLite dataset generated from `Data_Collection (3)2.xlsx`

## Local Setup

### API

1. Create and activate a Python virtual environment.
2. Install dependencies from [`apps/api/requirements.txt`](apps/api/requirements.txt).
3. Copy [`apps/api/.env.example`](apps/api/.env.example) to `apps/api/.env`.
4. Rebuild the database:

```powershell
cd apps/api
python -m app.importer
```

5. Run the API:

```powershell
uvicorn app.main:app --reload --port 8000
```

### Web

1. Copy `apps/web/.env.local.example` to `apps/web/.env.local`.
2. Install dependencies:

```powershell
cd apps/web
npm install
```

3. Run the frontend:

```powershell
npm run dev
```

## Deployment

- Deploy `apps/web` as a Next.js Vercel project.
- Deploy `apps/api` as a separate FastAPI Vercel project with root directory `apps/api`.
- Set `READ_ONLY_MODE=true` in the API project on Vercel.
- Set `API_BASE_URL` and `NEXT_PUBLIC_API_BASE_URL` in the web project to the deployed API URL.

