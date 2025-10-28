import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const add_product = createAsyncThunk(
  'product/add_product',
  async (product, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/product-add', product, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method

export const get_product = createAsyncThunk(
  'product/get_product',
  async (productId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/product-get/${productId}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method

export const update_product = createAsyncThunk(
  'product/update_product',
  async (product, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/product-update', product, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method

export const product_image_update = createAsyncThunk(
  'product/product_image_update',
  async (
    { oldImage, newImage, productId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('oldImage', oldImage);
      formData.append('newImage', newImage);
      formData.append('productId', productId);
      const { data } = await api.post('/product-image-update', formData, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method
export const get_products = createAsyncThunk(
  'product/get_products',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/products-get?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue({
        products: data.data, // Product data
        pagination: data.pagination, // Pagination metadata
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_vendor_products = createAsyncThunk(
  'product/get_vendor_products',
  async (
    { parPage, page, searchValue,shopUrl},
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/vendor-products-get?page=${page}&searchValue=${searchValue}&parPage=${parPage}&shopUrl=${shopUrl}`,
        { withCredentials: true }
      );
      return fulfillWithValue({
        products: data.data, // Product data
        pagination: data.pagination, // Pagination metadata
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
export const get_retailer_products = createAsyncThunk(
  'product/get_retailer_products',
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/retailer-products-get?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue({
        products: data.data, // Product data
        pagination: data.pagination, // Pagination metadata
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const get_product_mapping = createAsyncThunk(
  'product/get_product_mapping',
  async (productMappingId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/product-mapping/${productMappingId}`);
      console.log("data.vendorProduct")
      return {
        productMapping: data.productMapping,
        shopURLs: data.shopURLs,
        vendorProduct: data.vendorProduct
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// AsyncThunk to publish a product to a shop
export const publish_product_to_shop = createAsyncThunk(
  'product/publish_product_to_shop',
  async ({ productMappingId, shopURL }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/publish-product', {
        productId: productMappingId,
        shopURL,
      });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const create_retailer_product = createAsyncThunk(
  'product/create_retailer_product',
  async (productData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('shopURL', productData.shopURL);
      formData.append('title', productData.title);
      formData.append('body_html', productData.body_html);
      formData.append('vendor', productData.vendor);
      formData.append('tags', productData.tags);
      formData.append('variants', JSON.stringify(productData.variants));
      
      // Append image files
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const { data } = await api.post('/create-retailer-product', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network error occurred' });
    }
  }
);

export const get_retail_shops = createAsyncThunk(
  'product/get_retail_shops',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/get-retail-shops', {}, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch retail shops');
    }
  }
);



// Product Reducer
export const productReducer = createSlice({
  name: 'product',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    products: [],
    shopsLoader: false, // Add this
  retailShops: [], // Add this
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
    },
    unmatchedProducts: [],
    productMappings: [],
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Add product cases
      .addCase(add_product.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_product.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(add_product.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })

      // Get products
      .addCase(get_products.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.products = payload.products;
        state.pagination = payload.pagination;
      })
      .addCase(get_products.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_products.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error || 'Failed to fetch products';
      })
      
      .addCase(get_product_mapping.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_vendor_products.fulfilled, (state, action) => {
        state.products = action.payload.products;  // Ensure Redux updates products
        state.hasMore=action.payload.pagination.hasMore;
        state.totalProduct = action.payload.pagination.total || 0;

      })
      .addCase(get_vendor_products.rejected, (state, action) => {
        console.error("Redux Fetch Error:", action.payload);
      })
      .addCase(get_retailer_products.fulfilled, (state, action) => {
        console.log(action.payload.products,'PRODUCTSM<')
        state.products = action.payload.products;  // Ensure Redux updates products
        state.hasMore=action.payload.pagination.hasMore;
        state.totalProduct = action.payload.pagination.total || 0;

      })
      .addCase(get_retailer_products.rejected, (state, action) => {
        console.error("Redux Fetch Error:", action.payload);
      })
      .addCase(get_product_mapping.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.productMapping = payload.productMapping;
        state.shopURLs = payload.shopURLs;
        state.vendorProduct = payload.vendorProduct;
      })
      .addCase(get_product_mapping.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload || 'Failed to fetch product mapping';
      })

      .addCase(publish_product_to_shop.pending, (state) => {
        state.loader = true;
      })
      .addCase(publish_product_to_shop.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload;
      })
      .addCase(publish_product_to_shop.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload || 'Failed to publish product';
      })
      .addCase(create_retailer_product.pending, (state) => {
  state.loader = true;
  state.errorMessage = '';
  state.successMessage = '';
})
.addCase(create_retailer_product.fulfilled, (state, { payload }) => {
  state.loader = false;
  state.successMessage = payload.message;
  // Optionally add the new product to the products array
  if (payload.product) {
    state.products.unshift(payload.product);
  }
})
.addCase(create_retailer_product.rejected, (state, { payload }) => {
  state.loader = false;
  state.errorMessage = payload?.error || payload?.message || 'Failed to create product';
})
.addCase(get_retail_shops.pending, (state) => {
  state.shopsLoader = true;
})
.addCase(get_retail_shops.fulfilled, (state, { payload }) => {
  state.shopsLoader = false;
  state.retailShops = payload.data?.shopUrls || payload.data?.shops || payload.shopUrls || [];
  state.successMessage = payload.message;
})
.addCase(get_retail_shops.rejected, (state, { payload }) => {
  state.shopsLoader = false;
  state.errorMessage = payload?.error || payload?.message || 'Failed to fetch retail shops';
})
  },  
});
export const { messageClear } = productReducer.actions;
export default productReducer.reducer;
