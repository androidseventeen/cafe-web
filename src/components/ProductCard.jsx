function TypeBadge({ type }) {
  const styles =
    type === 'Digital'
      ? 'border-purple-500 text-purple-500'
      : 'border-brand-sky text-brand-sky';
  return (
    <span className={`rounded border px-2 py-1 text-xs ${styles}`}>{type}</span>
  );
}

export default function ProductCard({
  name,
  subtext,
  price,
  originalPrice,
  type,
  placeholderLabel,
  saveLabel,
}) {
  const isOnSale = Boolean(originalPrice);

  return (
    <article className="overflow-hidden rounded-md border-2 border-black bg-white">
      <div className="relative flex h-64 items-center justify-center border-b-2 border-dashed border-black/40 bg-brand-cream">
        {saveLabel && (
          <span className="absolute left-3 top-3 rounded border-2 border-black bg-red-500 px-2 py-1 text-xs font-medium text-white">
            {saveLabel}
          </span>
        )}
        <span className="text-neutral-500">{placeholderLabel}</span>
      </div>

      <div className="space-y-2 px-5 py-4">
        <h3 className="font-bold">{name}</h3>
        {subtext && (
          <p className="text-sm italic text-neutral-500">{subtext}</p>
        )}

        <div className="flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-lg font-bold ${isOnSale ? 'text-red-600' : ''}`}
            >
              ${price}
            </span>
            {originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          {type && <TypeBadge type={type} />}
        </div>
      </div>
    </article>
  );
}
