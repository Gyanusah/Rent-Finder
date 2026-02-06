// import axios from 'axios';

// //const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// const API_URL = import.meta.env.VITE_API_URL;

// axios.get(`${API_URL}/api/properties?limit=6`)
// axios.post(`${API_URL}/api/otp/send/both`, { ...})


// const api = axios.create({
//     baseURL: API_URL,
// });

// // Add token to requests
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');

//         // Set default headers if not FormData
//         if (!(config.data instanceof FormData)) {
//             if (!config.headers['Content-Type']) {
//                 config.headers['Content-Type'] = 'application/json';
//             }
//         } else {
//             // For FormData, delete Content-Type to let browser set it
//             delete config.headers['Content-Type'];
//         }

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Handle response errors
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;

// import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getProperties = async () => {
    const res = await axios.get(`${API_URL}/api/properties?limit=6`);
    return res.data;
};

export const sendOtp = async (phone, email) => {
    const res = await axios.post(`${API_URL}/api/otp/send/both`, {
        phone,
        email
    });
    return res.data;
};

