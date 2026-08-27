# HIPA Masalas Independent Website Source

This is a portable React, Vite, Express and tRPC source export. Every public website image is included under `client/public/assets`, and all public image references use local `/assets/...` paths. No hosted assets from the previous build environment are required.

## First local run — no database required

The export works immediately with its seven published HIPA blog articles bundled in `data/blog-posts.json`. MySQL is optional for local viewing and testing.

1. Copy `.env.example` to `.env`.
2. Set a long, private `JWT_SECRET`, `ADMIN_LOGIN_USERNAME` and `ADMIN_LOGIN_PASSWORD` in `.env`. Do not commit this file.
3. Leave `DATABASE_URL` empty or retain the example placeholder when you only need the built-in local mode.
4. Install dependencies with `npm install` or `pnpm install`.
5. Start development with `npm run dev` or `pnpm dev`.
6. Open `http://localhost:3000`. The seven bundled blog articles are already visible at `/blog`, and the password-protected editor is at `/admin`.
7. If port 3000 is already busy, use `PORT=3001 npm run dev` on macOS/Linux, or `set PORT=3001 && npm run dev` on Windows Command Prompt.
8. Create a production build with `npm run build`, then run `npm start`.

In local bundled-data mode, changes made through the administrator are saved to `data/local-state.json`. Keep this file in the project if those local edits must be retained; delete it to reset the site back to the original bundled blog data. The Node.js process must have write permission for the `data` directory.

## Optional MySQL mode

For a shared or multi-instance production deployment, set `DATABASE_URL` to a valid MySQL connection string. Generate and apply the migration with `pnpm db:generate`, then load the seven exported articles with `pnpm content:import`. With a valid database connection, blog and product-availability data use MySQL instead of `data/local-state.json`.

## Important deployment notes

The password-protected admin panel stores uploaded cover images in `client/public/uploads` for this portable local-file configuration. For horizontally scaled or serverless hosting, replace `server/storage.ts` with a compatible object-storage adapter and retain the returned local/public URL convention.

The public fonts are Google Fonts: Dancing Script, Playfair Display and Poppins. Their exact CSS source remains in `client/index.html`; no website asset is hosted by the previous build platform.

The contact-form notification adapter logs enquiries by default. Connect a mail or CRM provider in `server/_core/notification.ts` if delivery notifications are required.
