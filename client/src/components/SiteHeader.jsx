import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setQuery } from '../features/search/searchSlice';
import { getSettings } from '../api/client';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function SiteHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const token = useSelector((state) => state.auth.token);
  const cartCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState('923230000000');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const setting = await getSettings();
        const normalized = String(setting?.whatsappNumber || '').replace(/[^\d]/g, '');
        if (mounted && normalized) {
          setWhatsAppNumber(normalized);
        }
      } catch (_err) {
        // fallback remains active
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e4e4da] bg-white/95 backdrop-blur">
      <div className="section-shell flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-3 font-bold text-brand-900">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d8d2c4] bg-organic-cream text-sm">IK</span>
          <span>
            <span className="block text-lg leading-5">Irfan Kabeer Organic Foods</span>
            <span className="block text-[11px] font-semibold text-[#7b7f72]">Pure Taste • Healthy Life</span>
          </span>
        </Link>

        <form
          className="hidden flex-1 lg:block lg:max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            navigate('/');
          }}
        >
          <label className="sr-only" htmlFor="site-search">Search products</label>
          <div className="flex items-center gap-2 rounded-full border border-[#dde3d8] bg-[#f8f7f2] px-4 py-2">
            <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8.5 15a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="site-search"
              value={query}
              onChange={(event) => dispatch(setQuery(event.target.value))}
              placeholder="Search salt, flour, rice, sugar..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-[#475346] lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition ${isActive ? 'text-brand-800 underline decoration-[#b9862f] decoration-2 underline-offset-8' : 'hover:text-brand-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="hidden rounded-full border border-[#dde3d8] p-2 text-[#4f5e4d] lg:inline-flex"
            aria-label="Search"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8.5 15a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <Link to="/cart" className="rounded-full border border-[#dde3d8] px-3 py-2 text-sm font-bold text-[#3e4a3c]">
            Cart ({cartCount})
          </Link>
          <a
            href={`https://wa.me/923250026250`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-brand-800 px-4 py-2 text-xs font-bold text-white lg:inline-flex"
          >
            Order on WhatsApp
          </a>
          <Link to={token ? '/account/profile' : '/login'} className="hidden rounded-full border border-[#dde3d8] px-3 py-2 text-sm font-bold lg:inline-flex">
            {token ? 'My Account' : 'Login'}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dde3d8] lg:hidden"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#ece8dc] bg-white lg:hidden">
          <div className="section-shell grid gap-2 py-3 text-sm font-semibold text-[#475346]">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-[#f4f2ea]">
                {item.label}
              </NavLink>
            ))}
            <Link to={token ? '/account/profile' : '/login'} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2 hover:bg-[#f4f2ea]">
              {token ? 'My Account' : 'Login'}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}