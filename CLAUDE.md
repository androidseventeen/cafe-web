# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is `ecom-client` — the storefront + admin UI for a single-vendor ecommerce store, paired with a separate `ecom-api` backend (not in this repo). It started as a bare Create React App scaffold and now has real React Router **v7** routing (`src/App.js`; `package.json` confirms `react-router-dom ^7.18.1` — the README's "v6" mention is stale), a shared `MainLayout`, and a handful of pages — see [Pages implemented](#pages-implemented) below for exactly what's built vs. stubbed. Most of the README's full route table (cart, checkout, auth, admin) is still unbuilt. Treat the README route table and directory structure as the *intended* design, not what fully exists yet.

Stub directories under `src/` (`features/`) are still placeholders for the layout described in the README — populate them as work progresses rather than inventing a different structure. `components/`, `pages/`, `layouts/`, `services/`, and `assets/` are no longer empty (see below).

## Pages implemented

`src/App.js` wires `BrowserRouter`/`Routes` into three layout-route groups — storefront pages under `MainLayout` (`src/layouts/MainLayout.jsx`, renders `TopNav` + `<Outlet />`), `/login` under `AuthLayout`, and `/admin/*` under `RequireRole` + `AdminLayout`:

| Path | Component | Status |
|---|---|---|
| `/`, `/shop` | `src/pages/ProductList.jsx` | Built out — filter/sort bar (still decorative/unwired), product grid (`ProductCard`), pagination (still decorative — `GET /api/products` returns no total-count field to paginate against). Data is fetched via `cafeApi.listProducts()` (public, active-status products only), with loading/success (incl. empty-state)/error states matching `admin/Products.jsx`'s pattern. Cards omit price entirely — the list endpoint doesn't embed SKUs/pricing — and each links to `/products/:id` |
| `/products/:id` | `src/pages/ProductDetail.jsx` | Built out — fetches `GET /api/products/:id` (public, embeds SKUs) via `cafeApi.getProduct`. Shows the lowest SKU price (formatted from cents; "From $X" only when SKUs have differing prices) or a "Pricing coming soon" note if the product has zero SKUs yet. 404 (missing, wrong-status, or malformed id — `Product._id` is a plain `String`, not an `ObjectId`, so there's no separate cast-error case) → not-found state with a link back to `/shop`; other failures → red error box. Quantity stepper is local UI state only; "ADD TO CART" is an inert disabled button (`title="Coming soon"`, same idiom as `Login.jsx`'s "Forgot password?"). Shipping/returns and star-rating rows are static decorative copy, no backend. The README documents this route as `/products/:slug`, but `Product` has no slug field — only `_id` — so the implemented route uses `/products/:id`; treat `:slug` as aspirational unless a slug field is actually added later |
| `/about` | `src/pages/About.jsx` | Stub — heading only |
| `/blog` | `src/pages/Blog.jsx` | Stub — heading only |
| `/login` | `src/pages/Login.jsx` | Built out — email/password form under `AuthLayout` (minimal header, no nav/cart), wired to `cafe-api`'s `/users/login` via `AuthContext`. Same form for all roles; post-login redirect goes through `src/lib/redirect.js`'s `getPostLoginRedirect(role)` — `admin`/`owner` → `/admin`, `shopper` → `/` |
| `/admin` | `src/pages/admin/Dashboard.jsx` | Built out — stat cards + recent-orders table under `AdminLayout` (sidebar nav + header with Log out). Data is **hardcoded placeholder** (`STATS`/`RECENT_ORDERS` consts) — `cafe-api` has no orders/revenue/order-item endpoints yet (those modules are empty stubs), so there's nothing to fetch |
| `/admin/products` | `src/pages/admin/Products.jsx` | Built out — fetches `GET /api/products/all` (owner/admin only, lists every product regardless of status) via `cafeApi.listAllProducts` on mount; renders a table, with distinct loading/success (incl. empty-table)/error states. Error message read the same way as `Login.jsx` (`err.response.data.error.message`) |
| `/admin/orders`, `/admin/staff` | `src/pages/admin/{Orders,Staff}.jsx` | Stubs — heading only, same precedent as `About.jsx`/`Blog.jsx`. Exist so the `AdminLayout` sidebar nav isn't dead links; real CRUD is separate, later work |

All four `/admin/*` routes are wrapped in `src/components/RequireRole.jsx` (the first route-guard in this codebase), used as a layout-route element the same way `MainLayout`/`AuthLayout` are: renders nothing while `AuthContext.status === 'loading'` (avoids a flash-redirect before the mount-time `/me` call resolves), redirects anonymous users to `/login`, and redirects authenticated-but-wrong-role users to `/`. Currently `allow={['admin', 'owner']}` for all four routes — **`/admin/staff`'s owner-only restriction is nav-visibility-only right now** (the `AdminLayout` sidebar hides the Staff link from `admin`-role users), not route-level; an `admin` who navigates to `/admin/staff` directly is not blocked by `RequireRole`. Tighten this once Staff CRUD is actually built.

An axios client exists (`src/services/api-client.js`, `src/services/config.js`, base URL from `REACT_APP_SERVERAPI`) — `cafeApi.login`/`me`/`logout`/`createUser`/`listAllProducts`/`listProducts`/`getProduct` are all consumed. Everything else in the README's route table (`/cart`, `/checkout`, `/register`, `/account/*`) has no route or page yet.

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
- `src/layouts/AdminLayout.jsx` — third layout sibling to `MainLayout`/`AuthLayout`: header (brand + logged-in user's email + Log out) + role-aware sidebar nav (Dashboard/Products/Orders, Staff only for `owner`). Used by all `/admin/*` routes, guarded by `RequireRole` — see the Pages table above.
- The JWT lives in an **httpOnly cookie** set by `cafe-api` — **never `localStorage`**. `src/services/config.js`'s axios instance already has `withCredentials: true` so the cookie flows automatically; no token is read or stored in JS.

## Planned architecture (from README — not yet built)

- **State**: Context API + `useReducer` for cart (no Redux) — same pattern as auth above
- **Guest cart**: persisted server-side via a `sessionToken` cookie
- **Payments**: Stripe Elements — card data must never touch this app's state or be sent to `ecom-api`
- **Hosting**: Render Static Site (free tier)

The README notes CRA is unmaintained upstream — migration to Vite is on the table if build times become a problem, but is not planned yet.
