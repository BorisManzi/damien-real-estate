# Damien Real Estate

Find your place in Rwanda. A mobile-first property site for Rwanda. Public
pages and the staff admin share **one Postgres database**.

In production that database is **Neon** (durable Postgres). Admin writes
(listings, homepage copy, photos, contacts) land in Neon and the public site
polls them every few seconds, so a published listing or homepage edit shows up
live without a deploy.

## Stack

- TanStack Start (React 19) + Tailwind CSS v4
- Better Auth (email/password locally; Google and X when the hosted broker is configured)
- Postgres: **Neon** when `DATABASE_URL` is set, embedded PGLite only for local work

## Run locally

You need **Node.js 22+** ([nodejs.org](https://nodejs.org/)). This repo ships `.nvmrc`.

```bash
git clone https://github.com/BorisManzi/damien-real-estate.git
cd damien-real-estate
npm install
npm run dev
```

Open the address Vite prints. Do **not** add a `.env` file for local work —
PGLite starts on its own.

### Starter admin

Created automatically on first boot:

| | |
|---|---|
| Email | `admin@damien.rw` |
| Password | `DamienAdmin2026` |

Sign in at `/login`, then change this password before you share the site.

## Production database (Neon)

Hosted deploys **require** a pooled Neon `DATABASE_URL`. Without it the app
refuses to start on Vercel — serverless has no disk, so an embedded database
would wipe listings, CMS and accounts on every cold start.

This repo used to be Next.js. If a Vercel deploy fails looking for `.next`,
set **Framework Preset** to **TanStack Start** (or keep `vercel.json`, which
already pins that).

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string (`-pooler` in the host).
3. In the Vercel project → Settings → Environment Variables, set:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `BETTER_AUTH_URL` | Public site origin, e.g. `https://damien-real-estate.vercel.app` |
| `BETTER_AUTH_SECRET` | A long random secret (session signing) |

Never commit these. Migrations in `migrations/` apply on `npm run build`
(`0001` auth, `0002` catalog, `0003` homepage CMS).

If the catalog is empty on first boot, demo listings are seeded so the public
site is not blank — pause or delete them when you go live.

## Pages

| | |
|---|---|
| Public site | `/` |
| Properties | `/properties` |
| Property detail | `/properties/:slug` |
| Rent / Buy / Land | `/rent` `/buy` `/land` |
| About / Contact | `/about` `/contact` |
| Admin | `/admin` |
| Homepage CMS | `/admin/home` |
| Listings | `/admin/listings` |
| Contacts | `/admin/clients` |
| Sign in | `/login` |

## What you can do from admin

- **Homepage** — edit every landing-page headline, blurb, neighborhood name, and
  hero / neighborhood photos. Save writes the live homepage.
- **Listings** — create, edit, pause, or delete properties. Drag-and-drop photos
  (one cover + gallery). A listing only appears on the public site when its
  lifecycle is **live**.
- **Contacts** — renters and buyers (inquired / rented / purchased). Public
  inquiry forms write into this same table.

## What lives where

```
src/routes/              Pages (home, properties, rent/buy/land, admin, login, APIs)
src/components/admin/    Workspace shell, listing form, photo drop, CMS image
src/components/home/     Marketing homepage (reads CMS content)
src/components/property/ Cards, filters, galleries
src/components/layout/   Public header, footer, WhatsApp
src/lib/catalog.ts       Listings + contacts (staff writes, public live reads)
src/lib/home.ts          Homepage CMS load/save
src/lib/home-defaults.ts Launch copy for the landing page
src/lib/auth/            Better Auth (do not edit except email-password.ts)
public/images/           Photography
migrations/              Auth, catalog, CMS schema
.grok/app-env.json       Auth/database flags for local scripts
```

## Scripts

| Command | |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build + migrations |
| `npm run typecheck` | TypeScript |

## Brand

Primary green `#0F5132`, cream `#F8F5EC`, terracotta `#E76F22`. Plus Jakarta Sans
+ Inter. Tagline: *Find your place in Rwanda.*
