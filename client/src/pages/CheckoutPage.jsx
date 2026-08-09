import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../features/cart/cartSlice';
import { createOrder, validateCoupon } from '../api/client';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const authUser = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '', city: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponInfo, setCouponInfo] = useState(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = items.length ? 150 : 0;
    const discount = couponInfo ? (couponInfo.coupon.type === 'percent' ? Math.round((subtotal * couponInfo.coupon.amount) / 100) : Number(couponInfo.coupon.amount)) : 0;
    const grandTotal = Math.max(0, subtotal - discount + delivery);
    return { subtotal, delivery, discount, grandTotal };
  }, [items, couponInfo]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!items.length) {
      setError('Your cart is empty. Add items before checking out.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const order = await createOrder({
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          notes: form.notes,
        },
        customerUser: authUser?._id,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        couponCode: couponInfo?.coupon?.code,
      });

      dispatch(clearCart());
      navigate('/order-success', {
        state: {
          orderId: order.orderId,
          customerName: form.fullName,
          subtotal: totals.subtotal,
          discount: totals.discount,
          grandTotal: totals.grandTotal,
          couponCode: couponInfo?.coupon?.code,
        },
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckCoupon() {
    if (!coupon) return;
    setCheckingCoupon(true);
    setError('');
    try {
      const res = await validateCoupon(coupon);
      if (res.valid) {
        setCouponInfo(res);
      } else {
        setCouponInfo(null);
        setError(res.message || 'Invalid coupon');
      }
    } catch (err) {
      setError('Failed to validate coupon');
    } finally {
      setCheckingCoupon(false);
    }
  }

  return (
    <div className="section-shell py-10 lg:py-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <form
          className="organic-card p-6"
          onSubmit={handleSubmit}
        >
          <h1 className="text-5xl font-semibold text-brand-900">Checkout</h1>
          {error ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['fullName', 'Full Name'],
              ['phone', 'Phone Number'],
              ['email', 'Email (Optional)'],
              ['city', 'City'],
            ].map(([name, label]) => (
              <label key={name} className="grid gap-2 text-sm font-medium text-slate-700">
                {label}
                <input
                  value={form[name]}
                  onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                  className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none"
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
              Address
              <textarea
                rows="4"
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
              Order Notes
              <textarea
                rows="4"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
              Coupon Code (optional)
              <div className="flex items-center gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCheckCoupon}
                  disabled={checkingCoupon}
                  className="rounded-full bg-brand-100 px-4 py-2 text-sm font-bold text-brand-700 disabled:opacity-60"
                >
                  {checkingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
              {couponInfo ? <p className="mt-2 text-sm text-green-700">Applied: {couponInfo.coupon.code} - {couponInfo.coupon.type === 'percent' ? `${couponInfo.coupon.amount}% off` : `Rs. ${couponInfo.coupon.amount}`}</p> : null}
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <aside className="organic-card h-fit p-6">
          <h2 className="text-4xl font-semibold text-brand-900">Your Order</h2>
          <p className="mt-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">Cash on Delivery</p>
          <div className="mt-6 space-y-3 text-sm text-[#60705f]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>Rs. {totals.subtotal}</span>
            </div>
            {totals.discount ? (
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span>-Rs. {totals.discount}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <span>Delivery Charges</span>
              <span>Rs. {totals.delivery}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#dde3d8] pt-4 text-base font-bold text-brand-900">
              <span>Grand Total</span>
              <span>Rs. {totals.grandTotal}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}