import { useState } from 'react';
import { createContactMessage } from '../api/client';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setStatus('submitting');
      await createContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (_err) {
      setStatus('error');
    }
  }

  return (
    <div className="section-shell py-10 lg:py-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="organic-card p-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">Contact</p>
          <h1 className="mt-2 text-5xl font-semibold text-brand-900">Get in touch</h1>
          <p className="mt-3 text-[#60705f]">We are here to help with product inquiries, bulk orders, and support.</p>
          <div className="mt-6 grid gap-3 text-sm text-[#4a5847]">
            <div className="rounded-2xl bg-[#f8f4ea] p-4">WhatsApp:0312 889186</div>
            <div className="rounded-2xl bg-[#f8f4ea] p-4">Phone: 0312 889186</div>
            <div className="rounded-2xl bg-[#f8f4ea] p-4">Email: ikorganicfoods09@gmail.com</div>
            <div className="rounded-2xl bg-[#f8f4ea] p-4">Address: rawalpindi, Pakistan</div>
          </div>
        </section>

        <section className="organic-card p-7">
          <h2 className="text-4xl font-semibold text-brand-900">Send Message</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#4a5847]">
              Name
              <input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#4a5847]">
              Phone
              <input value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#4a5847] sm:col-span-2">
              Email
              <input value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#4a5847] sm:col-span-2">
              Message
              <textarea rows="5" value={form.message} onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))} className="rounded-2xl border border-[#dbe1d4] bg-[#f9f7ef] px-4 py-3 outline-none" />
            </label>
            <button className="btn-primary sm:col-span-2" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' ? <p className="text-sm font-semibold text-brand-700 sm:col-span-2">Message sent successfully.</p> : null}
            {status === 'error' ? <p className="text-sm font-semibold text-rose-600 sm:col-span-2">Could not send message. Try again.</p> : null}
          </form>
        </section>
      </div>
    </div>
  );
}