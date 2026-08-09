import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="section-shell py-10 lg:py-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} />
      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="organic-card h-fit p-4 text-sm font-semibold text-[#435140]">
          <Link to="/account/profile" className="block rounded-xl bg-brand-700 px-3 py-2 text-white">Profile</Link>
          <Link to="/account/orders" className="mt-2 block rounded-xl px-3 py-2 hover:bg-[#f5f2e8]">My Orders</Link>
          <button onClick={() => dispatch(logout())} className="mt-2 w-full rounded-xl px-3 py-2 text-left text-rose-600 hover:bg-rose-50">Logout</button>
        </aside>

        <section className="organic-card p-7">
          <h1 className="text-5xl font-semibold text-brand-900">My Profile</h1>
          <div className="mt-5 grid gap-3 text-sm text-[#4c5948] sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f8f4ea] p-4"><span className="font-bold">Name:</span> {user?.name}</div>
            <div className="rounded-2xl bg-[#f8f4ea] p-4"><span className="font-bold">Phone:</span> {user?.phone || '-'}</div>
            <div className="rounded-2xl bg-[#f8f4ea] p-4 sm:col-span-2"><span className="font-bold">Email:</span> {user?.email}</div>
          </div>
          <div className="mt-6">
            <button onClick={() => dispatch(logout())} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white">
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
