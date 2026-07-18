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
| `/login` | `src/pages/Login.jsx` | Built out — email/password form under `AuthLayout` (minimal header, no nav/cart), wired to `cafe-api`'s `/users/login` via `AuthContext`. Same form for all roles; post-login redirect goes through `src/lib/redirect.js`'s `getPostLoginRedirect(role)`, which currently sends every role to `/` (no `/admin` area exists yet) |

An axios client exists (`src/services/api-client.js`, `src/services/config.js`, base URL from `REACT_APP_SERVERAPI`) — `ProductList` still doesn't consume it, but `cafeApi.login`/`me`/`logout`/`createUser` do. Everything else in the README's route table (`/products/:slug`, `/cart`, `/checkout`, `/register`, `/account/*`, `/admin/*`) has no route or page yet.

## Tailwind is wired up

`tailwind.config.js` defines the `content` glob (`./src/**/*.{js,jsx,ts,tsx}`) and the brand color tokens (`brand-blue`, `brand-navy`, `brand-sky`, `brand-cream`, `brand-tan`, `brand-grey`); `src/styles/index.css` has the `@tailwind base/components/utilities` directives. Tailwind classes work as normal.

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

## Auth (implemented)

- `src/context/AuthContext.jsx` — Context API + `useReducer` holding `{ user, status }` (`'loading' | 'authenticated' | 'anonymous'`), as planned in the README. Provides `login(email, password)` and `logout()`; on mount it calls `GET /users/me` to restore the session from the cookie (a 401 there just means logged-out, not an error).
- `src/layouts/AuthLayout.jsx` — minimal-chrome layout (brand mark only, no nav links/cart) for auth routes, parallel to `MainLayout`; currently used by `/login`, intended for `/register` and forgot-password later.
- The JWT lives in an **httpOnly cookie** set by `cafe-api` — **never `localStorage`**. `src/services/config.js`'s axios instance already has `withCredentials: true` so the cookie flows automatically; no token is read or stored in JS.

## Planned architecture (from README — not yet built)

- **State**: Context API + `useReducer` for cart (no Redux) — same pattern as auth above
- **Guest cart**: persisted server-side via a `sessionToken` cookie
- **Payments**: Stripe Elements — card data must never touch this app's state or be sent to `ecom-api`
- **Routing**: React Router v6; admin routes gated by role (Admin/Owner, with `/admin/staff` restricted to Owner)
- **Hosting**: Render Static Site (free tier)

The README notes CRA is unmaintained upstream — migration to Vite is on the table if build times become a problem, but is not planned yet.
