# 002 - Sort By Dropdown (Product List)

## Description

The "Sort by" `<select>` on the product list page (`src/pages/ProductList.jsx`, lines 51-63) currently renders options (Featured, Price: Low to High, Price: High to Low, Newest) but has no `onChange` handler and does not affect the order of rendered products. Wire it up so selecting an option actually re-sorts the visible product grid.

## Background

The dropdown is uncontrolled (`defaultValue="featured"`, no state) and the `PRODUCTS` array below it is rendered in its original hardcoded order (lines 66-74). Each product currently has a `price` field (string) but no explicit "created/newest" field, so "Newest" sorting will need a date/order field added to the product data model, or should be scoped out until real product data exists.

## Background (data note)

Products currently only have: `id`, `name`, `subtext`, `price`, `type`, `originalPrice`, `saveLabel`. There is no `createdAt` field needed for "Newest", so this ticket should define how that's handled (e.g., fall back to array order, or add a mock `createdAt`).

## Dependencies

- Shares the same rendered list as [001 - Filter Implementation](001-filter-implementation-productlist.md); sorting must apply on top of (or in combination with) whatever filtered subset is active.
- Interacts with [004 - Pagination](004-pagination-productlist.md) and [005 - Page Size Dropdown](005-page-size-dropdown-productlist.md): sort order must be applied before pagination slices the list, and changing sort should reset pagination to page 1.
- No backend sort support yet (`ecom-api` not connected) — sort is client-side against local data for now.

## Acceptance Criteria

- Selecting "Price: Low to High" / "Price: High to Low" re-orders the rendered product grid by numeric price ascending/descending.
- Selecting "Featured" restores the default/original ordering.
- Selecting "Newest" sorts by whatever newest-first proxy field is defined during implementation (documented in code/comments if not obvious).
- The select is a controlled component reflecting the currently active sort.
- Changing sort order resets the current page to 1 (coordinate with pagination ticket).
- No console errors/warnings introduced; sorting does not mutate the original `PRODUCTS` source array in place.
