import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../api/client';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionHeading } from '../components/SectionHeading';

function normalizeProduct(product) {
  const category = product.category;

  return {
    ...product,

    id: product.id || product._id || product.slug,

    slug: product.slug || product._id || 'product',

    image:
      product.image ||
      product.images?.[0] ||
      '',

    categorySlug:
      typeof category === 'string'
        ? category.toLowerCase().trim()
        : category?.slug?.toLowerCase().trim() || '',

    categoryName:
      typeof category === 'string'
        ? category
        : category?.name || '',

    price: Number(product.price || 0),

    stock: Number(product.stock || 0),
  };
}

/* --------------------------------
   Loading Skeleton
-------------------------------- */

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#dde3d8] bg-white shadow-sm">
      <div className="h-64 animate-pulse bg-[#eeeade]" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-[#e5e2d7]" />
        <div className="h-7 w-3/4 animate-pulse rounded bg-[#e5e2d7]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#e5e2d7]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#e5e2d7]" />

        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-24 animate-pulse rounded bg-[#e5e2d7]" />
          <div className="h-4 w-16 animate-pulse rounded bg-[#e5e2d7]" />
        </div>

        <div className="flex gap-2 pt-2">
          <div className="h-11 flex-1 animate-pulse rounded-full bg-[#e5e2d7]" />
          <div className="h-11 flex-1 animate-pulse rounded-full bg-[#e5e2d7]" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------
   Category Button
-------------------------------- */

function CategoryButton({
  active,
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full overflow-hidden rounded-2xl px-4 py-3
        text-left text-sm font-bold
        transition-all duration-300
        active:scale-[0.97]
        ${active
          ? 'bg-brand-700 text-white shadow-lg shadow-brand-900/10'
          : 'bg-[#f6f4eb] text-[#435040] hover:-translate-y-0.5 hover:bg-[#ece9dd] hover:text-brand-800'
        }
      `}
    >
      <span
        className={`
          absolute inset-0 -translate-x-full bg-white/10
          transition-transform duration-500
          group-hover:translate-x-0
          ${active ? 'opacity-100' : 'opacity-0'}
        `}
      />

      <span className="relative z-10 flex items-center justify-between">
        <span>{children}</span>

        <span
          className={`
            transition-all duration-300
            ${active
              ? 'translate-x-0 opacity-100'
              : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
            }
          `}
        >
          →
        </span>
      </span>
    </button>
  );
}

/* --------------------------------
   Shop Page
-------------------------------- */

export function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* --------------------------------
     Load Products + Categories
     (with retry so a cold-start / transient failure doesn't
     flash "No products found" before the real data arrives —
     the skeleton stays visible until we have a real answer)
  -------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function fetchWithRetry(fetchFn, retries = 2, delayMs = 1200) {
      for (let attempt = 0; attempt <= retries; attempt++) {
        const result = await fetchFn();

        // getCategories()/getProducts() return null on failure.
        // Any non-null result (even an empty array) is accepted.
        if (result !== null) {
          return result;
        }

        if (attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs)
          );
        }
      }

      return null;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [apiCategories, apiProducts] = await Promise.all([
          fetchWithRetry(getCategories),
          fetchWithRetry(getProducts),
        ]);

        if (!mounted) return;

        if (apiCategories === null && apiProducts === null) {
          setError(
            'We could not load the products right now. Please try again.'
          );
          setCategories([]);
          setProducts([]);
          return;
        }

        setCategories(apiCategories || []);

        const normalizedProducts = (apiProducts || []).map(
          normalizeProduct
        );

        setProducts(normalizedProducts);
      } catch (err) {
        console.error('Failed to load shop data:', err);

        if (mounted) {
          setError(
            'We could not load the products right now. Please try again.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /* --------------------------------
     Filter + Sort
  -------------------------------- */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Category */

    if (activeCategory !== 'all') {
      const selectedCategory = String(activeCategory)
        .toLowerCase()
        .trim();

      result = result.filter((product) => {
        const productSlug = String(
          product.categorySlug || ''
        )
          .toLowerCase()
          .trim();

        const productName = String(
          product.categoryName || ''
        )
          .toLowerCase()
          .trim();

        return (
          productSlug === selectedCategory ||
          productName === selectedCategory
        );
      });
    }

    /* Sorting */

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'name') {
      result.sort((a, b) =>
        String(a.name || '').localeCompare(
          String(b.name || '')
        )
      );
    }

    return result;
  }, [products, activeCategory, sortBy]);

  /* --------------------------------
     Current Category Name
  -------------------------------- */

  const activeCategoryName = useMemo(() => {
    if (activeCategory === 'all') {
      return 'All Products';
    }

    const category = categories.find(
      (item) =>
        item.slug === activeCategory ||
        item.name?.toLowerCase() ===
        String(activeCategory).toLowerCase()
    );

    return category?.name || 'Products';
  }, [categories, activeCategory]);

  return (
    <div className="section-shell py-10 lg:py-14">

      {/* Breadcrumbs */}

      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Our Products' },
        ]}
      />

      {/* Header */}

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <SectionHeading
          eyebrow="Desi Food Collection"
          title="Our Products"
          description="Discover premium desi food essentials, natural products and traditional flavours made for your home."
        />

        {/* Sort */}

        <div className="flex w-full items-center justify-between rounded-full border border-[#d7ddce] bg-white px-4 py-2.5 shadow-sm transition-all duration-300 hover:shadow-md sm:w-auto">

          <label
            htmlFor="product-sort"
            className="mr-3 text-sm font-semibold text-[#637260]"
          >
            Sort:
          </label>

          <select
            id="product-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            className="cursor-pointer bg-transparent text-sm font-bold text-brand-900 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">
              Price: Low to High
            </option>
            <option value="price-desc">
              Price: High to Low
            </option>
            <option value="name">
              Name
            </option>
          </select>
        </div>
      </div>

      {/* Main Content */}

      <div className="mt-8 grid gap-6 lg:grid-cols-[250px_1fr]">

        {/* Sidebar */}

        <aside className="organic-card h-fit p-5 transition-all duration-300 hover:shadow-lg">

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-brand-900">
              Categories
            </h2>

            {!loading && (
              <span className="rounded-full bg-[#f5f2e8] px-2.5 py-1 text-xs font-bold text-[#637260]">
                {categories.length}
              </span>
            )}
          </div>

          {/* Categories */}

          <div className="mt-5 grid gap-2">

            <CategoryButton
              active={activeCategory === 'all'}
              onClick={() =>
                setActiveCategory('all')
              }
            >
              All Products
            </CategoryButton>

            {loading ? (
              <>
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-11 animate-pulse rounded-2xl bg-[#f0eee5]"
                  />
                ))}
              </>
            ) : (
              categories.map((category) => (
                <CategoryButton
                  key={
                    category._id ||
                    category.slug ||
                    category.name
                  }
                  active={
                    activeCategory ===
                    category.slug
                  }
                  onClick={() =>
                    setActiveCategory(
                      category.slug ||
                      category.name
                    )
                  }
                >
                  {category.name}
                </CategoryButton>
              ))
            )}

          </div>

          {/* Bulk Order */}

          <Link
            to="/contact"
            className="
              group relative mt-5 flex w-full
              items-center justify-center gap-2
              overflow-hidden rounded-full
              border border-brand-700
              px-5 py-3
              text-sm font-bold text-brand-700
              transition-all duration-300
              hover:-translate-y-0.5
              hover:bg-brand-50
              hover:shadow-md
              active:scale-95
            "
          >
            <span className="relative z-10">
              Need Bulk Order?
            </span>

            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

        </aside>

        {/* Products Area */}

        <section>

          {/* Result Header */}

          {!loading && !error && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

              <div>
                <p className="text-sm text-[#637260]">
                  Showing
                  <span className="mx-1 font-bold text-brand-900">
                    {filteredProducts.length}
                  </span>
                  products
                </p>

                {activeCategory !== 'all' && (
                  <p className="mt-1 text-xs text-[#8a9185]">
                    Category:
                    <span className="ml-1 font-semibold text-brand-700">
                      {activeCategoryName}
                    </span>
                  </p>
                )}
              </div>

              {/* Clear Filter */}

              {activeCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveCategory('all')
                  }
                  className="
                    group flex items-center gap-2
                    rounded-full
                    border border-[#d7ddce]
                    bg-white
                    px-4 py-2
                    text-xs font-bold
                    text-brand-800
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-brand-700
                    hover:shadow-sm
                    active:scale-95
                  "
                >
                  Clear filter
                  <span className="transition-transform duration-300 group-hover:rotate-90">
                    ×
                  </span>
                </button>
              )}

            </div>
          )}

          {/* Error */}

          {error && !loading && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 px-6 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl">
                !
              </div>

              <h3 className="mt-4 text-2xl font-semibold text-red-900">
                Something went wrong
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="
                  mt-5 rounded-full
                  bg-brand-700
                  px-5 py-3
                  text-sm font-bold text-white
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-brand-800
                  hover:shadow-lg
                  active:scale-95
                "
              >
                Try Again
              </button>

            </div>
          )}

          {/* Loading Skeletons */}

          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <ProductSkeleton
                    key={index}
                  />
                )
              )}
            </div>
          )}

          {/* Products */}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map(
                  (product, index) => (
                    <div
                      key={
                        product.id ||
                        product._id ||
                        product.slug
                      }
                      className="animate-[fadeInUp_0.5s_ease-out_both]"
                      style={{
                        animationDelay: `${Math.min(
                          index * 70,
                          500
                        )}ms`,
                      }}
                    >
                      <ProductCard
                        product={product}
                      />
                    </div>
                  )
                )}
              </div>
            )}

          {/* Empty State */}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-[#dde3d8] bg-white px-6 text-center shadow-sm">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f2e8] text-3xl">
                  🛒
                </div>

                <h3 className="mt-5 text-3xl font-semibold text-brand-900">
                  No products found
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#637260]">
                  We couldn't find any products in
                  this category right now. Try another
                  category or view all products.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setActiveCategory('all')
                  }
                  className="
                    group mt-6 flex items-center gap-2
                    rounded-full
                    bg-brand-700
                    px-6 py-3
                    text-sm font-bold text-white
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:bg-brand-800
                    hover:shadow-lg
                    active:scale-95
                  "
                >
                  <span>
                    View All Products
                  </span>

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

              </div>
            )}

        </section>
      </div>
    </div>
  );
}
