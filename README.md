# TroniCase POS + Repair Shop Management System

Original full-stack web app for TroniCase branch operations. It is inspired by the general POS and repair-shop domain, but it does not copy GadgetPOS code, assets, branding, UI, or API endpoints.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Shadcn-style local UI components
- Prisma ORM
- PostgreSQL
- Custom JWT cookie authentication
- Recharts analytics

## Core Modules

- Authentication with role-based access: Super Admin, Admin, Branch Manager, Sales Lady / Cashier, Technician, Developer
- Dashboard with sales, repairs, inventory value, expenses, net income, low stock alerts, recent repair orders, and daily/monthly charts
- POS checkout with search, SKU/barcode entry, cart, discount, cash/GCash, receipt print/download, and inventory deduction API
- Products and inventory with SKU/barcode, category, brand/model compatibility, pricing, branch stock, low-stock alerts, and stock transfers
- Repair tickets with customer/device details, diagnosis, technician assignment, statuses, parts, labor, signature field, photo fields, and warranty tracking
- Sales reports with date, branch, and cashier filters plus CSV/PDF actions
- Expenses CRUD
- Notifications for stock, repairs, subscriptions, and branch announcements
- Branch management with all requested TroniCase and partner branches

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `DATABASE_URL` and `AUTH_SECRET` in `.env`.

4. Create the database schema and seed demo data:

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy With GitHub + Vercel

GitHub Pages is not enough for this app because it uses Next.js API routes, Prisma, authentication cookies, and PostgreSQL. Use GitHub as the code host and Vercel as the live web host.

1. Create a new GitHub repository named `tronicase-pos-repair`.

2. Upload or push this folder to the repository:

```bash
git init
git add .
git commit -m "Initial TroniCase POS system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tronicase-pos-repair.git
git push -u origin main
```

3. Create a PostgreSQL database with Neon, Supabase, Railway, or Render.

4. Import the GitHub repository into Vercel.

5. Add these Vercel environment variables:

```env
DATABASE_URL="your-postgresql-connection-string"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="https://your-vercel-project.vercel.app"
```

6. Use these Vercel build settings:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run vercel-build
Output Directory: .next
```

7. After the first deploy, run database migration and seed once:

```bash
npm run prisma:deploy
npm run prisma:seed
```

## Demo Accounts

All seeded accounts use this demo password:

```text
password123
```

- `super@tronicase.test` - Super Admin
- `admin@tronicase.test` - Admin
- `manager@tronicase.test` - Branch Manager
- `cashier@tronicase.test` - Sales Lady / Cashier
- `tech@tronicase.test` - Technician
- `dev@tronicase.test` - Developer

## Useful API Routes

- `POST /api/auth/login`
- `GET/POST /api/products`
- `GET/PATCH/DELETE /api/products/:id`
- `GET/POST /api/repairs`
- `GET/PATCH/DELETE /api/repairs/:id`
- `GET/POST /api/sales`
- `GET /api/reports/sales`
- `GET/POST /api/expenses`
- `PATCH/DELETE /api/expenses/:id`
- `GET/POST /api/branches`
- `PATCH/DELETE /api/branches/:id`
- `GET/POST /api/notifications`
- `PATCH/DELETE /api/notifications/:id`
- `GET/POST /api/stock-transfers`

## Receipt

A sample receipt is available at:

```text
public/receipts/sample-receipt.txt
```

The POS screen can also print the current cart or download a text receipt from the browser.

## Notes

- The UI screens include local interactive state for fast demo use.
- The API routes are Prisma-backed and enforce role permissions through the custom JWT cookie.
- For production, replace the demo password storage with a strong password hash such as Argon2 or bcrypt, add audit logs, and connect file uploads for repair photos/signatures to object storage.
