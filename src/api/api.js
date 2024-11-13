import axios from "axios";

const url = "https://mlsserver-10ed9240e649.herokuapp.com";


const api = axios.create({
    baseURL: `${url}/api`,
    withCredentials: true 
});

export default api;
