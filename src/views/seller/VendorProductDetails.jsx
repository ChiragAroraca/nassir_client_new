import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const VendorProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vendor = location.state?.vendor;
  const [minSimilarity, setMinSimilarity] = useState(0);
  const [filteredMatches, setFilteredMatches] = useState(vendor?.matches || []);
  const [shopUrls, setShopUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    if (vendor?.matches) {
      setFilteredMatches(vendor.matches);
    }
  }, [vendor]);

  const fetchVendorMatches = async (minScore) => {
    try {
      const vendorId = vendor?.vendor_id;
      const response = await fetch(
        `https://nassir-server-new.vercel.app/api/retailer-matches-score?vendorId=${vendorId}&minScore=${minScore}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setFilteredMatches(data.data);
        setShopUrls(data?.lowSimilarityMatches); // Assuming this is an array of objects
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching vendor matches:", error);
    }
  };

  const handleFilter = () => {
    const minScore = parseFloat(minSimilarity) / 100;
    fetchVendorMatches(minScore);
  };

  const handleResetFilter = () => {
    setMinSimilarity(0);
    setFilteredMatches(vendor?.matches || []);
  };

  const goBack = () => navigate(-1);

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
          desc: vendor?.vendorDetails?.body_html,
          prompt: prompt?prompt:'I want a short and accurate description in about 100 words.',
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.generatedDescription) {
        setProductDescription(data.generatedDescription);
      } else {
        setDescriptionError(data.error || "Failed to generate description.");
      }
    } catch (error) {
      console.error("Error fetching description:", error);
      setDescriptionError("Server error while generating description.");
    } finally {
      setIsLoadingDescription(false);
    }
  };

  const handleApproveAndPublish = () => {
    // dispatch(publish_product_to_shop(vendor?._id, selectedShop));
    alert(`Product Approved and Published to ${selectedShop}`);
    closeModal();
  };

  const handleGenerate = (shop) => {
    openModal(shop);
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
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full"
          >
            Reset Filter
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Vendor: <strong>{vendor?.vendor_title}</strong>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto grid grid-cols-2 gap-6">
        {/* Left Column: Retailer Matches */}
        <div className={shopUrls?.length === 0 ? "col-span-2" : ""}>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Retailer Matches</h1>
          <div className="space-y-4">
            {filteredMatches.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg shadow bg-white cursor-pointer`}
              >
                <h3 className="font-semibold">{item?.retail_title}</h3>
                <p><strong>ID:</strong> {item?.retail_id?.$numberLong || item?.retail_id}</p>
                <p><strong>Score:</strong> {(item?.similarity * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Shop URLs */}
        {shopUrls?.length > 0 && (
          <div>
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
                      onClick={() => handleApproveAndPublish()}
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
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

      {/* Display Word Count of vendor?.body_html */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Word count in product's previous description:{" "}
          <strong>{vendor?.vendorDetails?.body_html?.split(/\s+/).filter(Boolean).length || 0}</strong>
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
    </div>
  );
};

export default VendorProductDetails;