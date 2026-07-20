import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-grey">
      <header className="border-b border-black bg-white">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <Link to="/" className="text-xl font-bold tracking-[0.2em]">
            STORE.CO
          </Link>
        </div>
      </header>
      <main className="flex items-center justify-center px-4 py-12">
        <Outlet />
      </main>
    </div>
  );
}
