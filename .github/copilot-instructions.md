<!-- Auto-generated helper for AI coding agents. Edit only to correct factual details. -->
# Copilot instructions for the mkulima-dairy repo

Purpose: give an AI coding agent immediate, actionable context to be productive in this codebase.

- **Repo layout:** Backend is a Django monolith at `backend/edairyhub/` (project package `edairyhub`). Frontend is a Vite + React TypeScript app at `frontend/feed-africa-hub-main/`.

- **Big picture:**
  - The backend exposes REST APIs (Django + Django REST Framework). App modules include `marketplace`, `dashboard`, `ussd`, `ml_forecast`, `recommendations`, and `accounts` (see `edairyhub/edairyhub/settings.py`).
  - All main API URL includes are mounted under `/api/` in `edairyhub/edairyhub/urls.py`. Marketplace also exposes site pages under the `marketplace/` path (namespace `marketplace`).
  - Frontend talks to backend via `src/api.ts` (axios instance). Default `baseURL` is `http://127.0.0.1:8000` and `withCredentials: true` — the app uses cookie-based session auth + CSRF.

- **Key files to inspect for behavior & decisions:**
  - Backend entry: `backend/edairyhub/manage.py`
  - Backend settings: `backend/edairyhub/edairyhub/settings.py` (INSTALLED_APPS, CORS, CSRF, STATIC/MEDIA, admin interface customizations)
  - URL routing: `backend/edairyhub/edairyhub/urls.py` and `backend/edairyhub/edairyhub/urls_auth.py`
  - Frontend config & scripts: `frontend/feed-africa-hub-main/package.json` and `vite.config.ts`
  - Frontend API client: `frontend/feed-africa-hub-main/src/api.ts`

- **Authentication & CSRF contract (important):**
  - Backend uses session authentication (see `REST_FRAMEWORK` in settings). Frontend must send cookies and a CSRF token.
  - CSRF and auth endpoints: `GET /api/auth/csrf/`, `POST /api/auth/login/`, `POST /api/auth/logout/`, `GET /api/auth/user/` (see `edairyhub/edairyhub/urls_auth.py`).
  - Concrete example (frontend): call `await api.get('/api/auth/csrf/')`, then set `api.defaults.headers['X-CSRFToken']` before mutating requests. `api` is the axios instance in `src/api.ts`.

- **Run / dev workflows (how devs run things locally):**
  - Backend (from repository root):
    - Create & activate venv, install dependencies (project has no `requirements.txt` in repo snapshot — install required packages from `settings.py`: e.g. `Django`, `djangorestframework`, `corsheaders`, `django-filters`, `admin_interface`, `colorfield`).
    - Common commands:
      - `cd backend/edairyhub` then `python -m venv .venv && source .venv/bin/activate`
      - `pip install -r requirements.txt` (if present) otherwise `pip install django djangorestframework corsheaders django-filter`
      - `python manage.py migrate`
      - `python manage.py runserver 0.0.0.0:8000`
      - `python manage.py test` to run Django tests in app `tests.py` files.
  - Frontend (from repository root):
    - `cd frontend/feed-africa-hub-main`
    - `npm install` (or `bun install`/`pnpm install` if preferred — repository includes `bun.lockb`)
    - `npm run dev` (or `npm start`) — Vite dev server runs on port 5173 by default (matches CORS_ALLOWED_ORIGINS in settings).
    - Build: `npm run build`, preview: `npm run preview`.

- **Project-specific conventions & patterns:**
  - API-first, session-based auth: frontend uses cookies + CSRF instead of token auth. Do not switch axios to token auth without updating backend.
  - Central axios `api` instance: modify `frontend/feed-africa-hub-main/src/api.ts` to change backend host or to add global headers.
  - URLs are added to `edairyhub/edairyhub/urls.py` — many apps are mounted by including each app's `urls.py` under `/api/`.
  - Admin is customized with `admin_interface` and `colorfield`; admin appearance options exist in `settings.py`.
  - Timezone is `Africa/Nairobi`; DB is SQLite by default (`db.sqlite3` in backend root) — be careful when changing DB settings or migrations.

- **Integration points / external services:**
  - Africa's Talking credentials placeholders are in `settings.py` (`AFRICASTALKING_USERNAME`, `AFRICASTALKING_API_KEY`) — used by `ussd` or messaging features.
  - ML logic lives under `ml_forecast/` (`ml_forecast/ml_model.py`) and can be called from views/management commands.

- **Common edits & where to make them:**
  - Add API route: create `yourapp/urls.py` and include it in `edairyhub/edairyhub/urls.py` under the `/api/` includes.
  - Change frontend → backend base URL: update `frontend/.../src/api.ts`.
  - Add new models: create in app `models.py`, `makemigrations`, `migrate` and add admin entries in the app's `admin.py`.

- **Troubleshooting tips (fast wins):**
  - CORS errors: add `http://localhost:5173` to `CORS_ALLOWED_ORIGINS` in `settings.py`.
  - CSRF 403 on POST: ensure `X-CSRFToken` header is set from `GET /api/auth/csrf/` and `api` uses `withCredentials: true`.
  - Static/media not served in dev: ensure `python manage.py runserver` is used (static served by `staticfiles` settings) or configure a webserver in prod.

If anything here is incomplete or you'd like me to expand a section (example code for CSRF flow, a list of app-level URLs, exact dependency list), tell me which part to expand or correct and I'll update this file.
