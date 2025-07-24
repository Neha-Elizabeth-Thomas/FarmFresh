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

// 👇 Import route guards
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';


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

            {/* Add more RoleRoute for admin, buyer if needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
