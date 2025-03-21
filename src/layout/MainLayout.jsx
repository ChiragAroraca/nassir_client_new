import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, updateSellers } from '../store/Reducers/chatReducer';
import api from '../api/api'; // Import the pre-configured Axios instance

const MainLayout = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [showSidebar, setShowSidebar] = useState(false);

  // Function to add a seller or admin
  const addUser = async () => {
    if (userInfo) {
      try {
        if (userInfo.role === 'seller') {
          await api.post('/addSeller', {
            sellerId: userInfo._id,
            userInfo,
          });
        } else {
          await api.post('/addAdmin', { adminInfo: userInfo });
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  // Fetch active customers and sellers
  const fetchActiveUsers = async () => {
    try {
      const customersResponse = await api.get('/getActiveCustomers');
      dispatch(updateCustomer(customersResponse.data));

      const sellersResponse = await api.get('/getActiveSellers');
      dispatch(updateSellers(sellersResponse.data));
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  // Add user and fetch active users on component mount
  useEffect(() => {
    addUser();
    fetchActiveUsers();

    // Polling for active users (replace with WebSocket or SSE if needed)
    const interval = setInterval(() => {
      fetchActiveUsers();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [userInfo, dispatch]);

  return (
    <div className="bg-[#cdcae9] w-full min-h-screen">
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="ml-0 lg:ml-[260px] pt-[95px] transition-all">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;