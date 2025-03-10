import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";  
 
export const get_admin_orders = createAsyncThunk(
    'orders/get_admin_orders',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {

        try {
            const {data} = await api.get(`/admin/orders?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method  
 
  export const get_admin_order = createAsyncThunk(
    'orders/get_admin_order',
    async( orderId ,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.get(`/admin/order/${orderId}`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
) 
  // End Method  

  export const admin_order_status_update = createAsyncThunk(
    'orders/admin_order_status_update',
    async( {orderId,info} ,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.put(`/admin/order-status/update/${orderId}`,info,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
) 
  // End Method  

  export const get_seller_orders = createAsyncThunk(
    'orders/get_seller_orders',
    async({ parPage,page,searchValue,sellerId },{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.get(`/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
) 
  // End Method 
  export const update_pdf_status = createAsyncThunk(
    '/update-pdf-status',
    async ({ orderId, newStatus }, { rejectWithValue, fulfillWithValue }) => {
      try {
        // Send a POST request to update the PDF status
        const { data } = await api.post('/update-pdf-status', {
          orderId,
          newStatus,
        });
  
        // Return the response data on success
        return fulfillWithValue(data);
      } catch (error) {
        // Return error on failure
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );


  export const get_seller_order = createAsyncThunk(
    'orders/get_seller_order',
    async( orderId ,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.get(`/seller/order/${orderId}`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
) 
  // End Method  

  export const seller_order_status_update = createAsyncThunk(
    'orders/seller_order_status_update',
    async( {orderId,info} ,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.put(`/seller/order-status/update/${orderId}`,info,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
) 
  // End Method  

 
export const OrderReducer = createSlice({
    name: 'order',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        totalOrder: 0,
        order : {}, 
        myOrders: []
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
          
        .addCase(get_admin_orders.fulfilled, (state, { payload }) => {
            state.myOrders = payload.orders;
            state.totalOrder = payload.totalOrder; 
        })
        .addCase(get_admin_order.fulfilled, (state, { payload }) => {
            state.order = payload.order; 
        })
        .addCase(admin_order_status_update.rejected, (state, { payload }) => {
            state.errorMessage = payload.message; 
        })
        .addCase(admin_order_status_update.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; 
        })

        .addCase(get_seller_orders.fulfilled, (state, { payload }) => {
            state.myOrders = payload.orders;
            state.totalOrder = payload.totalOrder; 
        })
       .addCase(update_pdf_status.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update_pdf_status.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
      })
      .addCase(update_pdf_status.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
        .addCase(get_seller_order.fulfilled, (state, { payload }) => {
            state.order = payload.order; 
        })

        .addCase(seller_order_status_update.rejected, (state, { payload }) => {
            state.errorMessage = payload.message; 
        })
        .addCase(seller_order_status_update.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; 
        })
 

    }

})
export const {messageClear} = OrderReducer.actions
export default OrderReducer.reducer