import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addItem } from '../features/cart/cartSlice';

export function ProductCard({ product }) {
  const dispatch = useDispatch();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const productId = product._id || product.id;

  const image =
    product.image ||
    product.images?.[0] ||
    '';

  const handleAddToCart = () => {
    if (adding || product.stock <= 0) return;

    setAdding(true);

    dispatch(
      addItem({
        ...product,
        quantity: 1,
      })
    );

    setTimeout(() => {
      setAdding(false);
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1200);
    }, 500);
  };

  return (
    <article
      className="
        group flex h-full flex-col
        overflow-hidden rounded-3xl
        border border-[#dde3d8]
        bg-white
        shadow-soft
        transition-all duration-300
        hover:-translate-y-2
        hover:shadow-xl
      "
    >
      {/* =====================================================
          PRODUCT IMAGE
      ====================================================== */}

      <Link
  to={`/product/${product.slug}`}
  className="group/image relative block h-64 w-full overflow-hidden bg-[#f3f1e8]"
>
  {image ? (
    <>
      {/* Background — empty gap hide karega */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="
          absolute inset-0
          h-full w-full
          scale-110
          object-cover
          blur-2xl
          opacity-25
        "
      />

      {/* Main image — POORI image visible */}
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <img
          src={image}
          alt={product.name || 'Product'}
          loading="lazy"
          className="
            h-full
            w-full
            object-contain
            object-center
            drop-shadow-md
            transition-transform
            duration-500
            ease-out
            group-hover/image:scale-105
          "
        />
      </div>

      {/* Light overlay */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-white/5
          transition
          duration-300
          group-hover/image:bg-transparent
        "
      />
    </>
  ) : (
    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
      No Image
    </div>
  )}

  {product.stock <= 0 && (
    <div className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white">
      Out of Stock
    </div>
  )}
</Link>

      {/* =====================================================
          PRODUCT CONTENT
      ====================================================== */}

      <div className="flex flex-1 flex-col p-5">

        {/* Brand / Category */}

        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#b9862f]
          "
        >
          Desi Food
        </p>

        {/* Product Name */}

        <Link to={`/product/${product.slug}`}>
          <h3
            className="
              mt-2
              line-clamp-2
              min-h-[3.5rem]
              text-2xl
              font-semibold
              leading-7
              text-brand-900
              transition-colors
              duration-300
              group-hover:text-brand-700
            "
          >
            {product.name}
          </h3>
        </Link>

        {/* Description */}

        {product.description && (
          <p
            className="
              mt-2
              line-clamp-2
              min-h-[3rem]
              text-sm
              leading-6
              text-[#637260]
            "
          >
            {product.description}
          </p>
        )}

        {/* =====================================================
            PRICE
        ====================================================== */}

        <div className="mt-4 flex items-center justify-between">

          <p
            className="
              text-xl
              font-bold
              text-brand-900
            "
          >
            Rs. {product.price}
          </p>

          {product.stock > 0 && (
            <span
              className="
                rounded-full
                bg-green-50
                px-2.5 py-1
                text-xs
                font-semibold
                text-green-700
              "
            >
              In stock
            </span>
          )}

        </div>

        {/* =====================================================
            BUTTONS
        ====================================================== */}

        <div className="mt-auto flex gap-2 pt-5">

          {/* VIEW BUTTON */}

          <Link
            to={`/product/${product.slug}`}
            className="
              group/view
              flex
              min-h-[44px]
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-full
              border
              border-[#d7ddce]
              bg-white
              px-3
              py-3
              text-center
              text-sm
              font-bold
              text-brand-900
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-brand-700
              hover:bg-brand-50
              hover:shadow-sm
              active:scale-95
            "
          >
            <span>
              View
            </span>

            <svg
              className="
                h-4 w-4
                transition-transform
                duration-300
                group-hover/view:translate-x-1
              "
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 10h11M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* ADD TO CART */}

          <button
            type="button"
            disabled={
              product.stock <= 0 ||
              adding
            }
            onClick={handleAddToCart}
            className={`
              group/cart
              relative
              flex
              min-h-[44px]
              flex-1
              items-center
              justify-center
              gap-1.5
              overflow-hidden
              rounded-full
              px-3
              py-3
              text-sm
              font-bold
              text-white
              transition-all
              duration-300
              active:scale-95

              ${
                added
                  ? `
                    bg-green-700
                    shadow-lg
                    shadow-green-900/20
                  `
                  : `
                    bg-brand-700
                    hover:-translate-y-0.5
                    hover:bg-brand-800
                    hover:shadow-lg
                    hover:shadow-brand-900/20
                  `
              }

              disabled:
              cursor-not-allowed
              disabled:opacity-50
              disabled:hover:translate-y-0
              disabled:hover:shadow-none
            `}
          >

            {/* Shine */}

            <span
              className="
                pointer-events-none
                absolute
                inset-0
                -translate-x-full
                bg-white/10
                transition-transform
                duration-500
                group-hover/cart:translate-x-0
              "
            />

            {/* LOADING */}

            {adding ? (
              <>
                <span
                  className="
                    relative
                    z-10
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />

                <span className="relative z-10">
                  Adding
                </span>
              </>
            ) : added ? (
              /* ADDED */

              <>
                <svg
                  className="
                    relative
                    z-10
                    h-4
                    w-4
                    animate-[scaleIn_0.25s_ease-out]
                  "
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m4 10 4 4 8-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="relative z-10">
                  Added
                </span>
              </>
            ) : (
              /* DEFAULT */

              <>
                <span className="relative z-10">
                  Add
                </span>

                <svg
                  className="
                    relative
                    z-10
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover/cart:translate-x-1
                  "
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10h12M11 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}

          </button>

        </div>
      </div>
    </article>
  );
}