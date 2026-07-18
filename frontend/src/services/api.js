import axios from "axios";

// Axios Instance
const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Add JWT Token to Every Request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;