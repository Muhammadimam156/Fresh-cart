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

    // Small loading animation
    setTimeout(() => {
      setAdding(false);
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1200);
    }, 500);
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#dde3d8] bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Product Image */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-[#f5f5ef]"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            No Image
          </div>
        )}

        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9862f]">
          FreshKart
        </p>

        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 text-2xl font-semibold text-brand-900 transition-colors duration-300 group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#637260]">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-brand-900">
            Rs. {product.price}
          </p>

          {product.stock > 0 && (
            <span className="text-xs font-semibold text-green-700">
              In stock
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-2">
          {/* View Product */}
          <Link
            to={`/product/${product.slug}`}
            className="group/view flex-1 rounded-full border border-[#d7ddce] px-4 py-3 text-center text-sm font-bold text-brand-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-700 hover:bg-brand-50 active:scale-95"
          >
            <span>View</span>
          </Link>

          {/* Add To Cart */}
          <button
            type="button"
            disabled={product.stock <= 0 || adding}
            onClick={handleAddToCart}
            className={`group/cart relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-3 text-sm font-bold text-white transition-all duration-300 active:scale-95 ${
              added
                ? 'bg-green-700 shadow-lg'
                : 'bg-brand-700 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lg'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {/* Shine animation */}
            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover/cart:translate-x-0" />

            {adding ? (
              <>
                {/* Spinner */}
                <span className="relative z-10 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                <span className="relative z-10">
                  Adding...
                </span>
              </>
            ) : added ? (
              <>
                {/* Check icon */}
                <svg
                  className="relative z-10 h-4 w-4 animate-[scaleIn_0.25s_ease-out]"
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

                <span className="relative z-10">
                  Added
                </span>
              </>
            ) : (
              <>
                <span className="relative z-10">
                  Add to Cart
                </span>

                {/* Arrow */}
                <svg
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/cart:translate-x-1"
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
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}