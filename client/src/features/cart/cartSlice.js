import { createSlice } from '@reduxjs/toolkit';

const storageKey = 'freshcart-cart';

function loadCart() {
  try {
    const saved =
      window.localStorage.getItem(
        storageKey
      );

    return saved
      ? JSON.parse(saved)
      : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(items)
    );
  } catch {
    // Ignore storage errors
  }
}

const cartSlice =
  createSlice({
    name: 'cart',

    initialState: {
      items:
        typeof window === 'undefined'
          ? []
          : loadCart(),
    },

    reducers: {
      addItem(state, action) {
        const item =
          action.payload;

        const productId =
          item.id || item._id;

        const variantId =
          item.variantId || null;

        const existing =
          state.items.find(
            (cartItem) =>
              (cartItem.id ||
                cartItem._id) ===
                productId &&
              (cartItem.variantId ||
                null) ===
                variantId
          );

        if (existing) {
          existing.quantity +=
            Number(
              item.quantity || 1
            );
        } else {
          state.items.push({
            ...item,

            id: productId,

            variantId,

            variantLabel:
              item.variantLabel ||
              '',

            variantWeight:
              item.variantWeight ??
              null,

            variantUnit:
              item.variantUnit ||
              '',

            price: Number(
              item.price || 0
            ),

            quantity: Number(
              item.quantity || 1
            ),
          });
        }

        saveCart(state.items);
      },

      removeItem(
        state,
        action
      ) {
        const {
          id,
          variantId = null,
        } = action.payload;

        state.items =
          state.items.filter(
            (item) =>
              !(
                (item.id ||
                  item._id) ===
                  id &&
                (item.variantId ||
                  null) ===
                  variantId
              )
          );

        saveCart(
          state.items
        );
      },

      updateQuantity(
        state,
        action
      ) {
        const {
          id,
          variantId = null,
          quantity,
        } = action.payload;

        const item =
          state.items.find(
            (cartItem) =>
              (cartItem.id ||
                cartItem._id) ===
                id &&
              (cartItem.variantId ||
                null) ===
                variantId
          );

        if (item) {
          item.quantity =
            Math.max(
              1,
              Number(quantity)
            );
        }

        saveCart(
          state.items
        );
      },

      clearCart(state) {
        state.items = [];

        saveCart(
          state.items
        );
      },
    },
  });

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;