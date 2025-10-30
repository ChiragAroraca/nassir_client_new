import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { get_vendor_products } from "../../store/Reducers/productReducer";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";

const VendorProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const hasMore = useSelector((state) => state.product.hasMore);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [parPage, setParPage] = useState(10);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [minSimilarity, setMinSimilarity] = useState("");
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [shopUrl, setShopUrl] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(
      get_vendor_products({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue: searchTerm,
      })
    );
  }, [currentPage, parPage, searchTerm, dispatch]);

  useEffect(() => {
    if (shopUrl) {
      const filtered = products.filter(product => product?.vendorDetails?.shopURL === shopUrl);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [shopUrl, products]);

  const handleSearch = () => {
    console.log('SEARCHED<><><>')
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handleRowClick = (vendor) => {
    navigate(`/vendor-product/${vendor.vendor_id?.$numberLong || vendor.vendor_id}`, {
      state: {
        vendor,
        matches: vendor.matches || [],
      },
    });
  };

  const openModal = (vendor) => {
    setSelectedVendor(vendor);
    setFilteredMatches(vendor.matches || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
    setMinSimilarity("");
  };

  const handleFilter = () => {
    if (selectedVendor) {
      const minScore = parseFloat(minSimilarity) / 100;
      const matches = selectedVendor.matches.filter(item => item.similarity >= minScore);
      setFilteredMatches(matches);
    }
  };

  const clearShopUrl = () => {
    setShopUrl(null);
    setFilteredProducts(products);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendor Products</h1>
            <p className="text-gray-600">Manage and view all vendor products</p>
          </div>

          {/* Search Section */}
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-8">
            <Search
              setParPage={setParPage}
              setCurrentPage={setCurrentPage}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              onSearch={handleSearch}
            />
          </div>
          
          {/* Shop URL Filter */}
          <div className="flex items-center justify-center mb-6">
            {shopUrl && (
              <div className="flex items-center bg-blue-100/80 backdrop-blur-sm text-blue-800 rounded-full px-4 py-2 border border-blue-200/50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{shopUrl}</span>
                <button 
                  onClick={clearShopUrl} 
                  className="ml-3 text-blue-600 hover:text-red-600 hover:bg-white/50 rounded-full p-1 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-800">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200/50">
                  <tr>
                    <th scope="col" className="py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                      Vendor Product ID
                    </th>
                    <th scope="col" className="py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide" style={{ width: '50%' }}>
                      Details
                    </th>
                    <th scope="col" className="py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                      Shop URL
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100/50">
                  {filteredProducts?.map((vendor, i) => (
                    <tr
                      key={i}
                      className="cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
                      onClick={() => handleRowClick(vendor)}
                    >
                      <td className="py-6 px-6">
                        <div className="space-y-3">
                          <div className="bg-blue-50/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-200/50">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Product ID</p>
                            <p className="font-medium text-gray-900 font-mono text-sm">
                              {vendor.vendor_id?.$numberLong || vendor.vendor_id}
                            </p>
                          </div>
                          
                          {vendor?.vendorDetails?.variants?.map((variant, idx) => (
                            <div key={idx} className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                                  <p className="font-semibold text-gray-900">{variant?.title}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SKU</p>
                                  <p className="font-medium text-gray-700">{variant?.sku || 'Undefined'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      
                      <td className="py-6 px-6" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                        <div className="flex items-start space-x-4">
                          {/* Product Image */}
                          {vendor?.vendorDetails?.images[0]?.src && (
                            <div className="flex-shrink-0">
                              <img
                                src={vendor?.vendorDetails?.images[0]?.src}
                                alt={vendor.vendor_title}
                                className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-lg"
                              />
                            </div>
                          )}
                          
                          {/* Product Info */}
                          <div className="flex-1 space-y-3">
                            <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                              <p className="font-semibold text-gray-900">{vendor.vendor_title}</p>
                            </div>
                            
                            {vendor?.vendorDetails?.body_html && (
                              <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                                <div
                                  className="text-sm text-gray-700 line-clamp-3"
                                  dangerouslySetInnerHTML={{ __html: vendor.vendorDetails.body_html }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-6 px-6">
                        <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shop URL</p>
                          <a 
                            href={vendor?.vendorDetails?.shopURL}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 font-medium underline break-all transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {vendor?.vendorDetails?.shopURL}
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {!filteredProducts || filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Vendor Products Found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
              <Pagination
                pageNumber={currentPage}
                hasMore={hasMore}
                setPageNumber={setCurrentPage}
                parPage={parPage}
                showItem={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="w-3/4 md:w-1/2 lg:w-1/3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 relative max-h-[80vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl p-2 transition-all" 
              onClick={closeModal}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h5 className="text-lg pr-10 font-bold text-gray-800 mb-6">
              Retailer Products Matching {selectedVendor.vendor_title}
            </h5>
            
            <div className="mb-6 bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <input
                type="number"
                placeholder="Min Similarity (%)"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all mb-3"
              />
              <button
                onClick={handleFilter}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Apply Filter
              </button>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {filteredMatches?.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ID</p>
                        <p className="font-medium text-gray-900 font-mono text-sm">{item?.retail_id?.$numberLong || item?.retail_id}</p>
                      </div>
                      <span className="bg-green-100/80 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200/50">
                        {(item?.similarity * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                      <p className="font-semibold text-gray-900">{item?.retail_title}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredMatches.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.44-1.007-5.9-2.616M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Matches Found</h3>
                  <p className="text-gray-600">Try adjusting the similarity filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;