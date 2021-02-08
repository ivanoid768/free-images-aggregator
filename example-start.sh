#!/usr/bin/env bash
export PEXELS_API_KEY="vbsUxlo8wVfcgfJfANY0T"
export UNSPLASH_API_KEY="vbsUxlo8wVfcgfJfANY0T"
export PIXABAY_API_KEY="vbsUxlo8wVfcgfJfANY0T"

export PIXABAY_LIMIT=5000
export UNSPLASH_LIMIT=50
export PEXELS_LIMIT=200

export CATEGORY="robotics"

export PG_DB_CONNECTION_URI="postgresql://fia:password@fia-postgres:5432/fia"

export CORS_ORIGIN="*"

export ADMIN_PASSWORD="password123"

export UPDATE_IMAGE_DATA_WORKER_COUNT=4

export UPDATE_CRON="0 * * * *"

yarn run start
