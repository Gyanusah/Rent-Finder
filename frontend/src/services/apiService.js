


import axios from 'axios';

// Use Vite proxy in development and a configured backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
    const authHeaders = getAuthHeaders();
    config.headers = {
        ...config.headers,
        ...authHeaders,
    };
    return config;
});

export const propertyAPI = {
    getAll: (params) => axiosInstance.get('/properties', { params }),
    getAllAdmin: (params) => axiosInstance.get('/properties/admin/properties', { params }),
    approve: (id) => axiosInstance.put(`/properties/admin/properties/${id}/approve`),
    getById: (id) => axiosInstance.get(`/properties/${id}`),
    getByOwner: () => axiosInstance.get('/properties/owner/my-properties'),
    create: (data) => {
        if (data instanceof FormData) {
            return axiosInstance.post('/properties', data, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': undefined,
                },
            });
        }
        return axiosInstance.post('/properties', data);
    },
    update: (id, data) => {
        if (data instanceof FormData) {
            return axiosInstance.put(`/properties/${id}`, data, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': undefined,
                },
            });
        }
        return axiosInstance.put(`/properties/${id}`, data);
    },
    delete: (id) => axiosInstance.delete(`/properties/${id}`),
    sendInquiry: (id, data) => axiosInstance.post(`/properties/${id}/inquiry`, data),
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

    updateProfile: (data) => {
        if (data instanceof FormData) {
            return axiosInstance.put('/auth/update-profile', data, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': undefined,
                },
            });
        }
        return axiosInstance.put('/auth/update-profile', data);
    },
    changePassword: (data) => axiosInstance.put('/auth/change-password', data),

    getAllUsers: () => axiosInstance.get('/auth/users'),
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;

    // For production (HTTPS frontend), use the backend URL
    if (window.location.protocol === 'https:') {
        return `${API_BASE_URL.replace('/api', '')}${imagePath}`;
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
