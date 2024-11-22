import OrderReducer from './Reducers/OrderReducer';
import PaymentReducer from './Reducers/PaymentReducer';
import authReducer from './Reducers/authReducer';
import bannerReducer from './Reducers/bannerReducer';
import categoryReducer from './Reducers/categoryReducer';
import chatReducer from './Reducers/chatReducer';
import CustomerReducer from './Reducers/customerReducer';
import dashboardReducer from './Reducers/dashboardReducer';
import productReducer from './Reducers/productReducer';
import sellerReducer from './Reducers/sellerReducer';

const rootReducer = {
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  seller: sellerReducer,
  chat: chatReducer,
  order: OrderReducer,
  customer: CustomerReducer,
  payment: PaymentReducer,
  dashboard: dashboardReducer,
  banner: bannerReducer,
};
export default rootReducer;
