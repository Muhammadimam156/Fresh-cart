import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { Link, Navigate } from 'react-router-dom';

export function RegisterPage() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const isLoading = status === 'loading';

  if (token) {
    return <Navigate to="/account/profile" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    await dispatch(register(form));
  };

  return (
    <div className="section-shell py-12 lg:py-16">
      <div className="grid overflow-hidden rounded-[2rem] border border-[#dde3d8] bg-white lg:grid-cols-2">

        {/* Image */}
        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80"
            alt="Natural food showcase"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="p-8 lg:p-10">

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
            Join FreshKart
          </p>

          <h1 className="mt-2 text-5xl font-semibold text-brand-900">
            Create Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-3"
          >

            {/* Name */}
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Full name"
              type="text"
              required
              disabled={isLoading}
              className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none focus:border-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Email */}
            <input
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              type="email"
              required
              disabled={isLoading}
              className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none focus:border-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Phone */}
            <input
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
              type="tel"
              disabled={isLoading}
              className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none focus:border-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Password */}
            <input
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="Password"
              type="password"
              required
              minLength={6}
              disabled={isLoading}
              className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none focus:border-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary mt-1 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <p className="text-sm text-[#657462]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-brand-700 hover:text-brand-800"
              >
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}