import { useState, useEffect } from "react";
import api from "../api/axiosInstance";

function useProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  

    async function fetchProducts() {
        try {
            setLoading(true)
            const response = await api.get("product");
            if (response.data.success) {
                setProducts(response.data.products)
        
            }

        } catch (error) {
            setError(error?.response?.data?.message || "Internal Server Error")
        } finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return {
        loading,
        error,
        data: products
    }

}

export default useProduct