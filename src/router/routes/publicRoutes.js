import { lazy } from 'react';
import VendorProductDetails from '../../views/seller/VendorProductDetails';
import RetailerProductDetails from '../../views/seller/RetailerProductDetails';
const Login = lazy(() => import('../../views/auth/Login'));
const Register = lazy(() => import('../../views/auth/Register'));
const AdminLogin = lazy(() => import('../../views/auth/AdminLogin'));
const Home = lazy(() => import('../../views/Home'));
const UnAuthorized = lazy(() => import('../../views/UnAuthorized'));
const Success = lazy(() => import('../../views/Success'));

const publicRoutes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/unauthorized',
    element: <UnAuthorized />,
  },
  {
    path: '/success?',
    element: <Success />,
  },
  {
    path:'/vendor-product/:id',
    element:<VendorProductDetails/>
  },
  {
    path:'/retailer-product/:id',
    element:<RetailerProductDetails/>
  }
];

export default publicRoutes;
