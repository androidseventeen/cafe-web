import { Outlet } from 'react-router-dom';
import TopNav from '../components/TopNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-brand-grey">
      <TopNav cartCount={0} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
