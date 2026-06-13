# Deployment Guide

This app uses:

- Frontend: React + Vite
- Backend: FastAPI
- Database: Postgres
- File storage: Cloudinary

Important:

- We are not using Firestore as the app database.
- Postgres stores project rows and media metadata.
- Cloudinary stores the actual uploaded image and video files.

## What you need to set up

### 1) Cloudinary

Create a Cloudinary account and copy these values from the dashboard:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `CLOUDINARY_FOLDER`

### 2) Postgres

Create a PostgreSQL database on Render.

Render will give you a connection string. Use it as:

- `DATABASE_URL`

### 3) Backend environment variables

Set these in the Render backend service:

- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`
- `CORS_ORIGINS`

Recommended `CORS_ORIGINS` value:

- `https://your-frontend.onrender.com`

If you also want local development, you can include:

- `http://localhost:5173`

Example:

```env
CORS_ORIGINS=http://localhost:5173,https://your-frontend.onrender.com
```

### 4) Frontend environment variable

Set this in the Render static site:

- `VITE_API_BASE_URL`

Point it to your backend service URL, for example:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## Render deployment

### Backend service

Create a new Web Service from the `backend` folder with:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend service

Create a new Static Site from the repo root with:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`

## After deploy

- Open the backend health check URL: `/health`
- Open the frontend site
- Visit `/admin` to add projects
- Visit `/map` to confirm the projects show up publicly
