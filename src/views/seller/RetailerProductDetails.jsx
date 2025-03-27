import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RetailerProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const retailer = location.state?.retailer;
  
  const [minSimilarity, setMinSimilarity] = useState(0);
  const [filteredMatches, setFilteredMatches] = useState(retailer?.matches || []);
  const [shopUrls, setShopUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");
  const [publishedOn, setPublishedOn] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  let preFetchedMinScore;

  useEffect(() => {
    if (retailer?.matches) {
      setFilteredMatches(retailer.matches);
    }
  }, [retailer]);

  const preFetchMinScoreReloaded = async () => {
    const score = await localStorage.getItem('retailerProductMinSimilarity');
    preFetchedMinScore = await JSON.parse(score);
    if (preFetchedMinScore) {
      fetchRetailerMatches();
      setMinSimilarity(preFetchedMinScore * 100);
    }
  };

  useEffect(() => {
    preFetchMinScoreReloaded();
  }, []);

  const fetchRetailerMatches = async (minScore) => {
    try {
      const retailerId = retailer?.retail_id;
      const response = await fetch(
        `https://nassir-server-new.vercel.app/api/vendor-matches-score?retailId=${retailerId}&minScore=${preFetchedMinScore ? preFetchedMinScore : minScore}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        setFilteredMatches(data.data);
        setShopUrls(data?.lowSimilarityMatches || []);
        setPublishedOn(data?.publishedOn || []);
        if (minScore) {
          toast.success('Products fetched according to similarity');
        }
      } else {
        if (data.message === "No matches found with the specified similarity score.") {
          toast.error(data.message);
        } else {
          toast.error("Failed to fetch matches. Please try again.");
        }
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching retailer matches:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleFilter = () => {
    const minScore = parseFloat(minSimilarity) / 100;
    localStorage.setItem('retailerProductMinSimilarity', minScore.toString());
    fetchRetailerMatches(minScore);
  };

  const handleResetFilter = () => {
    setMinSimilarity(0);
    setFilteredMatches(retailer?.matches || []);
    setShopUrls([]);
    setPublishedOn([]);
    setSelectedItems([]);
    setComparisonResults(null);
    localStorage.removeItem('retailerProductMinSimilarity');
  };

  const goBack = () => {
    navigate(-1);
    localStorage.removeItem('retailerProductMinSimilarity');
  };

  const openModal = (shop) => {
    setSelectedShop(shop);
    setProductDescription("");
    setPrompt("");
    setDescriptionError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setProductDescription("");
    setPrompt("");
    setIsLoadingDescription(false);
    setDescriptionError("");
  };

  const fetchDescription = async () => {
    setIsLoadingDescription(true);
    setDescriptionError("");

    try {
      const response = await fetch("https://nassir-server-new.vercel.app/api/get-publishing-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          desc: retailer?.retailerDetails?.body_html,
          prompt: prompt || "I want a short and accurate description in about 100 words.",
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.generatedDescription) {
        setProductDescription(data.generatedDescription);
      } else {
        setDescriptionError(data.error || "Failed to generate description.");
        toast.error(data.error || "Failed to generate description.");
      }
    } catch (error) {
      console.error("Error fetching description:", error);
      setDescriptionError("Server error while generating description.");
      toast.error("Server error while generating description.");
    } finally {
      setIsLoadingDescription(false);
    }
  };

  const handleApproveAndPublish = () => {
    toast.success(`Product Approved and Published`);
    closeModal();
  };

  const handleGenerate = (shop) => {
    openModal(shop);
  };

  const handleGetItem = async (item) => {
    try {
      const response = await fetch(`https://nassir-server-new.vercel.app/api/vendor-product?id=${item.vendor_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        const productUrl = `${data.data.shopURL}/products/${data.data.handle}`;
        window.location.href = productUrl;
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("API Error:", error.message);
    }
  };

  const toggleItemSelection = (item) => {
    setSelectedItems(prev => {
      if (prev.some(selected => selected.vendor_id === item.vendor_id)) {
        return prev.filter(selected => selected.vendor_id !== item.vendor_id);
      } else {
        return [...prev, item];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredMatches.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...filteredMatches]);
    }
  };

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      const vendorProductIds = selectedItems.map(item => item.vendor_id);
      const retailerId = retailer?.retail_id;

      const response = await fetch('https://nassir-server-new.vercel.app/api/create-vendor-comparision-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorProductIds,
          retailerId
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        setComparisonResults(data.data);
        toast.success(`Comparison completed for ${data.data.comparisons.length} products`);
      } else {
        toast.error(data.message || 'Comparison failed');
      }
    } catch (error) {
      console.error('Comparison error:', error);
      toast.error('Error during comparison');
    } finally {
      setIsComparing(false);
    }
  };

  const closeComparisonResults = () => {
    setComparisonResults(null);
    setShowCompareModal(false);
    setSelectedItems([]);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar Left */}
      <div className="w-64 p-6 bg-white shadow-md sticky top-0 h-screen flex flex-col justify-between">
        <div>
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition mb-6"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h2 className="text-lg font-semibold mb-4">Filter Similarity</h2>
          <input
            type="range"
            min="0"
            max="100"
            value={minSimilarity}
            onChange={(e) => setMinSimilarity(Number(e.target.value))}
            className="w-full mb-4 accent-blue-700"
          />
          <input
            type="number"
            placeholder="Min Similarity (%)"
            value={minSimilarity}
            onChange={(e) => setMinSimilarity(e.target.value)}
            className="px-4 py-2 border text-black rounded-lg w-full mb-3"
          />
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition w-full mb-2"
          >
            Apply Filter
          </button>
          <button
            onClick={handleResetFilter}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full mb-2"
          >
            Reset Filter
          </button>
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-full"
          >
            Compare by AI
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Retailer: <strong>{retailer?.retail_title}</strong>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto grid grid-cols-2 gap-6">
        {/* Left Column: Vendor Matches */}
        <div className={shopUrls?.length === 0 && publishedOn?.length === 0 ? "col-span-2" : ""}>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Vendor Matches</h1>
          <div className="space-y-4">
            {filteredMatches.map((item, index) => (
              <div
                onClick={() => handleGetItem(item)}
                key={index}
                className={`p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-gray-50`}
              >
                <h3 className="font-semibold">{item?.vendor_title}</h3>
                <p><strong>ID:</strong> {item?.vendor_id?.$numberLong || item?.vendor_id}</p>
                <p><strong>Score:</strong> {(item?.similarity * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Shop URLs and Published On */}
        {(shopUrls?.length > 0 || publishedOn?.length > 0) && (
          <div>
            {/* Shop URLs Section */}
            {shopUrls?.length > 0 && (
              <>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Shop URLs</h1>
                <div className="space-y-4">
                  {shopUrls.map((shop, shopIndex) => (
                    <div key={shopIndex} className="p-4 border rounded-lg shadow bg-white flex items-center justify-between">
                      <h1 className="text-sm font-bold text-gray-800">{shop.shopURL}</h1>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGenerate(shop.shopURL)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Generate Description
                        </button>
                        <button
                          onClick={handleApproveAndPublish}
                          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Published On Section */}
            {publishedOn?.length > 0 && (
              <div className={shopUrls?.length > 0 ? "mt-8" : ""}>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Published On</h1>
                <div className="space-y-4">
                  {publishedOn.map((shopUrl, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow bg-white flex items-center justify-between">
                      <h1 className="text-sm font-bold text-gray-800">{shopUrl}</h1>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedShop(shopUrl);
                            handleApproveAndPublish();
                          }}
                          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                        >
                          Republish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description Generator Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Product Description Generator</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Word count in product's previous description:{" "}
                <strong>{retailer?.retailerDetails?.body_html?.split(/\s+/).filter(Boolean).length || 0}</strong>
              </p>
            </div>

            <input
              type="text"
              placeholder="Enter prompt for new description"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg text-black mb-4"
              disabled={isLoadingDescription || productDescription}
            />

            {!productDescription && (
              <button
                onClick={fetchDescription}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-4 w-full"
                disabled={isLoadingDescription}
              >
                {isLoadingDescription ? "Generating..." : "Generate Description"}
              </button>
            )}

            {descriptionError && (
              <p className="text-red-600 text-sm mb-4">{descriptionError}</p>
            )}

            {productDescription && (
              <>
                <textarea
                  rows={6}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full p-3 border rounded-lg text-black mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={handleApproveAndPublish}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                  >
                    Approve and Publish
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Compare by AI Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ width: '70%', height: '70%', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Compare Products by AI</h2>
              <button
                onClick={() => {
                  setShowCompareModal(false);
                  setSelectedItems([]);
                }}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4">
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredMatches.length && filteredMatches.length > 0}
                    onChange={toggleSelectAll}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="font-medium">Select All ({filteredMatches.length} items)</span>
                </div>
                {filteredMatches.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg flex items-center cursor-pointer ${selectedItems.some(selected => selected.vendor_id === item.vendor_id) ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                    onClick={() => toggleItemSelection(item)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.some(selected => selected.vendor_id === item.vendor_id)}
                      onChange={() => toggleItemSelection(item)}
                      className="mr-2 h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item?.vendor_title}</h3>
                      <p className="text-sm text-gray-600">Score: {(item?.similarity * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCompare}
                disabled={selectedItems.length === 0 || isComparing}
                className={`px-4 py-2 rounded-lg transition ${selectedItems.length > 0 ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {isComparing ? 'Comparing...' : `Compare (${selectedItems.length} selected)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results Modal */}
      {comparisonResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ width: '70%', height: '70%', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Comparison Results</h2>
              <button
                onClick={closeComparisonResults}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Retailer Product: {comparisonResults.retailerProduct.title}</h3>
              <p className="text-sm text-gray-600">Retailer: {comparisonResults.retailerProduct.retailer}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {comparisonResults.comparisons.map((comparison, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{comparison.vendorProduct.title}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${comparison.isSimilar ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {comparison.isSimilar ? 'Similar' : 'Not Similar'}
                      </span>
                    </div>
                    <p className="text-gray-700">{comparison.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={closeComparisonResults}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default RetailerProductDetails;