import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 border-l-4 px-6 py-3 text-sm ${
    isActive
      ? 'border-black bg-white font-semibold'
      : 'border-transparent text-neutral-700 hover:bg-white/60'
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-grey">
      <header className="flex items-center justify-between border-b border-black bg-white px-8 py-6">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-[0.2em]">STORE.CO</span>
          <span className="text-sm text-neutral-500">{user.email}</span>
        </div>
        <Button
          onClick={handleLogout}
          className="rounded border-2 border-black px-4 py-2 text-sm"
        >
          Log out
        </Button>
      </header>

      <div className="flex">
        <aside className="w-64 shrink-0 border-r border-black/20 bg-brand-grey">
          <p className="px-6 pb-2 pt-6 text-xs tracking-[0.2em] text-neutral-400">
            NAVIGATION
          </p>
          <nav className="flex flex-col">
            <NavLink to="/admin" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              Orders
            </NavLink>
            {user.role === 'owner' && (
              <NavLink to="/admin/staff" className={navLinkClass}>
                Staff
                {/* <span className="ml-auto rounded border border-brand-blue px-2 py-0.5 text-xs text-brand-blue">
                  Owner
                </span> */}
              </NavLink>
            )}
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
