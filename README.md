# ecom-client

Storefront and admin UI for a single-vendor ecommerce store. Built with React (CRA), Tailwind CSS, and React Router v6.

## Stack

- **Framework** — React (Create React App)
- **Styling** — Tailwind CSS
- **Routing** — React Router v6
- **State** — Context API + useReducer (auth + cart)
- **HTTP** — Axios (JWT interceptor attached)
- **Payments** — `@stripe/stripe-js` + `@stripe/react-stripe-js`
- **Hosting** — Render Static Site (free tier)

## Prerequisites

- Node.js 18+
- `ecom-api` running locally or deployed

## Getting started

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Start dev server
npm start
```

## Environment variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Scripts

```bash
npm start        # dev server on localhost:3000
npm run build    # production build
npm test         # run tests
```

## Route structure

| Path | Component | Auth |
|---|---|---|
| `/` | Catalog | Public |
| `/products/:slug` | Product detail | Public |
| `/cart` | Cart | Public |
| `/checkout` | Checkout | Public (guest ok) |
| `/orders/confirm/:id` | Order confirmation | Public |
| `/account/orders` | Order history | Shopper |
| `/downloads/:token` | Download landing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/admin` | Admin dashboard | Admin + Owner |
| `/admin/products` | Product list | Admin + Owner |
| `/admin/products/new` | Create product | Admin + Owner |
| `/admin/products/:id` | Edit product | Admin + Owner |
| `/admin/orders` | Orders list | Admin + Owner |
| `/admin/orders/:id` | Order detail | Admin + Owner |
| `/admin/staff` | Staff management | Owner only |

## Notes

- JWT stored in `httpOnly` cookie — never `localStorage`
- Cart state persisted via `sessionToken` cookie for guests
- Stripe card input handled by Stripe Elements — card data never touches this app
- CRA is unmaintained upstream — consider migrating to Vite if build times become an issue during the POC