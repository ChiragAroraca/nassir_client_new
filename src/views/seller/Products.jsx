import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(50);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
  }, [searchTerm, currentPage, parPage]);

  const handleSearch = () => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
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
            <p className="text-gray-600">Manage and view all your products</p>
          </div>

          {/* Search Section */}
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-8">
            <Search
              setParPage={setParPage}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              onSearch={handleSearch}
            />
          </div>

          {/* Products Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-800">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200/50">
                  <tr>
                    <th scope="col" className="py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                      ID
                    </th>
                    <th scope="col" className="py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                      Vendor Product
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100/50">
                  {products?.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-all duration-200">
                      <td className="py-6 px-6 font-medium text-gray-900">
                        <div className="bg-blue-50/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-200/50 font-mono text-sm">
                          {d?._id}
                        </div>
                      </td>

                      {/* Vendor Product */}
                      <td className="py-6 px-6">
                        <div className="flex items-start space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-lg"
                              src={d.vendorProduct.images[0]?.src}
                              alt="Vendor Product"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Product ID</p>
                                <p className="font-medium text-gray-900 font-mono text-sm">{d?.vendorProduct?._id}</p>
                              </div>
                              <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price</p>
                                <p className="font-bold text-green-600 text-lg">${d?.vendorProduct?.variants[0]?.price}</p>
                              </div>
                            </div>

                            <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                              <p className="font-semibold text-gray-900">{d?.vendorProduct?.title}</p>
                            </div>

                            <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vendor</p>
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-sm font-medium border border-blue-200/50">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {d?.vendorProduct?.vendor}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {!products || products.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or add new products.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalProduct > parPage && (
            <div className="flex justify-end mt-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalProduct}
                  parPage={parPage}
                  showItem={3}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;