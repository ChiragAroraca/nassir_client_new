import axios from "axios";

let url = "https://mlsserver-10ed9240e649.herokuapp.com";

console.log("url >><< 123", url)

const api = axios.create({
    baseURL : `${url}/api`
})

export default api