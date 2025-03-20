import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { get_vendor_products } from "../../store/Reducers/productReducer";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";


const VendorProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const hasMore=useSelector((state)=>state.product.hasMore)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(50);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [minSimilarity, setMinSimilarity] = useState("");
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [shopUrl, setShopUrl] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products); // State for filtered products
  const navigate = useNavigate();


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(
      get_vendor_products({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
  }, [currentPage, parPage, searchValue, dispatch]);

  useEffect(() => {
    // Filter products based on the selected shop URL
    if (shopUrl) {
      const filtered = products.filter(product => product?.vendorDetails?.shopURL === shopUrl);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Reset to all products if no shop URL is selected
    }
  }, [shopUrl, products]);



  const handleRowClick = (vendor) => {
    navigate(`/vendor-product/${vendor.vendor_id?.$numberLong || vendor.vendor_id}`, {
      state: {
        vendor,
        matches: vendor.matches || [],
      },
    });
  };
  const openModal = (vendor) => {
    setSelectedVendor(vendor);
    setFilteredMatches(vendor.matches || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
    setMinSimilarity("");
  };

  const handleFilter = () => {
    if (selectedVendor) {
      const minScore = parseFloat(minSimilarity) / 100; // Convert percentage to decimal
      const matches = selectedVendor.matches.filter(item => item.similarity >= minScore);
      setFilteredMatches(matches);
    }
  };


  const clearShopUrl = () => {
    setShopUrl(null); // Clear the selected shop URL
    setFilteredProducts(products); // Reset to all products
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <h1 className="text-white font-bold text-2xl mb-6">Vendor Products</h1>
      <div className="w-full p-6 bg-white text-gray-800 rounded-lg shadow">
        <Search
          setParPage={setParPage}
          setCurrentPage={setCurrentPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="flex items-center justify-center mb-4">
          {shopUrl && (
            <div className="flex items-center ml-4 bg-gray-200 text-gray-800 rounded-full px-3 py-1">
              <span>{shopUrl}</span>
              <button onClick={clearShopUrl} className="ml-2 text-red-500">
                ✖
              </button>
            </div>
          )}
        </div>
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-sm uppercase border-b border -gray-300 bg-gray-100">
              <tr>
                <th scope="col" className="py-3 px-4">Vendor Product ID</th>
                <th scope="col" className="py-3 px-4" style={{ width: '50%' }}>Details</th>
                <th scope="col" className="py-3 px-4">Shop URL</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((vendor, i) => (
               <tr
               key={i}
               className="border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition"
               onClick={() => handleRowClick(vendor)}
             >
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <p>
                      <strong>ID:</strong> {vendor.vendor_id?.$numberLong || vendor.vendor_id}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-medium" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                    <p>
                      <strong>Title:</strong> {vendor.vendor_title}
                    </p>
                    {vendor?.vendorDetails?.images[0]?.src && (
                      <img
                        src={vendor?.vendorDetails?.images[0]?.src}
                        alt={vendor.vendor_title}
                        className="w-20 h-20 py-2 object-cover rounded-md mb-2"
                      />
                    )}
                    {vendor?.vendorDetails?.body_html && (
                      <div
                        className="text-sm text-gray-700 mt-2"
                        dangerouslySetInnerHTML={{ __html: vendor.vendorDetails.body_html }}
                      />
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <a 
                      href={vendor?.vendorDetails?.shopURL}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {vendor?.vendorDetails?.shopURL}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full flex justify-end mt-6">
          <Pagination
            pageNumber={currentPage}
            hasMore={hasMore}
            setPageNumber={setCurrentPage}
            parPage={parPage}
            showItem={3}
          />
        </div>
      </div>

      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-3/4 md:w-1/2 lg:w-1/3 bg-white rounded-lg p-6 shadow-lg relative max-h-[80vh] overflow-y-auto">
            <button className="absolute top-4 right-6 text-gray-600 text-xl" onClick={closeModal}> ✖</button>
            <h5 className="text-sm pr-10 font-bold text-gray-800 mb-4">Retailer Products Matching {selectedVendor.vendor_title}</h5>
            <div className="mb-4 relative">
              <input
                type="number"
                placeholder="Min Similarity (%)"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(e.target.value)}
                className="px-4 py-2 border text-black rounded-lg w-full"
              />
              <button
                onClick={handleFilter}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Apply Filter
              </button>
            </div>
            <div className="flex flex-col gap-4 items-center">
              {filteredMatches?.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-md bg-gray-100 w-full">
                  <p className="text-black"><strong>ID:</strong> {item?.retail_id?.$numberLong || item?.retail_id}</p>
                  <p className="text-black"><strong>Title:</strong> {item?.retail_title}</p>
                  <p className="text-black"><strong>Score:</strong> {(item?.similarity * 100).toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;