import { TypeBadge } from './ProductCard';
import Button from './Button';
import { formatPriceUSD } from '../lib/price';

// Derive a display price + stock summary from a product's embedded SKUs
// (GET /products/all embeds them). No SKUs → no price and zero stock.
function summarize(product) {
  const skus = product.skus || [];
  if (skus.length === 0) return { price: null, varies: false, stock: 0 };
  const prices = skus.map((s) => s.price);
  const lowest = Math.min(...prices);
  const varies = !prices.every((p) => p === lowest);
  const stock = skus.reduce((sum, s) => sum + (s.stock || 0), 0);
  return { price: lowest, varies, stock };
}

export default function AdminProductCard({ product }) {
  const { price, varies, stock } = summarize(product);
  const isDigital = product.type === 'digital';
  const nonActive = product.status !== 'active';
  const outOfStock = !isDigital && stock === 0;

  return (
    <article className="rounded-md border-2 border-black bg-white">
      <div className="flex gap-4 p-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded border border-black/20 bg-brand-cream text-xs text-neutral-500">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            'No image'
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-bold">{product.name}</h3>
            {nonActive && (
              <span className="shrink-0 rounded border border-neutral-400 px-2 py-0.5 text-xs capitalize italic text-neutral-500">
                {product.status}
              </span>
            )}
          </div>

          {product.description && (
            <p className="truncate text-sm italic text-neutral-500">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            {price != null ? (
              <span className="text-lg font-bold">
                {varies ? `From ${formatPriceUSD(price)}` : formatPriceUSD(price)}
              </span>
            ) : (
              <span className="text-sm text-neutral-400">No price</span>
            )}
            <TypeBadge type={product.type} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-black/30 px-4 py-3">
        <span className={`text-sm italic ${outOfStock ? 'text-red-600' : 'text-neutral-500'}`}>
          {isDigital ? 'Downloads: ∞' : `Stock: ${stock}${outOfStock ? ' — out' : ''}`}
        </span>
        <div className="flex gap-2">
          <Button
            title="Coming soon"
            className="rounded border-2 border-black px-4 py-1.5 text-sm"
          >
            Edit
          </Button>
          <Button
            title="Coming soon"
            className="rounded border-2 border-red-500 px-4 py-1.5 text-sm text-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
