import { useState } from 'react';
import { Link } from 'react-router-dom';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event) {
    event.preventDefault();

    if (!email.trim()) return;

    alert("Thanks for subscribing! We'll keep you updated. 🌿");

    setEmail('');
    setSubscribed(true);

    setTimeout(() => {
      setSubscribed(false);
    }, 10000);
  }

  return (
    <footer className="mt-16 bg-brand-900 text-brand-50">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <div className="flex items-center gap-3 font-bold text-white">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-200/30 bg-brand-800 text-sm">FK</span>
            <span>
              <span className="block text-lg">Irfan Kabeer Organic Foods</span>
              <span className="block text-xs font-medium text-brand-100/80">Pure Taste • Healthy Life</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-brand-100/85">
            Premium grocery essentials sourced with care for households across Pakistan.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-brand-200">
            <span className="rounded-full border border-brand-100/30 px-3 py-1">Natural products</span>
            <span className="rounded-full border border-brand-100/30 px-3 py-1">Trusted quality</span>
          </div>
        </div>

        <div className="text-sm text-brand-100/85">
          <h2 className="text-base font-bold text-white">Quick Links</h2>
          <div className="mt-4 grid gap-2">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/account/orders">Track Order</Link>
          </div>
        </div>

        <div className="text-sm text-brand-100/85">
          <h2 className="text-base font-bold text-white">Customer Service</h2>
          <div className="mt-4 grid gap-2">
            <span>Shipping & Delivery</span>
            <span>Returns & Refund Policy</span>
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
            <span>FAQ</span>
          </div>
        </div>

        <div className="text-sm text-brand-100/85">
          <h2 className="text-base font-bold text-white">Contact Us</h2>
          <div className="mt-4 grid gap-2">
            <span>WhatsApp: 92 325 0026250</span>
            <span>Phone: 92 312 889186</span>
            <span>Email: ikorganicfoods09@gmail.com</span>
            <span>Address: Karachi, Pakistan</span>
          </div>

          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribed}
              className="w-full rounded-full border border-brand-200/30 bg-brand-800 px-4 py-2 text-xs text-white outline-none placeholder:text-brand-100/50 disabled:opacity-50"
              placeholder="Your email"
            />

            <button
              type="submit"
              disabled={subscribed}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold text-white transition-all duration-300 active:scale-95 ${
                subscribing 
                  ? 'cursor-not-allowed bg-green-700'
                  : 'bg-[#b9862f] hover:bg-[#a2762c]'
              }`}
            >
              {subscribed ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Subscribed
                </span>
              ) : (
                'Subscribed'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-brand-800/70">
        <div className="section-shell flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-brand-100/80">
          <span>© {new Date().getFullYear()} Irfan Kabeer Organic Foods. All rights reserved.</span>
          <span>Cash on Delivery • Secure Ordering • Pakistan Delivery</span>
        </div>
      </div>
    </footer>
  );
}
