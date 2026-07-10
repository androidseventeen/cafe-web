# 003 - Navigation to Product Details (Product List)

## Description

Product cards rendered by `ProductList.jsx` via `ProductCard` (`src/components/ProductCard.jsx`) are currently static, non-interactive `<article>` elements with no link or click handler. Make each card navigate to a product detail page/route when clicked.

## Background

`ProductCard` receives `name`, `subtext`, `price`, `originalPrice`, `type`, `placeholderLabel`, `saveLabel` as props but no `id` or link is wired into the rendered markup (it's spread via `{...p}` in `ProductList.jsx` line 70, so `id` is already available on the card's props, just unused). There is currently **no product detail page or route** in the app — `App.js` only defines routes for `/`, `/shop`, `/about`, and `/blog`. This ticket includes creating a minimal detail route/page as a prerequisite, or should be split further if that page is being built separately.

## Dependencies

- Requires a product detail route to exist (e.g., `/products/:id`) — if a separate ticket/effort is tracking the detail page build-out, this ticket should link to it and only cover the navigation/click behavior from the list.
- React Router v6 is already installed and used in `App.js`/`MainLayout.jsx` — navigation should use `<Link>` or `useNavigate` from `react-router-dom`, not raw `<a>` tags or `window.location`.
- Product `id` field already exists in the `PRODUCTS` data (`src/pages/ProductList.jsx` lines 4-9) and should be used as the route param.

## Acceptance Criteria

- Clicking anywhere on a product card (or a clearly designated "View" area within it) navigates to that product's detail route (e.g., `/products/:id`), using client-side routing (no full page reload).
- The correct product `id` is passed through to the detail route for each card.
- Keyboard accessibility: card is reachable via tab order and activatable via Enter/Space (e.g., implemented as a `<Link>`/button-semantic element, not a bare `<div onClick>`).
- Existing card styling/layout (hover states, borders, badges) is preserved.
- If no detail page exists yet, a minimal placeholder detail page is created so the route resolves without a 404/blank screen.
