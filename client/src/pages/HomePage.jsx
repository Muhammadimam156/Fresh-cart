import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCategories, getProducts } from '../api/client';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';

function normalizeProduct(product) {
  return {
    ...product,
    id: product.id || product._id || product.slug,
    slug:
      product.slug ||
      product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      'product',
    name: product.name || 'Product',
    description: product.description || 'Fresh grocery item',
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    featured: Boolean(product.featured),
    latest: Boolean(product.latest),
    image: product.image || product.images?.[0] || '',
    category:
      typeof product.category === 'string'
        ? product.category
        : product.category?.name ||
          product.category?.slug ||
          'grocery',
  };
}

export function HomePage() {
  const query = useSelector((state) => state.search?.query || '');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!mounted) return;

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Failed to load home data:', error);

        if (mounted) {
          setProducts([]);
          setCategories([]);
        }
      }
    }

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  const normalizedProducts = useMemo(() => {
    const seen = new Set();

    return products
      .map(normalizeProduct)
      .filter((product) => {
        const key = product.id || product.slug;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = String(query || '').trim().toLowerCase();

    if (!normalizedQuery) {
      return normalizedProducts;
    }

    return normalizedProducts.filter((product) => {
      const text = [
        product.name,
        product.description,
        product.category,
      ]
        .join(' ')
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [query, normalizedProducts]);

  const featuredProducts = filteredProducts.filter(
    (product) => product.featured
  );

  const latestProducts = filteredProducts.filter(
    (product) => product.latest
  );

  const highlightedCategories = categories.slice(0, 5);

  return (
    <div>
      {/* HERO */}
      <section className="section-shell py-12 lg:py-16">
        <div className="organic-card overflow-hidden p-8 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
            FreshCart Organic Collection
          </p>

          <h1 className="mt-3 text-5xl font-semibold text-brand-900 lg:text-7xl">
            Pure Taste
            <br />
            Healthy Life
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5f6d5d]">
            Carefully selected pantry essentials, authentic taste, and
            dependable delivery across Pakistan.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-shell py-12 lg:py-16">
        <SectionHeading
          eyebrow="Our Products"
          title="Quality products, authentic taste and carefully selected ingredients."
          description="Explore pantry categories curated for everyday cooking and healthy living."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {highlightedCategories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="organic-card overflow-hidden"
            >
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
              )}

              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b9862f]">
                  Category
                </p>

                <h3 className="mt-2 text-3xl font-semibold text-brand-900">
                  {category.name}
                </h3>

                <p className="mt-1 text-sm text-[#647361]">
                  Natural quality essentials packed with care.
                </p>

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                  View Products →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-brand-900 text-brand-50">
        <div className="section-shell grid gap-6 py-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [
              'Quality Ingredients',
              'Sourced from trusted suppliers with strict quality checks.',
            ],
            [
              'Hygienic Packaging',
              'Safe handling and clean packaging for every product.',
            ],
            [
              'Made With Care',
              'Prepared and packed with consistency and freshness in mind.',
            ],
            [
              'Delivery Across Pakistan',
              'Fast and dependable delivery network nationwide.',
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              className="border-l border-brand-700/70 pl-4 first:border-l-0 first:pl-0"
            >
              <h3 className="text-3xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-brand-100/85">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-shell py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="organic-card overflow-hidden p-3">
            <img
              src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh ingredients"
              className="h-full min-h-[320px] w-full rounded-3xl object-cover"
            />
          </div>

          <div className="organic-card p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
              About FreshKart
            </p>

            <h2 className="mt-2 text-5xl font-semibold text-brand-900">
              Premium grocery essentials, naturally trusted
            </h2>

            <p className="mt-4 text-base leading-7 text-[#5f6d5d]">
              Our mission is to provide premium daily grocery items with
              reliable quality, honest sourcing, and seamless ordering.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
              {['Authentic Taste', 'Premium Quality', 'Customer Trust'].map(
                (point) => (
                  <span
                    key={point}
                    className="rounded-full border border-[#d7ddce] bg-[#f8f4ea] px-4 py-2 text-brand-800"
                  >
                    {point}
                  </span>
                )
              )}
            </div>

            <Link to="/about" className="btn-primary mt-8">
              Learn More About Us →
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section-shell py-12 lg:py-16">
        <SectionHeading
          eyebrow="Best Sellers"
          title="Our Best Sellers"
          description="Top products chosen by our regular customers."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id || product._id || product.slug}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#f5f1e5]">
        <div className="section-shell py-12 lg:py-16">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Customers Say"
            description="Real feedback from happy homes across Pakistan."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                'Ayesha Khan',
                'Quality bahut achi hoti hai aur delivery bhi time par milti hai.',
              ],
              [
                'Muhammad Ali',
                'Pure honey aur spices ka taste bohat authentic laga.',
              ],
              [
                'Sana Tariq',
                'Packaging clean thi aur products fresh mile. Recommended.',
              ],
            ].map(([name, quote]) => (
              <article key={name} className="organic-card p-5">
                <p className="text-sm leading-7 text-[#5f6d5d]">
                  “{quote}”
                </p>

                <p className="mt-4 text-sm font-bold text-brand-800">
                  {name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST PRODUCTS */}
      <section className="section-shell py-12 lg:py-16">
        <SectionHeading
          eyebrow="Latest"
          title="Latest Products"
          description="Recently added essentials and fresh shelf updates."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestProducts.map((product) => (
            <ProductCard
              key={product.id || product._id || product.slug}
              product={product}
            />
          ))}
        </div>
      </section>
    </div>
  );
}