import { useState } from 'react';
import Modal from './Modal';
import ProductForm from './ProductForm';
import { cafeApi } from '../services/api-client';

// Blank for add; seeded from the product for edit. Price maps to the product's
// `priceDefault` (no SKU juggling — see the "Price now lives on the product"
// note in the plan).
function deriveInitialValues(product) {
  if (!product) {
    return {
      name: '',
      type: 'physical',
      status: 'active',
      priceDefault: '',
      description: '',
      optionGroups: [],
      skus: [],
    };
  }
  return {
    name: product.name ?? '',
    type: product.type ?? 'physical',
    // An archived product keeps its status unless the user toggles it — the
    // toggle only offers active/draft, so leaving it untouched preserves archived.
    status: product.status ?? 'active',
    priceDefault: product.priceDefault,
    description: product.description ?? '',
    // Seed existing groups so an edit extends rather than wipes them.
    optionGroups: product.optionGroups ?? [],
    // Seed existing SKUs so "Manage SKUs" prefills instead of starting blank.
    skus: product.skus ?? [],
  };
}

// Thin container: wraps ProductForm in the portal Modal and branches the submit
// between create (POST) and update (PATCH) based on whether a `product` is given.
export default function ProductFormModal({ product, onClose, onSaved }) { console.log(product)
  const wasEditOnOpen = Boolean(product); // drives title/copy only, never changes
  // Becomes the created product once the product-create step succeeds, so a
  // retry after a failed SKU batch call updates it instead of creating a
  // second product — the product-create and sku-create calls aren't wrapped
  // in a backend transaction.
  const [savedProduct, setSavedProduct] = useState(product);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');
    const { skus, ...productFields } = values;
    try {
      let current = savedProduct;
      if (current) {
        const { data } = await cafeApi.updateProduct(current._id, productFields);
        current = data.data.product;
      } else {
        const { data } = await cafeApi.createProduct({ ...productFields, images: [] });
        current = data.data.product;
        setSavedProduct(current);
      }
      if (skus?.create?.length) {
        await cafeApi.createSkus(current._id, skus.create);
      }
      if (skus?.update?.length) {
        await cafeApi.updateSkus(skus.update);
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
      title={wasEditOnOpen ? 'Edit product' : 'Add product'}
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
