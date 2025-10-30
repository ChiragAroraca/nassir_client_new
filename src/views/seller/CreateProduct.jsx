import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle, IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { create_retailer_product, get_retail_shops, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const dispatch = useDispatch();
  
  const { loader, successMessage, errorMessage, retailShops, shopsLoader } = useSelector(
    (state) => state.product
  );

  const fileInputRef = useRef(null);
  const editFileInputRefs = useRef([]);

  const [state, setState] = useState({
    shopURL: [],
    title: '',
    body_html: '',
    vendor: '',
    tags: '',
  });

  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [creationResults, setCreationResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const [variants, setVariants] = useState([
    {
      id: Date.now(),
      title: 'Default Title',
      option1: '',
      option2: '',
      option3: '',
      sku: '',
      price: '',
      inventory_quantity: '',
      weight: '',
      requires_shipping: true
    }
  ]);

  const [variantOptions, setVariantOptions] = useState({
    option1: { name: 'Size', values: [] },
    option2: { name: 'Color', values: [] },
    option3: { name: 'Material', values: [] }
  });

  const [showVariants, setShowVariants] = useState(false);

  // Fetch retail shops on component mount
  useEffect(() => {
    dispatch(get_retail_shops());
  }, [dispatch]);

  // Cleanup image URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      imageShow.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [imageShow]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // Handle multiple shop URL selection
  const handleShopURLChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setState({
      ...state,
      shopURL: selectedOptions,
    });
  };

  const removeShopURL = (urlToRemove) => {
    setState({
      ...state,
      shopURL: state.shopURL.filter(url => url !== urlToRemove)
    });
  };

  const handleRefreshShops = () => {
    dispatch(get_retail_shops());
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Selected ${files.length} files`);
    
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isImage) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      console.log('No valid image files selected');
      return;
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);

    const newImageUrls = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    
    const updatedImageShow = [...imageShow, ...newImageUrls];
    setImageShow(updatedImageShow);

    console.log(`Total images: ${newImages.length}, Total previews: ${updatedImageShow.length}`);
    
    if (e.target) {
      e.target.value = '';
    }
  };

  const changeImage = (newFile, index) => {
    if (!newFile) return;

    if (!newFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (newFile.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    const updatedImages = [...images];
    const updatedImageShow = [...imageShow];

    if (updatedImageShow[index] && updatedImageShow[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(updatedImageShow[index].url);
    }

    updatedImages[index] = newFile;
    updatedImageShow[index] = {
      url: URL.createObjectURL(newFile),
      file: newFile
    };

    setImages(updatedImages);
    setImageShow(updatedImageShow);

    console.log(`Updated image at index ${index}`);
    
    if (editFileInputRefs.current[index]) {
      editFileInputRefs.current[index].value = '';
    }
  };

  const removeImage = (index) => {
    if (imageShow[index] && imageShow[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(imageShow[index].url);
    }

    const updatedImages = images.filter((_, i) => i !== index);
    const updatedImageShow = imageShow.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setImageShow(updatedImageShow);

    console.log(`Removed image at index ${index}, remaining: ${updatedImages.length}`);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isImage) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      setImages(newImages);

      const newImageUrls = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }));
      
      setImageShow([...imageShow, ...newImageUrls]);
      console.log(`Added ${validFiles.length} files via drag & drop`);
    }
  };

  // Variant Functions
  const addVariant = () => {
    const newVariant = {
      id: Date.now() + Math.random(),
      title: 'New Variant',
      option1: '',
      option2: '',
      option3: '',
      sku: '',
      price: '',
      inventory_quantity: '',
      weight: '',
      requires_shipping: true
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (variantId) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== variantId));
    } else {
      toast.error('At least one variant is required');
    }
  };

  const updateVariant = (variantId, field, value) => {
    setVariants(variants.map(variant => {
      if (variant.id === variantId) {
        const updatedVariant = { ...variant, [field]: value };
        
        const options = [updatedVariant.option1, updatedVariant.option2, updatedVariant.option3]
          .filter(opt => opt && opt.trim())
          .join(' / ');
        updatedVariant.title = options || 'Default Title';
        
        return updatedVariant;
      }
      return variant;
    }));
  };

  const addOptionValue = (optionName, value) => {
    if (value.trim() && !variantOptions[optionName].values.includes(value.trim())) {
      setVariantOptions({
        ...variantOptions,
        [optionName]: {
          ...variantOptions[optionName],
          values: [...variantOptions[optionName].values, value.trim()]
        }
      });
    }
  };

  const removeOptionValue = (optionName, value) => {
    setVariantOptions({
      ...variantOptions,
      [optionName]: {
        ...variantOptions[optionName],
        values: variantOptions[optionName].values.filter(v => v !== value)
      }
    });

    setVariants(variants.map(variant => ({
      ...variant,
      [optionName]: variant[optionName] === value ? '' : variant[optionName]
    })));
  };

  const generateVariantCombinations = () => {
    const option1Values = variantOptions.option1.values.length > 0 ? variantOptions.option1.values : [''];
    const option2Values = variantOptions.option2.values.length > 0 ? variantOptions.option2.values : [''];
    const option3Values = variantOptions.option3.values.length > 0 ? variantOptions.option3.values : [''];

    const combinations = [];
    option1Values.forEach(opt1 => {
      option2Values.forEach(opt2 => {
        option3Values.forEach(opt3 => {
          const title = [opt1, opt2, opt3].filter(opt => opt).join(' / ') || 'Default Title';
          combinations.push({
            id: Date.now() + Math.random(),
            title,
            option1: opt1,
            option2: opt2,
            option3: opt3,
            sku: '',
            price: '',
            inventory_quantity: '0',
            weight: '',
            requires_shipping: true
          });
        });
      });
    });

    setVariants(combinations);
  };

  const validateShopURL = (url) => {
    const shopifyPattern = /^https:\/\/[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com\/?$/;
    return shopifyPattern.test(url);
  };

  const add = (e) => {
    e.preventDefault();
    
    console.log('Form submission - Current images:', images.length);
    
    if (!state.title || !state.vendor || !state.shopURL.length || images.length === 0) {
      toast.error('Please fill all required fields, select at least one shop, and add at least one image');
      return;
    }

    const invalidURLs = state.shopURL.filter(url => !validateShopURL(url));
    if (invalidURLs.length > 0) {
      toast.error(`Invalid Shopify store URLs: ${invalidURLs.map(url => url.replace('https://', '').replace('.myshopify.com', '')).join(', ')}`);
      return;
    }

    const invalidVariants = variants.filter(v => !v.price || parseFloat(v.price) <= 0);
    if (invalidVariants.length > 0) {
      toast.error('All variants must have a valid price');
      return;
    }

    const productData = {
      shopURL: state.shopURL.join(','),
      title: state.title,
      body_html: state.body_html,
      vendor: state.vendor,
      tags: state.tags,
      variants: variants.map(variant => ({
        title: variant.title,
        option1: variant.option1 || null,
        option2: variant.option2 || null,
        option3: variant.option3 || null,
        sku: variant.sku,
        price: parseFloat(variant.price).toFixed(2)
      })),
      images: images
    };

    console.log('Dispatching product creation for multiple shops...', {
      ...productData,
      images: productData.images.length + ' files',
      shopCount: state.shopURL.length
    });

    dispatch(create_retailer_product(productData));
  };

  const resetForm = () => {
    imageShow.forEach(img => {
      if (img.url && img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });

    setState({
      shopURL: [],
      title: '',
      body_html: '',
      vendor: '',
      tags: '',
    });
    
    setImages([]);
    setImageShow([]);
    
    setFileInputKey(Date.now());
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    editFileInputRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });

    setVariants([{
      id: Date.now(),
      title: 'Default Title',
      option1: '',
      option2: '',
      option3: '',
      sku: '',
      price: '',
      inventory_quantity: '',
      weight: '',
      requires_shipping: true
    }]);
    
    setVariantOptions({
      option1: { name: 'Size', values: [] },
      option2: { name: 'Color', values: [] },
      option3: { name: 'Material', values: [] }
    });
    
    setShowVariants(false);
    setShowPreview(false);
    setCreationResults(null);
    setShowResults(false);

    console.log('Form reset completed');
  };

  useEffect(() => {
    if (successMessage) {
      let message = '';
      let results = null;

      if (typeof successMessage === 'object') {
        if (successMessage.results) {
          results = successMessage.results;
          setCreationResults(results);
          setShowResults(true);
          
          message = `Product processing completed: ${results.created?.length || 0} successful, ${results.existing?.length || 0} existing, ${results.errors?.length || 0} failed`;
        } else {
          message = successMessage.message || JSON.stringify(successMessage);
        }
      } else {
        message = successMessage;
      }

      toast.success(message);
      dispatch(messageClear());
      
      if (!results || (results && results.errors?.length === 0)) {
        resetForm();
      }
    }

    if (errorMessage) {
      const message = typeof errorMessage === 'object' ? 
        (errorMessage.message || JSON.stringify(errorMessage)) : 
        errorMessage;
      toast.error(message);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Results Modal Component
  const ResultsModal = () => {
    if (!showResults || !creationResults) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 max-w-4xl max-h-[80vh] overflow-y-auto m-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Product Creation Results</h2>
            <button
              onClick={() => setShowResults(false)}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <IoMdCloseCircle size={24} />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50/80 backdrop-blur-sm p-6 rounded-xl border border-green-200/50">
              <div className="flex items-center mb-2">
                <IoMdCheckmarkCircleOutline className="text-green-600 mr-2" size={24} />
                <span className="font-semibold text-green-800">Successful</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{creationResults.created?.length || 0}</p>
            </div>
            <div className="bg-yellow-50/80 backdrop-blur-sm p-6 rounded-xl border border-yellow-200/50">
              <div className="flex items-center mb-2">
                <IoMdImages className="text-yellow-600 mr-2" size={24} />
                <span className="font-semibold text-yellow-800">Existing</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{creationResults.existing?.length || 0}</p>
            </div>
            <div className="bg-red-50/80 backdrop-blur-sm p-6 rounded-xl border border-red-200/50">
              <div className="flex items-center mb-2">
                <IoMdCloseCircleOutline className="text-red-600 mr-2" size={24} />
                <span className="font-semibold text-red-800">Failed</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{creationResults.errors?.length || 0}</p>
            </div>
          </div>

          {/* Results Details */}
          {creationResults.created && creationResults.created.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Successfully Created</h3>
              <div className="space-y-2">
                {creationResults.created.map((item, index) => (
                  <div key={index} className="bg-green-50/50 backdrop-blur-sm p-4 rounded-xl border-l-4 border-green-500">
                    <p className="font-medium text-gray-800">{item.shopURL.replace('https://', '').replace('.myshopify.com', '')}</p>
                    <p className="text-sm text-gray-600">Product ID: {item.product._id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {creationResults.existing && creationResults.existing.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Already Exists</h3>
              <div className="space-y-2">
                {creationResults.existing.map((item, index) => (
                  <div key={index} className="bg-yellow-50/50 backdrop-blur-sm p-4 rounded-xl border-l-4 border-yellow-500">
                    <p className="font-medium text-gray-800">{item.shopURL.replace('https://', '').replace('.myshopify.com', '')}</p>
                    <p className="text-sm text-gray-600">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {creationResults.errors && creationResults.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Failed</h3>
              <div className="space-y-2">
                {creationResults.errors.map((item, index) => (
                  <div key={index} className="bg-red-50/50 backdrop-blur-sm p-4 rounded-xl border-l-4 border-red-500">
                    <p className="font-medium text-gray-800">{item.shopURL.replace('https://', '').replace('.myshopify.com', '')}</p>
                    <p className="text-sm text-gray-600">{item.error}</p>
                    {item.details && (
                      <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowResults(false);
                if (creationResults.errors?.length === 0) {
                  resetForm();
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Product</h1>
              <p className="text-gray-600">Add a new product to your store inventory</p>
            </div>
            <Link
              to="/seller/dashboard/products"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              All Products
            </Link>
          </div>

          <form onSubmit={add}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Shop URL Multiple Selection */}
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                  <label htmlFor="shopURL" className="block text-sm font-semibold text-gray-800 mb-3">
                    Shopify Store URLs <span className="text-red-500">*</span>
                    <span className="text-sm font-normal text-gray-500 ml-2">(Hold Ctrl/Cmd to select multiple)</span>
                  </label>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <select
                        multiple
                        value={state.shopURL}
                        onChange={handleShopURLChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[120px] bg-white/50 backdrop-blur-sm transition-all"
                        required
                        disabled={shopsLoader}
                      >
                        {retailShops && retailShops.map((shop, index) => (
                          <option key={index} value={typeof shop === 'string' ? shop : shop.shopURL}>
                            {typeof shop === 'string' ? shop : shop.shopURL}
                          </option>
                        ))}
                      </select>
                      
                      {(!retailShops || retailShops.length === 0) && !shopsLoader && (
                        <p className="text-sm text-gray-500 mt-2">
                          No shops available. Please add shops first.
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleRefreshShops}
                      disabled={shopsLoader}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                      title="Refresh shop list"
                    >
                      {shopsLoader ? (
                        <PropagateLoader color="#ffffff" size={4} />
                      ) : (
                        '🔄'
                      )}
                    </button>
                  </div>
                  
                  {/* Selected shops display */}
                  {state.shopURL.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-3">Selected shops ({state.shopURL.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {state.shopURL.map((url, index) => (
                          <span key={index} className="inline-flex items-center bg-blue-100/80 text-blue-800 px-3 py-2 rounded-full text-sm backdrop-blur-sm border border-blue-200/50">
                            {url.replace('https://', '').replace('.myshopify.com', '')}
                            <button
                              type="button"
                              onClick={() => removeShopURL(url)}
                              className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-all"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                    onChange={inputHandle}
                    value={state.title}
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                {/* Vendor */}
                <div>
                  <label htmlFor="vendor" className="block text-sm font-semibold text-gray-800 mb-3">
                    Vendor <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                    onChange={inputHandle}
                    value={state.vendor}
                    type="text"
                    id="vendor"
                    name="vendor"
                    placeholder="Enter vendor name"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-semibold text-gray-800 mb-3">
                    Tags (comma separated)
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                    onChange={inputHandle}
                    value={state.tags}
                    type="text"
                    id="tags"
                    name="tags"
                    placeholder="e.g., apparel, hoodie, lifestyle"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Body HTML */}
                <div>
                  <label htmlFor="body_html" className="block text-sm font-semibold text-gray-800 mb-3">
                    Body HTML <span className="text-gray-500">(Enter full HTML content)</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none h-48 resize-vertical font-mono text-sm bg-white/50 backdrop-blur-sm transition-all"
                    onChange={inputHandle}
                    value={state.body_html}
                    id="body_html"
                    name="body_html"
                    placeholder={`<p><strong>Product Name – Bold Statement</strong></p>\n<p>Product description paragraph...</p>\n<p><strong>Features:</strong></p>\n<ul>\n<li><strong>Feature 1</strong> – Description</li>\n<li><strong>Feature 2</strong> – Description</li>\n</ul>\n<p><em>Additional notes...</em></p>`}
                  />
                  
                  {/* HTML Preview Toggle */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      {showPreview ? 'Hide Preview' : 'Preview HTML'}
                    </button>
                    <span className="text-xs text-gray-500">
                      Supports HTML: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;em&gt;, etc.
                    </span>
                  </div>
                  
                  {/* HTML Preview */}
                  {showPreview && state.body_html && (
                    <div className="mt-4 p-4 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                      <h4 className="text-sm font-semibold mb-3 text-gray-700">HTML Preview:</h4>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: state.body_html }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Variants Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-lg font-bold text-gray-800">
                  Product Variants <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowVariants(!showVariants)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {showVariants ? 'Hide Variants' : 'Manage Variants'}
                </button>
              </div>

              {showVariants && (
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                  
                  {/* Variant Options Configuration */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Variant Options</h3>
                    
                    {Object.entries(variantOptions).map(([optionKey, option]) => (
                      <div key={optionKey} className="mb-6">
                        <div className="flex items-center mb-3">
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) => setVariantOptions({
                              ...variantOptions,
                              [optionKey]: { ...option, name: e.target.value }
                            })}
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none mr-3 bg-white/50 backdrop-blur-sm transition-all"
                            placeholder={`Option ${optionKey.slice(-1)} name`}
                          />
                          <span className="text-sm text-gray-500">
                            (e.g., Size, Color, Material)
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {option.values.map((value, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center bg-blue-100/80 text-blue-800 px-3 py-2 rounded-full text-sm backdrop-blur-sm border border-blue-200/50"
                            >
                              {value}
                              <button
                                type="button"
                                onClick={() => removeOptionValue(optionKey, value)}
                                className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-all"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex">
                          <input
                            type="text"
                            placeholder={`Add ${option.name.toLowerCase()} option`}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addOptionValue(optionKey, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.target.previousElementSibling;
                              addOptionValue(optionKey, input.value);
                              input.value = '';
                            }}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-r-xl transition-all transform hover:scale-105"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={generateVariantCombinations}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-3 mt-4 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Generate All Combinations
                    </button>
                  </div>

                  {/* Variants List */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-800">Variants ({variants.length})</h3>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        Add Variant
                      </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {variants.map((variant, index) => (
                        <div key={variant.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-800">
                              Variant {index + 1}: {variant.title}
                            </h4>
                            {variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeVariant(variant.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-100 px-3 py-1 rounded-lg transition-all"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Option Values */}
                            {Object.entries(variantOptions).map(([optionKey, option]) => (
                              option.values.length > 0 && (
                                <div key={optionKey}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {option.name}
                                  </label>
                                  <select
                                    value={variant[optionKey]}
                                    onChange={(e) => updateVariant(variant.id, optionKey, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                                  >
                                    <option value="">Select {option.name}</option>
                                    {option.values.map((value, i) => (
                                      <option key={i} value={value}>
                                        {value}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Price */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-3 text-gray-500 text-sm">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={variant.price}
                                  onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                                  placeholder="0.00"
                                  required
                                />
                              </div>
                            </div>

                            {/* SKU */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU
                              </label>
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                                placeholder="SKU"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-800 mb-6">
                Product Images <span className="text-red-500">*</span>
                {images.length > 0 && (
                  <span className="ml-3 text-green-600 font-medium">({images.length} selected)</span>
                )}
              </label>
              
              {/* Drag and Drop Area */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all backdrop-blur-sm ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <IoMdImages className="mx-auto text-6xl text-gray-400 mb-6" />
                <p className="text-gray-600 mb-4 text-lg">
                  Drag and drop your images here, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold underline">
                    browse
                    <input
                      key={fileInputKey}
                      ref={fileInputRef}
                      multiple
                      onChange={handleImageChange}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPG, PNG, GIF (Max 10MB each)
                </p>
              </div>

              {/* Image Preview Grid */}
              {imageShow.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
                  {imageShow.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        className="w-full h-32 object-cover rounded-xl border border-gray-200/50 shadow-sm"
                        src={img.url}
                        alt={`Product ${i + 1}`}
                        onError={(e) => {
                          console.error(`Failed to load image ${i}:`, e);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <label className="text-white cursor-pointer hover:text-blue-300 mr-3 p-2 hover:bg-white/20 rounded-lg transition-all">
                          <IoMdImages size={24} />
                          <input
                            ref={(el) => (editFileInputRefs.current[i] = el)}
                            onChange={(e) => changeImage(e.target.files[0], i)}
                            type="file"
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => removeImage(i)}
                          type="button"
                          className="text-white hover:text-red-300 p-2 hover:bg-white/20 rounded-lg transition-all"
                        >
                          <IoMdCloseCircle size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Debug info (remove in production) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-3 text-xs text-gray-500">
                  Debug: {images.length} files selected, {imageShow.length} previews shown
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
              <button
                type="button"
                className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all backdrop-blur-sm"
                onClick={resetForm}
              >
                Reset
              </button>
              <button
                disabled={loader}
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl px-8 py-3 min-w-[140px] transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none"
              >
                {loader ? (
                  <PropagateLoader color="#ffffff" size={8} cssOverride={{ display: 'inline-flex' }} />
                ) : (
                  `Create Product${state.shopURL.length > 1 ? ` for ${state.shopURL.length} Shops` : ''}`
                )}
              </button>
            </div>
          </form>

          {loader && (
            <div className="flex justify-center mt-8">
              <PropagateLoader color="#4A90E2" cssOverride={overrideStyle} />
            </div>
          )}

          {/* Results Modal */}
          <ResultsModal />
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;