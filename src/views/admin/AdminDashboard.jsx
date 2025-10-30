import React, { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import seller from '../../assets/seller.png';
import { get_admin_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSale,
    totalOrder,
    totalProduct,
    totalSeller,
    recentOrder,
    recentMessage,
  } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(get_admin_dashboard_data());
  }, []);

  const state = {
    series: [
      {
        name: 'Orders',
        data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45],
      },
      {
        name: 'Revenue',
        data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78],
      },
      {
        name: 'Sellers',
        data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56],
      },
    ],
    options: {
      colors: ['#3B82F6', '#8B5CF6', '#06B6D4'],
      plotOptions: {
        radius: 30,
      },
      chart: {
        background: 'transparent',
        foreColor: '#374151',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: ['smooth', 'straight', 'stepline'],
        lineCap: 'butt',
        colors: '#f0f0f0',
        width: 2,
        dashArray: 0,
      },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ],
      },
      legend: {
        position: 'top',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 5,
      },
      responsive: [
        {
          breakpoint: 565,
          options: {
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            chart: {
              height: '550px',
            },
          },
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-7">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 pl-5">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your platform overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-gray-800">${totalSale}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MdCurrencyExchange className="text-white text-2xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Products</p>
                <p className="text-3xl font-bold text-gray-800">{totalProduct}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MdProductionQuantityLimits className="text-white text-2xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">+5.2%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>

          {/* Sellers Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Sellers</p>
                <p className="text-3xl font-bold text-gray-800">{totalSeller}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaUsers className="text-white text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+8.1%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Orders</p>
                <p className="text-3xl font-bold text-gray-800">{totalOrder}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaCartShopping className="text-white text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">+3.2%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* Charts and Messages Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Analytics Overview</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Live Data</span>
                </div>
              </div>
              <Chart
                options={state.options}
                series={state.series}
                type="bar"
                height={350}
              />
            </div>
          </div>

          {/* Recent Messages */}
          <div className="lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Recent Seller Messages</h3>
                <Link 
                  to="/admin/messages" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentMessage.map((m, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                    <div className="flex-shrink-0">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        src={m.senderId === userInfo._id ? userInfo.image : seller}
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {m.senderName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {moment(m.createdAt).startOf('hour').fromNow()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {m.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
            <Link 
              to="/admin/orders" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Payment Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Order Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrder.map((d, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      #{d._id?.slice(-8)}
                    </td>
                    <td className="py-4 px-4 text-gray-700 font-semibold">
                      ${d.price}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        d.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {d.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        d.delivery_status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : d.delivery_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {d.delivery_status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link 
                        to={`/admin/dashboard/order/details/${d._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;