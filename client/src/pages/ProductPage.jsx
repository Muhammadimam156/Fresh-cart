import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';

import {
  getProductBySlug,
  getProducts,
} from '../api/client';

import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RatingStars } from '../components/RatingStars';

export function ProductPage() {
  const { slug } = useParams();

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const [product, setProduct] =
    useState(null);

  const [relatedProducts, setRelated] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        setLoading(true);

        const apiProduct =
          await getProductBySlug(slug);

        if (!mounted) return;

        if (!apiProduct) {
          setProduct(null);
          setRelated([]);
          return;
        }

        setProduct(apiProduct);

        /*
         * Select first variant by default
         */

        if (
          Array.isArray(
            apiProduct.variants
          ) &&
          apiProduct.variants.length > 0
        ) {
          setSelectedVariant(
            apiProduct.variants[0]
          );
        } else {
          setSelectedVariant(null);
        }

        const categorySlug =
          typeof apiProduct.category ===
          'string'
            ? apiProduct.category
            : apiProduct.category?.slug;

        if (categorySlug) {
          const products =
            await getProducts({
              category:
                categorySlug,
            });

          if (mounted) {
            const related =
              (products || [])
                .filter((item) => {
                  const itemId =
                    item._id ||
                    item.id;

                  const currentId =
                    apiProduct._id ||
                    apiProduct.id;

                  return (
                    itemId !==
                    currentId
                  );
                })
                .slice(0, 4);

            setRelated(related);
          }
        }
      } catch (error) {
        console.error(
          'Failed to load product:',
          error
        );

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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-brand-900">
          Loading product...
        </p>
      </div>
    );
  }

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
    typeof product.category ===
    'string'
      ? product.category
      : product.category?.name ||
        'Category';

  const categorySlug =
    typeof product.category ===
    'string'
      ? product.category
      : product.category?.slug;

  const productImage =
    product.images?.[0] ||
    product.image ||
    '';

  /*
   * Selected price
   */

  const currentPrice =
    selectedVariant
      ? selectedVariant.price
      : product.price;

  /*
   * Selected stock
   */

  const currentStock =
    selectedVariant
      ? selectedVariant.stock
      : product.stock;

  /*
   * Add selected product/variant
   */

  function handleAddToCart() {
    if (currentStock <= 0) {
      return;
    }

    dispatch(
      addItem({
        ...product,

        id:
          product._id ||
          product.id,

        variantId:
          selectedVariant?.id ||
          null,

        variantLabel:
          selectedVariant?.label ||
          '',

        variantWeight:
          selectedVariant?.weight ??
          null,

        variantUnit:
          selectedVariant?.unit ||
          '',

        price: Number(
          currentPrice
        ),

        stock: Number(
          currentStock
        ),

        quantity: 1,
      })
    );
  }

  function handleBuyNow() {
    if (currentStock <= 0) {
      return;
    }

    handleAddToCart();

    navigate('/checkout');
  }

  return (
    <div>
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
            label: categoryName,
            to: categorySlug
              ? `/category/${categorySlug}`
              : '/shop',
          },

          {
            label: product.name,
          },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* IMAGE */}

        <div className="organic-card overflow-hidden">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-contain p-6"
            />
          ) : (
            <div className="flex min-h-[400px] items-center justify-center bg-[#f5f5ef]">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS */}

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

          {/* PRICE */}

          <p className="mt-5 text-3xl font-bold text-brand-900">
            Rs. {currentPrice}
          </p>

          {/* DESCRIPTION */}

          <p className="mt-5 leading-7 text-[#637260]">
            {product.description}
          </p>

          {/* VARIANTS */}

          {product.variants?.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-brand-900">
                  Select Weight
                </p>

                {selectedVariant && (
                  <span className="text-sm font-semibold text-brand-700">
                    {selectedVariant.label ||
                      `${selectedVariant.weight} ${selectedVariant.unit}`}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {product.variants.map(
                  (variant) => {
                    const selected =
                      selectedVariant?.id ===
                      variant.id;

                    const outOfStock =
                      Number(
                        variant.stock
                      ) <= 0;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={
                          outOfStock
                        }
                        onClick={() =>
                          setSelectedVariant(
                            variant
                          )
                        }
                        className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                          selected
                            ? 'border-brand-700 bg-brand-50 ring-2 ring-brand-200'
                            : 'border-slate-200 bg-white hover:border-brand-500'
                        } ${
                          outOfStock
                            ? 'cursor-not-allowed opacity-50'
                            : ''
                        }`}
                      >
                        <div className="font-bold text-brand-900">
                          {variant.label ||
                            `${variant.weight} ${variant.unit}`}
                        </div>

                        <div className="mt-1 text-sm font-bold text-brand-700">
                          Rs.{' '}
                          {
                            variant.price
                          }
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {outOfStock
                            ? 'Out of stock'
                            : `${variant.stock} available`}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* STOCK */}

          <div className="mt-6">
            <p className="font-semibold text-brand-900">
              Stock status:{' '}
              <span className="font-normal">
                {currentStock > 0
                  ? `${currentStock} available`
                  : 'Out of stock'}
              </span>
            </p>

            <p className="mt-2 font-semibold text-brand-900">
              Category:{' '}
              <span className="font-normal">
                {categoryName}
              </span>
            </p>
          </div>

          {/* ACTIONS */}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={
                currentStock <= 0
              }
              onClick={
                handleAddToCart
              }
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Cart
            </button>

            <button
              type="button"
              disabled={
                currentStock <= 0
              }
              onClick={
                handleBuyNow
              }
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          {/* WHATSAPP */}

          <a
            href={`https://wa.me/0312889186?text=${encodeURIComponent(
              `Assalamualaikum, I want to order ${product.name}${
                selectedVariant
                  ? ` - ${
                      selectedVariant.label ||
                      `${selectedVariant.weight} ${selectedVariant.unit}`
                    }`
                  : ''
              }. Price: Rs. ${currentPrice}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full border border-[#d7ddce] px-5 py-3 font-semibold text-brand-900"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* RELATED */}

      {relatedProducts.length >
        0 && (
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
            {relatedProducts.map(
              (item) => (
                <ProductCard
                  key={
                    item._id ||
                    item.id ||
                    item.slug
                  }
                  product={item}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}