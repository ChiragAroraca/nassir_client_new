import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Thunk to fetch all customers for a seller
export const get_seller_customers = createAsyncThunk(
  "customers/get_seller_customers",
  async ({ parPage, page, searchValue, sellerId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/seller/customers/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to fetch a specific customer's details
export const get_seller_customer = createAsyncThunk(
  "customers/get_seller_customer",
  async (customerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/seller/customer/${customerId}`, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const update_customer_status = createAsyncThunk(
    "customers/update_customer_status",
    async ({ customerId, updatedData }, { rejectWithValue, fulfillWithValue }) => {
      try {
        const { data } = await api.put(
          `/seller/customers/${customerId}`,
          updatedData,
          { withCredentials: true }
        );
        return fulfillWithValue(data); 
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message); // Handle errors
      }
    }
  );
  

// Customer Reducer
export const CustomerReducer = createSlice({
  name: "customer",
  initialState: {
    successMessage: "",
    errorMessage: "",
    totalCustomer: 0,
    customer: {},
    myCustomers: [],
    loading: false,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_seller_customers.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_seller_customers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myCustomers = payload.customers;
        state.totalCustomer = payload.totalCustomer;
      })
      .addCase(get_seller_customers.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.message || "Failed to fetch customers";
      })

      .addCase(get_seller_customer.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_seller_customer.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.customer = payload.customer;
      })
      .addCase(get_seller_customer.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.message || "Failed to fetch customer details";
      })
      .addCase(update_customer_status.pending, (state) => {
        state.loading = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(update_customer_status.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = "Customer status updated successfully";
        const index = state.myCustomers.findIndex(
          (customer) => customer._id === payload.customer._id
        );
        if (index !== -1) {
          state.myCustomers[index] = payload.customer;
        }
      })
      .addCase(update_customer_status.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload || "Failed to update customer status";
      });
  },
});

export const { messageClear } = CustomerReducer.actions;
export default CustomerReducer.reducer;
