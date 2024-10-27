import axios from "axios";

let url = process.env.SERVER_URL || "https://mlsserver-10ed9240e649.herokuapp.com";

const api = axios.create({
    baseURL : `${url}/api`
})

export default api