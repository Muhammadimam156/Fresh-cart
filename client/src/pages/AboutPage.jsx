import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';

const trustPoints = ['Authentic Taste', 'Premium Quality', 'Customer Trust'];

export function AboutPage() {
  return (
    <div>
      <section className="border-b border-[#e8e5d8] bg-[#f8f4ea]">
        <div className="section-shell grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">About Us</p>
            <h1 className="mt-3 text-5xl font-semibold text-brand-900">Rooted in Quality, Crafted for Daily Living</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f6d5d]">
              FreshKart brings naturally sourced grocery essentials with strict quality checks and customer-first service for homes across Pakistan.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {trustPoints.map((item) => (
                <span key={item} className="rounded-full border border-[#d6dccd] bg-white px-4 py-2 text-sm font-semibold text-brand-800">{item}</span>
              ))}
            </div>
            <Link to="/shop" className="btn-primary mt-8">Explore Products</Link>
          </div>
          <div className="organic-card overflow-hidden p-3">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
              alt="Organic grocery collection"
              className="h-full min-h-[340px] w-full rounded-3xl object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section-shell py-12 lg:py-16">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built for trust, freshness and consistency"
          description="We focus on natural sourcing, hygienic handling and clear order updates to keep every order simple and dependable."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Natural Sourcing', text: 'Carefully selected ingredients from trusted suppliers.' },
            { title: 'Hygienic Processing', text: 'Clean packaging with quality control in every batch.' },
            { title: 'Reliable Delivery', text: 'Fast and safe delivery service across Pakistan.' },
          ].map((item) => (
            <article key={item.title} className="organic-card p-5">
              <h2 className="text-3xl font-semibold text-brand-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f6d5d]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
