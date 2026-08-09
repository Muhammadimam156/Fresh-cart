import { Link, useLocation } from 'react-router-dom';

export function SuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId ?? 'FC-ORDER';
  const customerName = location.state?.customerName ?? 'Customer';
  const subtotal = location.state?.subtotal;
  const discount = location.state?.discount;
  const grandTotal = location.state?.grandTotal;
  const couponCode = location.state?.couponCode;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Order placed</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Thanks, {customerName}</h1>
        <p className="mt-4 text-slate-600">Your order has been created successfully.</p>
        <div className="mx-auto mt-6 inline-flex rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
          Order ID: {orderId}
        </div>
        {typeof subtotal !== 'undefined' ? (
          <div className="mt-4 text-sm text-slate-600">
            <div>Subtotal: Rs. {subtotal}</div>
            {discount ? <div>Discount{couponCode ? ` (${couponCode})` : ''}: -Rs. {discount}</div> : null}
            <div className="mt-2 font-semibold">Grand Total: Rs. {grandTotal}</div>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft">
            Continue Shopping
          </Link>
          <Link to="/contact" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700">
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
}