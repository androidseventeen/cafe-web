# 001 - Filter Implementation (Product List)

## Description

The "Filters" button on the product list page (`src/pages/ProductList.jsx`) is currently a static, non-functional element. Implement a working filter panel/drawer that lets users narrow the product grid by attributes such as type (Physical/Digital), price range, and sale status.

## Background

`ProductList.jsx` renders a hardcoded `PRODUCTS` array and a `FilterIcon` button (lines 12-20, 46-49) with no click handler, no open/close state, and no filtering logic applied to the rendered grid. There is currently no products API integration (`ecom-api` is a separate, not-yet-connected backend per `REACT_APP_API_URL`), so filtering will initially need to operate against local/mock data or an in-memory product list, with an eye toward swapping in server-side query params later.

## Dependencies

- Product data source: depends on how products will eventually be fetched (`REACT_APP_API_URL` / `ecom-api`); until that's wired up, filtering operates on local/mock data.
- May share state/UI conventions with [002 - Sort Dropdown](002-sort-dropdown-productlist.md) since both affect the same rendered product list and likely need to compose (filter + sort + paginate together).
- No existing Context/reducer for product-list UI state — this ticket may need to introduce one (per README's stated Context API + `useReducer` pattern) or local component state, to be decided at implementation time.

## Acceptance Criteria

- Clicking "Filters" opens a visible filter panel (inline, drawer, or modal) and clicking again (or a close control) closes it.
- At minimum, users can filter by product type (Physical/Digital) and by sale status (on sale vs. not); price range filtering is a stretch goal if time allows.
- Applying a filter updates the rendered product grid to only show matching products, without a full page reload.
- Filters can be cleared/reset back to showing the full product list.
- Filter state is visually reflected in the UI (e.g., active filter count/badge or highlighted controls).
- No console errors/warnings introduced; existing product grid layout and styling remain intact when no filters are active.
