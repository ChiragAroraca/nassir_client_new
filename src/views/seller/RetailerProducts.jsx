import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { useDispatch, useSelector } from 'react-redux';
import { get_retailer_products } from '../../store/Reducers/productReducer';
import Pagination from '../Pagination';

const RetailerProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const hasMore=useSelector((state)=>state.product.hasMore)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(20);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [minSimilarity, setMinSimilarity] = useState(""); // State for minimum similarity
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [shopUrl, setShopUrl] = useState(null); // State for shop URL
  const [filteredProducts, setFilteredProducts] = useState(products); // State for filtered products

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(get_retailer_products({ parPage: parseInt(parPage), page: parseInt(currentPage), searchValue }));
  }, [searchValue, currentPage, parPage, dispatch]);

  useEffect(() => {
    // Filter products based on the selected shop URL
    if (shopUrl) {
      const filtered = products.filter(product => product?.retailerDetails?.shopURL === shopUrl);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Reset to all products if no shop URL is selected
    }
  }, [shopUrl, products]);

  const openModal = (retailer) => {
    setSelectedVendor(retailer);
    setFilteredMatches(retailer.matches || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
    setMinSimilarity(""); // Reset minSimilarity when closing modal
  };

  const handleFilter = () => {
    if (selectedVendor) {
      const minScore = parseFloat(minSimilarity) / 100; // Convert percentage to decimal
      const matches = selectedVendor.matches.filter(item => item.similarity >= minScore);
      setFilteredMatches(matches);
    }
  };

  const handleShopUrlClick = (shopURL, e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setShopUrl(shopURL); // Set the shop URL state
    setCurrentPage(1); // Reset current page to 1
  };

  const clearShopUrl = () => {
    setShopUrl(null); // Clear the selected shop URL
    setFilteredProducts(products); // Reset to all products
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <h1 className="text-white font-bold text-2xl mb-6">All Products</h1>
      <div className="w-full p-6 bg-white text-gray-800 rounded-lg shadow">
        <Search
          setParPage={setParPage}
          setCurrentPage={setCurrentPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue} />
        <div className="flex items-center mb-4">
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
            <thead className="text-sm uppercase border-b border-gray-300 bg-gray-100">
              <tr>
                <th scope="col" className="py-3 px-4">Retailer Product ID</th>
                <th scope="col" className="py-3 px-4" style={{ width: '50%' }}>Details</th>
                <th scope="col" className="py-3 px-4">Shop URL</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((retailer, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => openModal(retailer)}
                >
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <p>
                      <strong>ID:</strong> {retailer.retail_id?.$numberLong || retailer.retail_id}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-medium" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                    <p>
                      <strong>Title:</strong> {retailer.retail_title}
                    </p>
                    {retailer?.retailerDetails?.images[0]?.src && (
                      <img
                        src={retailer?.retailerDetails?.images[0]?.src}
                        alt={retailer.retail_title}
                        className="w-20 h-20 py-2 object-cover rounded-md mb-2"
                      />
                    )}
                    {retailer?.retailerDetails?.body_html && (
                      <div
                        className="text-sm text-gray-700 mt-2"
                        dangerouslySetInnerHTML={{ __html: retailer.retailerDetails.body_html }}
                      />
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleShopUrlClick(retailer?.retailerDetails?.shopURL, e);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {retailer?.retailerDetails?.shopURL}
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
            setPageNumber={setCurrentPage}
            parPage={parPage}
            hasMore={hasMore}
            showItem={3}
          />
        </div>
      </div>

      {isModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-3/4 md:w-1/2 lg:w-1/3 bg-white rounded-lg p-6 shadow-lg relative max-h-[80vh] overflow-y-auto">
            <button className="absolute top-4 right-6 text-gray-600 text-xl" onClick={closeModal}>✖</button>
            <h5 className="text-sm pr-10 font-bold text-gray-800 mb-4">Vendor Products matching {selectedVendor.retail_title}</h5>
            <div className="mb-4 relative">
              <input
                type="number"
                placeholder="Min Similarity (%)"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full text-black"
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
                  <p className="text-black"><strong>ID:</strong> {item?.vendor_id?.$numberLong || item?.vendor_id}</p>
                  <p className="text-black"><strong>Title:</strong> {item?.vendor_title}</p>
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

export default RetailerProducts;