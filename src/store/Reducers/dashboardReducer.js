import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const get_admin_dashboard_data = createAsyncThunk(
  'dashboard/get_admin_dashboard_data',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/admin/get-dashboard-data', {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End method

export const get_seller_dashboard_data = createAsyncThunk(
  'dashboard/get_seller_dashboard_data',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/seller/get-dashboard-data', {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End method

export const syncRetailerData = createAsyncThunk(
  'dashboard/sync_retailer_data',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/seller/sync-retailer', {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncProductsData = createAsyncThunk(
  'dashboard/sync_products_data',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/seller/sync-products', {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncVendorsData = createAsyncThunk(
  'dashboard/sync_vendor_data',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      // POST request to /seller/sync-retailer
      const { data } = await api.get('/seller/sync-vendor', {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const dashboardReducer = createSlice({
  name: 'dashboard',
  initialState: {
    totalSale: 0,
    totalOrder: 0,
    totalProduct: 0,
    totalPendingOrder: 0,
    totalSeller: 0,
    recentOrder: [],
    recentMessage: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
        state.totalSale = payload.totalSale;
        state.totalOrder = payload.totalOrder;
        state.totalProduct = payload.totalProduct;
        state.totalSeller = payload.totalSeller;
        state.recentOrder = payload.recentOrders;
        state.recentMessage = payload.messages;
      })
      .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
        state.totalSale = payload.totalSale;
        state.totalOrder = payload.totalOrder;
        state.totalProduct = payload.totalProduct;
        state.totalPendingOrder = payload.totalPendingOrder;
        state.recentOrder = payload.recentOrders;
        state.recentMessage = payload.messages;
      });
  },
});
export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;