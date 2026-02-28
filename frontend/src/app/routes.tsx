import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Cart } from './pages/Cart';

function Root({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

function AuthRoot({ children }: { children: React.ReactNode }) {
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
    path: '/customer/dashboard',
    element: <Root><CustomerDashboard /></Root>,
  },
  {
    path: '/customer/cart',
    element: <Root><Cart /></Root>,
  },
  {
    path: '/customer/orders',
    element: <Root><CustomerDashboard /></Root>,
  },
  {
    path: '/customer/favorites',
    element: <Root><CustomerDashboard /></Root>,
  },
  {
    path: '/customer/profile',
    element: <Root><CustomerDashboard /></Root>,
  },
  {
    path: '/vendor/dashboard',
    element: <Root><VendorDashboard /></Root>,
  },
  {
    path: '/vendor/products',
    element: <Root><VendorDashboard /></Root>,
  },
  {
    path: '/vendor/orders',
    element: <Root><VendorDashboard /></Root>,
  },
  {
    path: '/admin/dashboard',
    element: <Root><AdminDashboard /></Root>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
