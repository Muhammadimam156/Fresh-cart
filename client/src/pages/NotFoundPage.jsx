import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">404</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft">
        Back to home
      </Link>
    </div>
  );
}