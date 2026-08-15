import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../api/client';

export function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const data = await getAdminDashboard();

      setDashboard(data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);

      setError(
        err?.response?.data?.message ||
          'Unable to load dashboard data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="min-h-[500px]">
        <div className="flex min-h-[450px] flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />

          <p className="mt-5 animate-pulse text-sm font-semibold text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
          !
        </div>

        <h2 className="mt-4 text-2xl font-bold text-red-800">
          Dashboard Error
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadDashboard()}
          className="group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-800 hover:shadow-lg active:scale-95"
        >
          <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />

          <span className="relative z-10">
            Try Again
          </span>

          <span className="relative z-10 transition-transform duration-300 group-hover:rotate-180">
            ↻
          </span>
        </button>
      </div>
    );
  }

  /*
    Backend response ko flexible rakha gaya hai.
    Agar dashboard object ke andar summary ho ya direct values
    hon, dono situations handle ho jayengi.
  */

  const summary = dashboard?.summary || dashboard || {};

  const stats = [
    {
      title: 'Total Products',
      value:
        summary.totalProducts ??
        summary.productsCount ??
        dashboard?.products?.length ??
        0,
      icon: '📦',
      link: '/admin/products',
      description: 'Products in store',
    },
    {
      title: 'Categories',
      value:
        summary.totalCategories ??
        summary.categoriesCount ??
        dashboard?.categories?.length ??
        0,
      icon: '🗂️',
      link: '/admin/categories',
      description: 'Active categories',
    },
    {
      title: 'Total Orders',
      value:
        summary.totalOrders ??
        summary.ordersCount ??
        dashboard?.orders?.length ??
        0,
      icon: '🛒',
      link: '/admin/orders',
      description: 'All customer orders',
    },
    {
      title: 'Customers',
      value:
        summary.totalCustomers ??
        summary.customersCount ??
        0,
      icon: '👥',
      link: '/admin/customers',
      description: 'Registered customers',
    },
    {
      title: 'Pending Orders',
      value:
        summary.pendingOrders ??
        summary.pending ??
        0,
      icon: '⏳',
      link: '/admin/orders',
      description: 'Waiting for action',
    },
    {
      title: 'Delivered',
      value:
        summary.deliveredOrders ??
        summary.delivered ??
        0,
      icon: '✅',
      link: '/admin/orders',
      description: 'Successfully delivered',
    },
    {
      title: 'Total Sales',
      value: `Rs. ${Number(
        summary.totalSales ??
          summary.totalRevenue ??
          0
      ).toLocaleString()}`,
      icon: '💰',
      link: '/admin/orders',
      description: 'Total order revenue',
    },
    {
      title: 'Messages',
      value:
        summary.totalMessages ??
        summary.messagesCount ??
        0,
      icon: '💬',
      link: '/admin/messages',
      description: 'Customer messages',
    },
  ];

  const recentOrders =
    dashboard?.recentOrders ||
    dashboard?.orders ||
    [];

  const recentProducts =
    dashboard?.recentProducts ||
    dashboard?.products ||
    [];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
            FreshKart Administration
          </p>

          <h1 className="mt-1 text-4xl font-semibold text-brand-900 lg:text-5xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#637260]">
            Manage your store and monitor your business from one place.
          </p>
        </div>

        <button
          type="button"
          disabled={refreshing}
          onClick={() => loadDashboard(true)}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#d7ddce] bg-white px-5 py-3 text-sm font-bold text-brand-900 transition-all duration-300 hover:-translate-y-1 hover:border-brand-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
              Refreshing...
            </>
          ) : (
            <>
              <span className="transition-transform duration-500 group-hover:rotate-180">
                ↻
              </span>
              Refresh Dashboard
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="group animate-[slideUp_0.5s_ease-out_both]"
            style={{
              animationDelay: `${index * 70}ms`,
            }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-[#dde3d8] bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f4f1e7] transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f1e7] text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {stat.icon}
                  </div>

                  <span className="text-lg text-slate-300 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <p className="mt-5 text-sm font-semibold text-[#637260]">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold text-brand-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9862f]">
            Quick Actions
          </p>

          <h2 className="mt-1 text-3xl font-semibold text-brand-900">
            Manage Store
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            to="/admin/products"
            icon="＋"
            title="Add Product"
            description="Create a new product"
          />

          <QuickAction
            to="/admin/categories"
            icon="＋"
            title="Add Category"
            description="Create a new category"
          />

          <QuickAction
            to="/admin/orders"
            icon="🛒"
            title="View Orders"
            description="Manage customer orders"
          />

          <QuickAction
            to="/admin/customers"
            icon="👥"
            title="Customers"
            description="View your customers"
          />
        </div>
      </section>

      {/* Recent Orders + Products */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <section className="overflow-hidden rounded-3xl border border-[#dde3d8] bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-[#edf0e9] p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9862f]">
                Orders
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-brand-900">
                Recent Orders
              </h2>
            </div>

            <Link
              to="/admin/orders"
              className="group rounded-full px-4 py-2 text-xs font-bold text-brand-700 transition-all duration-300 hover:bg-brand-50 active:scale-95"
            >
              View All
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div className="divide-y divide-[#edf0e9]">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No recent orders available.
              </div>
            ) : (
              recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id || order.id || order.orderId}
                  className="group flex items-center justify-between gap-4 p-4 transition-colors duration-200 hover:bg-[#fafbf7]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-brand-900">
                      {order.orderId || `Order #${order._id}`}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {order.customer?.fullName ||
                        order.customerUser?.name ||
                        'Customer'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-900">
                      Rs. {Number(
                        order.grandTotal || 0
                      ).toLocaleString()}
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Products */}
        <section className="overflow-hidden rounded-3xl border border-[#dde3d8] bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-[#edf0e9] p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9862f]">
                Inventory
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-brand-900">
                Recent Products
              </h2>
            </div>

            <Link
              to="/admin/products"
              className="group rounded-full px-4 py-2 text-xs font-bold text-brand-700 transition-all duration-300 hover:bg-brand-50 active:scale-95"
            >
              View All
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div className="divide-y divide-[#edf0e9]">
            {recentProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No products available.
              </div>
            ) : (
              recentProducts.slice(0, 5).map((product) => {
                const image =
                  product.image ||
                  product.images?.[0];

                return (
                  <div
                    key={product._id || product.id || product.slug}
                    className="group flex items-center gap-4 p-4 transition-colors duration-200 hover:bg-[#fafbf7]"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f5f5ef]">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg">
                          📦
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-brand-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {product.category?.name ||
                          product.category ||
                          'Product'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-900">
                        Rs. {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </p>

                      <p
                        className={`mt-1 text-[10px] font-bold ${
                          product.stock > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}


/* --------------------------------
   Quick Action Component
-------------------------------- */

function QuickAction({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-3xl border border-[#dde3d8] bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#f5f7ef] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-xl font-bold text-brand-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-brand-900">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <span className="ml-auto text-lg text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-700">
          →
        </span>
      </div>
    </Link>
  );
}