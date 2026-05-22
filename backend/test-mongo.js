import dns from 'dns';
dns.setDefaultResultOrder('ipv6first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log("Connecting to:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
        console.log("✅ Connected!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Error:", err.message);
        console.error("❌ Code:", err.code);
        process.exit(1);
    });