
import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { FiPlus, FiMoreVertical } from "react-icons/fi";
import Action from "../components/Action";
import { Link, useNavigate } from "react-router-dom";
import TableSkeleton from "../components/TableSkeleton";
import ErrorPage from "../pages/ErrorPage";
import useProduct from "../hooks/useProduct";
import StatusButton from "../components/StatusButton";


function Products() {
  const [activeMenu, setActiveMenu] = useState("");
  const { loading, error, data } = useProduct();
  const navigate = useNavigate();


  if (loading) {
    return <TableSkeleton />
  }

  if (error != null) {
    return <ErrorPage />
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">


      <PageHeader title="Product List" />

      <div className="w-full rounded-2xl border border-gray-200 bg-white">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your products
            </p>
          </div>

          <Link
            to="/admin/product/add"
            className="flex items-center gap-2 rounded-xl bg-[#155e52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10483f]"
          >
            <FiPlus size={18} />
            Add Product
          </Link>

        </div>

        {/* Product Table */}
        <div className="overflow-x-auto p-1">

          <table className="w-full min-w-175 text-left">

            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-700">

                <th className="px-6 py-5 font-medium">
                  Product Name
                </th>
                <th className="px-6 py-5 font-medium">
                  Price
                </th>

                <th className="px-4 py-5 font-medium">
                  Created At
                </th>

                <th className="px-4 py-5 font-medium">
                  Status
                </th>

                <th className="px-4 py-5 text-center font-medium">
                  Action
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody>

              {data.length > 0 ? (
                data.map((product) => (

                  <tr
                    key={product._id}
                    className="border-b border-gray-200 transition hover:bg-gray-50"
                  >

                    {/* Product Name */}
                    <td className="px-4 py-3">

                      <div className="flex items-center gap-4">

                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />

                        <h3 className="text-sm font-semibold text-gray-800">
                          {product.name}
                        </h3>

                      </div>

                    </td>
                    <td className="px-4 py-3">

                      <div className="flex items-center gap-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                          ₹ {product.price}
                          {product.discountPrice ? `₹ ${product.discountPrice}` : "N/A"}

                        </h3>
                      </div>

                    </td>

                    {/* Created At */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(product.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusButton path={`product/status-update/${product._id}`} status={product.status} />
                    </td>

                    {/* Action */}
                    <td className="relative px-4 py-3 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === product._id
                              ? null
                              : product._id
                          )
                        }
                        className="rounded-lg p-2 transition hover:bg-gray-100"
                      >
                        <FiMoreVertical size={22} />
                      </button>

                      {activeMenu === product._id && (
                        <Action
                          onView={() => {
                            navigate(`/admin/product/view/${product._id}`)
                            setActiveMenu(null);
                          }}

                          onEdit={() => {
                            navigate(`/admin/product/edit/${product._id}`)
                            setActiveMenu(null);
                          }}

                          path={`product/delete/${product._id}`}

                          uploadImages={() => {
                            navigate(`/admin/product/upload-images/${product._id}`)
                            setActiveMenu(null);
                          }}
                        />
                      )}

                    </td>

                  </tr>

                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-10 text-center text-sm text-gray-500"
                  >
                    No products available
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Products;
