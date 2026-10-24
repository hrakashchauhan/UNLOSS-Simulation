# UNLOSS Simulation

UNLOSS Simulation is a minimal end-to-end parcel handoff prototype. It lets a seller create an order and one QR code, an assigned delivery person validate and start the delivery, and the customer confirm or reject receipt with a development-only OTP. It demonstrates the core UNLOSS problem: keeping seller, courier, and customer delivery status aligned with an auditable record of each attempt.

This is an independent simulation with its own SQLite database, fictional accounts, and environment variables. It does not use the original UNLOSS repository's database, credentials, or production data.

## Links

- GitHub repository: [github.com/hrakashchauhan/UNLOSS-Simulation](https://github.com/hrakashchauhan/UNLOSS-Simulation)
- Live UNLOSS product demo on Vercel: [unloss-web.vercel.app](https://unloss-web.vercel.app)
- Simulation demo: run locally using the setup instructions below. The simulation repository is intentionally isolated from the deployed production product.

## Idea, technology stack, and tools

The prototype uses a role-based Express API with secure bcrypt password hashing, persistent Prisma sessions, SQLite migrations, transactional order updates, hashed and encrypted QR tokens, and attempt-bound OTP challenges. The frontend is a responsive React and Vite app with QR generation, browser camera scanning through ZXing, manual token fallback, and role-specific dashboards. Vitest and Supertest cover the accepted-delivery, duplicate-completion, rejection, and retry paths.

## Requirements

Node.js 22.12+ and npm.

## Run locally

From this directory in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup.ps1
```

Use two terminals:

```powershell
npm run dev:api
npm run dev:web
```

Open http://127.0.0.1:5174. The API listens on 127.0.0.1:3002. SQLite is stored at `api/unloss-simulation.db`.

## Fictional development accounts

These are fictional development-only accounts; every account uses the local test password `ParcelDemo!2026` after seeding. The login page offers one-click account selection. Change `SEED_PASSWORD` in `api/.env` before running the seed command if you prefer another local password.

| Role | Email | Phone |
| --- | --- | --- |
| Seller | seller@unloss.test | +919800000101 |
| Delivery person | delivery@unloss.test | +919800000202 |
| Customer | customer@unloss.test | +919800000303 |
| Delivery person | delivery2@unloss.test | +919800000204 |
| Customer | customer2@unloss.test | +919800000304 |

OTP codes are generated in the customer screen and clearly labeled **development only**. No SMS is sent. Test-account listing and simulated OTP require `DEMO_MODE=true`; demo mode is disabled under `NODE_ENV=production`.

## Workflow

1. Sign in as seller. Add a product, then create an order by selecting the fictional customer and eligible delivery account. The order creates one random QR token.
2. Open the order details, download the QR, then sign in as the assigned delivery person. Scan it with a camera or enter its token manually; the server checks token, assignment, role, and status before allowing the delivery attempt to start.
3. Sign in as the assigned customer. Use that order's QR (the seller can share the saved QR) to validate it, request the simulated OTP, then confirm or reject receipt.
4. Refresh or sign in as another role to see database-backed status and attempt history. Rejected orders can be started again; previous attempts remain recorded.

## Checks

```powershell
npm --prefix api run typecheck
npm --prefix api test
npm --prefix api run build
npm --prefix web run typecheck
npm --prefix web run build
```

The API typecheck, API unit/integration workflow test, API build, and web typecheck/build commands above cover the working simulation. Never commit `.env` or database files.
