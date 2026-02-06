


import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const propertyAPI = {
    getAll: (params) => axiosInstance.get('/properties', { params }),
    getById: (id) => axiosInstance.get(`/properties/${id}`),
    getByOwner: () => axiosInstance.get('/properties/owner/my-properties'),
    create: (data) => {
        if (data instanceof FormData) {
            return axiosInstance.post('/properties', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
        return axiosInstance.post('/properties', data);
    },
    update: (id, data) => {
        if (data instanceof FormData) {
            return axiosInstance.put(`/properties/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
        return axiosInstance.put(`/properties/${id}`, data);
    },
    delete: (id) => axiosInstance.delete(`/properties/${id}`),
};

export const authAPI = {
    register: (data) => axiosInstance.post('/auth/register', data),

    login: async (data) => {
        const response = await axiosInstance.post('/auth/login', data);

        // Save token and user data
        if (response?.data?.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    
    // For production (HTTPS frontend), use relative path or handle appropriately
    if (window.location.protocol === 'https:') {
        // In production, you might need to use a CDN or different approach
        // For now, return the image path and let the frontend handle it
        return imagePath;
    }
    
    // For local development (HTTP), use the full URL
    return `${API_BASE_URL.replace('/api', '')}${imagePath}`;
};

export const favoriteAPI = {
    getAll: (params) => axiosInstance.get('/favorites', { params }),
    add: (propertyId) => axiosInstance.post('/favorites', { propertyId }),
    remove: (propertyId) => axiosInstance.delete(`/favorites/${propertyId}`),
    isFavorite: (propertyId) => axiosInstance.get(`/favorites/check/${propertyId}`),
};

export const otpAPI = {
    sendEmailOTP: (email) => axiosInstance.post('/otp/send/email', { email }),
    sendPhoneOTP: (phone) => axiosInstance.post('/otp/send/phone', { phone }),
    sendBothOTP: (email, phone) => axiosInstance.post('/otp/send/both', { email, phone }),
    verifyOTP: (email, phone, otp, type) => axiosInstance.post('/otp/verify', { email, phone, otp, type }),
};

export default axiosInstance;
