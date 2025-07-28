import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/buyer/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import BuyerProfilePage from './pages/buyer/BuyerProfilePage';
import SellerProfilePage from './pages/seller/SellerProfilePage';
import SellerRegisterPage from './pages/seller/SellerRegisterPage';
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import AddOrEditProductPage from './pages/seller/AddorEditProductPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ManageProductsPage from './pages/seller/ManageProductsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminManageSellersPage from './pages/admin/AdminManageSellersPage';
import AdminManageProductsPage from './pages/admin/AdminManageProductsPage';

// 👇 Import route guards
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';
import AdminRoute from './routes/AdminRoute';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-buyer" element={<RegisterPage />} />
            <Route path="/register-seller" element={<SellerRegisterPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
            <Route path="/search" element={<CategoryPage />} />

            {/* ✅ Protected (logged-in) Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile/buyer" element={<BuyerProfilePage />} />
            </Route>

            {/* ✅ Seller-Only Routes */}
            <Route element={<RoleRoute allowedRoles={['seller']} />}>
              <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
              <Route path="/seller/add-product" element={<AddOrEditProductPage />} />
              <Route path="/seller/products" element={<ManageProductsPage />} />
              <Route path="/profile/seller" element={<SellerProfilePage />} />
            </Route>


            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/sellers" element={<AdminManageSellersPage />} />
                <Route path="/admin/products" element={<AdminManageProductsPage />} />
                {/* Add more admin routes here */}
              </Route>
            </Route>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
