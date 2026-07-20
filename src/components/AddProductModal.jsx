import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { cafeApi } from '../services/api-client';

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

// Derive a unique-enough SKU code from the product name for the default SKU.
function skuCodeFor(name) {
  const slug = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20);
  return `${slug || 'SKU'}-${Date.now().toString(36).toUpperCase()}`;
}

export default function AddProductModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('physical');
  const [status, setStatus] = useState('active');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('A product name is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { data } = await cafeApi.createProduct({
        name: name.trim(),
        type,
        status,
        description: description.trim(),
        images: [],
      });
      const product = data.data.product;

      // The product carries no price of its own — price lives on SKUs. Persist
      // the entered price as a default SKU so the grid can display it. Skipped
      // when no positive price was entered (manage variants later via SKUs).
      const parsedPrice = Number(price);
      if (Number.isFinite(parsedPrice) && parsedPrice > 0) {
        await cafeApi.createSkus(product._id, [
          { sku: skuCodeFor(name), price: parsedPrice, stock: 0 },
        ]);
      }

      onCreated();
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          'Could not save the product. Please try again.'
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add product"
      onClose={submitting ? () => {} : onClose}
      footer={
        <>
          <Button
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border-2 border-black bg-white px-6 py-2.5 text-sm disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-product-form"
            disabled={submitting}
            className="rounded-md bg-black px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save product'}
          </Button>
        </>
      }
    >
      <form id="add-product-form" onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded border-2 border-red-500 bg-white px-4 py-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div>
          <label htmlFor="ap-name" className={labelClass}>
            Product name
          </label>
          <input
            id="ap-name"
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
            <label htmlFor="ap-price" className={labelClass}>
              Price
            </label>
            <input
              id="ap-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
          <label htmlFor="ap-desc" className={labelClass}>
            Description
          </label>
          <textarea
            id="ap-desc"
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
      </form>
    </Modal>
  );
}
