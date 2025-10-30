import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../components/Search';
import { get_seller_request } from '../../store/Reducers/sellerReducer';

const SellerRequest = () => {
  const dispatch = useDispatch();
  const { sellers, totalSeller } = useSelector((state) => state.seller);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(
      get_seller_request({
        parPage,
        searchValue,
        page: currentPage,
      })
    );
  }, [parPage, searchValue, currentPage]);

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Requests</h1>
          <p className="text-gray-600">Review and manage pending seller applications</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6">
          {/* Search Section */}
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-8">
            <Search
              setParPage={setParPage}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
            />
          </div>

          {/* Seller Requests Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-800">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200/50">
                  <tr>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">No</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Name</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Email</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Payment Status</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                    <th scope="col" className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100/50">
                  {sellers.map((d, i) => (
                    <tr className="hover:bg-gray-50/50 transition-all duration-200" key={i}>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        <div className="w-8 h-8 bg-orange-100/80 text-orange-800 rounded-lg flex items-center justify-center text-sm font-semibold">
                          {i + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {d.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span>{d.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/50">
                          {d.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          d.payment === 'active' 
                            ? 'bg-green-100/80 text-green-800 border border-green-200/50' 
                            : d.payment === 'pending'
                            ? 'bg-orange-100/80 text-orange-800 border border-orange-200/50'
                            : 'bg-red-100/80 text-red-800 border border-red-200/50'
                        }`}>
                          {d.payment}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          d.status === 'active' 
                            ? 'bg-green-100/80 text-green-800 border border-green-200/50' 
                            : d.status === 'pending'
                            ? 'bg-orange-100/80 text-orange-800 border border-orange-200/50'
                            : 'bg-red-100/80 text-red-800 border border-red-200/50'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-start items-center gap-4">
                          <Link
                            to={`/admin/dashboard/seller/details/${d._id}`}
                            className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                          >
                            <FaEye />
                            <span className="hidden sm:inline text-sm font-medium">Review</span>
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
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Seller Requests Found</h3>
                  <p className="text-gray-600">There are currently no pending seller requests to review.</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-orange-50/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-800 mb-1">Review Guidelines</h4>
                <p className="text-xs text-orange-700">
                  Review each seller request carefully. Check their business information, payment setup, and ensure all required documents are provided before approval.
                </p>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="w-full flex justify-end mt-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={50}
                parPage={parPage}
                showItem={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;
