import { AiOutlineDashboard, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';
import { FaUserTimes, FaUsers } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { FaCodePullRequest } from 'react-icons/fa6';
import { IoIosChatbubbles } from 'react-icons/io';
import { IoMdAdd } from 'react-icons/io';
import { MdViewList } from 'react-icons/md';
import { TbBasketDiscount} from 'react-icons/tb';
import { BsCartCheck, BsSaveFill, BsUpload } from 'react-icons/bs';
import { IoChatbubbles } from 'react-icons/io5';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';

export const allNav = [
  {
    id: 1,
    title: 'Dashboard',
    icon: <AiOutlineDashboard />,
    role: 'admin',
    path: '/admin/dashboard',
  },
  {
    id: 2,
    title: 'Orders',
    icon: <AiOutlineShoppingCart />,
    role: 'admin',
    path: '/admin/dashboard/orders',
  },
  {
    id: 3,
    title: 'Category',
    icon: <BiCategory />,
    role: 'admin',
    path: '/admin/dashboard/category',
  },
  {
    id: 4,
    title: 'Sellers',
    icon: <FaUsers />,
    role: 'admin',
    path: '/admin/dashboard/sellers',
  },
  {
    id: 5,
    title: 'Payment Request',
    icon: <MdPayment />,
    role: 'admin',
    path: '/admin/dashboard/payment-request',
  },
  {
    id: 6,
    title: 'Deactive Sellers',
    icon: <FaUserTimes />,
    role: 'admin',
    path: '/admin/dashboard/deactive-sellers',
  },
  {
    id: 7,
    title: 'Seller Request',
    icon: <FaCodePullRequest />,
    role: 'admin',
    path: '/admin/dashboard/sellers-request',
  },
  {
    id: 8,
    title: 'Live Chat',
    icon: <IoIosChatbubbles />,
    role: 'admin',
    path: '/admin/dashboard/chat-sellers',
  },
  {
    id: 9,
    title: 'Dashboard',
    icon: <AiOutlineDashboard />,
    role: 'seller',
    path: '/seller/dashboard',
  },
  {
    id: 10,
    title: 'Add Product',
    icon: <IoMdAdd />,
    role: 'seller',
    path: '/seller/dashboard/add-product',
  },
  {
    id: 11,
    title: 'All Product',
    icon: <MdViewList />,
    role: 'seller',
    path: '/seller/dashboard/products',
  },
  {
    id: 10,
    title: 'Retailer Products',
    icon: <MdViewList />,
    role: 'seller',
    path: '/seller/dashboard/retailer-products',
  },
  {
    id: 10,
    title: 'Vendor Products',
    icon: <MdViewList />,
    role: 'seller',
    path: '/seller/dashboard/vendor-products',
  },
  {
    id: 17,
    title: 'Profile',
    icon: <CgProfile />,
    role: 'seller',
    path: '/seller/dashboard/profile',
  }
];
