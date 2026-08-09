import { Routes, Route } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { GenericPage } from './components/GenericPage';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { SuccessPage } from './pages/SuccessPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ShopPage } from './pages/ShopPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/Dashboard';
import { AdminCategories } from './admin/CategoriesPage';
import { AdminProducts } from './admin/ProductsPage';
import { AdminOrders } from './admin/OrdersPage';
import { MyOrdersPage } from './pages/MyOrdersPage';

const simpleRoutes = [
  ['/forgot-password', 'Forgot Password'],
  ['/reset-password', 'Reset Password'],
  ['/account/change-password', 'Change Password'],
  ['/admin/customers', 'Customer List'],
  ['/admin/messages', 'Messages'],
  ['/admin/settings', 'Store Settings'],
];

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="order-success" element={<SuccessPage />} />
        {simpleRoutes.map(([path, title]) => (
          <Route key={path} path={path} element={<GenericPage title={title} />} />
        ))}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/account/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
}
