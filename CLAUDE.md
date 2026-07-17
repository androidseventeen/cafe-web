# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is `ecom-client` — the storefront + admin UI for a single-vendor ecommerce store, paired with a separate `ecom-api` backend (not in this repo). It started as a bare Create React App scaffold and now has real React Router v6 routing (`src/App.js`), a shared `MainLayout`, and a handful of pages — see [Pages implemented](#pages-implemented) below for exactly what's built vs. stubbed. Most of the README's full route table (cart, checkout, auth, admin) is still unbuilt. Treat the README route table and directory structure as the *intended* design, not what fully exists yet.

Stub directories under `src/` (`features/`) are still placeholders for the layout described in the README — populate them as work progresses rather than inventing a different structure. `components/`, `pages/`, `layouts/`, `services/`, and `assets/` are no longer empty (see below).

## Pages implemented

`src/App.js` wires `BrowserRouter`/`Routes`, all nested under `MainLayout` (`src/layouts/MainLayout.jsx`, renders `TopNav` + `<Outlet />`):

| Path | Component | Status |
|---|---|---|
| `/`, `/shop` | `src/pages/ProductList.jsx` | Built out — filter/sort bar, product grid (`ProductCard`), pagination. Data is a **hardcoded local `PRODUCTS` array**, not fetched from `ecom-api` |
| `/about` | `src/pages/About.jsx` | Stub — heading only |
| `/blog` | `src/pages/Blog.jsx` | Stub — heading only |

An axios client exists (`src/services/api-client.js`, `src/services/config.js`, base URL from `REACT_APP_SERVERAPI`) but no page consumes it yet. Everything else in the README's route table (`/products/:slug`, `/cart`, `/checkout`, `/login`, `/register`, `/account/*`, `/admin/*`) has no route or page yet.

## Tailwind is installed but not wired up

`tailwindcss`, `postcss`, and `autoprefixer` are installed and `postcss.config.js` is set up, but:
- `tailwind.config.js` is **empty (0 bytes)** — needs the standard `content: ["./src/**/*.{js,jsx,ts,tsx}"]` config before Tailwind classes will emit
- `src/styles/index.css` has no `@tailwind base/components/utilities` directives yet

If you add Tailwind classes and they don't apply, this is why. The first UI task should complete this wiring.

## Commands

```bash
npm start                       # dev server on localhost:3000
npm run build                   # production build → build/
npm test                        # jest watch mode (react-scripts)
npm test -- --watchAll=false    # single non-interactive run (CI-style)
npm test -- App.test.js         # run one test file
```

There is no lint script — CRA's `eslintConfig` (`react-app`, `react-app/jest`) runs inline during `npm start` / `npm run build`.

## Environment

Requires an `.env` (not committed) — see README for keys. `REACT_APP_API_URL` points at the `ecom-api` backend; `REACT_APP_STRIPE_PUBLISHABLE_KEY` is the Stripe publishable key. Without a running `ecom-api`, most flows will not function once implemented.

## Planned architecture (from README — not yet built)

- **State**: Context API + `useReducer` for auth and cart (no Redux)
- **HTTP**: Axios with a JWT interceptor; JWT lives in an `httpOnly` cookie — **never `localStorage`**
- **Guest cart**: persisted server-side via a `sessionToken` cookie
- **Payments**: Stripe Elements — card data must never touch this app's state or be sent to `ecom-api`
- **Routing**: React Router v6; admin routes gated by role (Admin/Owner, with `/admin/staff` restricted to Owner)
- **Hosting**: Render Static Site (free tier)

The README notes CRA is unmaintained upstream — migration to Vite is on the table if build times become a problem, but is not planned yet.
