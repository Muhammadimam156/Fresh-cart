import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://fresh-cart-server-six.vercel.app/api',
  timeout: 10000,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function getCategories() {
  try {
    const res = await api.get('/categories');
    return res.data.categories;
  } catch (err) {
    return null;
  }
}

export async function getProducts(params = {}) {
  try {
    const res = await api.get('/products', { params });
    return res.data.products;
  } catch (err) {
    return null;
  }
}

export async function getProductBySlug(slug) {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data.product;
  } catch (err) {
    return null;
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const res = await api.get(`/categories/${slug}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function register(payload) {
  const res = await api.post('/auth/register', payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post('/auth/login', payload);
  return res.data;
}

export async function fetchMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function getSettings() {
  const res = await api.get('/settings');
  return res.data.setting;
}

export async function createContactMessage(payload) {
  const res = await api.post('/contact', payload);
  return res.data;
}

export async function getMyOrders() {
  const res = await api.get('/orders/me');
  return res.data.orders;
}

export async function getAllOrders() {
  const res = await api.get('/orders');
  return res.data.orders;
}

export async function updateOrderStatus(id, payload) {
  const res = await api.patch(`/orders/${id}/status`, payload);
  return res.data.order;
}

export async function validateCoupon(code) {
  const res = await api.post('/coupons/validate', { code });
  return res.data;
}

export async function createOrder(payload) {
  const res = await api.post('/orders', payload);
  return res.data.order;
}

// Admin: categories
export async function createCategory(payload) {
  const res = await api.post('/categories', payload);
  return res.data.category;
}

export async function updateCategory(id, payload) {
  const res = await api.put(`/categories/${id}`, payload);
  return res.data.category;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
}

// Admin: products
export async function createProduct(payload) {
  const res = await api.post('/products', payload);
  return res.data.product;
}

export async function updateProduct(id, payload) {
  const res = await api.put(`/products/${id}`, payload);
  return res.data.product;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}

// Upload image
export async function uploadImage(file) {
  const data = new FormData();
  data.append('image', file);

  const res = await api.post('/uploads', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });

  return res.data;
}
export async function getAdminDashboard() {
  const res = await api.get('/admin/dashboard');
  return res.data;
}

export default api;