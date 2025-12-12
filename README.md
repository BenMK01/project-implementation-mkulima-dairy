# Mkulima Dairy Feeds — Local Development README

This repository contains a Django backend (API) and a Vite + React frontend for the Mkulima Dairy Feeds project.

This README explains how to run the project locally, the available API endpoints, auth flows (JWT + session), admin access, and common troubleshooting steps. Use this as a one‑page cheat sheet.

---

Table of contents
- Prerequisites
- Quick start (backend + frontend)
- Backend: setup & run
- Frontend: setup & run
- Environment variables
- Key API endpoints (examples)
- Typical user flows (curl + UI)
- Admin access
- Deploy / production notes
- Troubleshooting
- Useful commands / cheatsheet

---

Prerequisites
- Python 3.10+
- Node 16+ and npm
- Git
- (Optional for production) PostgreSQL, S3 credentials, etc.

---

Quick start (summary)
1. Backend:
   - Create & activate venv, install Python deps, run migrations, create superuser, run server.
2. Frontend:
   - cd `frontend/feed-africa-hub-main`, `npm ci`, `npm run dev`.
3. Open frontend at: http://localhost:5173/
   Backend API at: http://127.0.0.1:8000/

---

Backend — setup & run

1. Create virtualenv and activate:
```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install requirements:
```bash
pip install -r requirements.txt
# If you need JWT/CORS packages:
pip install djangorestframework djangorestframework-simplejwt corsheaders
```

3. Environment variables (development)
Set minimal env vars in your shell or with your chosen loader:
```bash
export DJANGO_SECRET_KEY="dev-secret-change-me"
export DJANGO_DEBUG=True
export DJANGO_ALLOWED_HOSTS="127.0.0.1,localhost"
```

4. Migrate and create superuser:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

5. Run dev server:
```bash
python manage.py runserver 127.0.0.1:8000
```

Backend is available at: `http://127.0.0.1:8000/`

Notes:
- Static/media served from `STATIC_ROOT`/`MEDIA_ROOT` in DEBUG mode.
- If you use admin_interface theme helper, you can run the helper function in Django shell.

---

Frontend — setup & run

1. Install dependencies:
```bash
cd frontend/feed-africa-hub-main
npm ci
```

2. Dev server:
```bash
npm run dev
```

3. Open:
- Frontend UI: `http://localhost:5173/`

Notes:
- In development the frontend usually uses an empty `VITE_API_BASE` so Vite proxy forwards `/api` to the backend. Check `vite.config` if you changed proxy settings.
- To build production assets:
```bash
npm run build
# The output is in `dist/` — copy it to backend `frontend_dist/` if your backend serves index.html
```

---

Environment variables (important)
- DJANGO_SECRET_KEY — required for Django (do not commit)
- DJANGO_DEBUG — set to `False` in production
- DJANGO_ALLOWED_HOSTS — comma-separated allowed hosts
- DATABASE_URL or DB_HOST/DB_NAME/DB_USER/DB_PASS — for production Postgres
- VITE_API_BASE — frontend environment variable for production API base (e.g. `https://api.yoursite.com`)
- AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_STORAGE_BUCKET_NAME — if using S3 for media/static
- SIMPLE_JWT config (optionally adjusted in settings.py)

---

Auth flows supported
1. JWT (recommended for cross-origin frontends)
   - Endpoints:
     - POST `/api/auth/register/` — register
     - POST `/api/auth/token/` — obtain access & refresh
     - POST `/api/auth/token/refresh/`
     - GET `/api/auth/me/` — requires `Authorization: Bearer <access_token>`

2. Session + CSRF helper (optional)
   - Endpoints (note duplicate segment due to URL mounting):
     - GET `/api/auth/auth/csrf/` — returns CSRF token and sets cookie
     - POST `/api/auth/auth/login/` — session login (requires CSRF)
     - POST `/api/auth/auth/logout/`
     - GET `/api/auth/auth/user/` — current user (session)
   - When using session login, use `axios` with `withCredentials: true` and set `X-CSRFToken`.

Security notes
- LocalStorage tokens are simple but vulnerable to XSS. For better security consider httpOnly refresh cookie method (requires backend changes) or keep tokens in memory and use refresh cookies.
- For session cookies across different domains, use `SameSite=None` and `Secure=True`, and configure `CSRF_TRUSTED_ORIGINS` and `CORS_ALLOWED_ORIGINS`.

---

Key API endpoints (quick reference)

Auth (JWT)
- POST /api/auth/register/
  - Body: `{ "username": "...", "email": "...", "password": "..." }`
