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

// One row per option group: "Name: v1, v2" on the left with a small input to add
// the next value, and a ➕ on the right. Holds its own draft so each group's
// input is independent. Maps to optionValueSchema ({ label }) on add.
function OptionGroupRow({ group, onAddValue }) {
  const [optionDraft, setOptionDraft] = useState('');

  const add = () => {
    if (!optionDraft.trim()) return;
    onAddValue(optionDraft);
    setOptionDraft('');
  };

  const valuesText = group.values.map((v) => v.label).join(', ');

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2">
        <span className="text-xs text-neutral-700">
          {group.name}
          {valuesText && `: ${valuesText}`}
        </span>
        
      </span>
      <span>
        <input
          value={optionDraft}
          onChange={(e) => setOptionDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // don't submit the whole product form
              add();
            }
          }}
          placeholder="option"
          className="w-[120px] rounded border-2 border-black mx-3 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <Button
          type="button"
          onClick={add}
          disabled={!optionDraft.trim()}
          title="Add option"
          className="rounded-[1rem] border border-black bg-white px-3 py-2 text-sm disabled:opacity-50"
        >
          ➕
        </Button>
      </span>
    </div>
  );
}

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
  // Draft name for a new variant group; committed to `optionGroups` on "Add
  // group name". `optionGroups` is seeded from initialValues so editing a
  // product preserves (and can extend) its existing groups.
  const [variantGroup, setVariantGroup] = useState('');
  const [optionGroups, setOptionGroups] = useState(
    () => initialValues?.optionGroups ?? []
  );
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
      optionGroups,
    });
  };

  // Commit the draft group name as a new, empty option group (maps to
  // optionGroupSchema { name, values }).
  const handleAddGroup = () => {
    const groupName = variantGroup.trim();
    if (!groupName) return;
    setOptionGroups((groups) => [...groups, { name: groupName, values: [] }]);
    setVariantGroup('');
  };

  // Append a value (label) to the group at `groupIndex`.
  const handleAddValue = (groupIndex, label) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setOptionGroups((groups) =>
      groups.map((g, i) =>
        i === groupIndex ? { ...g, values: [...g.values, { label: trimmed }] } : g
      )
    );
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

      {/* Variant Option Groups — step 1: name-a-group row only (inert button,
          not submitted). Rendering/editing existing groups comes later. */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="pf-variant-group" className={labelClass}>
            Variant group
          </label>
          <input
            id="pf-variant-group"
            value={variantGroup}
            onChange={(e) => setVariantGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // don't submit the whole product form
                handleAddGroup();
              }
            }}
            placeholder="e.g. Size"
            className={inputClass}
          />
        </div>
        <div>
          <span className={labelClass}>&nbsp;</span>
          <Button
            type="button"
            onClick={handleAddGroup}
            disabled={!variantGroup.trim()}
            className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-sm disabled:opacity-50"
          >
            + Add group name
          </Button>
        </div>
      </div>

      {/* Option-value rows — one per group; add values with the ➕ button. */}
      {optionGroups.length > 0 && (
        <div className="space-y-2">
          {optionGroups.map((group, i) => (
            <OptionGroupRow
              key={i}
              group={group}
              onAddValue={(label) => handleAddValue(i, label)}
            />
          ))}
        </div>
      )}

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
