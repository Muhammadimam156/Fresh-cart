import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        setLoading(true);

        const apiProduct = await getProductBySlug(slug);

        if (!mounted) return;

        if (!apiProduct) {
          setProduct(null);
          setRelatedProducts([]);
          return;
        }

        setProduct(apiProduct);

        // ======================================================
        // SELECT FIRST VARIANT BY DEFAULT
        // ======================================================

        if (
          Array.isArray(apiProduct.variants) &&
          apiProduct.variants.length > 0
        ) {
          setSelectedVariant(apiProduct.variants[0]);
        } else {
          setSelectedVariant(null);
        }

        // ======================================================
        // RELATED PRODUCTS
        // ======================================================

        const categorySlug =
          typeof apiProduct.category === 'string'
            ? apiProduct.category
            : apiProduct.category?.slug;

        if (categorySlug) {
          const products = await getProducts({
            category: categorySlug,
          });

          if (mounted) {
            const currentProductId =
              String(apiProduct._id || apiProduct.id);

            const related = (products || [])
              .filter((item) => {
                const itemId = String(
                  item._id || item.id
                );

                return itemId !== currentProductId;
              })
              .slice(0, 4);

            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error(
          'Failed to load product:',
          error
        );

        if (mounted) {
          setProduct(null);
          setRelatedProducts([]);
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

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-brand-900">
          Loading product...
        </p>
      </div>
    );
  }

  // ============================================================
  // PRODUCT NOT FOUND
  // ============================================================

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

  // ============================================================
  // CATEGORY
  // ============================================================

  const categoryName =
    typeof product.category === 'string'
      ? product.category
      : product.category?.name || 'Category';

  const categorySlug =
    typeof product.category === 'string'
      ? product.category
      : product.category?.slug;

  // ============================================================
  // PRODUCT IMAGE
  // ============================================================

  const productImage =
    product.images?.[0] ||
    product.image ||
    '';

  // ============================================================
  // CURRENT VARIANT PRICE
  // ============================================================

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price || 0)
    : Number(product.price || 0);

  // ============================================================
  // CURRENT STOCK
  // ============================================================

  const currentStock = selectedVariant
    ? Number(selectedVariant.stock || 0)
    : Number(product.stock || 0);

  // ============================================================
  // GET VARIANT ID SAFELY
  // ============================================================

  function getVariantId(variant) {
    if (!variant) {
      return null;
    }

    const id =
      variant._id ||
      variant.id ||
      null;

    if (!id) {
      return null;
    }

    return String(id);
  }

  // ============================================================
  // HANDLE VARIANT SELECT
  // ============================================================

  function handleVariantSelect(variant) {
    const variantId = getVariantId(variant);

    console.log(
      'Selected Variant:',
      variant
    );

    console.log(
      'Selected Variant ID:',
      variantId
    );

    setSelectedVariant(variant);
  }

  // ============================================================
  // ADD TO CART
  // ============================================================

  function handleAddToCart() {
    if (currentStock <= 0 || adding) {
      return;
    }

    // ========================================================
    // IMPORTANT
    // ========================================================

    const productId = String(
      product._id || product.id
    );

    const variantId = getVariantId(
      selectedVariant
    );

    // Agar product mein variants hain
    // to variantId lazmi hona chahiye
    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0 &&
      !variantId
    ) {
      console.error(
        'Variant ID missing:',
        selectedVariant
      );

      alert(
        'Please select a valid variant before adding to cart.'
      );

      return;
    }

    console.log('==============================');
    console.log('ADDING PRODUCT TO CART');
    console.log('Product ID:', productId);
    console.log('Variant ID:', variantId);
    console.log('Variant:', selectedVariant);
    console.log('Price:', currentPrice);
    console.log('Stock:', currentStock);
    console.log('==============================');

    setAdding(true);

    // ========================================================
    // ADD ITEM
    // ========================================================

    dispatch(
      addItem({
        ...product,

        id: productId,

        // IMPORTANT
        variantId: variantId,

        variantLabel:
          selectedVariant?.label ||
          (
            selectedVariant?.weight !== undefined &&
            selectedVariant?.weight !== null
              ? `${selectedVariant.weight} ${
                  selectedVariant.unit || ''
                }`
              : ''
          ),

        variantWeight:
          selectedVariant?.weight ?? null,

        variantUnit:
          selectedVariant?.unit || '',

        price: Number(currentPrice),

        stock: Number(currentStock),

        quantity: 1,
      })
    );

    // ========================================================
    // TOAST
    // ========================================================

    setToastVisible(true);

    setTimeout(() => {
      setAdding(false);
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    }, 500);

    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  }

  // ============================================================
  // BUY NOW
  // ============================================================

  function handleBuyNow() {
    if (currentStock <= 0) {
      return;
    }

    const variantId = getVariantId(
      selectedVariant
    );

    // Variant validation
    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0 &&
      !variantId
    ) {
      alert(
        'Please select a valid variant before continuing.'
      );

      return;
    }

    handleAddToCart();

    navigate('/checkout');
  }

  // ============================================================
  // RETURN UI
  // ============================================================

  return (
    <div>

      {/* ======================================================
          TOAST
      ====================================================== */}

      <div
        className={`fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl bg-green-700 px-5 py-4 text-white shadow-xl transition-all duration-300 ${
          toastVisible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <svg
          className="h-5 w-5 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="m4 10 4 4 8-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-sm font-semibold">
          {product.name} added to cart!
        </span>
      </div>

      {/* ======================================================
          BREADCRUMBS
      ====================================================== */}

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

      {/* ======================================================
          PRODUCT MAIN SECTION
      ====================================================== */}

      <div className="mt-8 grid gap-10 lg:grid-cols-2">

        {/* ====================================================
            IMAGE
        ==================================================== */}

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

        {/* ====================================================
            DETAILS
        ==================================================== */}

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b9862f]">
            Product Details
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-brand-900">
            {product.name}
          </h1>

          {/* RATING */}

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

          {/* ==================================================
              VARIANTS
          ================================================== */}

          {Array.isArray(product.variants) &&
            product.variants.length > 0 && (
              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <p className="font-bold text-brand-900">
                    Select Weight
                  </p>

                  {selectedVariant && (
                    <span className="text-sm font-semibold text-brand-700">
                      {selectedVariant.label ||
                        (
                          selectedVariant.weight !==
                            undefined &&
                          selectedVariant.weight !==
                            null
                            ? `${selectedVariant.weight} ${
                                selectedVariant.unit ||
                                ''
                              }`
                            : ''
                        )}
                    </span>
                  )}

                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {product.variants.map(
                    (variant) => {

                      const variantId =
                        getVariantId(
                          variant
                        );

                      const selected =
                        getVariantId(
                          selectedVariant
                        ) === variantId;

                      const outOfStock =
                        Number(
                          variant.stock || 0
                        ) <= 0;

                      return (
                        <button
                          key={
                            variantId ||
                            `${variant.weight}-${variant.unit}-${variant.price}`
                          }
                          type="button"
                          disabled={
                            outOfStock
                          }
                          onClick={() =>
                            handleVariantSelect(
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
                              (
                                variant.weight !==
                                  undefined &&
                                variant.weight !==
                                  null
                                  ? `${variant.weight} ${
                                      variant.unit ||
                                      ''
                                    }`
                                  : 'Variant'
                              )}
                          </div>

                          <div className="mt-1 text-sm font-bold text-brand-700">
                            Rs.{' '}
                            {Number(
                              variant.price ||
                                0
                            )}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {outOfStock
                              ? 'Out of stock'
                              : `${Number(
                                  variant.stock ||
                                    0
                                )} available`}
                          </div>

                        </button>
                      );
                    }
                  )}

                </div>

                {/* DEBUG INFORMATION */}
                {selectedVariant && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">

                    <div>
                      Selected Variant ID:{' '}
                      <strong>
                        {getVariantId(
                          selectedVariant
                        ) || 'NULL'}
                      </strong>
                    </div>

                  </div>
                )}

              </div>
            )}

          {/* ==================================================
              STOCK
          ================================================== */}

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

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="mt-8 flex flex-wrap gap-3">

            {/* ADD TO CART */}

            <button
              type="button"
              disabled={
                currentStock <= 0 ||
                adding
              }
              onClick={
                handleAddToCart
              }
              className={`relative flex min-w-[160px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                added
                  ? 'bg-green-700 shadow-lg shadow-green-900/20'
                  : 'bg-brand-700 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lg'
              }`}
            >

              {adding ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Adding
                </>
              ) : added ? (
                <>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="m4 10 4 4 8-8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Added
                </>
              ) : (
                'Add to Cart'
              )}

            </button>

            {/* BUY NOW */}

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

          {/* ==================================================
              WHATSAPP
          ================================================== */}

          <a
            href={`https://wa.me/92312889186?text=${encodeURIComponent(
              `Assalamualaikum, I want to order ${
                product.name
              }${
                selectedVariant
                  ? ` - ${
                      selectedVariant.label ||
                      (
                        selectedVariant.weight !==
                          undefined &&
                        selectedVariant.weight !==
                          null
                          ? `${selectedVariant.weight} ${
                              selectedVariant.unit ||
                              ''
                            }`
                          : ''
                      )
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

      {/* ======================================================
          RELATED PRODUCTS
      ====================================================== */}

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