- POST /api/auth/token/
  - Body: `{ "username": "...", "password": "..." }`
  - Response: `{ "access": "...", "refresh": "..." }`
- POST /api/auth/token/refresh/
  - Body: `{ "refresh": "..." }`
- GET /api/auth/me/
  - Header: `Authorization: Bearer <access_token>`

Session/CSRF (helper)
- GET /api/auth/auth/csrf/           (get csrf cookie)
- POST /api/auth/auth/login/         (session login, needs CSRF)
- GET /api/auth/auth/user/           (session current user)
- POST /api/auth/auth/logout/

Marketplace & app APIs
- GET /marketplace/api/feeds/         — list feeds
- GET /marketplace/api/feeds/<id>/    — feed details
- GET /api/recommendations/           — list recommendations
- POST /api/recommendations/chat/     — chat-style AI recommendations
- GET /api/forecast/forage/           — forage/forecast endpoints
- GET /api/suppliers/                 — suppliers list
- GET /api/suppliers/<id>/            — supplier detail

Admin
- Django admin (real): `/django-admin/` (use superuser credentials)

---

Example curl requests

Register (JWT):
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"a@example.com","password":"strongpass123"}'
```

Obtain tokens:
```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"strongpass123"}'
```

Call protected endpoint with access token:
```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://127.0.0.1:8000/api/auth/me/
```

Session + CSRF example:
```bash
# Get CSRF cookie
curl -c cookies.txt http://127.0.0.1:8000/api/auth/auth/csrf/

# Login using cookie and header (replace CSRF token value)
curl -b cookies.txt -c cookies.txt -H "Content-Type: application/json" \
  -H "X-CSRFToken: <csrf-from-cookie>" \
  -X POST -d '{"username":"alice","password":"strongpass123"}' \
  http://127.0.0.1:8000/api/auth/auth/login/
```

---

Typical user flows (local UI)
- Register / Login:
  - Open frontend: `http://localhost:5173/account` (or `/register`, `/login`).
  - Use the form to create account or log in (client uses JWT flow by default in this project).
- Profile:
  - After login, visit `/profile`.
- Marketplace:
  - Browse `Feed Marketplace` from the nav or `/feed-marketplace`.
  - Click a product to view `/feed/:id`.
- Cart:
  - Add to cart and visit `/cart`.

---

Admin access
- Admin UI: `http://127.0.0.1:8000/django-admin/`
- Use the superuser created with `createsuperuser`.
- From admin manage Users, Feeds, Suppliers and other models.

---

Deploy / production notes (short)
- Build frontend: `npm run build` → `dist/`.
- Serve frontend with Vercel or copy `dist/` to backend `frontend_dist/` if serving via Django.
- Host Django on Render / Fly / Railway / a VM. Use Gunicorn + nginx or platform-managed service.
- Use Postgres in production; set `DATABASE_URL`.
- Use object storage (S3 or DO Spaces) for MEDIA files.
- Set `DJANGO_DEBUG=False`, `ALLOWED_HOSTS`, `SECRET_KEY`, and other env vars.
- For frontend calling backend cross-origin, prefer JWT or proxy `/api/*` through platform to avoid cookie issues.

---

Troubleshooting — common problems
- Blank frontend or import errors:
  - Check Vite terminal for the first red error line. Fix missing/incorrect relative imports or alias config in `tsconfig.json` / `vite.config.ts`.
- API 401 Unauthorized:
  - JWT: verify Authorization header `Bearer <token>`.
  - Session: ensure `X-CSRFToken` header and cookies are sent (`axios` withCredentials = true).
- CSRF token missing: call `GET /api/auth/auth/csrf/` to set the cookie first for session login.
- Media/static not found: run `python manage.py collectstatic` and ensure `STATIC_ROOT` served by your webserver in production.

---

Useful commands / cheatsheet
Backend:
```bash
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
python manage.py collectstatic --noinput
```

Frontend:
```bash
cd frontend/feed-africa-hub-main
npm ci
npm run dev        # development
npm run build      # production build (dist/)
```

Debugging:
- Check Vite terminal for import errors.
- Browser DevTools console & Network tab for failing API requests.
- Django runserver terminal for server-side tracebacks.

---

Want a README file added to the repo?
This file is ready to be committed as `README.md` at the project root. If you want, I can:
- Create a PR / patch with this file added,
- Or produce a Postman collection with the endpoints,
- Or add a short `dev-quickstart.md` file with only the commands.

Tell me if you'd like me to commit/create the README in your repo (I can prepare a patch or instructions).
