// TODO: backend has no orders/revenue/product-count aggregation endpoints yet
// (orders, order-items, payments, cart modules are empty stubs in cafe-api).
// Replace with real data once those endpoints exist.
const STATS = [
  { label: 'TOTAL ORDERS', value: '1,284', detail: '↑ 12% this month', variant: 'default' },
  { label: 'REVENUE', value: '$48,320', detail: '↑ 8% this month', variant: 'default' },
  { label: 'PRODUCTS', value: '42', detail: '18 physical · 24 digital', variant: 'default' },
  { label: 'PENDING ORDERS', value: '17', detail: 'Needs attention', variant: 'warning' },
];

const RECENT_ORDERS = [
  { id: '#10048', customer: 'Jane Smith', total: '$87.14', status: 'Fulfilled', date: 'Jul 7, 2026' },
  { id: '#10047', customer: 'Guest', total: '$29.99', status: 'Pending', date: 'Jul 7, 2026' },
  { id: '#10046', customer: 'Carlos Ruiz', total: '$149.00', status: 'Processing', date: 'Jul 6, 2026' },
  { id: '#10045', customer: 'Aiko Tanaka', total: '$59.99', status: 'Fulfilled', date: 'Jul 6, 2026' },
  { id: '#10044', customer: 'Marc Dupont', total: '$19.99', status: 'Cancelled', date: 'Jul 5, 2026' },
];

const STATUS_STYLES = {
  Fulfilled: 'border-green-600 text-green-700',
  Pending: 'border-orange-500 text-orange-600',
  Processing: 'border-blue-500 text-blue-600',
  Cancelled: 'border-red-500 text-red-600',
};

function StatCard({ label, value, detail, variant }) {
  return (
    <div
      className={`rounded border-2 bg-white px-6 py-5 ${
        variant === 'warning' ? 'border-red-500' : 'border-black'
      }`}
    >
      <p className="text-xs tracking-[0.15em] text-neutral-400">{label}</p>
      <p className="pt-2 text-3xl font-bold">{value}</p>
      <p className={`pt-1 text-sm ${variant === 'warning' ? 'text-red-600' : 'text-neutral-500'}`}>
        {detail}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`rounded border px-2 py-1 text-xs ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-8 rounded border-2 border-black bg-white">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="font-bold">Recent orders</h2>
          <span className="cursor-not-allowed text-sm text-brand-blue" title="Coming soon">
            View all →
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-black/20 bg-brand-grey text-left">
              <th className="px-6 py-3 font-medium">Order #</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((o) => (
              <tr key={o.id} className="border-b border-dashed border-black/20 last:border-b-0">
                <td className="px-6 py-4 text-brand-blue">{o.id}</td>
                <td className="px-6 py-4">{o.customer}</td>
                <td className="px-6 py-4">{o.total}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-6 py-4 text-neutral-500">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
