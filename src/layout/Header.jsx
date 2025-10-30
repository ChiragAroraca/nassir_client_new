import React from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Header = ({ showSidebar, setShowSidebar }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 w-full py-4 px-4 lg:px-7 z-40">
      <div className="ml-0 lg:ml-[280px] transition-all">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 h-[65px] flex justify-between items-center px-5">
          
          {/* Mobile menu toggle */}
          <div
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-[35px] flex lg:hidden h-[35px] rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-blue-500/25 justify-center items-center cursor-pointer transition-all duration-200"
          >
            <span>
              <FaList className="text-white" />
            </span>
          </div>

          {/* Search input - conditional rendering */}
          {location.pathname !== '/seller/dashboard/vendor-products' && location.pathname !== '/seller/dashboard/retailer-products' ? (
            <div className="hidden md:block">
              <input
                className="px-3 py-2 outline-none border border-gray-200 bg-gray-50/50 rounded-xl text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                type="text"
                name="search"
                placeholder="search"
              />
            </div>
          ) : null}

          {/* User profile section */}
          <div className="flex justify-center items-center gap-8 relative">
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center gap-3">
                <div className="flex justify-center items-center flex-col text-end">
                  <h2 className="text-md font-bold text-gray-800">{userInfo.name}</h2>
                  <span className="text-[14px] w-full font-normal text-gray-600">
                    {userInfo.role}
                  </span>
                </div>

                {userInfo.role === 'admin' ? (
                  <img
                    className="w-[45px] h-[45px] rounded-xl overflow-hidden shadow-lg border-2 border-white"
                    src="http://localhost:3001/images/admin.jpg"
                    alt=""
                  />
                ) : (
                  <img
                    className="w-[45px] h-[45px] rounded-xl overflow-hidden shadow-lg border-2 border-white"
                    src={userInfo.image}
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;