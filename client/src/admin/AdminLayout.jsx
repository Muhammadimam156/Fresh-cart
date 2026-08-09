import { Outlet, Link, NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Messages', to: '/admin/messages' },
  { label: 'Settings', to: '/admin/settings' },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f3f0e6]">
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
        <aside className="bg-brand-900 p-5 text-brand-50">
          <Link to="/admin" className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-200/30 bg-brand-800 text-sm font-bold">FK</span>
            <span>
              <span className="block text-base font-bold">Admin Panel</span>
              <span className="block text-xs text-brand-100/80">FreshKart</span>
            </span>
          </Link>

          <nav className="grid gap-1 text-sm font-semibold">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 transition ${isActive ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-800'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="p-4 lg:p-7">
          <header className="organic-card mb-5 flex items-center justify-between p-4">
            <h1 className="text-4xl font-semibold text-brand-900">FreshKart Administration</h1>
            <Link to="/" className="rounded-full border border-[#d7ddce] px-4 py-2 text-sm font-bold text-[#3f4d3d]">View Website</Link>
          </header>

          <div className="organic-card p-5">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
