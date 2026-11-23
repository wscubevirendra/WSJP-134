import { useState, useEffect } from "react";
import api from "../api/axiosInstance";

function useCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  

    async function fetchcategory() {
        try {
            setLoading(true)
            const response = await api.get("category");
            if (response.data.success) {
                setCategories(response.data.categories)
                console.log(response.data.categories)
            }

        } catch (error) {
            setError(error?.response?.data?.message || "Internal Server Error")
        } finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        fetchcategory()
    }, [])

    return {
        loading,
        error,
        data: categories
    }

}

export default useCategory