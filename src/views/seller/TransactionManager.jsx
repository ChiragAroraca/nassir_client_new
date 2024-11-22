import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_seller_customers, update_customer_status } from "../../store/Reducers/customerReducer";

const TransactionManager = () => {
  const dispatch = useDispatch();
  const { myCustomers, totalCustomer, successMessage, errorMessage, loading } = useSelector(
    (state) => state.customer
  );
  const { userInfo } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      sellerId: userInfo._id,
    };
    dispatch(get_seller_customers(obj));
  }, [searchValue, currentPage, parPage]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
    }
    if (errorMessage) {
      alert(errorMessage);
    }
  }, [successMessage, errorMessage]);

  const isValidUrl = (url) => {
    try {
      return url && new URL(url);
    } catch {
      return false;
    }
  };

  const handleStatusChange = (customerId, documentName, status) => {
    dispatch(
      update_customer_status({
        customerId,
        updatedData: { documentName, status },
      })
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-lg mb-3">
        Customers and Legal Documents
      </h1>
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="mt-5 space-y-5">
          {myCustomers.map((customer, i) => (
            <div
              key={customer._id}
              className="p-5 bg-white shadow-md rounded-md border border-gray-200"
            >
              <h2 className="text-lg font-bold text-gray-800">
                {customer.name} (ID: #{customer._id})
              </h2>
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700">
                  Legal Documents:
                </h3>
                {customer.legalDocuments && customer.legalDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                    {customer.legalDocuments.map((document, index) => (
                      <div
                        key={`${customer._id}-${index}`}
                        className="p-4 bg-gray-50 rounded-md shadow border border-gray-300"
                      >
                        <h4 className="font-semibold text-gray-800">
                          {document.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-2">
                          Status:{" "}
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              document.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : document.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {document.status}
                          </span>
                        </p>
                        {document.uploadUrl && isValidUrl(document.uploadUrl) ? (
                          <a
                            href={document.uploadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-3 text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                          >
                            View Document
                          </a>
                        ) : (
                          <p className="text-sm text-red-500 mt-3">
                            No Valid Document Uploaded
                          </p>
                        )}
                        <div className="mt-3">
                          <label
                            htmlFor={`status-${customer._id}-${index}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Update Status:
                          </label>
                          <select
                            id={`status-${customer._id}-${index}`}
                            value={document.status}
                            onChange={(e) =>
                              handleStatusChange(
                                customer._id,
                                document.name,
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-2">
                    No Legal Documents Found
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalCustomer > parPage && (
          <div className="w-full flex justify-end mt-4">
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
