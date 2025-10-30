import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/Reducers/authReducer';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [allNav, setAllNav] = useState([]);
  
  useEffect(() => {
    const navs = getNav(role);
    setAllNav(navs);
  }, [role]);

  return (
    <div>
      {/* Overlay */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-300 ${!showSidebar ? 'invisible opacity-0' : 'visible opacity-100'} w-screen h-screen bg-black/20 backdrop-blur-sm top-0 left-0 z-40`}
      ></div>

      {/* Sidebar */}
      <div
        className={`w-[280px] fixed bg-white/90 backdrop-blur-xl z-50 top-0 h-screen shadow-2xl border-r border-white/20 transition-all duration-300 ${showSidebar ? 'left-0' : '-left-[280px] lg:left-0'}`}
      >
        {/* Header with gradient bar */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="h-[80px] flex justify-center items-center px-6 border-b border-gray-100/50">
            <Link to="/" className="flex items-center space-x-3">
              {/* Modern logo container */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
                <p className="text-xs text-gray-500">Seller Portal</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6">
          <nav>
            <ul className="space-y-2">
              {allNav.map((n, i) => (
                <li key={i}>
                  <Link
                    to={n.path}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      pathname === n.path 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]' 
                        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900 hover:transform hover:scale-[1.01]'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-5 h-5 transition-transform duration-200 ${
                      pathname === n.path ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`}>
                      {n.icon}
                    </div>
                    <span className={`font-medium transition-colors duration-200 ${
                      pathname === n.path ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {n.title}
                    </span>
                    
                    {/* Active indicator */}
                    {pathname === n.path && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="my-8 border-t border-gray-200/50"></div>

            {/* Logout button */}
            <div>
              <button
                onClick={() => dispatch(logout({ navigate, role }))}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:transform hover:scale-[1.01]"
              >
                <div className="flex items-center justify-center w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-200">
                  <BiLogOutCircle />
                </div>
                <span className="font-medium">Logout</span>
                <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100/50">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs text-gray-600 bg-gray-50/80 border border-gray-200/50">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              System Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
