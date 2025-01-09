import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct } = useSelector((state) => state.product);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(50);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
  }, [searchValue, currentPage, parPage]);

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <h1 className="text-white font-bold text-2xl mb-6">All Products</h1>

      <div className="w-full p-6 bg-white text-gray-800 rounded-lg shadow">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-sm uppercase border-b border-gray-300 bg-gray-100">
              <tr>
                <th scope="col" className="py-3 px-4">ID</th>
                <th scope="col" className="py-3 px-4">Vendor Product</th>
                <th scope="col" className="py-3 px-4">Retailer Product</th>
                <th scope="col" className="py-3 px-4">Similarity Score</th>
                <th scope="col" className="py-3 px-4">Published Shops</th>
              </tr>
            </thead>

            <tbody>
              {products.map((d, i) => (
                <tr key={i} className="border-b border-gray-300">
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{d._id}</td>

                  {/* Vendor Product */}
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <div>
                      <p><strong>ID:</strong> {d.vendorProduct._id}</p>
                      <p><strong>Title:</strong> {d.vendorProduct.title}</p>
                      <p><strong>Vendor:</strong> {d.vendorProduct.vendor}</p>
                      <p><strong>Price:</strong> ${d.vendorProduct.variants[0]?.price}</p>
                      <img
                        className="w-[80px] h-[80px] mt-2 object-cover rounded border"
                        src={d.vendorProduct.images[0]?.src}
                        alt="Vendor"
                      />
                    </div>
                  </td>

                  {/* Retailer Product */}
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {d.retailerProduct ? (
                      <div>
                        <p><strong>ID:</strong> {d.retailerProduct._id}</p>
                        <p><strong>Title:</strong> {d.retailerProduct.title}</p>
                        <p><strong>Vendor:</strong> {d.retailerProduct.vendor}</p>
                        <p><strong>Price:</strong> ${d.retailerProduct.variants[0]?.price}</p>
                      </div>
                    ) : (
                      <p>No Retailer Product</p>
                    )}
                  </td>

                  {/* Similarity Score */}
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    <p>{d.similarityScore?.toFixed(2)}</p>
                  </td>

                  {/* Published Shops */}
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {d.publishedRetailShops.length > 0 ? (
                      <ul>
                        {d.publishedRetailShops.map((shop, index) => (
                          <li key={index}>{shop}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Not Published</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalProduct > parPage && (
          <div className="w-full flex justify-end mt-6">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalProduct}
              parPage={parPage}
              showItem={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
