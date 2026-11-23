
import React, { useEffect, useState } from "react";
import {
    FiArrowLeft,
    FiSave,
    FiFolderPlus,
    FiUploadCloud,
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "../components/PageHeader";
import api from "../api/axiosInstance";

function CategoryForm() {

    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        name: "",
        image: ""
    });

    const [prev, setPrev] = useState("");

    const [loading, setLoading] = useState(false);

    // Fetch single category for edit
    useEffect(() => {

        if (id) {
            getSingleCategory();
        }

    }, [id]);

    async function getSingleCategory() {
        try {

            const response = await api.get(`category/${id}`);

            const category = response.data.category;

            setForm({
                name: category.name,
                image: ""
            });

            setPrev(category.image);

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Unable to fetch category"
            );
        }
    }

    // Handle form submit
    async function submitHandler(event) {
        event.preventDefault();

        try {

            setLoading(true);

            const payload = new FormData();

            payload.append("name", form.name);

            if (form.image) {
                payload.append("image", form.image);
            }

            let response;

            if (isEdit) {

                response = await api.put(
                    `category/update/${id}`,
                    payload
                );

            } else {

                response = await api.post(
                    "category/create",
                    payload
                );

            }

            if (response.data.success) {

                toast.success(response.data.message);

                navigate("/admin/categories");

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Internal Server Error"
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">

            <PageHeader title={isEdit ? "Edit Category" : "Add Category"} />

            <div className="mx-auto mt-6 w-full">

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    {/* Card Header */}
                    <div className="border-b border-gray-100 px-7 py-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7f2ef] text-[#155e52]">
                                <FiFolderPlus size={23} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Category Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {isEdit
                                        ? "Update category information."
                                        : "Add category name and upload its image."
                                    }
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler}>

                        <div className="space-y-6 px-7 py-7">

                            {/* Category Name */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Category Name *
                                </label>

                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            name: event.target.value
                                        })
                                    }
                                    name="name"
                                    required
                                    placeholder="Enter category name"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#155e52]"
                                />

                            </div>

                            {/* Category Image */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Category Image {!isEdit && "*"}
                                </label>

                                <label
                                    htmlFor="image"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center hover:border-[#155e52]"
                                >

                                    {prev || form.image ? (

                                        <img
                                            src={
                                                form.image
                                                    ? URL.createObjectURL(form.image)
                                                    : prev
                                            }
                                            alt="Category Preview"
                                            className="mb-4 h-32 w-32 rounded-xl object-cover"
                                        />

                                    ) : (

                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f2ef] text-[#155e52]">
                                            <FiUploadCloud size={26} />
                                        </div>

                                    )}

                                    <p className="text-sm font-semibold text-gray-700">
                                        Click to upload category image
                                    </p>

                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        required={!isEdit}
                                        onChange={(event) => {

                                            const file = event.target.files[0];

                                            if (file) {
                                                setForm({
                                                    ...form,
                                                    image: file
                                                });
                                            }

                                        }}
                                        className="hidden"
                                    />

                                </label>

                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/70 px-7 py-5">

                            <button
                                type="button"
                                onClick={() => navigate("/admin/categories")}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                            >
                                <FiArrowLeft size={16} />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 rounded-xl bg-[#155e52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#10483f] disabled:opacity-50"
                            >
                                <FiSave size={17} />

                                {loading
                                    ? "Please wait..."
                                    : isEdit
                                        ? "Update Category"
                                        : "Save Category"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default CategoryForm;
