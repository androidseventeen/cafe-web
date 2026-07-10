# 005 - Page Size Dropdown (Product List)

## Description

Add a dropdown control to the product list page (`src/pages/ProductList.jsx`) letting users choose how many products display per page: 6, 9, or 12. No such control exists today.

## Background

`ProductList.jsx` currently renders all products in a single `md:grid-cols-2 lg:grid-cols-3` grid (lines 66-74) with no concept of page size at all — this is a net-new control, not a rewire of existing markup, unlike the other tickets in this batch. It should live near the existing "Sort by" control in the header row (lines 45-64) for layout consistency.

## Dependencies

- Directly coupled to [004 - Pagination](004-pagination-productlist.md): page size determines how the product list is sliced into pages, and this ticket has no independent user-visible effect without pagination in place. Recommend building/landing together or immediately after 004.
- Should apply to the same filtered/sorted list as [001](001-filter-implementation-productlist.md) and [002](002-sort-dropdown-productlist.md).

## Acceptance Criteria

- A dropdown (styled consistently with the existing "Sort by" select, e.g. `border-2 border-black` per line 55) offers 6, 9, and 12 as page-size options.
- Selecting a value re-renders the grid to show that many products on the current page, and recalculates total page count for the pagination control.
- Changing page size resets the current page back to 1.
- A sensible default is defined (e.g., 9, matching the current 3-column layout) and applied on initial load.
- The chosen page size persists across sort/filter changes until the user explicitly changes it again.
