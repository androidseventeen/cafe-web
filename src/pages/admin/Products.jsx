import { useEffect, useState } from 'react';
import { cafeApi } from '../../services/api-client';
import AdminProductCard from '../../components/AdminProductCard';
import AddProductModal from '../../components/AddProductModal';
import Button from '../../components/Button';

const FETCH_ERROR = 'Something went wrong. Please try again.';

export default function Products() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Reused after a successful create to refresh the grid.
  const fetchProducts = async () => {
    setStatus('loading');
    try {
      const { data } = await cafeApi.listAllProducts();
      setProducts(data.data.products);
      setStatus('success');
    } catch (err) {
      setError(err?.response?.data?.error?.message || FETCH_ERROR);
      setStatus('error');
    }
  };

  useEffect(() => {
    let cancelled = false;
    cafeApi
      .listAllProducts()
      .then(({ data }) => {
        if (cancelled) return;
        setProducts(data.data.products);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.error?.message || FETCH_ERROR);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreated = () => {
    setShowAdd(false);
    fetchProducts();
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <span className="text-sm italic text-neutral-500">
          {products.length} products total
        </span>
      </div>

      {/* Toolbar — search + filters are decorative for now (no functionality). */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          onClick={() => setShowAdd(true)}
          className="rounded-md bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
        >
          + Add product
        </Button>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Search products…"
            title="Coming soon"
            className="w-full rounded-md border-2 border-black bg-white py-3 pl-10 pr-4 text-sm"
          />
        </div>
        <Button
          title="Coming soon"
          className="rounded-md border-2 border-black bg-white px-6 py-3 text-sm"
        >
          Filters
        </Button>
      </div>

      {status === 'loading' && (
        <p className="pt-8 text-sm text-neutral-500">Loading products…</p>
      )}

      {status === 'error' && (
        <div className="mt-8 rounded border-2 border-red-500 bg-white px-6 py-5">
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {status === 'success' &&
        (products.length === 0 ? (
          <p className="pt-10 text-center text-sm text-neutral-500">
            No products yet
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <AdminProductCard key={p._id} product={p} />
            ))}
          </div>
        ))}

      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
