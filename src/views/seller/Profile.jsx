import React, { useEffect, useState } from 'react';
import { FaImages } from 'react-icons/fa6';
import { FadeLoader } from 'react-spinners';
import { FaRegEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  profile_image_upload,
  messageClear,
  profile_info_add,
} from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';

const Profile = () => {
  const [state, setState] = useState({
    division: '',
    district: '',
    shopName: '',
    sub_district: '',
  });

  const dispatch = useDispatch();
  const { userInfo, loader, successMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      messageClear();
    }
  }, [successMessage]);

  const add_image = (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      dispatch(profile_image_upload(formData));
    }
  };

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const add = (e) => {
    e.preventDefault();
    dispatch(profile_info_add(state));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 lg:p-7">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="w-full flex flex-wrap gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full md:w-6/12 lg:flex-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              {/* Profile Image Section */}
              <div className="flex justify-center items-center py-6 mb-6 border-b border-gray-200/50">
                {userInfo?.image ? (
                  <label
                    htmlFor="img"
                    className="h-[150px] w-[200px] relative p-3 cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    <img 
                      src={userInfo.image} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">Change Photo</span>
                    </div>
                    {loader && (
                      <div className="bg-black/70 absolute left-0 top-0 w-full h-full flex justify-center items-center z-20 rounded-xl backdrop-blur-sm">
                        <FadeLoader color="#ffffff" />
                      </div>
                    )}
                  </label>
                ) : (
                  <label
                    className="flex justify-center items-center flex-col h-[150px] w-[200px] cursor-pointer border-2 border-dashed hover:border-blue-500 border-gray-300 relative rounded-2xl bg-gray-50/50 backdrop-blur-sm hover:bg-gray-100/50 transition-all duration-200"
                    htmlFor="img"
                  >
                    <FaImages className="text-3xl text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">Select Image</span>
                    {loader && (
                      <div className="bg-black/70 absolute left-0 top-0 w-full h-full flex justify-center items-center z-20 rounded-2xl backdrop-blur-sm">
                        <FadeLoader color="#ffffff" />
                      </div>
                    )}
                  </label>
                )}
                <input
                  onChange={add_image}
                  type="file"
                  className="hidden"
                  id="img"
                />
              </div>

              {/* User Info Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 relative">
                  <span className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 absolute right-3 top-3 cursor-pointer transition-all duration-200 transform hover:scale-105">
                    <FaRegEdit className="text-white" />
                  </span>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-20">Name:</span>
                      <span className="text-gray-800 font-semibold">{userInfo.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-20">Email:</span>
                      <span className="text-gray-800">{userInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-20">Role:</span>
                      <span className="inline-flex px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-sm font-medium border border-blue-200/50 capitalize">
                        {userInfo.role}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-20">Status:</span>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                        userInfo.status === 'active' 
                          ? 'bg-green-100/80 text-green-800 border-green-200/50' 
                          : 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50'
                      }`}>
                        {userInfo.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-20">Payment:</span>
                      {userInfo.payment === 'active' ? (
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm cursor-pointer font-medium px-3 py-1 rounded-lg shadow-lg hover:shadow-red-500/25 transition-all">
                          {userInfo.payment}
                        </span>
                      ) : (
                        <span
                          onClick={() => dispatch(create_stripe_connect_account())}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm cursor-pointer font-medium px-3 py-1 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105"
                        >
                          Click Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Information</h3>
                {!userInfo?.shopInfo ? (
                  <form onSubmit={add} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="Shop" className="block text-sm font-medium text-gray-700">Shop Name</label>
                      <input
                        value={state.shopName}
                        onChange={inputHandle}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                        type="text"
                        name="shopName"
                        id="Shop"
                        placeholder="Enter shop name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="division" className="block text-sm font-medium text-gray-700">Division Name</label>
                      <input
                        value={state.division}
                        onChange={inputHandle}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                        type="text"
                        name="division"
                        id="division"
                        placeholder="Enter division name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700">District Name</label>
                      <input
                        value={state.district}
                        onChange={inputHandle}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                        type="text"
                        name="district"
                        id="district"
                        placeholder="Enter district name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="sub" className="block text-sm font-medium text-gray-700">Sub District Name</label>
                      <input
                        value={state.sub_district}
                        onChange={inputHandle}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                        type="text"
                        name="sub_district"
                        id="sub"
                        placeholder="Enter sub district name"
                      />
                    </div>

                    <button
                      disabled={loader ? true : false}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 w-[200px] text-white rounded-xl px-7 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 disabled:transform-none"
                    >
                      {loader ? (
                        <PropagateLoader
                          color="#fff"
                          cssOverride={overrideStyle}
                        />
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 relative">
                    <span className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 absolute right-3 top-3 cursor-pointer transition-all duration-200 transform hover:scale-105">
                      <FaRegEdit className="text-white" />
                    </span>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-28">Shop Name:</span>
                        <span className="text-gray-800 font-semibold">{userInfo.shopInfo?.shopName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-28">Division:</span>
                        <span className="text-gray-800">{userInfo.shopInfo?.division}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-28">District:</span>
                        <span className="text-gray-800">{userInfo.shopInfo?.district}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-28">Sub District:</span>
                        <span className="text-gray-800">{userInfo.shopInfo?.sub_district}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Change Password */}
          <div className="w-full md:w-6/12 lg:flex-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h3>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="o_password" className="block text-sm font-medium text-gray-700">Old Password</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                    type="password"
                    name="old_password"
                    id="o_password"
                    placeholder="Enter old password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="n_password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm transition-all"
                    type="password"
                    name="new_password"
                    id="n_password"
                    placeholder="Enter new password"
                  />
                </div>

                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-7 py-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                  Save Changes
                </button>
              </form>

              {/* Security Tips */}
              <div className="mt-8 bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Security Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use a strong password with at least 8 characters</li>
                  <li>• Include uppercase, lowercase, numbers, and symbols</li>
                  <li>• Don't reuse passwords from other accounts</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;