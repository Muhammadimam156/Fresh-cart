import { createSlice } from '@reduxjs/toolkit';

const storageKey = 'freshcart-cart';

function loadCart() {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Ignore storage errors in private browsing or restricted contexts.
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: typeof window === 'undefined' ? [] : loadCart(),
  },
  reducers: {
    addItem(state, action) {
      const item = action.payload;
      const existing = state.items.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        existing.quantity += item.quantity ?? 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity ?? 1 });
      }

      saveCart(state.items);
    },
    removeItem(state, action) {
      state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((cartItem) => cartItem.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity);
      }

      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;