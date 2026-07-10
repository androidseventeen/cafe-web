import Button from './Button';
import { ReactComponent as ShopBag } from '../assets/blue-shop-bag.svg';

export default function CartButton({ count = 0, onClick }) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onClick}
        aria-label="Open cart"
        className="p-1 hover:opacity-80"
      >
        <ShopBag className="h-7 w-7" />
      </Button>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
        {count}
      </span>
    </div>
  );
}
