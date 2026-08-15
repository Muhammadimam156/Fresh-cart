import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getProducts, getCategoryBySlug } from '../api/client';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function CategoryPage() {
  const { slug } = useParams();

  const query = useSelector(
    (state) => state.search?.query || ''
  );

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadCategory() {
      try {
        setLoading(true);
        setError('');

        const [categoryData, productsData] =
          await Promise.all([
            getCategoryBySlug(slug),
            getProducts({
              category: slug,
            }),
          ]);

        if (!mounted) return;

        console.log('Category:', categoryData);
        console.log('Category Products:', productsData);

        setCategory(categoryData || null);
        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );
      } catch (error) {
        console.error(
          'Failed to load category:',
          error
        );

        if (!mounted) return;

        setCategory(null);
        setProducts([]);

        setError(
          error?.message ||
            'Failed to load category.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadCategory();
    } else {
      setLoading(false);
      setCategory(null);
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  const filtered = query.trim()
    ? products.filter((product) =>
        product?.name
          ?.toLowerCase()
          .includes(query.toLowerCase())
      )
    : products;

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="section-shell py-16">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />

          <p className="mt-5 text-sm font-semibold text-[#637260]">
            Loading category...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (error) {
    return (
      <div className="section-shell py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-red-200 bg-white p-10 text-center shadow-soft">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-3xl font-semibold text-brand-900">
            Unable to load category
          </h1>

          <p className="mt-3 text-[#637260]">
            Something went wrong while loading this
            category.
          </p>

          <p className="mt-3 break-words rounded-xl bg-red-50 p-3 text-left text-xs text-red-600">
            {error}
          </p>

          <Link
            to="/shop"
            className="btn-primary mt-7 inline-flex"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // -----------------------------
  // CATEGORY NOT FOUND
  // -----------------------------

  if (!category) {
    return (
      <div className="section-shell py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#dde3d8] bg-white p-10 text-center shadow-soft">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f1e7] text-3xl">
            🛒
          </div>

          <h1 className="mt-5 text-4xl font-semibold text-brand-900">
            Category not found
          </h1>

          <p className="mt-3 text-[#637260]">
            Sorry, we could not find this category.
          </p>

          <p className="mt-3 text-xs text-slate-400">
            Slug: {slug}
          </p>

          <Link
            to="/shop"
            className="btn-primary mt-7 inline-flex"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // -----------------------------
  // CATEGORY PAGE
  // -----------------------------

  return (
    <div>
      <div className="animate-[fadeIn_0.5s_ease-out]">
        <Breadcrumbs
          items={[
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Shop',
              to: '/shop',
            },
            {
              label: category.name,
            },
          ]}
        />
      </div>

      <div className="animate-[slideUp_0.6s_ease-out]">
        <SectionHeading
          eyebrow="Category"
          title={category.name}
          description={`Browse all products available in the ${
            category.name || 'selected'
          } category.`}
        />
      </div>

      <div className="section-shell pb-16">
        {filtered.length === 0 ? (
          <div className="organic-card mt-8 p-10 text-center">
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
              to="/shop"
              className="mt-6 inline-flex rounded-full border border-brand-700 px-5 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              Back to Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#637260]">
                {filtered.length}{' '}
                {filtered.length === 1
                  ? 'product'
                  : 'products'}{' '}
                found
              </p>

              {query && (
                <p className="text-sm text-[#637260]">
                  Search:{' '}
                  <strong>{query}</strong>
                </p>
              )}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(
                (product, index) => (
                  <div
                    key={
                      product?._id ||
                      product?.id ||
                      product?.slug ||
                      index
                    }
                    className="animate-[slideUp_0.55s_ease-out_both]"
                    style={{
                      animationDelay: `${
                        index * 100
                      }ms`,
                    }}
                  >
                    <ProductCard
                      product={product}
                    />
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}