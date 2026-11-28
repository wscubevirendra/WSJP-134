
import React from 'react'
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ImageUpload() {
    const navigate = useNavigate()
    const { id } = useParams();

    async function submitHandler(e) {
        e.preventDefault();
        const form = new FormData();
        for (const img of e.target.images.files) {
            form.append("images", img);
        }

        try {
            const response = await api.post(
                `product/upload-images/${id}`,
                form
            );

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/admin/products")
            }

        } catch (error) {
            toast.error(error.response?.data || "Internal Server Error");
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <input
                type="file"
                name="images"
                multiple
                accept="image/*"
            />

            <button type="submit">Upload Images</button>
        </form>
    );
}
