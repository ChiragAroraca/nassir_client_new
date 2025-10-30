import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { useDispatch, useSelector } from 'react-redux';
import { get_retailer_products } from '../../store/Reducers/productReducer';
import Pagination from '../Pagination';
import { useNavigate } from 'react-router-dom';

const RetailerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);
  const hasMore = useSelector((state) => state.product.hasMore);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [parPage, setParPage] = useState(10);
  const [shopUrl, setShopUrl] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(get_retailer_products({ 
      parPage: parseInt(parPage), 
      page: parseInt(currentPage), 
      searchValue: searchTerm 
    }));
  }, [searchTerm, currentPage, parPage, dispatch]);

  useEffect(() => {
    if (shopUrl) {
      const filtered = products.filter(product => product?.retailerDetails?.shopURL === shopUrl);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [shopUrl, products]);

  const handleSearch = () => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const clearShopUrl = () => {
    setShopUrl(null);
    setFilteredProducts(products);
  };

  const handleRowClick = (retailer) => {
    navigate(`/retailer-product/${retailer.retail_id?.$numberLong || retailer.retail_id}`, {
      state: {
        retailer,
        matches: retailer.matches || [],
      },
    });
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Products</h1>
            <p className="text-gray-600">Manage and view all retailer products</p>
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
          <div className="flex items-center mb-6">
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
                      Retailer Product ID
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
                  {filteredProducts?.map((retailer, i) => (
                    <tr
                      key={i}
                      className="cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
                      onClick={() => handleRowClick(retailer)}
                    >
                      <td className="py-6 px-6">
                        <div className="space-y-3">
                          <div className="bg-blue-50/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-200/50">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Product ID</p>
                            <p className="font-medium text-gray-900 font-mono text-sm">
                              {retailer.retail_id?.$numberLong || retailer.retail_id}
                            </p>
                          </div>
                          
                          {retailer?.retailerDetails?.variants?.map((variant, idx) => (
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
                          {retailer?.retailerDetails?.images[0]?.src && (
                            <div className="flex-shrink-0">
                              <img
                                src={retailer?.retailerDetails?.images[0]?.src}
                                alt={retailer.retail_title}
                                className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-lg"
                              />
                            </div>
                          )}
                          
                          {/* Product Info */}
                          <div className="flex-1 space-y-3">
                            <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                              <p className="font-semibold text-gray-900">{retailer.retail_title}</p>
                            </div>
                            
                            {retailer?.retailerDetails?.body_html && (
                              <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                                <div
                                  className="text-sm text-gray-700 line-clamp-3"
                                  dangerouslySetInnerHTML={{ __html: retailer.retailerDetails.body_html }}
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
                            href={retailer?.retailerDetails?.shopURL}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 font-medium underline break-all transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {retailer?.retailerDetails?.shopURL}
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Retailer Products Found</h3>
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
                setPageNumber={setCurrentPage}
                parPage={parPage}
                hasMore={hasMore}
                showItem={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerProducts;