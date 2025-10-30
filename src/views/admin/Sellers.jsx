import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer';

const Sellers = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);

  const { sellers, totalSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_active_sellers(obj));
  }, [searchValue, currentPage, parPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 lg:p-7">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 pl-5">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sellers</h1>
          <p className="text-gray-600">Manage and view all active sellers</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          {/* Search and Filter Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
                <select
                  onChange={(e) => setParPage(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search sellers</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all w-64"
                  type="text"
                  placeholder="Search by name, email, shop..."
                />
              </div>
            </div>
          </div>

          {/* Sellers Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-800">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200/50">
                  <tr>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">No</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Image</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Name</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Shop Name</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Payment Status</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Email</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">District</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100/50">
                  {sellers.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-all duration-200">
                      <td className="py-4 px-4 font-medium text-gray-900">
                        <div className="w-8 h-8 bg-blue-100/80 text-blue-800 rounded-lg flex items-center justify-center text-sm font-semibold">
                          {i + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <img 
                          className="w-[45px] h-[45px] rounded-xl object-cover border-2 border-white shadow-lg" 
                          src={d.image} 
                          alt="" 
                        />
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {d.name}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {d.shopInfo?.shopName || 
                          <span className="text-gray-400 italic">Not set</span>
                        }
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          d.payment === 'active' 
                            ? 'bg-green-100/80 text-green-800 border border-green-200/50' 
                            : 'bg-yellow-100/80 text-yellow-800 border border-yellow-200/50'
                        }`}>
                          {d.payment}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {d.email}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          d.status === 'active' 
                            ? 'bg-green-100/80 text-green-800 border border-green-200/50' 
                            : d.status === 'pending'
                            ? 'bg-yellow-100/80 text-yellow-800 border border-yellow-200/50'
                            : 'bg-red-100/80 text-red-800 border border-red-200/50'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {d.shopInfo?.district || 
                          <span className="text-gray-400 italic">Not set</span>
                        }
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-start items-center gap-4">
                          <Link
                            to={`/admin/dashboard/seller/details/${d._id}`}
                            className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                          >
                            <FaEye />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {sellers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Sellers Found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalSeller <= parPage ? (
            <div className="w-full flex justify-end mt-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalSeller}
                  parPage={parPage}
                  showItem={4}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default Sellers;