import axios from 'axios';

const url = 'https://mlsserver-10ed9240e649.herokuapp.com';

console.log('REACT_APP_SERVER_URL:', process.env.SERVER_URL);

const api = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});

export default api;
