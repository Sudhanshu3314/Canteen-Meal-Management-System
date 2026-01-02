import axios from "axios";

const api = axios.create({
    baseURL: "https://cmms-backends.vercel.app",
    // baseURL: "http://localhost:8080",
    // withCredentials: true
});

export default api;
