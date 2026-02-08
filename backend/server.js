import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Auth will fail silently without these. Check Vercel dashboard Environment Variables.');
    process.exit(1);
}

// Routes
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

connectDB();  // ✅ IMPORTANT

const app = express();

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5000',
            'http://127.0.0.1:3000',
            'https://rent-finder-2wxn.vercel.app',
            'https://rent-finder-4y2i.vercel.app',
            'https://rent-finder-n4vs.vercel.app'
        ];

        // Allow any Vercel preview deployment (rent-finder-XXXX.vercel.app)
        const isVercelPreview = origin.match(/https:\/\/rent-finder-[a-z0-9]+\.vercel\.app$/);
        const isAllowed = allowedOrigins.includes(origin.replace(/\/$/, '')) || isVercelPreview;

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

app.options("*", cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/otp', otpRoutes);

// Health check
app.use('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Multer errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large. Maximum 10MB per file.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files. Maximum 10 files allowed.' });
        }
        return res.status(400).json({ message: 'Upload error: ' + err.message });
    }

    // File filter errors
    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({
        message: err.message || 'Something went wrong!',
    });
});

const PORT = process.env.PORT || 5000;
// const server =
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


export default app;
