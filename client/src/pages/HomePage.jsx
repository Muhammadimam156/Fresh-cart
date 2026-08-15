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
      ====================================================== */}
      <section className="relative bg-[#f8f4e8]">
        <div className="section-shell grid min-h-[650px] items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">

          {/* Content */}
          <div className="relative z-10">

            <div className="mb-5 inline-flex animate-[fadeInUp_.6s_ease-out] items-center gap-2 rounded-full border border-[#d8c99e] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b6828]">
              <span className="h-2 w-2 rounded-full bg-[#b9862f]" />
              Authentic Desi Products
            </div>

            <h1 className="max-w-2xl animate-[fadeInUp_.8s_ease-out] text-6xl font-semibold leading-[0.95] text-[#243522] sm:text-7xl lg:text-8xl">
              Pure Taste.
              <span className="block text-[#8a6428]">
                Desi Tradition.
              </span>
            </h1>

            <p className="mt-7 max-w-xl animate-[fadeInUp_1s_ease-out] text-lg leading-8 text-[#687064]">
              Discover authentic Pakistani food products made with quality,
              tradition and care. From pure honey and flour to rice, spices
              and other desi favorites.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-[#285c30] px-7 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d4824] hover:shadow-xl active:scale-95"
              >
                Explore Products
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="https://wa.me/0312889186"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#c9d0c2] bg-white px-7 py-4 text-sm font-bold text-[#30432f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4f1e6] active:scale-95"
              >
                Order on WhatsApp
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-7 text-sm text-[#657060]">
              <div>
                <strong className="block text-xl text-[#29412c]">
                  100%
                </strong>
                Authentic
              </div>

              <div>
                <strong className="block text-xl text-[#29412c]">
                  Fresh
                </strong>
                Products
              </div>

              <div>
                <strong className="block text-xl text-[#29412c]">
                  Fast
                </strong>
                Delivery
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#d9c38b]/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#7c9a67]/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[3rem] border-[10px] border-white shadow-2xl">
              <img
                src="https://images.pexels.com/photos/8820432/pexels-photo-8820432.jpeg"
                alt="Traditional desi food"
                className="h-[520px] w-full object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a2762c]">
                  Our Promise
                </p>

                <p className="mt-1 font-semibold text-[#273727]">
                  Bringing authentic desi taste to your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <section className="section-shell py-16 lg:py-20">

        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9862f]">
              Explore
            </p>

            <h2 className="mt-2 text-5xl font-semibold text-[#253625]">
              Desi Categories
            </h2>

            <p className="mt-3 max-w-xl text-[#70796e]">
              Everything you need for an authentic desi kitchen.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden rounded-full border border-[#d5dccf] px-5 py-3 text-sm font-bold text-[#315534] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f1f4eb] sm:inline-flex"
          >
            View All →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.slice(0, 4).map((category, index) => {
            const slug =
              category.slug ||
              category._id ||
              category.name?.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link
                key={category._id || category.id || category.name}
                to={`/category/${slug}`}
                className="group relative overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  animation: `fadeInUp .6s ease-out ${index * 100}ms both`,
                }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={getImage(category)}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = fallbackCategories[index]?.image;
                    }}
                  />
                </div>

                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-4 backdrop-blur">
                  <h3 className="font-semibold text-[#263827]">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#737c70]">
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

      {/* =====================================================
          LATEST PRODUCTS
      ====================================================== */}
      <section className="bg-[#f3f0e6] py-16 lg:py-20">
        <div className="section-shell">

          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9862f]">
                New Arrivals
              </p>

              <h2 className="mt-2 text-5xl font-semibold text-[#253625]">
                Latest Products
              </h2>

              <p className="mt-3 text-[#70796e]">
                Discover the newest additions to our collection.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden rounded-full bg-[#285c30] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d4824] sm:inline-flex"
            >
              Shop All →
            </Link>
          </div>

          {loading ? (
            <ProductSkeleton />
          ) : latestProducts.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="section-shell py-16 lg:py-20">

        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9862f]">
            Customer Favorites
          </p>

          <h2 className="mt-2 text-5xl font-semibold text-[#253625]">
            Best Sellers
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-[#70796e]">
            Products our customers keep coming back for.
          </p>
        </div>

        {loading ? (
          <ProductSkeleton />
        ) : bestProducts.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="bg-[#24462a] py-16 text-white lg:py-20">
        <div className="section-shell">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d8bb73]">
              Why Choose Us
            </p>

            <h2 className="mt-2 text-5xl font-semibold">
              Taste You Can Trust
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <Feature
              icon="🌿"
              title="Authentic Products"
              text="Carefully selected products with traditional desi taste."
            />

            <Feature
              icon="✨"
              title="Premium Quality"
              text="We focus on quality from selection to packaging."
            />

            <Feature
              icon="📦"
              title="Freshly Packed"
              text="Products are packed carefully to preserve freshness."
            />

            <Feature
              icon="💬"
              title="Easy Ordering"
              text="Order easily through our website or WhatsApp."
            />

          </div>
        </div>
      </section>

      {/* =====================================================
          WHATSAPP CTA
      ====================================================== */}
      <section className="section-shell py-16 lg:py-20">
        <div className="relative overflow-hidden rounded-[3rem] bg-[#f2e7ca] px-6 py-14 text-center sm:px-10">

          <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-[#b8c69e]/40 blur-2xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#98702d]">
              Need Help?
            </p>

            <h2 className="mt-3 text-5xl font-semibold text-[#293a28]">
              Want to Order Directly?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[#6c7568]">
              Contact us on WhatsApp and our team will help you place your
              order quickly and easily.
            </p>

            <a
              href="https://wa.me/0312889186"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#285c30] px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#1c4823] hover:shadow-2xl active:scale-95"
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
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        Products Coming Soon
      </h3>

      <p className="mt-2 text-sm text-[#737c70]">
        We are preparing our delicious desi products for you.
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