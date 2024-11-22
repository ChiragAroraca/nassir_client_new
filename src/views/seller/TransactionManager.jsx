import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { update_pdf_status } from '../../store/Reducers/OrderReducer';
import { get_seller_customers } from '../../store/Reducers/customerReducer';

const TransactionManager = () => {
  const dispatch = useDispatch();
  const { myCustomers, totalCustomer } = useSelector((state) => state.customer);
  const { userInfo } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(100);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(500);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      sellerId: userInfo._id,
    };
    dispatch(get_seller_customers(obj));
  }, [searchValue, currentPage, parPage]);

  const handleStatusChange = (customerId, documentName, status) => {
    dispatch(
      update_pdf_status({
        orderId: customerId,
        newStatus: status,
        documentName,
      })
    );
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-lg mb-3">Customers and Legal Documents</h1>
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
                <th scope="col" className="py-3 px-4">Customer Id</th>
                <th scope="col" className="py-3 px-4">Customer Name</th>
                <th scope="col" className="py-3 px-4">Legal Documents</th>
              </tr>
            </thead>
            <tbody>
              {myCustomers.map((customer, i) => (
                <tr key={i}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">#{customer._id}</td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">{customer.name}</td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {customer.legalDocuments && customer.legalDocuments.length > 0 ? (
                      customer.legalDocuments.map((document, index) => (
                        <div key={index} className="mb-2">
                          <p className="font-semibold">{document.name}</p>
                          {document.uploadUrl ? (
                            <a
                              href={document.uploadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300 mr-2"
                            >
                              View Document
                            </a>
                          ) : (
                            <span>No Document Uploaded</span>
                          )}
                          <select
                            value={document.status || 'Pending'}
                            onChange={(e) =>
                              handleStatusChange(customer._id, document.name, e.target.value)
                            }
                            className="bg-[#6a5fdf] text-white border border-gray-300 rounded p-1 ml-2"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      ))
                    ) : (
                      'No Legal Documents Found'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalCustomer <= parPage ? null : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalCustomer}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManager;
