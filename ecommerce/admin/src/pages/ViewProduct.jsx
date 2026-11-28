
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Fetch product details
  async function fetchProduct() {
    try {
      setLoading(true);

      const response = await api.get(`/product/${id}`);

      setProduct(response.data.product);
    } catch (error) {
      console.error("Product fetch error:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">
          Product Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = product.images || [];

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const InfoItem = ({ label, value }) => (
    <div className="border-b border-gray-100 py-3">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 mt-1 break-words">
        {value ?? "N/A"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 font-medium mb-3"
          >
            ← Back to Products
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            Product Details
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Complete product information and inventory details
          </p>
        </div>

        <button
          onClick={() => navigate(`/admin/product/edit/${id}`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          Edit Product
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section */}
        <div className="lg:col-span-1 space-y-6">

          {/* Product Images */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-bold text-gray-800 mb-4">
              Product Images
            </h2>

            <div className="bg-gray-50 rounded-lg h-72 flex items-center justify-center">
              {images.length > 0 ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <p className="text-gray-400">No image available</p>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`h-20 border-2 rounded-lg overflow-hidden ${
                      activeImage === index
                        ? "border-blue-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-bold text-gray-800 mb-4">
              Product Status
            </h2>

            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-500 text-sm">Stock Status</span>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                product.stock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {product.stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-500 text-sm">Product ID</span>
              <span className="text-xs font-medium text-gray-700 break-all text-right max-w-40">
                {product._id}
              </span>
            </div>
          </div>

        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoItem label="Product Name" value={product.name} />
              <InfoItem label="SKU" value={product.sku} />
              <InfoItem label="Category" value={product.category?.name || product.category} />
              <InfoItem label="Brand" value={product.brand?.name || product.brand} />
              <InfoItem label="Color" value={product.color} />
              <InfoItem label="Slug" value={product.slug} />
            </div>

            <div className="mt-5">
              <p className="text-xs font-medium text-gray-400 uppercase">
                Description
              </p>
              <div
                className="text-sm text-gray-600 mt-2 leading-7"
                dangerouslySetInnerHTML={{
                  __html: product.description || "No description available",
                }}
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Pricing Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Regular Price</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  ₹{product.price ?? "N/A"}
                </h3>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Discount Price</p>
                <h3 className="text-2xl font-bold text-blue-600 mt-2">
                  ₹{product.discountPrice ?? "N/A"}
                </h3>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Discount</p>
                <h3 className="text-2xl font-bold text-green-600 mt-2">
                  {product.price && product.discountPrice
                    ? `${Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100
                      )}%`
                    : "N/A"}
                </h3>
              </div>
            </div>
          </div>

          {/* Inventory Information */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Inventory Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoItem label="Stock" value={product.stock ? "Available" : "Unavailable"} />
              <InfoItem label="Quantity" value={product.quantity} />
              <InfoItem label="Total Images" value={images.length} />
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Additional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoItem label="Created At" value={formatDate(product.createdAt)} />
              <InfoItem label="Updated At" value={formatDate(product.updatedAt)} />
              <InfoItem label="Product ID" value={product._id} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
