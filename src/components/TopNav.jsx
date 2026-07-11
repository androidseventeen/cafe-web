import { NavLink } from 'react-router-dom';
import CartButton from './CartButton';

const linkClass = ({ isActive }) =>
  `text-sm tracking-[0.2em] ${isActive ? 'text-brand-navy font-semibold' : 'text-black'} hover:text-brand-navy`;

export default function TopNav({ cartCount = 0, onCartClick }) {
  return (
    <header className="border-b border-black/20 bg-brand-grey">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <NavLink to="/" className="text-xl font-bold tracking-[0.2em]">
          STORE.CO
        </NavLink>

        <nav className="flex items-center gap-10">
          <NavLink to="/" end className={linkClass}>HOME</NavLink>
          <NavLink to="/shop" className={linkClass}>SHOP</NavLink>
          <NavLink to="/about" className={linkClass}>ABOUT</NavLink>
          <NavLink to="/blog" className={linkClass}>BLOG</NavLink>
        </nav>

        <CartButton count={cartCount} onClick={onCartClick} />
      </div>
    </header>
  );
}
