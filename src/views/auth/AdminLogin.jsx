import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(admin_login(state));
    // console.log(state)
  };

  const overrideStyle = {
    display: 'flex',
    margin: '0 auto',
    height: '24px',
    justifyContent: 'center',
    alignItems: 'center',
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate('/');
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-50 flex justify-center items-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main container with glass morphism effect */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Header section */}
          <div className="text-center mb-8">
            {/* Brand Logo */}
            <div className="h-[70px] flex justify-center items-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                <h1 className="text-2xl font-bold tracking-wide">ADMIN</h1>
                <div className="text-xs font-medium opacity-90 tracking-wider">PORTAL</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414-4.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Administrator Access</h2>
              <p className="text-gray-600 text-sm">Sign in to access admin dashboard</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  onChange={inputHandle}
                  value={state.email}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  type="email"
                  name="email"
                  placeholder="Email"
                  id="email"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  onChange={inputHandle}
                  value={state.password}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  type="password"
                  name="password"
                  placeholder="Password"
                  id="password"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              disabled={loader ? true : false}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[0.98] active:scale-95 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none"
            >
              {loader ? (
                <div className="flex items-center justify-center">
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Login to Dashboard
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Admin access only - Unauthorized access is prohibited
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs text-gray-600 bg-white/60 backdrop-blur-sm border border-white/20">
            <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
            </svg>
            Secure Admin Access
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
