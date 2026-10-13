# Beli: Group Activity Briefs

Columbia Business School · Spring 2026

## Setup

You need Node.js installed. If you don't have it: https://nodejs.org (download the LTS version).

## Run locally

```bash
# 1. Open Terminal and navigate to this folder
cd beli-app

# 2. Install dependencies (only needed once)
npm install

# 3. Start the app (frontend + /api functions; needs the Vercel CLI and a
#    .env file with DATABASE_URL pointing at the Neon database)
vercel dev
```

`npm start` also works for the frontend alone, but sign-in and rankings need the `/api` functions.

The app will open automatically at http://localhost:3000

## Sign-in

Students sign in once at the class hub (Google); their section comes from the class roster.
The app must run under the hub's cookie domain with the hub variables in `.env.example`.
Instructors and TAs (hub roles) can open `/admin`.

## Stop the app

Press `Ctrl + C` in the terminal.
