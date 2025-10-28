import React, { useEffect, useState, useRef } from 'react'; // Add useRef import
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle, IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { create_retailer_product, get_retail_shops, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const dispatch = useDispatch();
  
  // Add retailShops and shopsLoader to your existing useSelector
  const { loader, successMessage, errorMessage, retailShops, shopsLoader } = useSelector(
    (state) => state.product
  );

  // Create refs for file inputs [web:184][web:182]
  const fileInputRef = useRef(null);
  const editFileInputRefs = useRef([]);

  const [state, setState] = useState({
    shopURL: [], // Changed to array for multiple selection [web:129]
    title: '',
    body_html: '',
    vendor: '',
    tags: '',
  });

  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Key to force input reset [web:184]

  // State for managing creation results [web:132]
  const [creationResults, setCreationResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Variant states
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

  // Cleanup image URLs on unmount to prevent memory leaks [web:188]
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

  // Handle multiple shop URL selection [web:129]
  const handleShopURLChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setState({
      ...state,
      shopURL: selectedOptions,
    });
  };

  // Function to remove a specific shop URL
  const removeShopURL = (urlToRemove) => {
    setState({
      ...state,
      shopURL: state.shopURL.filter(url => url !== urlToRemove)
    });
  };

  // Function to refresh shop URLs
  const handleRefreshShops = () => {
    dispatch(get_retail_shops());
  };

  // Fixed image handling function [web:191][web:188]
  const handleImageChange = (e) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Selected ${files.length} files`);
    
    // Convert FileList to Array and validate image types
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

    // Add new images to existing ones
    const newImages = [...images, ...validFiles];
    setImages(newImages);

    // Create preview URLs for new files [web:191]
    const newImageUrls = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file // Store file reference for cleanup
    }));
    
    const updatedImageShow = [...imageShow, ...newImageUrls];
    setImageShow(updatedImageShow);

    console.log(`Total images: ${newImages.length}, Total previews: ${updatedImageShow.length}`);
    
    // Reset file input value to allow selecting same files again [web:182]
    if (e.target) {
      e.target.value = '';
    }
  };

  const changeImage = (newFile, index) => {
    if (!newFile) return;

    // Validate file type and size
    if (!newFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (newFile.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    // Create copies of arrays
    const updatedImages = [...images];
    const updatedImageShow = [...imageShow];

    // Cleanup old URL if it exists [web:188]
    if (updatedImageShow[index] && updatedImageShow[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(updatedImageShow[index].url);
    }

    // Update arrays
    updatedImages[index] = newFile;
    updatedImageShow[index] = {
      url: URL.createObjectURL(newFile),
      file: newFile
    };

    setImages(updatedImages);
    setImageShow(updatedImageShow);

    console.log(`Updated image at index ${index}`);
    
    // Reset the specific edit file input [web:182]
    if (editFileInputRefs.current[index]) {
      editFileInputRefs.current[index].value = '';
    }
  };

  const removeImage = (index) => {
    // Cleanup object URL to prevent memory leaks [web:188]
    if (imageShow[index] && imageShow[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(imageShow[index].url);
    }

    // Remove from both arrays
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

    // Use same validation as handleImageChange
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

  // Variant Functions (keeping all existing variant functions as they are)
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
        
        // Auto-generate title from options
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

    // Clear this value from all variants
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

  // Validate Shopify URL
  const validateShopURL = (url) => {
    const shopifyPattern = /^https:\/\/[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com\/?$/;
    return shopifyPattern.test(url);
  };

  // Updated submission function for multiple shops [web:117]
  const add = (e) => {
    e.preventDefault();
    
    console.log('Form submission - Current images:', images.length);
    
    // Form validation
    if (!state.title || !state.vendor || !state.shopURL.length || images.length === 0) {
      toast.error('Please fill all required fields, select at least one shop, and add at least one image');
      return;
    }

    // Validate all selected Shopify URLs
    const invalidURLs = state.shopURL.filter(url => !validateShopURL(url));
    if (invalidURLs.length > 0) {
      toast.error(`Invalid Shopify store URLs: ${invalidURLs.map(url => url.replace('https://', '').replace('.myshopify.com', '')).join(', ')}`);
      return;
    }

    // Validate variants
    const invalidVariants = variants.filter(v => !v.price || parseFloat(v.price) <= 0);
    if (invalidVariants.length > 0) {
      toast.error('All variants must have a valid price');
      return;
    }

    // Prepare data for Redux action with multiple URLs
    const productData = {
      shopURL: state.shopURL.join(','), // Send as comma-separated string to backend
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
      images: images // Pass the actual File objects, not URLs
    };

    console.log('Dispatching product creation for multiple shops...', {
      ...productData,
      images: productData.images.length + ' files',
      shopCount: state.shopURL.length
    });

    // Dispatch Redux action
    dispatch(create_retailer_product(productData));
  };

  // Enhanced resetForm function [web:182][web:184]
  const resetForm = () => {
    // Cleanup all blob URLs to prevent memory leaks [web:188]
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
    
    // Reset file input using key change [web:184]
    setFileInputKey(Date.now());
    
    // Also reset file input refs [web:182]
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Reset all edit file input refs
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

  // Enhanced success/error message handling [web:132]
  useEffect(() => {
    if (successMessage) {
      let message = '';
      let results = null;

      if (typeof successMessage === 'object') {
        // Handle multi-shop creation results
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
      
      // Only reset form if all operations were successful or no multi-shop results
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

  // Results Modal Component [web:135]
  const ResultsModal = () => {
    if (!showResults || !creationResults) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Product Creation Results</h2>
            <button
              onClick={() => setShowResults(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdCloseCircle size={24} />
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="flex items-center">
                <IoMdCheckmarkCircleOutline className="text-green-600 mr-2" size={20} />
                <span className="font-semibold text-green-800">Successful</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{creationResults.created?.length || 0}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="flex items-center">
                <IoMdImages className="text-yellow-600 mr-2" size={20} />
                <span className="font-semibold text-yellow-800">Existing</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{creationResults.existing?.length || 0}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="flex items-center">
                <IoMdCloseCircleOutline className="text-red-600 mr-2" size={20} />
                <span className="font-semibold text-red-800">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{creationResults.errors?.length || 0}</p>
            </div>
          </div>

          {/* Successful Creations */}
          {creationResults.created && creationResults.created.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Successfully Created</h3>
              <div className="space-y-2">
                {creationResults.created.map((item, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="font-medium">{item.shopURL.replace('https://', '').replace('.myshopify.com', '')}</p>
                    <p className="text-sm text-gray-600">Product ID: {item.product._id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Products */}
          {creationResults.existing && creationResults.existing.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Already Exists</h3>
              <div className="space-y-2">
                {creationResults.existing.map((item, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                    <p className="font-medium">{item.shopURL.replace('https://', '').replace('.myshopify.com', '')}</p>
                    <p className="text-sm text-gray-600">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {creationResults.errors && creationResults.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Failed</h3>
              <div className="space-y-2">
                {creationResults.errors.map((item, index) => (
                  <div key={index} className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p className="font-medium">{item.shopURL.replace('https://', '').replace('.myshopify.com', '')}</p>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <div className="w-full p-6 bg-white text-gray-800 rounded-lg shadow">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-2xl font-bold">Create Product</h1>
          <Link
            to="/seller/dashboard/products"
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold rounded px-6 py-2"
          >
            All Products
          </Link>
        </div>

        <form onSubmit={add}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Shop URL Multiple Selection - UPDATED [web:25] */}
              <div>
                <label htmlFor="shopURL" className="block text-sm font-medium mb-2">
                  Shopify Store URLs <span className="text-red-500">*</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">(Hold Ctrl/Cmd to select multiple)</span>
                </label>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <select
                      multiple
                      value={state.shopURL}
                      onChange={handleShopURLChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
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
                      <p className="text-sm text-gray-500 mt-1">
                        No shops available. Please add shops first.
                      </p>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleRefreshShops}
                    disabled={shopsLoader}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-all"
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
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Selected shops ({state.shopURL.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {state.shopURL.map((url, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {url.replace('https://', '').replace('.myshopify.com', '')}
                          <button
                            type="button"
                            onClick={() => removeShopURL(url)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
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
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
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
                <label htmlFor="vendor" className="block text-sm font-medium mb-2">
                  Vendor <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
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
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags (comma separated)
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
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
                <label htmlFor="body_html" className="block text-sm font-medium mb-2">
                  Body HTML <span className="text-gray-500">(Enter full HTML content)</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-48 resize-vertical font-mono text-sm"
                  onChange={inputHandle}
                  value={state.body_html}
                  id="body_html"
                  name="body_html"
                  placeholder={`<p><strong>Product Name – Bold Statement</strong></p>
<p>Product description paragraph...</p>
<p><strong>Features:</strong></p>
<ul>
<li><strong>Feature 1</strong> – Description</li>
<li><strong>Feature 2</strong> – Description</li>
</ul>
<p><em>Additional notes...</em></p>`}
                />
                
                {/* HTML Preview Toggle */}
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    {showPreview ? 'Hide Preview' : 'Preview HTML'}
                  </button>
                  <span className="text-xs text-gray-500">
                    Supports HTML: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;em&gt;, etc.
                  </span>
                </div>
                
                {/* HTML Preview */}
                {showPreview && state.body_html && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium mb-2 text-gray-700">HTML Preview:</h4>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: state.body_html }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Variants Section - COMPLETE */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">
                Product Variants <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowVariants(!showVariants)}
                className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold rounded px-4 py-2 text-sm"
              >
                {showVariants ? 'Hide Variants' : 'Manage Variants'}
              </button>
            </div>

            {showVariants && (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                
                {/* Variant Options Configuration */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Variant Options</h3>
                  
                  {Object.entries(variantOptions).map(([optionKey, option]) => (
                    <div key={optionKey} className="mb-4">
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => setVariantOptions({
                            ...variantOptions,
                            [optionKey]: { ...option, name: e.target.value }
                          })}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none mr-2"
                          placeholder={`Option ${optionKey.slice(-1)} name`}
                        />
                        <span className="text-sm text-gray-500">
                          (e.g., Size, Color, Material)
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {option.values.map((value, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {value}
                            <button
                              type="button"
                              onClick={() => removeOptionValue(optionKey, value)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
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
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 outline-none"
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
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={generateVariantCombinations}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded px-6 py-2 mt-4 transition-all"
                  >
                    Generate All Combinations
                  </button>
                </div>

                {/* Variants List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Variants ({variants.length})</h3>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-4 py-2 text-sm transition-all"
                    >
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {variants.map((variant, index) => (
                      <div key={variant.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-800">
                            Variant {index + 1}: {variant.title}
                          </h4>
                          {variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Option Values */}
                          {Object.entries(variantOptions).map(([optionKey, option]) => (
                            option.values.length > 0 && (
                              <div key={optionKey}>
                                <label className="block text-sm font-medium mb-1">
                                  {option.name}
                                </label>
                                <select
                                  value={variant[optionKey]}
                                  onChange={(e) => updateVariant(variant.id, optionKey, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {/* Price */}
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                                required
                              />
                            </div>
                          </div>

                          {/* SKU */}
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              SKU
                            </label>
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
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

          {/* Image Upload Section - UPDATED WITH FIXES [web:184][web:191] */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-4">
              Product Images <span className="text-red-500">*</span>
              {images.length > 0 && (
                <span className="ml-2 text-green-600">({images.length} selected)</span>
              )}
            </label>
            
            {/* Drag and Drop Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <IoMdImages className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop your images here, or{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  browse
                  <input
                    key={fileInputKey} // Force reset using key [web:184]
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                {imageShow.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      className="w-full h-24 object-cover rounded-lg border"
                      src={img.url}
                      alt={`Product ${i + 1}`}
                      onError={(e) => {
                        console.error(`Failed to load image ${i}:`, e);
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <label className="text-white cursor-pointer hover:text-blue-300 mr-2">
                        <IoMdImages size={20} />
                        <input
                          ref={(el) => (editFileInputRefs.current[i] = el)} // Ref for each edit input [web:182]
                          onChange={(e) => changeImage(e.target.files[0], i)}
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => removeImage(i)}
                        type="button"
                        className="text-white hover:text-red-300"
                      >
                        <IoMdCloseCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-500">
                Debug: {images.length} files selected, {imageShow.length} previews shown
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all"
              onClick={resetForm}
            >
              Reset
            </button>
            <button
              disabled={loader}
              type="submit"
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-all text-white font-semibold rounded px-8 py-2 min-w-[120px]"
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
          <div className="flex justify-center mt-6">
            <PropagateLoader color="#4A90E2" cssOverride={overrideStyle} />
          </div>
        )}

        {/* Results Modal */}
        <ResultsModal />
      </div>
    </div>
  );
};

export default CreateProduct;