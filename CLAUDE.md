# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is `ecom-client` — the storefront + admin UI for a single-vendor ecommerce store, paired with a separate `ecom-api` backend (not in this repo). It is currently a **bare Create React App scaffold**: `src/App.js` renders the string "Cafe" and most of the planned architecture is empty directories. Treat the README route table and directory structure as the *intended* design, not what exists.

Empty stub directories under `src/` (`components/`, `features/`, `pages/`, `layouts/`, `services/`, `assets/`) are placeholders for the layout described in the README — populate them as work progresses rather than inventing a different structure.

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
