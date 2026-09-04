import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import Layout from "./components/Layout";
import ComingSoonPage from "./components/ComingSoonPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ProductsPage from "./features/products/pages/ProductsPage";
import CategoriesPage from "./features/categories/pages/CategoriesPage";
import OrdersPage from "./features/orders/pages/OrdersPage";
import OrderDetailPage from "./features/orders/pages/OrderDetailPage";
import UsersPage from "./features/users/pages/UsersPage";
import LocationsPage from "./features/locations/pages/LocationsPage";
import ShippingZonesPage from "./features/shipping-zones/pages/ShippingZonesPage";
import MediaPage from "./features/media/pages/MediaPage";
import AbandonedCartsPage from "./features/abandoned-carts/pages/AbandonedCartsPage";
import CustomersPage from "./features/customers/pages/CustomersPage";
import AdminsPage from "./features/admins/pages/AdminsPage";
import ReviewsPage from "./features/reviews/pages/ReviewsPage";
import RolesPage from "./features/roles/pages/RolesPage";

const comingSoonRoutes: { path: string; title: string }[] = [];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/shipping-zones" element={<ShippingZonesPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/abandoned-carts" element={<AbandonedCartsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/admins" element={<AdminsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/users" element={<UsersPage />} />
          {comingSoonRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ComingSoonPage title={route.title} />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
