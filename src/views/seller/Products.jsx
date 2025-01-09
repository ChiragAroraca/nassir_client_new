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
    <div className="px-2 lg:px-7 pt-5">
      <h1 className="text-[#000000] font-semibold text-lg mb-3">All Products</h1>

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
                <th scope="col" className="py-3 px-4">ID</th>
                <th scope="col" className="py-3 px-4">Vendor Product</th>
                <th scope="col" className="py-3 px-4">Retailer Product</th>
                <th scope="col" className="py-3 px-4">Similarity Score</th>
                <th scope="col" className="py-3 px-4">Published Shops</th>
                <th scope="col" className="py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((d, i) => (
                <tr key={i}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">{d._id}</td>

                  {/* Vendor Product */}
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <div>
                      <p><strong>ID:</strong> {d.vendorProduct._id}</p>
                      <p><strong>Title:</strong> {d.vendorProduct.title}</p>
                      <p><strong>Vendor:</strong> {d.vendorProduct.vendor}</p>
                      <p><strong>Price:</strong> ${d.vendorProduct.variants[0]?.price}</p>
                      <img
                        className="w-[80px] h-[80px] mt-2"
                        src={d.vendorProduct.images[0]?.src}
                        alt="Vendor"
                      />
                    </div>
                  </td>

                  {/* Retailer Product */}
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
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
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <p>{d.similarityScore?.toFixed(2)}</p>
                  </td>

                  {/* Published Shops */}
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
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

                  {/* Actions */}
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/seller/dashboard/edit-product/${d.vendorProduct._id}`}
                        className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                      >
                        <FaEdit />
                      </Link>

                      <Link className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEye />
                      </Link>

                      <Link className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50">
                        <FaTrash />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalProduct <= parPage ? (
          ''
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
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
