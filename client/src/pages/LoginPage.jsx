import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Link, Navigate } from 'react-router-dom';

export function LoginPage() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const isLoading = status === 'loading';

  if (token) {
    return <Navigate to="/account/profile" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    await dispatch(login(form));
  };

  return (
    <div className="section-shell py-12 lg:py-16">
      <div className="grid overflow-hidden rounded-[2rem] border border-[#dde3d8] bg-white lg:grid-cols-2">

        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1615486363973-f79f99d17fd6?auto=format&fit=crop&w=1200&q=80"
            alt="Organic product jars"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-8 lg:p-10">

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
            Welcome Back
          </p>

          <h1 className="mt-2 text-5xl font-semibold text-brand-900">
            Login
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-3"
          >

            <input
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="Email or phone"
              className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none focus:border-brand-700"
              disabled={isLoading}
            />

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
              className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none focus:border-brand-700"
              disabled={isLoading}
            />

            <div className="flex justify-between text-xs text-[#667463]">
              <Link
                to="/forgot-password"
                className="hover:text-brand-700"
              >
                Forgot password?
              </Link>

              <Link
                to="/register"
                className="font-semibold text-brand-700"
              >
                Create account
              </Link>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary mt-1 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}