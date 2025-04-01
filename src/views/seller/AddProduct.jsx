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
      // Make sure successMessage is a string
      const message = typeof successMessage === 'object' ? 
        (successMessage.message || JSON.stringify(successMessage)) : 
        successMessage;
      toast.success(message);
      dispatch(messageClear());
    }
    if (errorMessage) {
      // Make sure errorMessage is a string
      const message = typeof errorMessage === 'object' ? 
        (errorMessage.message || JSON.stringify(errorMessage)) : 
        errorMessage;
      toast.error(message);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <div className="w-full p-6 bg-white text-gray-800 rounded-lg shadow">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-2xl font-bold">Add Product</h1>
          <Link
            to="/seller/dashboard/products"
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold rounded px-6 py-2"
          >
            All Products
          </Link>
        </div>

        <div className="mb-6">
          <label htmlFor="productMappingId" className="block text-sm font-medium">
            Product Mapping ID OR Vendor Product ID
          </label>
          <div className="flex items-center mt-2">
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              type="text"
              id="productMappingId"
              placeholder="Enter ProductMapping ID"
              value={productMappingId}
              onChange={(e) => setProductMappingId(e.target.value)}
            />
            <button
              onClick={fetchProductMapping}
              className="ml-3 bg-green-600 hover:bg-green-700 transition-all text-white font-semibold rounded px-6 py-2"
            >
              Fetch Product
            </button>
          </div>
        </div>

        {productMapping && productMapping.vendorProduct && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Product Details (Product Mapping)</h2>
            <div className="mt-3 space-y-2">
              <p><strong>Title:</strong> {productMapping.vendorProduct.title}</p>
              <p><strong>Vendor:</strong> {productMapping.vendorProduct.vendor}</p>
              <p><strong>Price:</strong> ${productMapping.vendorProduct.variants && 
                productMapping.vendorProduct.variants[0] ? 
                productMapping.vendorProduct.variants[0].price : 'N/A'}</p>
              {productMapping.vendorProduct.images && 
               productMapping.vendorProduct.images[0] && (
                <img
                  className="w-40 h-40 mt-3 object-cover rounded border"
                  src={productMapping.vendorProduct.images[0].src}
                  alt="Product"
                />
              )}
            </div>
          </div>
        )}

        {!productMapping && vendorProduct && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Product Details (Vendor Product)</h2>
            <div className="mt-3 space-y-2">
              <p><strong>Title:</strong> {vendorProduct.title}</p>
              <p><strong>Vendor:</strong> {vendorProduct.vendor}</p>
              <p><strong>Price:</strong> ${vendorProduct.variants && 
                vendorProduct.variants[0] ? 
                vendorProduct.variants[0].price : 'N/A'}</p>
              {vendorProduct.images && 
               vendorProduct.images[0] && (
                <img
                  className="w-40 h-40 mt-3 object-cover rounded border"
                  src={vendorProduct.images[0].src}
                  alt="Product"
                />
              )}
            </div>
          </div>
        )}

        {shopURLs && shopURLs.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Publish to Shops</h2>
            <ul className="mt-3 space-y-2">
              {shopURLs.map((shopURL, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded">
                  <span>{typeof shopURL === 'string' ? shopURL : JSON.stringify(shopURL)}</span>
                  <button
                    onClick={() => publishProduct(shopURL)}
                    className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold rounded px-5 py-2"
                    disabled={!productMappingId}
                  >
                    Publish
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loader && (
          <div className="flex justify-center mt-6">
            <PropagateLoader color="#4A90E2" cssOverride={overrideStyle} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;