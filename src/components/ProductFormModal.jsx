import { useState } from 'react';
import Modal from './Modal';
import ProductForm from './ProductForm';
import { cafeApi } from '../services/api-client';

// Blank for add; seeded from the product for edit. Price maps to the product's
// `priceDefault` (no SKU juggling — see the "Price now lives on the product"
// note in the plan).
function deriveInitialValues(product) {
  if (!product) {
    return { name: '', type: 'physical', status: 'active', priceDefault: '', description: '' };
  }
  return {
    name: product.name ?? '',
    type: product.type ?? 'physical',
    // An archived product keeps its status unless the user toggles it — the
    // toggle only offers active/draft, so leaving it untouched preserves archived.
    status: product.status ?? 'active',
    priceDefault: product.priceDefault,
    description: product.description ?? '',
  };
}

// Thin container: wraps ProductForm in the portal Modal and branches the submit
// between create (POST) and update (PATCH) based on whether a `product` is given.
export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');
    try {
      if (isEdit) {
        await cafeApi.updateProduct(product._id, values);
      } else {
        await cafeApi.createProduct({ ...values, images: [] });
      }
      onSaved();
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
      title={isEdit ? 'Edit product' : 'Add product'}
      onClose={submitting ? () => {} : onClose}
    >
      <ProductForm
        initialValues={deriveInitialValues(product)}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitting={submitting}
        error={error}
        submitLabel="Save product"
      />
    </Modal>
  );
}
