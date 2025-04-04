import { lazy } from 'react';
import RetailerProducts from '../../views/seller/RetailerProducts';
import VendorProducts from '../../views/seller/VendorProducts';
const SellerDashboard = lazy(
  () => import('../../views/seller/SellerDashboard')
);
const AddProduct = lazy(() => import('../../views/seller/AddProduct'));
const Products = lazy(() => import('../../views/seller/Products'));
const Profile = lazy(() => import('../../views/seller/Profile'));
const EditProduct = lazy(() => import('../../views/seller/EditProduct'));
const Pending = lazy(() => import('./../../views/Pending'));
const Deactive = lazy(() => import('./../../views/Deactive'));
const AddBanner = lazy(() => import('../../views/seller/AddBanner'));

export const sellerRoutes = [
  {
    path: '/seller/account-pending',
    element: <Pending />,
    ability: 'seller',
  },
  {
    path: '/seller/account-deactive',
    element: <Deactive />,
    ability: 'seller',
  },
  {
    path: '/seller/dashboard',
    element: <SellerDashboard />,
    role: 'seller',
    status: 'active',
  },
  {
    path: '/seller/dashboard/add-product',
    element: <AddProduct />,
    role: 'seller',
    status: 'active',
  },
  {
    path: '/seller/dashboard/retailer-products',
    element: <RetailerProducts />,
    role: 'seller',
    status: 'active',
  },
  {
    path: '/seller/dashboard/vendor-products',
    element: <VendorProducts />,
    role: 'seller',
    status: 'active',
  },
  {
    path: '/seller/dashboard/edit-product/:productId',
    element: <EditProduct />,
    role: 'seller',
    status: 'active',
  },
  {
    path: '/seller/dashboard/products',
    element: <Products />,
    role: 'seller',
    status: 'active',
  },
  {
    path: '/seller/dashboard/profile',
    element: <Profile />,
    role: 'seller',
    visibility: ['active', 'deactive', 'pending'],
  },
  {
    path: '/seller/dashboard/add-banner/:productId',
    element: <AddBanner />,
    role: 'seller',
    status: 'active',
  },
];
