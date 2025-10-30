import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  get_seller,
  seller_status_update,
  messageClear,
} from '../../store/Reducers/sellerReducer';
import toast from 'react-hot-toast';

const SellerDetails = () => {
  const dispatch = useDispatch();
  const { seller, successMessage } = useSelector((state) => state.seller);
  const { sellerId } = useParams();

  useEffect(() => {
    dispatch(get_seller(sellerId));
  }, [sellerId]);

  const [status, setStatus] = useState('');
  
  const submit = (e) => {
    e.preventDefault();
    dispatch(
      seller_status_update({
        sellerId,
        status,
      })
    );
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage]);

  useEffect(() => {
    if (seller) {
      setStatus(seller.status);
    }
  }, [seller]);

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Details</h1>
          <p className="text-gray-600">View and manage seller account information</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8">
          <div className="w-full flex flex-wrap gap-8">
            {/* Profile Image Section */}
            <div className="w-full lg:w-3/12 flex justify-center items-start">
              <div className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 w-full max-w-sm">
                <div className="text-center">
                  {seller?.image ? (
                    <img
                      className="w-full h-[230px] object-cover rounded-xl shadow-lg border-4 border-white"
                      src="http://localhost:3000/images/demo.jpg"
                      alt="Seller Profile"
                    />
                  ) : (
                    <div className="w-full h-[230px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-500 font-medium">Image Not Uploaded</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="w-full lg:w-4/12">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Basic Info
                </h2>

                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-24">Name:</span>
                    <span className="text-gray-900 font-semibold">{seller?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-24">Email:</span>
                    <span className="text-gray-900">{seller?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-24">Role:</span>
                    <span className="inline-flex px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-sm font-medium border border-blue-200/50 capitalize">
                      {seller?.role}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-24">Status:</span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                      seller?.status === 'active' 
                        ? 'bg-green-100/80 text-green-800 border-green-200/50' 
                        : seller?.status === 'pending'
                        ? 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50'
                        : 'bg-red-100/80 text-red-800 border-red-200/50'
                    }`}>
                      {seller?.status}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-24">Payment:</span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                      seller?.payment === 'active' 
                        ? 'bg-green-100/80 text-green-800 border-green-200/50' 
                        : 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50'
                    }`}>
                      {seller?.payment}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="w-full lg:w-4/12">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Address
                </h2>

                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-28">Shop Name:</span>
                    <span className="text-gray-900 font-semibold">
                      {seller?.shopInfo?.shopName || 
                        <span className="text-gray-400 italic">Not set</span>
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-28">Division:</span>
                    <span className="text-gray-900">
                      {seller?.shopInfo?.division || 
                        <span className="text-gray-400 italic">Not set</span>
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-28">District:</span>
                    <span className="text-gray-900">
                      {seller?.shopInfo?.district || 
                        <span className="text-gray-400 italic">Not set</span>
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-28">Sub District:</span>
                    <span className="text-gray-900">
                      {seller?.shopInfo?.sub_district || 
                        <span className="text-gray-400 italic">Not set</span>
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Form */}
          <div className="mt-8 pt-8 border-t border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Update Status</h3>
            <form onSubmit={submit}>
              <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                      required
                    >
                      <option value="">--Select Status--</option>
                      <option value="active">Active</option>
                      <option value="deactive">Deactive</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 w-full sm:w-[170px] text-white rounded-xl px-7 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 font-medium"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;