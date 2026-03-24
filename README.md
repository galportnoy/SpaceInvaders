# Space Invaders

A full-stack Space Invaders arcade game built with React and Django. Shoot aliens, collect power-ups, answer trivia questions between waves, and compete on the leaderboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, JavaScript/JSX, CSS3 |
| Backend | Python 3, Django 6, Django REST Framework |
| Database | MySQL |

---

## Features

- Classic Space Invaders gameplay with 3 alien types (50, 100, 200 points each)
- 5x10 alien formation with increasing difficulty per wave
- **3 weapon types:**
  - Standard Shot (`Space`) — normal single bullet
  - Mega Shot (`Z`) — one-time piercing shot that passes through all aliens
  - Machine Gun (`M`) — 5-second rapid-fire mode (100ms fire rate)
- Pause/resume (`P`)
- Trivia quiz between waves (fetched from OpenTDB)
- Leaderboard — top 5 scores saved to database

---

## Project Structure

```
spaceinvaders/
├── code/
│   ├── frontend/spaceinvaders/     # React app (Vite)
│   │   └── src/
│   │       ├── components/         # Board, Spaceship, Alien, Projectile, etc.
│   │       ├── constants/          # Alien type definitions
│   │       └── utils/              # API helpers
│   └── backend/spaceinvaders/      # Django app
│       ├── models.py               # ScoreBoard model
│       ├── views.py                # API endpoints
│       └── urls.py                 # API routes
└── build/
    ├── db/spaceinvaders_schema.sql  # MySQL schema
    └── env/
        ├── .env.dev
        └── .env.prod
```

---

## Setup & Installation

### Prerequisites

- Node.js (npm)
- Python 3
- MySQL running on `localhost:3306`

### 1. Database

```bash
mysql -u root -p < build/db/spaceinvaders_schema.sql
```

This creates the `spaceinvaders_schema` database and `spaceinvaders_db_user`.

### 2. Backend

```bash
cd code/backend/spaceinvaders

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy dev environment file
cp ../../../build/env/.env.dev .env

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

Backend runs on `http://127.0.0.1:8000`.

### 3. Frontend

```bash
cd code/frontend/spaceinvaders

npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. API requests to `/api` are proxied to the Django backend automatically.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leaderboard/` | Get top 5 scores |
| `POST` | `/api/save-score/` | Save a player's score |
| `GET` | `/api/quiz/` | Fetch a trivia question |

---

## Controls

| Key | Action |
|-----|--------|
| `←` / `→` | Move spaceship |
| `Space` | Shoot |
| `Z` | Mega Shot (one use) |
| `M` | Activate Machine Gun (5 seconds) |
| `P` | Pause / Resume |

---

## Environment Variables

Copy the appropriate env file to `code/backend/spaceinvaders/.env`:

| Variable | Dev | Prod |
|----------|-----|------|
| `API_PREFIX` | `api/` | `` |
| `DB_HOST` | `localhost` | `sapir-db` |

---

## Scripts

**Frontend:**
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

**Backend:**
```bash
python manage.py runserver       # Start dev server
python manage.py migrate         # Apply migrations
python manage.py makemigrations  # Create new migrations
```