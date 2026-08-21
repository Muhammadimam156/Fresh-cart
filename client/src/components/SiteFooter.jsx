import { Link } from 'react-router-dom';

export function SiteFooter() {
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
          <form className="mt-4 flex gap-2">
            <input className="w-full rounded-full border border-brand-200/30 bg-brand-800 px-4 py-2 text-xs text-white outline-none" placeholder="Your email" />
            <button type="button" className="rounded-full bg-[#b9862f] px-4 py-2 text-xs font-bold text-white">Subscribe</button>
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