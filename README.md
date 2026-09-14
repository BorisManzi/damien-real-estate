# Damien Real Estate

Modern property discovery platform for Rwanda — Next.js MVP.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Mock property data layer (swap for API/DB later)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configure

Edit `.env.local`:

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp business number
- `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_EMAIL`
- `LEAD_WEBHOOK_URL` — optional webhook for form leads
- `NEXT_PUBLIC_SITE_URL` — production URL for SEO

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Discovery homepage |
| `/properties` | Marketplace + filters |
| `/properties/[slug]` | Property detail |
| `/rent` `/buy` `/land` | Pre-filtered listings |
| `/about` | Mission |
| `/contact` | Lead form |

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
