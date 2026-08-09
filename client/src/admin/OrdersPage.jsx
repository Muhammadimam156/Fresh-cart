import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../api/client';

const statuses = [
  'Pending',
  'Confirmed',
  'Processing',
  'Delivered',
  'Cancelled',
];

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getAllOrders();

      if (data) {
        setOrders(data);
      }
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
    try {
      setUpdatingId(orderId);

      await updateOrderStatus(orderId, {
        status,
        note: `Status changed to ${status}`,
      });

      await loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-brand-700">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
          <span className="font-semibold">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-4xl font-semibold text-brand-900">
          Order Management
        </h1>

        <p className="mt-2 text-[#637260]">
          Review current orders and update their fulfillment status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="organic-card mt-6 p-8 text-center">
          <p className="text-lg font-semibold text-brand-900">
            No orders found
          </p>

          <p className="mt-2 text-sm text-[#637260]">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-3xl border border-[#dde3d8] bg-white"
            >
              {/* Order Header */}
              <div className="border-b border-[#e7eadf] bg-[#faf9f4] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-brand-900">
                      {order.orderId}
                    </h2>

                    <p className="mt-1 text-sm text-[#637260]">
                      {order.customer?.fullName}
                    </p>

                    <p className="text-sm text-[#637260]">
                      {order.customer?.phone}
                    </p>

                    <p className="mt-2 text-sm text-[#637260]">
                      {order.customer?.address}, {order.customer?.city}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-bold text-brand-900">
                      Rs. {order.grandTotal}
                    </p>

                    <p className="text-sm text-[#637260]">
                      {order.orderItems?.length || 0} item
                      {order.orderItems?.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ordered Products */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-brand-900">
                  Ordered Products
                </h3>

                <div className="mt-4 grid gap-3">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-4 rounded-2xl border border-[#e2e6dc] bg-[#fafaf7] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f0f1e9]">
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

                        {/* Product Info */}
                        <div>
                          <h4 className="font-bold text-brand-900">
                            {item.productName}
                          </h4>

                          <p className="mt-1 text-sm text-[#637260]">
                            Price: Rs. {item.price}
                          </p>

                          <p className="text-sm text-[#637260]">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="sm:text-right">
                        <p className="text-lg font-bold text-brand-900">
                          Rs. {item.subtotal}
                        </p>

                        <p className="text-xs text-[#7a8477]">
                          {item.quantity} × Rs. {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 grid gap-2 border-t border-[#e2e6dc] pt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#637260]">Subtotal</span>
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
                      Delivery Charges
                    </span>

                    <span className="font-semibold">
                      Rs. {order.deliveryCharges}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between border-t border-[#e2e6dc] pt-3 text-lg">
                    <span className="font-bold text-brand-900">
                      Grand Total
                    </span>

                    <span className="font-bold text-brand-900">
                      Rs. {order.grandTotal}
                    </span>
                  </div>
                </div>

                {/* Customer Notes */}
                {order.customer?.notes && (
                  <div className="mt-5 rounded-2xl bg-[#f7f5ed] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7a8477]">
                      Customer Notes
                    </p>

                    <p className="mt-1 text-sm text-[#465343]">
                      {order.customer.notes}
                    </p>
                  </div>
                )}

                {/* Payment + Status */}
                <div className="mt-5 flex flex-col gap-4 border-t border-[#e2e6dc] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-[#637260]">
                      Payment Method
                    </p>

                    <p className="font-semibold text-brand-900">
                      {order.paymentMethod || 'Cash on Delivery'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand-900">
                      Status:
                    </span>

                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                      className="rounded-full border border-[#d7ddce] bg-white px-4 py-2.5 font-semibold text-brand-900 outline-none focus:border-brand-700 disabled:opacity-50"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order._id && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}