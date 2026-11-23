import React from 'react'
import api from '../api/axiosInstance'
import { toast } from 'sonner';
import { useRevalidator } from 'react-router-dom';

export default function StatusButton({ status, path }) {
    // const revalidator = useRevalidator()


    async function statusHanlder() {
        try {
            const response = await api.patch(path);
            if (response.data.success) {
                toast.success(response.data.message)
                // revalidator.revalidate()
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Internal Server Error"
            );
        }
    }

    return (
        <button
            onClick={statusHanlder}
            className={`rounded-full  px-3 py-1.5 text-xs font-semibold ${status
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
                }`}
        >
            {status ? "Active" : "Inactive"}
        </button>
    )
}
