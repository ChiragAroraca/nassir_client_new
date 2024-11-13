import axios from "axios";

const url = "https://mlsserver-10ed9240e649.herokuapp.com" || "http://localhost:5000";

console.log("process.env.SERVER_URL >><<", process.env.SERVER_URL)

const api = axios.create({
    baseURL: `${url}/api`,
    withCredentials: true 
});

export default api;
