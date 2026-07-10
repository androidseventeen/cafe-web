# 004 - Pagination (Product List)

## Description

The `Pagination` component in `src/pages/ProductList.jsx` (lines 22-40) currently renders 3 hardcoded page-number buttons and a "→" next button, none of which are wired to any state or click handlers. Implement functional pagination that slices the (filtered/sorted) product list and updates the visible page.

## Background

All 6 mock products in `PRODUCTS` are currently rendered on a single page (lines 66-74) regardless of the `Pagination` UI shown below the grid — the component is purely decorative today. Page count, current page, and the "→" button's behavior are all unimplemented (there's no previous button either, and no logic to disable it on page 1 or disable "→" on the last page).

## Dependencies

- Must operate on the final list *after* [001 - Filters](001-filter-implementation-productlist.md) and [002 - Sort](002-sort-dropdown-productlist.md) are applied, since the page count depends on the filtered/sorted result size.
- Directly coupled to [005 - Page Size Dropdown](005-page-size-dropdown-productlist.md), since total page count = `ceil(filteredProducts.length / pageSize)`.
- No backend pagination yet (`ecom-api` not connected) — implement as client-side slicing of the local/mock array for now; note where this would later be swapped for server-side `page`/`limit` query params.

## Acceptance Criteria

- Page number buttons reflect the actual number of pages needed for the current (filtered/sorted) product list and page size.
- Clicking a page number displays that page's slice of products in the grid.
- The currently active page is visually indicated (as today, via the black/white style swap).
- "→" advances to the next page when one exists, and is disabled (or hidden) on the last page; add an equivalent "←"/previous control disabled on page 1.
- Changing filters, sort, or page size resets the current page back to 1.
- Pagination controls are hidden or reduced appropriately when the product list fits on a single page.
