# Little Art Heaven

A handmade storefront for Srijita Nandy with a public catalog, cart checkout, WhatsApp follow-up flow, and an admin dashboard ready for Supabase-backed data.

## Stack

- Next.js App Router
- Tailwind CSS v4
- Supabase for database, auth, and storage
- Nodemailer for order email notifications

## Run locally

1. Copy `.env.example` to `.env.local`
2. Fill in the Supabase, WhatsApp, and SMTP values
3. Install dependencies
4. Run the dev server

```bash
npm install
npm run dev
```

## Supabase setup

1. Run the SQL in `supabase/schema.sql`
2. Create one admin user in Supabase Auth using the admin email you want for Srijita
3. Add product images to a bucket if you want live storage-backed uploads later

## Current behavior

- Public storefront uses the seeded Little Art Heaven catalog immediately
- If Supabase is not configured, the app falls back to seeded products and local mock order storage
- Once Supabase is configured, orders are persisted there and admin auth becomes live
