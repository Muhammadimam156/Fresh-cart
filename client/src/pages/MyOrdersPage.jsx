import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/client';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="section-shell py-10 lg:py-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Account', to: '/account/profile' }, { label: 'My Orders' }]} />
      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="organic-card h-fit p-4 text-sm font-semibold text-[#435140]">
          <Link to="/account/profile" className="block rounded-xl px-3 py-2 hover:bg-[#f5f2e8]">Profile</Link>
          <Link to="/account/orders" className="mt-2 block rounded-xl bg-brand-700 px-3 py-2 text-white">My Orders</Link>
        </aside>

        <section className="organic-card p-6">
          <h1 className="text-5xl font-semibold text-brand-900">My Orders</h1>
          <p className="mt-2 text-sm text-[#60705f]">Track the orders you placed with FreshCart.</p>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-600">
              You have not placed any orders yet.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#dce2d6] bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-[#f4f1e7] text-left text-[#4d5b49]">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-[#edf0e8]">
                      <td className="px-4 py-3 font-semibold text-brand-900">{order.orderId}</td>
                      <td className="px-4 py-3 text-[#60705f]">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-[#60705f]">{order.orderItems?.length || 0}</td>
                      <td className="px-4 py-3 font-semibold text-brand-900">Rs. {order.grandTotal}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
