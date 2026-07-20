import { useState } from 'react';
import Button from './Button';

const TYPES = ['physical', 'digital'];
const STATUSES = ['active', 'draft'];

// Segmented two-option toggle matching the wireframe (selected = solid black).
function Segmented({ options, value, onChange }) {
  return (
    <div className="flex rounded-md border-2 border-black p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded px-4 py-2 text-sm font-medium capitalize transition ${
            value === opt ? 'bg-black text-white' : 'text-neutral-600 hover:bg-black/5'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const labelClass = 'mb-2 block text-sm text-neutral-600';
const inputClass =
  'w-full rounded-md border-2 border-black bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue';

// Presentational product form — knows nothing about the API. Owns its field
// state (seeded from `initialValues`), validates client-side, and calls
// `onSubmit(values)` only when valid. The container supplies `onSubmit`,
// `onCancel`, `submitting`, and any API `error`. Reusable in a modal, drawer,
// or full page.
export default function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting = false,
  error = '',
  submitLabel = 'Save product', // todo: 'Update product 'if existing product 
}) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [type, setType] = useState(initialValues?.type ?? 'physical');
  const [status, setStatus] = useState(initialValues?.status ?? 'active');
  const [priceDefault, setPriceDefault] = useState(
    initialValues?.priceDefault != null ? String(initialValues.priceDefault) : ''
  );
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('A product name is required.');
      return;
    }
    // priceDefault is required (min 0) on the model — enforce it here too.
    const price = Number(priceDefault);
    if (priceDefault === '' || !Number.isFinite(price) || price < 0) {
      setValidationError('A valid price is required.');
      return;
    }
    setValidationError('');
    onSubmit({
      name: name.trim(),
      type,
      status,
      priceDefault: price,
      description: description.trim(),
    });
  };

  // A fresh validation error takes precedence; otherwise show the API error.
  const message = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <p
          role="alert"
          className="rounded border-2 border-red-500 bg-white px-4 py-3 text-sm text-red-600"
        >
          {message}
        </p>
      )}

      <div>
        <label htmlFor="pf-name" className={labelClass}>
          Product name
        </label>
        <input
          id="pf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <span className={labelClass}>Type</span>
          <Segmented options={TYPES} value={type} onChange={setType} />
        </div>
        <div>
          <span className={labelClass}>Status</span>
          <Segmented options={STATUSES} value={status} onChange={setStatus} />
        </div>
      </div>

      {/* Price and the SKUs/variants action share one row, per the design. */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="pf-price" className={labelClass}>
            Price
          </label>
          <input
            id="pf-price"
            type="number"
            min="0"
            step="0.01"
            value={priceDefault}
            onChange={(e) => setPriceDefault(e.target.value)}
            placeholder="$0.00"
            className={inputClass}
          />
        </div>
        <div>
          <span className={labelClass}>SKUs / variants</span>
          <Button
            type="button"
            title="Coming soon"
            className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-sm"
          >
            + Manage SKUs
          </Button>
        </div>
      </div>

      <div>
        <label htmlFor="pf-desc" className={labelClass}>
          Description
        </label>
        <textarea
          id="pf-desc"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description…"
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <span className={labelClass}>Images</span>
        <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-brand-cream bg-brand-cream/30 text-sm text-neutral-500">
          Image upload coming soon
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-dashed border-black/40 pt-5">
        <Button
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border-2 border-black bg-white px-6 py-2.5 text-sm disabled:opacity-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
        >
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
