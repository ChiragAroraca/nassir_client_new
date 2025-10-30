import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { add_product, messageClear, get_product_mapping, publish_product_to_shop } from '../../store/Reducers/productReducer';
import { get_category } from '../../store/Reducers/categoryReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { loader, successMessage, errorMessage, productMapping, vendorProduct, shopURLs } = useSelector(
    (state) => state.product
  );

  const [state, setState] = useState({
    name: '',
    description: '',
    discount: '',
    price: '',
    brand: '',
    stock: '',
  });

  const [productMappingId, setProductMappingId] = useState('');
  const [category, setCategory] = useState('');
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);

  useEffect(() => {
    dispatch(get_category({ searchValue: '', parPage: '', page: '' }));
  }, [vendorProduct]);

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setAllCategory(
      value
        ? categorys.filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
        : categorys
    );
  };

  const fetchProductMapping = () => {
    if (!productMappingId) {
      toast.error('Please enter a ProductMapping ID');
      return;
    }
    dispatch(get_product_mapping(productMappingId));
  };

  const publishProduct = (shopURL) => {
    console.log("productMappingId >>", productMappingId)
    dispatch(publish_product_to_shop({ productMappingId, shopURL }));
  };

  useEffect(() => {
    if (successMessage) {
      const message = typeof successMessage === 'object' ? 
        (successMessage.message || JSON.stringify(successMessage)) : 
        successMessage;
      toast.success(message);
      dispatch(messageClear());
    }
    if (errorMessage) {
      const message = typeof errorMessage === 'object' ? 
        (errorMessage.message || JSON.stringify(errorMessage)) : 
        errorMessage;
      toast.error(message);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 lg:p-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-10">
          {/* Header */}
          <div className="flex justify-between items-center pb-6 mb-6 border-b border-gray-200/50">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Product</h1>
              <p className="text-gray-600">Fetch and publish products to your stores</p>
            </div>
            <Link
              to="/seller/dashboard/products"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              All Products
            </Link>
          </div>

          {/* Product Mapping ID Input */}
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-8">
            <label htmlFor="productMappingId" className="block text-sm font-semibold text-gray-800 mb-3">
              Product Mapping ID OR Vendor Product ID
            </label>
            <div className="flex items-center gap-4">
              <input
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                type="text"
                id="productMappingId"
                placeholder="Enter ProductMapping ID"
                value={productMappingId}
                onChange={(e) => setProductMappingId(e.target.value)}
              />
              <button
                onClick={fetchProductMapping}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Fetch Product
              </button>
            </div>
          </div>

          {/* Product Details - Product Mapping */}
          {productMapping && productMapping.vendorProduct && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                Product Details (Product Mapping)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <p className="text-sm text-gray-600 mb-1">Title</p>
                    <p className="font-semibold text-gray-800">{productMapping.vendorProduct.title}</p>
                  </div>
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <p className="text-sm text-gray-600 mb-1">Vendor</p>
                    <p className="font-semibold text-gray-800">{productMapping.vendorProduct.vendor}</p>
                  </div>
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="font-semibold text-gray-800">
                      ${productMapping.vendorProduct.variants && 
                        productMapping.vendorProduct.variants[0] ? 
                        productMapping.vendorProduct.variants[0].price : 'N/A'}
                    </p>
                  </div>
                </div>
                {productMapping.vendorProduct.images && 
                 productMapping.vendorProduct.images[0] && (
                  <div className="flex justify-center">
                    <img
                      className="w-64 h-64 object-cover rounded-2xl border-4 border-white shadow-lg"
                      src={productMapping.vendorProduct.images[0].src}
                      alt="Product"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Details - Vendor Product */}
          {!productMapping && vendorProduct && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                Product Details (Vendor Product)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <p className="text-sm text-gray-600 mb-1">Title</p>
                    <p className="font-semibold text-gray-800">{vendorProduct.title}</p>
                  </div>
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <p className="text-sm text-gray-600 mb-1">Vendor</p>
                    <p className="font-semibold text-gray-800">{vendorProduct.vendor}</p>
                  </div>
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="font-semibold text-gray-800">
                      ${vendorProduct.variants && 
                        vendorProduct.variants[0] ? 
                        vendorProduct.variants[0].price : 'N/A'}
                    </p>
                  </div>
                </div>
                {vendorProduct.images && 
                 vendorProduct.images[0] && (
                  <div className="flex justify-center">
                    <img
                      className="w-64 h-64 object-cover rounded-2xl border-4 border-white shadow-lg"
                      src={vendorProduct.images[0].src}
                      alt="Product"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Publish to Shops */}
          {shopURLs && shopURLs.length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Publish to Shops ({shopURLs.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {shopURLs.map((shopURL, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-gray-100/50 transition-all">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">
                        {typeof shopURL === 'string' ? shopURL : JSON.stringify(shopURL)}
                      </span>
                    </div>
                    <button
                      onClick={() => publishProduct(shopURL)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none"
                      disabled={!productMappingId}
                    >
                      Publish
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loader && (
            <div className="flex justify-center mt-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
                <PropagateLoader color="#4A90E2" cssOverride={overrideStyle} />
                <p className="text-center text-gray-600 mt-4">Processing request...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;