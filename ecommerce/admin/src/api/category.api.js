import axios from "axios"

async function fetchCategory() {
    try {
        const response = await axios.get("http://localhost:5000/api/category");
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export { fetchCategory }