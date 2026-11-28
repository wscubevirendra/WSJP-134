import { Editor } from 'primereact/editor';

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiBox,
    FiCheck,
    FiImage,
    FiPackage,
    FiTag,
    FiUploadCloud,
    FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import api from "../api/axiosInstance";
import useCategory from "../hooks/useCategory";


const initialForm = {
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    color: "",
    sizes: [],
    isInStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isSale: false,
};

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50";

const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const { data } = useCategory();

    const [formData, setFormData] = useState(initialForm);
    const [categories, setCategories] = useState([]);

    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Load categories
    useEffect(() => {
        if (data) {
            setCategories(
                Array.isArray(data) ? data : data.categories || []
            );
        }
    }, [data]);

    // Fetch product for edit
    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setFetching(true);

                const response = await api.get(`/product/${id}`);

                const product = response.data.product;

                setFormData({
                    name: product.name || "",
                    sku: product.sku || "",
                    description: product.description || "",
                    category:
                        product.category?._id ||
                        product.category ||
                        "",
                    price: product.price ?? "",
                    discountPrice: product.discountPrice ?? "",
                    color: product.color || "",
                    sizes: product.sizes || [],
                    isInStock: product.isInStock ?? true,
                    isFeatured: product.isFeatured ?? false,
                    isNewArrival: product.isNewArrival ?? false,
                    isBestSeller: product.isBestSeller ?? false,
                    isSale: product.isSale ?? false,
                });

                setPreview(product.thumbnail || "");
            } catch (error) {
                toast.error("Failed to fetch product");
            } finally {
                setFetching(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Cleanup temporary image preview
    useEffect(() => {
        return () => {
            if (preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle size selection
    const handleSizeChange = (size) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((item) => item !== size)
                : [...prev.sizes, size],
        }));
    };

    // Handle thumbnail upload
    const handleThumbnail = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setThumbnail(file);
        setPreview(imageUrl);
    };

    // Handle thumbnail removal
    const removeThumbnail = () => {
        setThumbnail(null);
        setPreview("");
    };

    // Handle Create / Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.sku.trim() ||
            !formData.category ||
            formData.price === ""
        ) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "sizes") {
                    data.append(key, JSON.stringify(value));
                } else {
                    data.append(key, String(value));
                }
            });

            // Upload only when a new image is selected
            if (thumbnail) {
                data.append("image", thumbnail);
            }

            if (isEdit) {
                await api.put(`/product/update/${id}`, data);

                toast.success("Product updated successfully");
            } else {
                await api.post("/product/create", data);

                toast.success("Product created successfully");
            }

            navigate("/admin/products");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // Reusable toggle switch
    const ToggleSwitch = ({ name, checked, onChange }) => {
        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() =>
                    onChange({
                        target: {
                            name,
                            checked: !checked,
                        },
                    })
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-indigo-600" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0.5"
                        }`}
                />
            </button>
        );
    };

    // Product settings
    const productSettings = [
        {
            name: "isFeatured",
            label: "Featured Product",
            description: "Show in featured products",
        },
        {
            name: "isNewArrival",
            label: "New Arrival",
            description: "Mark as a recently added product",
        },
        {
            name: "isBestSeller",
            label: "Best Seller",
            description: "Highlight as a popular product",
        },
        {
            name: "isSale",
            label: "On Sale",
            description: "Show sale badge on product",
        },
    ];

    if (fetching) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <p className="text-sm font-medium text-gray-500">
                        Loading product details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f6fa] px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100"
                        >
                            <FiArrowLeft size={20} />
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    {isEdit ? "Edit Product" : "Add New Product"}
                                </h1>

                                <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                                    {isEdit ? "EDIT MODE" : "NEW PRODUCT"}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                                {isEdit
                                    ? "Update your product information and settings."
                                    : "Create and manage your store product details."}
                            </p>
                        </div>

                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">

                            {/* Basic Information */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">

                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <FiBox size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Basic Information
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Add essential product details
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">

                                    <div>
                                        <label className={labelClass}>
                                            Product Name *
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter product name"
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            SKU *
                                        </label>

                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleChange}
                                            placeholder="Example: PROD-001"
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Description
                                        </label>
                                        <Editor  value={formData.description} onTextChange={(e) =>{
                                            setFormData({...formData,description:(e.htmlValue)})
                                        }} 
                                        style={{ height: '320px' }} />

                                        {/* <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Write a detailed product description..."
                                            className={`${inputClass} resize-none`}
                                        /> */}
                                    </div>

                                </div>
                            </section>

                            {/* Pricing and Inventory */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">

                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <FiTag size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Pricing & Inventory
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Set product prices and availability
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <div>
                                        <label className={labelClass}>
                                            Regular Price *
                                        </label>

                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className={`${inputClass} pl-9`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Discount Price
                                        </label>

                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                name="discountPrice"
                                                value={formData.discountPrice}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className={`${inputClass} pl-9`}
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>
                                            Product Color
                                        </label>

                                        <input
                                            type="text"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            placeholder="Example: Black, White, Blue"
                                            className={inputClass}
                                        />
                                    </div>

                                </div>

                                {/* Stock Availability */}
                                <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">

                                    <div className="flex items-center justify-between gap-4">

                                        <div className="flex items-center gap-3">

                                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${formData.isInStock
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-red-100 text-red-600"
                                                }`}>
                                                <FiPackage size={21} />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    Stock Availability
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {formData.isInStock
                                                        ? "This product is available for purchase."
                                                        : "This product is currently unavailable."}
                                                </p>
                                            </div>

                                        </div>

                                        <ToggleSwitch
                                            name="isInStock"
                                            checked={formData.isInStock}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    isInStock: e.target.checked,
                                                }))
                                            }
                                        />

                                    </div>

                                    <div className="mt-4 border-t border-gray-200 pt-3">
                                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${formData.isInStock
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            <span className={`h-2 w-2 rounded-full ${formData.isInStock
                                                ? "bg-emerald-500"
                                                : "bg-red-500"
                                                }`} />

                                            {formData.isInStock
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </span>
                                    </div>

                                </div>

                            </section>

                            {/* Category and Sizes */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">

                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                        <FiTag size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Category & Variants
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Organize product categories and sizes
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">

                                    <label className={labelClass}>
                                        Product Category *
                                    </label>

                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`${inputClass} bg-gray-50`}
                                        required
                                    >
                                        <option value="">
                                            Select a category
                                        </option>

                                        {categories.map((category) => (
                                            <option
                                                key={category._id}
                                                value={category._id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Available Sizes
                                    </label>

                                    <p className="mb-4 text-xs text-gray-500">
                                        Select all sizes available for this product.
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                        {availableSizes.map((size) => {
                                            const selected =
                                                formData.sizes.includes(size);

                                            return (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSizeChange(size)
                                                    }
                                                    className={`flex h-11 min-w-12 items-center justify-center gap-1 rounded-lg border px-4 text-sm font-semibold transition ${selected
                                                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
                                                        }`}
                                                >
                                                    {selected && (
                                                        <FiCheck size={13} />
                                                    )}
                                                    {size}
                                                </button>
                                            );
                                        })}

                                    </div>
                                </div>

                            </section>

                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Product Thumbnail */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                        <FiImage size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Product Thumbnail
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Main product image
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">

                                    <label className={`flex min-h-[230px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${preview
                                        ? "border-gray-200 bg-gray-50"
                                        : "border-indigo-200 bg-indigo-50/40 hover:border-indigo-400 hover:bg-indigo-50"
                                        }`}>

                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Product thumbnail"
                                                className="h-[230px] w-full object-contain p-3"
                                            />
                                        ) : (
                                            <div className="px-5 py-10 text-center">

                                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                                                    <FiUploadCloud size={27} />
                                                </div>

                                                <p className="text-sm font-bold text-gray-800">
                                                    Upload Product Image
                                                </p>

                                                <p className="mt-2 text-xs text-gray-500">
                                                    Click to browse your files
                                                </p>

                                                <p className="mt-3 text-[11px] text-gray-400">
                                                    PNG, JPG, WEBP (Max 5MB)
                                                </p>

                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleThumbnail}
                                            className="hidden"
                                        />

                                    </label>

                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-50"
                                            title="Remove image"
                                        >
                                            <FiX size={17} />
                                        </button>
                                    )}

                                </div>

                                {preview && (
                                    <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
                                        <FiUploadCloud size={15} />
                                        Change Image

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleThumbnail}
                                            className="hidden"
                                        />
                                    </label>
                                )}

                                <p className="mt-3 text-center text-xs text-gray-400">
                                    Recommended: Square product image
                                </p>

                            </section>

                            {/* Product Settings */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                        <FiCheck size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Product Settings
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Manage product visibility
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">

                                    {productSettings.map((setting) => (
                                        <div
                                            key={setting.name}
                                            className="flex items-center justify-between gap-3"
                                        >

                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-800">
                                                    {setting.label}
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {setting.description}
                                                </p>
                                            </div>

                                            <ToggleSwitch
                                                name={setting.name}
                                                checked={formData[setting.name]}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        [setting.name]:
                                                            e.target.checked,
                                                    }))
                                                }
                                            />

                                        </div>
                                    ))}

                                </div>

                            </section>

                            {/* Quick Summary */}
                            <section className="rounded-2xl bg-indigo-600 p-6 text-white shadow-sm">

                                <h3 className="text-sm font-bold">
                                    Product Summary
                                </h3>

                                <div className="mt-5 space-y-4">

                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-indigo-100">
                                            Product Name
                                        </span>
                                        <span className="max-w-[55%] truncate font-semibold">
                                            {formData.name || "Not added"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-indigo-100">
                                            Sizes Selected
                                        </span>
                                        <span className="font-semibold">
                                            {formData.sizes.length}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-indigo-100">
                                            Availability
                                        </span>
                                        <span className="font-semibold">
                                            {formData.isInStock
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-indigo-100">
                                            Regular Price
                                        </span>
                                        <span className="font-semibold">
                                            ₹{formData.price || "0"}
                                        </span>
                                    </div>

                                </div>

                            </section>

                        </div>

                    </div>

                    {/* Form Actions */}
                    <div className="mt-7 flex flex-col-reverse justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">

                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            disabled={loading}
                            className="rounded-xl border border-gray-200 px-7 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiCheck size={17} />
                                    {isEdit
                                        ? "Update Product"
                                        : "Create Product"}
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default ProductForm;
