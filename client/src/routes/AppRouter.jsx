import { Routes, Route } from "react-router-dom";

import AdminLogin from "../pages/admin/AdminLogin";
import HomePage from "../pages/HomePage";
import Shop from "../pages/Shop";
import Collections from "../pages/Collections";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminReturns from "../pages/admin/AdminReturns";
import NewArrivals from "../pages/NewArrivals";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../pages/Account";
import Addresses from "../pages/Addresses"; 
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import OrderDetails from "../pages/OrderDetails";
import About from "../pages/About";
import Contact from "../pages/Contact";
import SearchResults from "../pages/SearchResults";


export default function AppRouter() {
  return (

    
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/" element={<HomePage />} />

      <Route path="/shop" element={<Shop />} />

      <Route
        path="/collections"
        element={<Collections />}
      />

      <Route path="/admin" element={<AdminDashboard />} />

      <Route
  path="/admin/orders"
  element={<AdminOrders />}
/>

<Route path="/admin/products" element={<AdminProducts />} />

<Route
  path="/admin/customers"
  element={<AdminCustomers />}
/>

<Route
  path="/admin/returns"
  element={<AdminReturns />}
/>

      <Route
        path="/new-arrivals"
        element={<NewArrivals />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/account"
        element={<Account />}
      />

      <Route
        path="/addresses"
        element={<Addresses />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/order-success"
        element={<OrderSuccess />}
      />

      <Route
  path="/orders/:userId/:orderId"
  element={<OrderDetails />}
/>

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/search"
        element={<SearchResults />}
      />
    </Routes>
  );
}