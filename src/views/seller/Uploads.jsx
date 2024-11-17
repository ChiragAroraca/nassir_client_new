import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_orders, update_pdf_status } from '../../store/Reducers/OrderReducer';

const Uploads = () => {
  const dispatch = useDispatch();

  const { myOrders, totalOrder } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      sellerId: userInfo._id,
    };
    dispatch(get_seller_orders(obj));
  }, [searchValue, currentPage, parPage]);

  const handleStatusChange = (orderId, status) => {
    dispatch(update_pdf_status({ orderId, status }));
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-lg mb-3">Orders</h1>

      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">Order Id</th>
                <th scope="col" className="py-3 px-4">View PDFs</th>
                <th scope="col" className="py-3 px-4">PDF Status</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((d, i) => (
                <tr key={i}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">#{d._id}</td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {/* Iterate through the uploads array to display multiple "View PDF" buttons */}
                    {d.uploads && d.uploads.length > 0 ? (
                      d.uploads.map((upload, index) => (
                        upload.pdfUrl ? (
                          <a
                            key={index}
                            href={upload.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300 mr-2 mb-2"
                          >
                            View PDF {index + 1}
                          </a>
                        ) : (
                          <span key={index}>No PDF available</span>
                        )
                      ))
                    ) : (
                      'No PDFs available'
                    )}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <select
                      value={d.pdf_status || 'Pending'}
                      onChange={(e) => handleStatusChange(d._id, e.target.value)}
                      className="bg-[#6a5fdf] text-white border border-gray-300 rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalOrder <= parPage ? null : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploads;
