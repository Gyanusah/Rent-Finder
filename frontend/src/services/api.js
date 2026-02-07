import axios from "axios";

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

