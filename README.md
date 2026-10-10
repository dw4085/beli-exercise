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

`npm start` also works for the frontend alone, but logins and rankings need the `/api` functions.

The app will open automatically at http://localhost:3000

## Section Passwords

| Section   | Password   |
|-----------|------------|
| Section 1 | bluehill   |
| Section 2 | ishikawa   |
| Section 3 | atomix     |

## Stop the app

Press `Ctrl + C` in the terminal.
