import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import { TypeBadge } from '../components/ProductCard';
import { cafeApi } from '../services/api-client';

function formatPrice(cents) {
  return (cents / 100).toFixed(2);
}

// No pricing/variant backend beyond raw SKUs yet: show the lowest SKU price,
// "From $X" only when SKUs genuinely differ, and a friendly note when a
// product exists but has no SKUs attached yet.
function priceDisplay(skus) {
  if (!skus || skus.length === 0) return null;
  const prices = skus.map((s) => s.price);
  const lowest = Math.min(...prices);
  const allSame = prices.every((p) => p === lowest);
  return allSame ? `$${formatPrice(lowest)}` : `From $${formatPrice(lowest)}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'notfound' | 'error'
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    cafeApi.getProduct(id)
      .then(({ data }) => {
        if (cancelled) return;
        setProduct(data.data.product);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setStatus('notfound');
          return;
        }
        setError(err?.response?.data?.error?.message || 'Something went wrong. Please try again.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-8 py-16">
        <p className="text-sm text-neutral-500">Loading product…</p>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="mx-auto max-w-7xl px-8 py-16 text-center">
        <p className="text-sm text-neutral-500">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-sm text-neutral-600 hover:text-black">
          ← Back to storefront
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="rounded border-2 border-red-500 bg-white px-6 py-5">
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const price = priceDisplay(product.skus);

  return (
    <div className="mx-auto max-w-7xl px-8 py-6">
      <div className="flex items-center gap-2 border-b border-dashed border-black/40 pb-6 text-sm">
        <Link to="/shop" className="text-neutral-500 hover:text-black">
          Shop
        </Link>
        <span className="text-neutral-400">›</span>
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-md border-2 border-black bg-brand-cream">
          <span className="text-neutral-500">Placeholder Img 1</span>
        </div>

        <div className="space-y-4">
          <TypeBadge type={product.type} />

          <h1 className="text-3xl font-bold">{product.name}</h1>

          {price ? (
            <p className="text-2xl font-bold">{price}</p>
          ) : (
            <p className="text-sm text-neutral-500">Pricing coming soon</p>
          )}

          <div className="border-t border-dashed border-black/40 pt-4">
            {product.description && (
              <p className="text-neutral-700">{product.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-dashed border-black/40 pt-4">
            <div className="flex items-center rounded border-2 border-black">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              disabled
              title="Coming soon"
              className="flex-1 cursor-not-allowed rounded bg-black py-3 text-sm font-semibold tracking-widest text-white disabled:opacity-50"
            >
              ADD TO CART
            </Button>
          </div>

          {/* Static marketing copy — no shipping/returns backend to wire up. */}
          <div className="flex gap-6 text-sm text-neutral-500">
            <span>→ Free shipping $75+</span>
            <span>✓ 30-day returns</span>
          </div>

          {/* Static placeholder rating — no reviews backend exists yet. */}
          <p className="text-sm">
            <span className="text-yellow-500">★★★★★</span>{' '}
            <span className="font-medium">Excellent 5.0</span>{' '}
            <span className="text-neutral-500">(124 reviews)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
