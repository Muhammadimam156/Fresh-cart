import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../api/client';
import { ProductCard } from '../components/ProductCard';

const fallbackCategories = [
  {
    _id: 'honey',
    name: 'Pure Honey',
    description: 'Natural and pure desi honey',
    image:
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=85',
  },
  {
    _id: 'flour',
    name: 'Desi Flour',
    description: 'Fresh and quality flour',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85',
  },
  {
    _id: 'rice',
    name: 'Premium Rice',
    description: 'Selected quality rice',
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=85',
  },
  {
    _id: 'spices',
    name: 'Desi Spices',
    description: 'Traditional Pakistani spices',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=85',
  },
];

function getImage(item) {
  return (
    item?.image ||
    item?.images?.[0] ||
    item?.thumbnail ||
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'
  );
}

export function HomePage() {
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadHome() {
      try {
        setLoading(true);

        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (!mounted) return;

        const validCategories =
          Array.isArray(categoriesData) && categoriesData.length
            ? categoriesData
            : fallbackCategories;

        const products = Array.isArray(productsData) ? productsData : [];

        setCategories(validCategories);

        // Latest products
        const latest = [...products]
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 4);

        // Best sellers
        const best = [...products]
          .sort((a, b) => {
            const salesA =
              Number(a.salesCount || a.soldCount || a.totalSold || 0);

            const salesB =
              Number(b.salesCount || b.soldCount || b.totalSold || 0);

            return salesB - salesA;
          })
          .slice(0, 4);

        setLatestProducts(latest);
        setBestProducts(best);
      } catch (error) {
        console.error('Failed to load home page:', error);

        if (mounted) {
          setCategories(fallbackCategories);
          setLatestProducts([]);
          setBestProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="overflow-hidden">

      {/* =====================================================
          HERO SECTION
          Mobile: compact so categories/products are reachable
          fast. Desktop: full, spacious layout (unchanged feel).
      ====================================================== */}
      {/* =====================================================
          MOBILE REORDER WRAPPER
          On mobile: Categories/Products come first, Hero second.
          On tablet/desktop (sm+): normal order (Hero first).
      ====================================================== */}
      <div className="flex flex-col">

      <div className="order-2 sm:order-1">
      <section className="relative bg-[#f8f4e8]">
        <div className="section-shell grid items-center gap-8 py-8 sm:gap-10 sm:py-10 lg:min-h-[650px] lg:grid-cols-2 lg:py-20">

          {/* Content */}
          <div className="relative z-10">

            <div className="mb-4 inline-flex animate-[fadeInUp_.6s_ease-out] items-center gap-2 rounded-full border border-[#d8c99e] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b6828] sm:mb-5">
              <span className="h-2 w-2 rounded-full bg-[#b9862f]" />
              100% Organic Desi Food Products in Pakistan
            </div>

            <h1 className="max-w-2xl animate-[fadeInUp_.8s_ease-out] text-4xl font-semibold leading-[1.05] text-[#243522] sm:text-6xl sm:leading-[0.95] lg:text-7xl xl:text-8xl">
              Pure Taste.
              <span className="block text-[#8a6428]">
                Desi Tradition.
              </span>
            </h1>

            <p className="mt-4 max-w-xl animate-[fadeInUp_1s_ease-out] text-base leading-7 text-[#687064] sm:mt-7 sm:text-lg sm:leading-8">
              Shop authentic, organic desi food products online — pure honey,
              fresh flour, premium rice, and traditional Pakistani spices,
              delivered fresh to your doorstep across Pakistan.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-[#285c30] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d4824] hover:shadow-xl active:scale-95 sm:px-7 sm:py-4"
              >
                Shop Now
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="https://wa.me/0312889186"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#c9d0c2] bg-white px-6 py-3.5 text-sm font-bold text-[#30432f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4f1e6] active:scale-95 sm:px-7 sm:py-4"
              >
                Order on WhatsApp
              </a>
            </div>

            <div className="mt-6 hidden flex-wrap gap-5 text-sm text-[#657060] sm:mt-10 sm:flex sm:gap-7">
              <div>
                <strong className="block text-xl text-[#29412c]">
                  100%
                </strong>
                Organic &amp; Authentic
              </div>

              <div>
                <strong className="block text-xl text-[#29412c]">
                  Fresh
                </strong>
                Quality Products
              </div>

              <div>
                <strong className="block text-xl text-[#29412c]">
                  Fast
                </strong>
                Nationwide Delivery
              </div>
            </div>
          </div>

          {/* Hero Image — hidden on mobile entirely so products
              are reachable within the first scroll. Visible from
              tablet size up, where there's room for it. */}
          <div className="relative hidden sm:block">
            <div className="absolute -right-10 -top-10 hidden h-40 w-40 rounded-full bg-[#d9c38b]/30 blur-3xl sm:block" />
            <div className="absolute -bottom-10 -left-10 hidden h-48 w-48 rounded-full bg-[#7c9a67]/20 blur-3xl sm:block" />

            <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl sm:rounded-[3rem] sm:border-[10px]">
              <img
                src="https://images.pexels.com/photos/8820432/pexels-photo-8820432.jpeg"
                alt="Authentic organic desi food products from Pakistan"
                className="h-[220px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[360px] lg:h-[520px]"
              />

              <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-3xl sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a2762c] sm:text-xs">
                  Our Promise
                </p>

                <p className="mt-1 text-sm font-semibold text-[#273727] sm:text-base">
                  Bringing authentic, chemical-free desi taste to your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE ONLY: Trust strip — replaces the hero image and
          stats row on small screens with a slim single line, so
          the categories/products grid below is visible almost
          immediately without heavy scrolling.
      ====================================================== */}
      <div className="flex items-center justify-center gap-4 border-y border-[#e7dfc4] bg-[#fbf7ea] px-4 py-2.5 text-[11px] font-bold text-[#8b6828] sm:hidden">
        <span>🌿 100% Organic</span>
        <span className="h-1 w-1 rounded-full bg-[#c9b27a]" />
        <span>🚚 Fast Delivery</span>
        <span className="h-1 w-1 rounded-full bg-[#c9b27a]" />
        <span>💵 COD</span>
      </div>
      </div>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <div className="order-1 sm:order-2">
      <section className="section-shell py-10 lg:py-20">

        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9862f]">
              Shop by Category
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-[#253625] sm:text-5xl">
              Explore Our Desi Food Categories
            </h2>

            <p className="mt-3 max-w-xl text-sm text-[#70796e] sm:text-base">
              Everything you need for an authentic, organic desi kitchen — handpicked and quality-checked.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden rounded-full border border-[#d5dccf] px-5 py-3 text-sm font-bold text-[#315534] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f1f4eb] sm:inline-flex"
          >
            View All Categories →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 md:grid-cols-4">
          {categories.slice(0, 4).map((category, index) => {
            const slug =
              category.slug ||
              category._id ||
              category.name?.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link
                key={category._id || category.id || category.name}
                to={`/category/${slug}`}
                className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  animation: `fadeInUp .6s ease-out ${index * 100}ms both`,
                }}
              >
                <div className="aspect-square w-full overflow-hidden bg-[#f3f1e8]">
                  <img
                    src={getImage(category)}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = fallbackCategories[index]?.image;
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-[#263827]">
                    {category.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-[#737c70]">
                    {category.description || 'Explore products'}
                  </p>

                  <span className="mt-3 inline-block text-xs font-bold text-[#37643b] transition-transform duration-300 group-hover:translate-x-1">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      </div>

      </div>
      {/* END MOBILE REORDER WRAPPER */}

      {/* =====================================================
          LATEST PRODUCTS
      ====================================================== */}
      <section className="bg-[#f3f0e6] py-10 lg:py-20">
        <div className="section-shell">

          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9862f]">
                New Arrivals
              </p>

              <h2 className="mt-2 text-3xl font-semibold text-[#253625] sm:text-5xl">
                Fresh Additions to Our Store
              </h2>

              <p className="mt-3 text-sm text-[#70796e] sm:text-base">
                Be the first to try our newest organic and desi products.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden rounded-full bg-[#285c30] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d4824] sm:inline-flex"
            >
              Shop All Products →
            </Link>
          </div>

          {loading ? (
            <ProductSkeleton />
          ) : latestProducts.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {latestProducts.map((product) => (
                <div
                  key={product._id || product.id || product.slug}
                  className="animate-[fadeInUp_.5s_ease-out]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyProducts />
          )}
        </div>
      </section>

      {/* =====================================================
          BEST SELLERS
      ====================================================== */}
      <section className="section-shell py-10 lg:py-20">

        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9862f]">
            Customer Favorites
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-[#253625] sm:text-5xl">
            Our Best Selling Desi Products
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-[#70796e] sm:text-base">
            Trusted by hundreds of customers across Pakistan — the products people keep reordering.
          </p>
        </div>

        {loading ? (
          <ProductSkeleton />
        ) : bestProducts.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {bestProducts.map((product) => (
              <div
                key={product._id || product.id || product.slug}
                className="animate-[fadeInUp_.5s_ease-out]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyProducts />
        )}
      </section>

      {/* =====================================================
          WHY US
      ====================================================== */}
      <section className="bg-[#24462a] py-10 text-white lg:py-20">
        <div className="section-shell">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d8bb73]">
              Why Choose Us
            </p>

            <h2 className="mt-2 text-3xl font-semibold sm:text-5xl">
              Pakistan's Trusted Organic Food Store
            </h2>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-12 md:grid-cols-2 bg-[#f2e7ca] lg:grid-cols-4">

            <Feature
              icon="🌿"
              title="100% Organic & Authentic"
              text="Carefully sourced, chemical-free products with genuine traditional desi taste."
            />

            <Feature
              icon="✨"
              title="Premium Quality Assured"
              text="Every product is quality-checked from selection to final packaging."
            />

            <Feature
              icon="📦"
              title="Freshly Packed for You"
              text="Hygienically packed to lock in freshness and flavor until it reaches your door."
            />

            <Feature
              icon="💬"
              title="Easy Online Ordering"
              text="Order in minutes through our website or WhatsApp — quick and hassle-free."
            />

          </div>
        </div>
      </section>

      {/* =====================================================
          WHATSAPP CTA
      ====================================================== */}
      <section className="section-shell py-10 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#f2e7ca] px-5 py-10 text-center sm:rounded-[3rem] sm:px-10 sm:py-14">

          <div className="absolute -left-20 -top-20 hidden h-52 w-52 rounded-full bg-white/40 blur-2xl sm:block" />
          <div className="absolute -bottom-20 -right-20 hidden h-52 w-52 rounded-full bg-[#b8c69e]/40 blur-2xl sm:block" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#98702d]">
              Need Help?
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[#293a28] sm:text-5xl">
              Order Fresh Desi Products in Minutes
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm text-[#6c7568] sm:text-base">
              Message us on WhatsApp and our team will help you place your
              order quickly, with fast delivery anywhere in Pakistan.
            </p>

            <a
              href="https://wa.me/0312889186"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#285c30] px-7 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#1c4823] hover:shadow-2xl active:scale-95 sm:mt-7 sm:px-8 sm:py-4"
            >
              <span className="text-xl">☘</span>
              Order on WhatsApp
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}


/* ============================================================
   FEATURE COMPONENT
============================================================ */

function Feature({ icon, title, text }) {
  return (
    <div className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/70">
        {text}
      </p>
    </div>
  );
}


/* ============================================================
   PRODUCT SKELETON
============================================================ */

function ProductSkeleton() {
  return (
    <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-3xl bg-white shadow-sm"
        >
          <div className="h-64 animate-pulse bg-[#e2e4dc]" />

          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#e2e4dc]" />
            <div className="h-3 w-full animate-pulse rounded bg-[#e2e4dc]" />
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#e2e4dc]" />
          </div>
        </div>
      ))}
    </div>
  );
}


/* ============================================================
   EMPTY PRODUCTS
============================================================ */

function EmptyProducts() {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-[#cfd6ca] bg-white p-10 text-center">
      <div className="text-4xl">🌾</div>

      <h3 className="mt-3 text-2xl font-semibold text-[#293a28]">
        New Products Coming Soon
      </h3>

      <p className="mt-2 text-sm text-[#737c70]">
        We are preparing our delicious, organic desi products for you.
      </p>

      <Link
        to="/shop"
        className="mt-5 inline-flex rounded-full bg-[#285c30] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d4824] active:scale-95"
      >
        Browse Shop
      </Link>
    </div>
  );
}
