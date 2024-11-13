import axios from "axios";

const url = process.env.SERVER_URL || "http://localhost:5000";

console.log("process.env.SERVER_URL >><<", process.env.SERVER_URL)

const api = axios.create({
    baseURL: `${url}/api`,
    withCredentials: true 
});

export default api;
