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
  const { loader, successMessage, errorMessage, productMapping, shopURLs } = useSelector(
    (state) => state.product
  );

  // States
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

  // Handle input changes
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch categories
  useEffect(() => {
    dispatch(get_category({ searchValue: '', parPage: '', page: '' }));
  }, []);

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  // Search categories
  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setAllCategory(
      value
        ? categorys.filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
        : categorys
    );
  };

  // Fetch ProductMapping by ID
  const fetchProductMapping = () => {
    if (!productMappingId) {
      toast.error('Please enter a ProductMapping ID');
      return;
    }
    dispatch(get_product_mapping(productMappingId));
  };

  // Publish product to shop
  const publishProduct = (shopURL) => {
    dispatch(publish_product_to_shop({ productMappingId, shopURL }));
  };
  // Handle success and error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Add Product</h1>
          <Link
            to="/seller/dashboard/products"
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
          >
            All Products
          </Link>
        </div>

        {/* Fetch ProductMapping */}
        <div className="mb-5">
          <label htmlFor="productMappingId" className="text-[#d0d2d6]">
            ProductMapping ID
          </label>
          <input
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6] mt-2"
            type="text"
            id="productMappingId"
            placeholder="Enter ProductMapping ID"
            value={productMappingId}
            onChange={(e) => setProductMappingId(e.target.value)}
          />
          <button
            onClick={fetchProductMapping}
            className="bg-green-500 hover:shadow-green-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 mt-3"
          >
            Fetch Product
          </button>
        </div>

        {/* Display Vendor Product */}
        {productMapping && (
          <div className="mb-5">
            <h2 className="text-[#d0d2d6] text-lg font-semibold">Vendor Product</h2>
            <p><strong>Title:</strong> {productMapping.vendorProduct.title}</p>
            <p><strong>Vendor:</strong> {productMapping.vendorProduct.vendor}</p>
            <p><strong>Price:</strong> ${productMapping.vendorProduct.variants[0]?.price}</p>
            <img
              className="w-[200px] h-[200px] mt-3"
              src={productMapping.vendorProduct.images[0]?.src}
              alt="Vendor Product"
            />
          </div>
        )}

        {/* Publish to Shops */}
        { shopURLs && shopURLs.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#d0d2d6] text-lg font-semibold">Publish to Shops</h2>
            <ul className="mt-2">
              {shopURLs.map((shopURL, index) => (
                <li key={index} className="flex items-center gap-3 mb-2">
                  <span>{shopURL}</span>
                  <button
                    onClick={() => publishProduct(shopURL)}
                    className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-5 py-2"
                  >
                    Publish
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loader && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default AddProduct;
