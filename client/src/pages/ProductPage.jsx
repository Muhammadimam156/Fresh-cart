import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';

import { getProductBySlug, getProducts } from '../api/client';

import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RatingStars } from '../components/RatingStars';

export function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        setLoading(true);

        const apiProduct = await getProductBySlug(slug);

        if (!mounted) return;

        if (!apiProduct) {
          setProduct(null);
          setRelated([]);
          return;
        }

        setProduct(apiProduct);

        // Get category slug
        const categorySlug =
          typeof apiProduct.category === 'string'
            ? apiProduct.category
            : apiProduct.category?.slug;

        if (categorySlug) {
          const products = await getProducts({
            category: categorySlug,
          });

          if (mounted) {
            const related = (products || [])
              .filter((item) => {
                const itemId = item._id || item.id;
                const currentId = apiProduct._id || apiProduct.id;

                return itemId !== currentId;
              })
              .slice(0, 4);

            setRelated(related);
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);

        if (mounted) {
          setProduct(null);
          setRelated([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-brand-900">
          Loading product...
        </p>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold text-brand-900">
          Product not found
        </h1>

        <Link
          to="/shop"
          className="btn-primary mt-6 inline-flex"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof product.category === 'string'
      ? product.category
      : product.category?.name || 'Category';

  const categorySlug =
    typeof product.category === 'string'
      ? product.category
      : product.category?.slug;

  const productImage =
    product.image ||
    product.images?.[0] ||
    '';

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          {
            label: categoryName,
            to: categorySlug ? `/category/${categorySlug}` : '/shop',
          },
          { label: product.name },
        ]}
      />

      {/* Product Details */}
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Product Image */}
        <div className="organic-card overflow-hidden">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[400px] items-center justify-center bg-[#f5f5ef]">
              No Image
            </div>
          )}
        </div>

        {/* Product Information */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
            Product Details
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-brand-900">
            {product.name}
          </h1>

          <div className="mt-4">
            <RatingStars />
          </div>

          <p className="mt-5 text-3xl font-bold text-brand-900">
            Rs. {product.price}
          </p>

          <p className="mt-5 leading-7 text-[#637260]">
            {product.description}
          </p>

          <div className="mt-5">
            <p className="font-semibold text-brand-900">
              Stock status:{' '}
              <span className="font-normal">
                {product.stock > 0 ? 'In stock' : 'Out of stock'}
              </span>
            </p>

            <p className="mt-2 font-semibold text-brand-900">
              Category:{' '}
              <span className="font-normal">
                {categoryName}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() =>
                dispatch(
                  addItem({
                    ...product,
                    quantity: 1,
                  })
                )
              }
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Cart
            </button>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => {
                dispatch(
                  addItem({
                    ...product,
                    quantity: 1,
                  })
                );

                navigate('/checkout');
              }}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodeURIComponent(
              `Assalamualaikum, I want to order ${product.name}. Price: Rs. ${product.price}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full border border-[#d7ddce] px-5 py-3 font-semibold text-brand-900"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
                Related Products
              </p>

              <h2 className="mt-2 text-4xl font-semibold text-brand-900">
                More in this category
              </h2>
            </div>

            {categorySlug && (
              <Link
                to={`/category/${categorySlug}`}
                className="text-sm font-bold text-brand-700"
              >
                View all
              </Link>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item._id || item.id || item.slug}
                product={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}