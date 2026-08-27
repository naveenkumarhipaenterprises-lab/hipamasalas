# Vercel deployment requirements

Deploy the project root containing `server.ts`, not a static `dist` upload. Leave Vercel's Output Directory empty. Vercel runs `npm run vercel-build`, serves client files from the generated root `public/` directory, and detects `server.ts` as the Express application entry point.

Set these production environment variables in Vercel before deployment:

```text
NODE_ENV=production
CANONICAL_ORIGIN=https://www.hipamasalas.com
JWT_SECRET=<long-random-secret>
ADMIN_LOGIN_USERNAME=<private-admin-username>
ADMIN_LOGIN_PASSWORD=<private-admin-password>
DATABASE_URL=mysql://<user>:<password>@<host>:3306/<database>?ssl={"rejectUnauthorized":true}
```

Before the first production deploy, configure a MySQL-compatible database through the Vercel Marketplace or another managed provider, set `DATABASE_URL` locally as well, and run `npm run db:push` once. This creates the enquiry, newsletter, blog and availability tables. Do not run `db:push` automatically inside Vercel's build command.

The `DATABASE_URL` is mandatory for persisted enquiry submissions, newsletter subscriptions, availability updates and admin-created or edited blogs. Vercel function files are not persistent storage. The bundled seven published blogs remain available as a read-only fallback if no database is configured, but forms cannot record submissions and admin edits cannot persist without the database.

After deployment, verify that `/robots.txt` is plain text, `/sitemap.xml` is XML, public product and article pages include server-rendered metadata and JSON-LD, and unknown routes return HTTP 404.
