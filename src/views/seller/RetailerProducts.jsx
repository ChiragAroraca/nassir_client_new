import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { useDispatch, useSelector } from 'react-redux';
import { get_retailer_products } from '../../store/Reducers/productReducer';
import Pagination from '../Pagination';
import { useNavigate } from 'react-router-dom';

const RetailerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);
  const hasMore = useSelector((state) => state.product.hasMore);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // For actual API search
  const [parPage, setParPage] = useState(10);
  const [shopUrl, setShopUrl] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(get_retailer_products({ 
      parPage: parseInt(parPage), 
      page: parseInt(currentPage), 
      searchValue: searchTerm 
    }));
  }, [searchTerm, currentPage, parPage, dispatch]);

  useEffect(() => {
    if (shopUrl) {
      const filtered = products.filter(product => product?.retailerDetails?.shopURL === shopUrl);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [shopUrl, products]);

  const handleSearch = () => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const clearShopUrl = () => {
    setShopUrl(null);
    setFilteredProducts(products);
  };

  const handleRowClick = (retailer) => {
    navigate(`/retailer-product/${retailer.retail_id?.$numberLong || retailer.retail_id}`, {
      state: {
        retailer,
        matches: retailer.matches || [],
      },
    });
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <h1 className="text-white font-bold text-2xl mb-6">All Products</h1>
      <div className="w-full p-6 bg-white text-gray-800 rounded-lg shadow">
        <Search
          setParPage={setParPage}
          setCurrentPage={setCurrentPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          onSearch={handleSearch}
        />

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
                  onClick={() => handleRowClick(retailer)}
                >
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <p>
                      <strong>ID:</strong> {retailer.retail_id?.$numberLong || retailer.retail_id}
                    </p>
                    {retailer?.retailerDetails?.variants?.map((variant, idx) => (
                      <div key={idx} className="py-3">
                        <p><strong>Title:</strong> {variant?.title}</p>
                        <p><strong>SKU:</strong> {variant?.sku || 'Undefined'}</p>
                      </div>
                    ))}
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
                      href={retailer?.retailerDetails?.shopURL}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
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
    </div>
  );
};

export default RetailerProducts;