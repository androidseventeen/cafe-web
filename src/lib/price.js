// Prices from cafe-api are decimal dollars (e.g. 1.99), never cents — see the
// "Price format" key decision in cafe-api's README. These are display helpers
// only: format the value as-is, never divide by 100.

// "1.99" — a bare two-decimal amount, no currency symbol.
export function formatPrice(dollars) {
  return Number(dollars).toFixed(2);
}

// "$1.99" — amount with the USD symbol, for display.
export function formatPriceUSD(dollars) {
  return `$${formatPrice(dollars)}`;
}
