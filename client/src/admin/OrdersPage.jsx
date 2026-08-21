import { useEffect, useMemo, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../api/client';

const statuses = [
  'Pending',
  'Confirmed',
  'Processing',
  'Delivered',
  'Cancelled',
];

const filters = ['All', 'Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Processing: 'bg-purple-50 text-purple-700 border-purple-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getAllOrders();

      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId, status) {
    const order = orders.find((item) => item._id === orderId);

    if (!order) return;

    const actionText =
      status === 'Delivered'
        ? 'mark this order as Delivered'
        : status === 'Cancelled'
          ? 'cancel this order'
          : `change the order status to ${status}`;

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText}?\n\nOrder: ${order.orderId}`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(orderId);

      await updateOrderStatus(orderId, {
        status,
        note: `Status changed to ${status} by admin`,
      });

      // Update UI immediately
      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item._id === orderId
            ? {
                ...item,
                status,
                statusHistory: [
                  ...(item.statusHistory || []),
                  {
                    status,
                    note: `Status changed to ${status} by admin`,
                    changedAt: new Date().toISOString(),
                  },
                ],
              }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to update order status'
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    if (filter === 'All') {
      return orders;
    }

    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'Pending').length,
    confirmed: orders.filter((o) => o.status === 'Confirmed').length,
    processing: orders.filter((o) => o.status === 'Processing').length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  };

  function formatDate(date) {
    if (!date) return '';

    return new Date(date).toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />

          <p className="mt-4 font-semibold text-brand-900">
            Loading orders...
          </p>

          <p className="mt-1 text-sm text-[#637260]">
            Please wait while we load customer orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-brand-900">
            Order Management
          </h1>

          <p className="mt-2 text-[#637260]">
            Manage customer orders, products, delivery and payment details.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="rounded-full border border-[#d7ddce] bg-white px-5 py-3 text-sm font-bold text-brand-900 transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          ↻ Refresh Orders
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <StatCard
          title="Total"
          value={orderStats.total}
          onClick={() => setFilter('All')}
        />

        <StatCard
          title="Pending"
          value={orderStats.pending}
          onClick={() => setFilter('Pending')}
        />

        <StatCard
          title="Confirmed"
          value={orderStats.confirmed}
          onClick={() => setFilter('Confirmed')}
        />

        <StatCard
          title="Processing"
          value={orderStats.processing}
          onClick={() => setFilter('Processing')}
        />

        <StatCard
          title="Delivered"
          value={orderStats.delivered}
          onClick={() => setFilter('Delivered')}
        />

        <StatCard
          title="Cancelled"
          value={orderStats.cancelled}
          onClick={() => setFilter('Cancelled')}
        />

      </div>

      {/* Filter */}
      <div className="organic-card p-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                filter === item
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'border border-[#d7ddce] bg-white text-[#52604f] hover:-translate-y-0.5 hover:bg-[#f5f7f1]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="organic-card p-12 text-center">
          <div className="text-5xl">📦</div>

          <h2 className="mt-4 text-2xl font-bold text-brand-900">
            No orders found
          </h2>

          <p className="mt-2 text-[#637260]">
            There are no orders in the "{filter}" category.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            const isUpdating = updatingId === order._id;

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-[#dde3d8] bg-white shadow-sm transition duration-300 hover:shadow-lg"
              >

                {/* Order Top */}
                <div className="border-b border-[#e7eadf] bg-[#faf9f4] p-5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-xl text-white">
                        🛒
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold text-brand-900">
                            {order.orderId}
                          </h2>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${
                              statusStyles[order.status] ||
                              'bg-slate-50 text-slate-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[#637260]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                    </div>

                    <div className="text-left xl:text-right">
                      <p className="text-2xl font-bold text-brand-900">
                        Rs. {order.grandTotal}
                      </p>

                      <p className="text-sm text-[#637260]">
                        {order.orderItems?.length || 0}{' '}
                        product
                        {order.orderItems?.length === 1 ? '' : 's'}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Customer + Order summary */}
                <div className="grid gap-5 p-5 lg:grid-cols-3">

                  {/* Customer */}
                  <div className="rounded-2xl bg-[#f8f7f1] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8a9186]">
                      Customer
                    </p>

                    <p className="mt-2 font-bold text-brand-900">
                      {order.customer?.fullName}
                    </p>

                    <p className="mt-1 text-sm text-[#637260]">
                      📞 {order.customer?.phone}
                    </p>

                    {order.customer?.email && (
                      <p className="mt-1 break-all text-sm text-[#637260]">
                        ✉ {order.customer.email}
                      </p>
                    )}
                  </div>

                  {/* Delivery */}
                  <div className="rounded-2xl bg-[#f8f7f1] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8a9186]">
                      Delivery Address
                    </p>

                    <p className="mt-2 text-sm font-semibold text-brand-900">
                      {order.customer?.address}
                    </p>

                    <p className="mt-1 text-sm text-[#637260]">
                      {order.customer?.city}
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="rounded-2xl bg-[#f8f7f1] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8a9186]">
                      Payment
                    </p>

                    <p className="mt-2 font-bold text-brand-900">
                      {order.paymentMethod || 'Cash on Delivery'}
                    </p>

                    <p className="mt-1 text-sm text-[#637260]">
                      Total: Rs. {order.grandTotal}
                    </p>
                  </div>

                </div>

                {/* Products Preview */}
                <div className="border-t border-[#e7eadf] px-5 py-5">

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-brand-900">
                        Customer Ordered
                      </h3>

                      <p className="text-sm text-[#637260]">
                        {order.orderItems?.length || 0} different product
                        {order.orderItems?.length === 1 ? '' : 's'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrder(
                          isExpanded ? null : order._id
                        )
                      }
                      className="rounded-full border border-[#d7ddce] px-4 py-2 text-sm font-bold text-brand-900 transition hover:-translate-y-0.5 hover:bg-[#f6f7f1] active:scale-95"
                    >
                      {isExpanded ? 'Hide Details ↑' : 'View Items ↓'}
                    </button>
                  </div>

                  {/* Always show first products */}
                  <div className="mt-4 grid gap-3">
                    {order.orderItems
                      ?.slice(0, isExpanded ? order.orderItems.length : 2)
                      .map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 rounded-2xl border border-[#e2e6dc] bg-[#fafaf7] p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
                        >

                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f0f1e9]">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#7a8477]">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-brand-900">
                              {item.productName}
                            </p>

                            {item.variantLabel && (
                              <p className="mt-1 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                                ⚖ {item.variantLabel}
                              </p>
                            )}

                            <p className="mt-1 text-sm text-[#637260]">
                              Rs. {item.price} × {item.quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-brand-900">
                              Rs. {item.subtotal}
                            </p>

                            <p className="text-xs text-[#7a8477]">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                        </div>
                      ))}
                  </div>

                  {!isExpanded && order.orderItems?.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setExpandedOrder(order._id)}
                      className="mt-3 text-sm font-bold text-brand-700 hover:underline"
                    >
                      + {order.orderItems.length - 2} more products
                    </button>
                  )}

                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#e7eadf] bg-[#faf9f4] p-5">

                    <div className="grid gap-6 lg:grid-cols-2">

                      {/* Order summary */}
                      <div>
                        <h3 className="font-bold text-brand-900">
                          Order Summary
                        </h3>

                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#637260]">
                              Subtotal
                            </span>

                            <span className="font-semibold">
                              Rs. {order.subtotal}
                            </span>
                          </div>

                          {order.discountAmount > 0 && (
                            <div className="flex justify-between text-green-700">
                              <span>
                                Discount
                                {order.couponCode
                                  ? ` (${order.couponCode})`
                                  : ''}
                              </span>

                              <span className="font-semibold">
                                - Rs. {order.discountAmount}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span className="text-[#637260]">
                              Delivery
                            </span>

                            <span className="font-semibold">
                              Rs. {order.deliveryCharges}
                            </span>
                          </div>

                          <div className="flex justify-between border-t border-[#dfe3d9] pt-3 text-lg">
                            <span className="font-bold text-brand-900">
                              Grand Total
                            </span>

                            <span className="font-bold text-brand-900">
                              Rs. {order.grandTotal}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <h3 className="font-bold text-brand-900">
                          Customer Notes
                        </h3>

                        <div className="mt-3 rounded-2xl bg-white p-4">
                          {order.customer?.notes ? (
                            <p className="text-sm text-[#52604f]">
                              {order.customer.notes}
                            </p>
                          ) : (
                            <p className="text-sm text-[#8a9186]">
                              No special notes from customer.
                            </p>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Status history */}
                    {order.statusHistory?.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-bold text-brand-900">
                          Order Timeline
                        </h3>

                        <div className="mt-3 space-y-2">
                          {order.statusHistory.map((history, index) => (
                            <div
                              key={`${history.changedAt}-${index}`}
                              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3"
                            >
                              <div className="h-2.5 w-2.5 rounded-full bg-brand-700" />

                              <div className="flex-1">
                                <p className="text-sm font-bold text-brand-900">
                                  {history.status}
                                </p>

                                {history.note && (
                                  <p className="text-xs text-[#637260]">
                                    {history.note}
                                  </p>
                                )}
                              </div>

                              <span className="text-xs text-[#7a8477]">
                                {formatDate(history.changedAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* Status Controls */}
                <div className="border-t border-[#e7eadf] bg-white p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#8a9186]">
                        Update Order Status
                      </p>

                      <p className="mt-1 text-sm text-[#637260]">
                        Changing the status keeps the order in your database.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <select
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className="rounded-full border border-[#d7ddce] bg-white px-5 py-3 font-bold text-brand-900 outline-none transition focus:border-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
                      )}

                    </div>

                  </div>
                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}


/* Statistics Card */
function StatCard({ title, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="organic-card group p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[#8a9186]">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-brand-900 transition group-hover:scale-105">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-brand-700">
        View orders →
      </p>
    </button>
  );
}