import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../api/client';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionHeading } from '../components/SectionHeading';

function normalizeProduct(product) {
  return {
    ...product,
    id: product.id || product._id || product.slug,
    slug: product.slug || 'product',
    image: product.image || product.images?.[0] || '',
    category: typeof product.category === 'string' ? product.category : product.category?.slug || product.category?.name || 'grocery',
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
  };
}

export function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
  let mounted = true;

  async function loadData() {
    try {
      const [apiCategories, apiProducts] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      if (!mounted) return;

      setCategories(apiCategories || []);
      setProducts((apiProducts || []).map(normalizeProduct));
    } catch (error) {
      console.error('Failed to load shop data:', error);
    }
  }

  loadData();

  return () => {
    mounted = false;
  };
}, []);

  const filteredProducts = useMemo(() => {
    let result = products.map(normalizeProduct);

    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory || item.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="section-shell py-10 lg:py-14">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <SectionHeading eyebrow="Store" title="Our Products" description="Browse clean pantry essentials with premium quality and trusted sourcing." />
        <div className="rounded-full border border-[#d7ddce] bg-white px-3 py-2 text-sm">
          <label className="mr-2 text-[#637260]">Sort:</label>
          <select className="bg-transparent outline-none" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="organic-card h-fit p-5">
          <h2 className="text-2xl font-semibold text-brand-900">Categories</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`rounded-xl px-3 py-2 text-left font-semibold ${activeCategory === 'all' ? 'bg-brand-700 text-white' : 'bg-[#f6f4eb] text-[#435040]'}`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`rounded-xl px-3 py-2 text-left font-semibold ${activeCategory === category.slug ? 'bg-brand-700 text-white' : 'bg-[#f6f4eb] text-[#435040]'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <Link to="/contact" className="btn-secondary mt-5 w-full">Need Bulk Order?</Link>
        </aside>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product._id || product.slug} product={product} />
          ))}
        </section>
      </div>
    </div>
  );
}
