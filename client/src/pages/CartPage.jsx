import { Link } from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  removeItem,
  updateQuantity,
} from '../features/cart/cartSlice';

import { Breadcrumbs } from '../components/Breadcrumbs';

export function CartPage() {
  const dispatch =
    useDispatch();

  const items = useSelector(
    (state) => state.cart.items
  );

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  const delivery =
    items.length > 0
      ? 150
      : 0;

  const grandTotal =
    subtotal + delivery;

  function getItemId(item) {
    return item.id || item._id;
  }

  function getVariantName(item) {
    if (!item.variantId) {
      return null;
    }

    return (
      item.variantLabel ||
      `${item.variantWeight || ''} ${
        item.variantUnit || ''
      }`.trim()
    );
  }

  return (
    <div className="section-shell py-10 lg:py-14">
      <Breadcrumbs
        items={[
          {
            label: 'Home',
            to: '/',
          },
          {
            label: 'Cart',
          },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* CART */}

        <section className="organic-card p-6">
          <h1 className="text-5xl font-semibold text-brand-900">
            Your Cart
          </h1>

          <div className="mt-6 grid gap-4">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[#60705f]">
                  Your cart is empty.
                </p>

                <Link
                  to="/shop"
                  className="btn-primary mt-5 inline-flex"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemId =
                  getItemId(item);

                const variantName =
                  getVariantName(
                    item
                  );

                return (
                  <article
                    key={`${itemId}-${item.variantId || 'default'}`}
                    className="flex flex-col gap-4 rounded-3xl border border-[#dde3d8] bg-[#fffef9] p-4 sm:flex-row sm:items-center"
                  >
                    {/* IMAGE */}

                    <img
                      src={
                        item.images?.[0] ||
                        item.image ||
                        ''
                      }
                      alt={
                        item.name
                      }
                      className="h-24 w-32 rounded-2xl object-cover"
                    />

                    {/* INFO */}

                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-brand-900">
                        {item.name}
                      </h2>

                      {variantName && (
                        <p className="mt-1 font-semibold text-brand-700">
                          Weight:{' '}
                          {
                            variantName
                          }
                        </p>
                      )}

                      <p className="mt-1 text-sm text-[#60705f]">
                        Rs.{' '}
                        {item.price}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Rs.{' '}
                        {item.price}{' '}
                        ×{' '}
                        {item.quantity}
                      </p>
                    </div>

                    {/* QUANTITY */}

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={
                          item.quantity <=
                          1
                        }
                        onClick={() =>
                          dispatch(
                            updateQuantity(
                              {
                                id: itemId,
                                variantId:
                                  item.variantId ||
                                  null,
                                quantity:
                                  item.quantity -
                                  1,
                              }
                            )
                          )
                        }
                        className="h-10 w-10 rounded-full border border-[#d9dece] text-lg disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center font-semibold">
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantity(
                              {
                                id: itemId,
                                variantId:
                                  item.variantId ||
                                  null,
                                quantity:
                                  item.quantity +
                                  1,
                              }
                            )
                          )
                        }
                        className="h-10 w-10 rounded-full border border-[#d9dece] text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          removeItem({
                            id: itemId,
                            variantId:
                              item.variantId ||
                              null,
                          })
                        )
                      }
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* SUMMARY */}

        <aside className="organic-card h-fit p-6">
          <h2 className="text-4xl font-semibold text-brand-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-3 text-sm text-[#60705f]">
            <div className="flex items-center justify-between">
              <span>
                Subtotal
              </span>

              <span>
                Rs. {subtotal}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>
                Delivery Charges
              </span>

              <span>
                Rs. {delivery}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-[#dde3d8] pt-4 text-base font-bold text-brand-900">
              <span>
                Grand Total
              </span>

              <span>
                Rs. {grandTotal}
              </span>
            </div>
          </div>

          <Link
            to="/checkout"
            className={`btn-primary mt-8 w-full ${
              items.length === 0
                ? 'pointer-events-none opacity-50'
                : ''
            }`}
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/contact"
            className="btn-secondary mt-3 w-full"
          >
            Order on WhatsApp
          </Link>
        </aside>
      </div>
    </div>
  );
}