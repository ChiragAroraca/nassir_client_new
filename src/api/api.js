import axios from "axios";

const url = process.env.SERVER_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: `${url}/api`,
    withCredentials: true 
});

export default api;
