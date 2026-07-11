import ProductCard from '../components/ProductCard';

const PRODUCTS = [
  { id: 1, name: 'Product Name 1', subtext: '(optional) subtext', price: '29.99', type: 'Physical' },
  { id: 2, name: 'Product Name 2', subtext: '(optional) subtext', price: '29.99', type: 'Physical' },
  { id: 3, name: 'Product Name 3', subtext: '(optional) subtext', price: '29.99', type: 'Digital' },
  { id: 4, name: 'Product Name 4', subtext: '(optional) subtext', price: '19.99', originalPrice: '29.97', saveLabel: 'Save $9.98' },
  { id: 5, name: 'Product Name 5', subtext: '(optional) subtext', price: '49.99', type: 'Digital' },
  { id: 6, name: 'Product Name 6', subtext: '(optional) subtext', price: '59.99', originalPrice: '79.99', saveLabel: 'Save $20.00' },
];

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

      <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <ProductCard
            key={p.id}
            {...p}
            placeholderLabel={`Placeholder Img ${i + 1}`}
          />
        ))}
      </div>

      <Pagination />
    </div>
  );
}
