import { useEffect, useState } from 'react';
import { cafeApi } from '../../services/api-client';

const STATUS_STYLES = {
  active: 'border-green-600 text-green-700',
  draft: 'border-orange-500 text-orange-600',
  archived: 'border-neutral-400 text-neutral-500',
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded border px-2 py-1 text-xs ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
      {status}
    </span>
  );
}

export default function Products() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    cafeApi.listAllProducts()
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
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="text-3xl font-bold">Products</h1>

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

      {status === 'success' && (
        <div className="mt-8 rounded border-2 border-black bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-black/20 bg-brand-grey text-left">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-neutral-500">
                    No products yet
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="border-b border-dashed border-black/20 last:border-b-0">
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4 capitalize">{p.type}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
