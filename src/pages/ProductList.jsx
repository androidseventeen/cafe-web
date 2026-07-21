import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { cafeApi } from '../services/api-client';

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 pt-10">
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          className={`h-10 w-10 rounded border-2 border-black text-sm font-medium ${
            n === 1 ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          {n}
        </button>
      ))}
      <button className="h-10 w-10 rounded border-2 border-black bg-white text-sm">
        →
      </button>
    </div>
  );
}

export default function ProductList() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    cafeApi.listProducts()
      .then(({ data }) => {
        if (cancelled) return;
        setProducts(data.data.products);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.error?.message || 'Something went wrong. Please try again.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-8 py-6">
      <div className="flex items-center justify-between border-b border-dashed border-black/40 pb-6">
        <button className="flex items-center gap-2 text-sm text-neutral-700">
          <FilterIcon />
          <span>Filters</span>
        </button>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-neutral-700">Sort by:</label>
          <select
            id="sort"
            className="rounded border-2 border-black bg-white px-3 py-2 text-sm"
            defaultValue="featured"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {status === 'loading' && (
        <p className="py-10 text-sm text-neutral-500">Loading products…</p>
      )}

      {status === 'error' && (
        <div className="mt-8 rounded border-2 border-red-500 bg-white px-6 py-5">
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {status === 'success' && products.length === 0 && (
        <p className="py-10 text-center text-sm text-neutral-500">No products yet</p>
      )}

      {status === 'success' && products.length > 0 && (
        <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Link key={p._id} to={`/products/${p._id}`} className="block">
              <ProductCard
                name={p.name}
                type={p.type}
                price={p.priceDefault}
                placeholderLabel={`Placeholder Img ${i + 1}`}
              />
            </Link>
          ))}
        </div>
      )}

      <Pagination />
    </div>
  );
}
