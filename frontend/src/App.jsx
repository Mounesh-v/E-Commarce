import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AISearch from "./pages/AISearch";
import AdminRoute from "./components/AdminRoute";
import Profile from "./pages/Profile";
import Collections from "./pages/Collections";
import CancelPayment from "./pages/CancelPayment";
import SuccessPayment from "./pages/SuccessPayment";
import NotFound from "./pages/NotFound";
import CreateProduct from "./admin/CreateProduct";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-100 font-sans text-sage-900 transition-colors duration-300">
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            className:
              "text-sm font-medium rounded-xl border border-sage-100 bg-white text-sage-900 shadow-soft",
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/ai-search" element={<AISearch />} />
            <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <Collections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route path="/success" element={<SuccessPayment />} />
            <Route path="/cancel" element={<CancelPayment />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <CreateProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
