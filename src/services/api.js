import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
console.log('in the main api service');

const axiosInstance = axios.create({ 
    baseURL: BASE_URL,
});

console.log('base url',BASE_URL);

export {BASE_URL, axiosInstance}