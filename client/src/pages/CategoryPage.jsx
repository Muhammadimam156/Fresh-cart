import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getProducts, getCategoryBySlug } from '../api/client';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function CategoryPage() {
  const { slug } = useParams();

  const query = useSelector((state) => state.search.query);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCategory() {
      try {
        setLoading(true);

        const [categoryData, productsData] = await Promise.all([
          getCategoryBySlug(slug),
          getProducts({ category: slug }),
        ]);

        if (!mounted) return;

        setCategory(categoryData);
        setProducts(productsData || []);
      } catch (error) {
        console.error('Failed to load category:', error);

        if (mounted) {
          setCategory(null);
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const filtered = query
    ? products.filter((product) =>
        product.name?.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  // Loading
  if (loading) {
    return (
      <div className="section-shell py-16">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />

          <p className="mt-5 animate-pulse text-sm font-semibold text-[#637260]">
            Loading category...
          </p>
        </div>
      </div>
    );
  }

  // Category not found
  if (!category) {
    return (
      <div className="section-shell py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#dde3d8] bg-white p-10 text-center shadow-soft animate-[fadeIn_0.5s_ease-out]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f1e7] text-3xl">
            🛒
          </div>

          <h1 className="mt-5 text-4xl font-semibold text-brand-900">
            Category not found
          </h1>

          <p className="mt-3 text-[#637260]">
            Sorry, we could not find the category you are looking for.
          </p>

          {/* Animated Button */}
          <Link
            to="/shop"
            className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-brand-800 hover:shadow-lg active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />

            <span className="relative z-10">
              Back to Shop
            </span>

            <svg
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M4 10h12M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="animate-[fadeIn_0.5s_ease-out]">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: category.name },
          ]}
        />
      </div>

      {/* Category Heading */}
      <div className="animate-[slideUp_0.6s_ease-out]">
        <SectionHeading
          eyebrow="Category"
          title={category.name}
          description={`Browse all products available in the ${category.name.toLowerCase()} category.`}
        />
      </div>

      <div className="section-shell pb-16">
        {/* No Products */}
        {filtered.length === 0 ? (
          <div className="organic-card mt-8 p-10 text-center animate-[fadeIn_0.6s_ease-out]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f1e7] text-2xl">
              🔍
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-brand-900">
              No products found
            </h2>

            <p className="mt-2 text-[#637260]">
              {query
                ? `No products match "${query}" in this category.`
                : 'There are currently no products in this category.'}
            </p>

            <Link
              to={`/category/${slug}`}
              className="group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-brand-700 px-5 py-3 text-sm font-bold text-brand-700 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-50 hover:shadow-md active:scale-95"
            >
              <span className="relative z-10">
                View All Products
              </span>

              <svg
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M4 10h12M11 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            {/* Product Count */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#637260]">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'product' : 'products'} found
              </p>

              {query && (
                <p className="text-sm text-[#637260]">
                  Search: <strong>{query}</strong>
                </p>
              )}
            </div>

            {/* Products */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, index) => (
                <div
                  key={product._id || product.id || product.slug}
                  className="animate-[slideUp_0.55s_ease-out_both]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}