import { type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Cart } from './pages/Cart';
import { ProtectedRoute } from './components/ProtectedRoute';

function Root({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}

function AuthRoot({ children }: { children: ReactNode }) {
  return <Layout hideFooter>{children}</Layout>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root><Home /></Root>,
  },
  {
    path: '/catalog',
    element: <Root><Catalog /></Root>,
  },
  {
    path: '/product/:id',
    element: <Root><ProductDetail /></Root>,
  },
  {
    path: '/login',
    element: <AuthRoot><Login /></AuthRoot>,
  },
  {
    path: '/register',
    element: <AuthRoot><Register /></AuthRoot>,
  },
  {
    path: '/profile',
    element: <Root><ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}><Profile /></ProtectedRoute></Root>,
  },
  // -- Customer routes (protected) --
  {
    path: '/customer/dashboard',
    element: <Root><ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute></Root>,
  },
  {
    path: '/customer/cart',
    element: <Root><ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute></Root>,
  },
  {
    path: '/customer/orders',
    element: <Root><ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute></Root>,
  },
  {
    path: '/customer/favorites',
    element: <Root><ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute></Root>,
  },
  {
    path: '/customer/profile',
    element: <Navigate to="/profile" replace />,
  },
  // -- Vendor routes (protected) --
  {
    path: '/vendor/dashboard',
    element: <Root><ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute></Root>,
  },
  {
    path: '/vendor/products',
    element: <Root><ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute></Root>,
  },
  {
    path: '/vendor/orders',
    element: <Root><ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute></Root>,
  },
  // -- Admin routes (protected) --
  {
    path: '/admin/dashboard',
    element: <Root><ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute></Root>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
