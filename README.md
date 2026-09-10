# MS Infra Real Estate Website

A full-stack real estate marketing website and admin management portal for MS Infra built with Next.js, Prisma, PostgreSQL, and secure server-side session authentication.

## Recommended architecture

- Frontend: Next.js App Router
- Backend: Next.js route handlers + server actions
- Database: PostgreSQL, hosted on Neon
- ORM: Prisma
- Auth: signed secure cookies with hashed passwords
- Storage: local file uploads in public/uploads for development and compatible cloud storage in production
- Styling: CSS modules and plain CSS, keeping the app lightweight and maintainable
- Deployment: Vercel for frontend and Render/railway-compatible environment support

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Prisma 5
- PostgreSQL
- Zod validation
- bcryptjs
- PDFKit

## Database schema

The app uses the following primary entities:

- AdminUser
- Project
- ProjectAmenity
- ProjectHighlight
- ProjectLocationBenefit
- ProjectNearbyLandmark
- ProjectFloorPlan
- ProjectImage
- Enquiry

## Application structure

- `src/app` — public pages and admin routes
- `src/lib` — Prisma, auth, validators, seed, config helpers
- `src/components` — reusable UI, including the enquiry form
- `prisma/schema.prisma` — database model definition
- `prisma/migrations` — migration files

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   `npm install`
3. Generate Prisma client and apply migrations:
   `npx prisma generate`
   `npx prisma migrate deploy`
4. Seed initial admin and demo projects:
   `npx tsx src/lib/seed.ts`
5. Run locally:
   `npm run dev`

## Admin login

- URL: `/admin/login`
- Credentials are configured through `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

## Environment variables

See `.env.example` for required values.

## Deployment notes

The application is configured for a production-friendly Next.js deployment. For production, set the same environment variables in your host and ensure the database is persisted.

## Notes

This project intentionally keeps public users free of registration and login; the admin route is separate and secured.
