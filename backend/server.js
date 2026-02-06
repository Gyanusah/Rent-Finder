// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const connectDB = require('./config/db');

// // Connect to database
// connectDB();

// const app = express();

// // Middleware
// app.use(express.json());

// app.use(express.json({ limit: '25mb' }));
// app.use(express.urlencoded({ limit: '25mb', extended: true }));
// app.use(cors({
//     origin: ['http://localhost:3000',  'http://localhost:5000',  'http://127.0.0.1:3000', ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     optionsSuccessStatus: 200
// }));

// // Serve static files for uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/properties', require('./routes/propertyRoutes'));
// app.use('/api/favorites', require('./routes/favoriteRoutes'));
// app.use('/api/otp', require('./routes/otpRoutes'));

// // Health check
// app.get('/api/health', (req, res) => {
//     res.status(200).json({ message: 'Server is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);

//     // Handle multer errors
//     if (err.name === 'MulterError') {
//         if (err.code === 'LIMIT_FILE_SIZE') {
//             return res.status(400).json({ message: 'File size too large. Maximum 10MB per file.' });
//         }
//         if (err.code === 'LIMIT_FILE_COUNT') {
//             return res.status(400).json({ message: 'Too many files. Maximum 10 files allowed.' });
//         }
//         return res.status(400).json({ message: `Upload error: ${err.message}` });
//     }

//     // Handle custom file filter errors
//     if (err.message && err.message.includes('Only image files')) {
//         return res.status(400).json({ message: err.message });
//     }

//     res.status(500).json({ message: err.message || 'Something went wrong!' });
// });

// const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

// function startServer(port, attemptsLeft = 10) {
//     const server = app.listen(port, () => {
//         console.log(`Server running on port ${port}`);
//     });

//     server.on('error', (err) => {
//         if (err.code === 'EADDRINUSE') {
//             console.warn(`Port ${port} in use.`);
//             if (attemptsLeft > 0) {
//                 const nextPort = port + 1;
//                 console.log(`Trying port ${nextPort}... (${attemptsLeft - 1} attempts left)`);
//                 setTimeout(() => startServer(nextPort, attemptsLeft - 1), 500);
//             } else {
//                 console.error('No available ports found. Exiting.');
//                 process.exit(1);
//             }
//         } else {
//             console.error('Server error:', err);
//             process.exit(1);
//         }
//     });

//     // Graceful shutdown
//     const shutdown = () => {
//         server.close(() => {
//             console.log('Server closed');
//             process.exit(0);
//         });
//     };

//     process.on('SIGINT', shutdown);
//     process.on('SIGTERM', shutdown);
// }

// // startServer(DEFAULT_PORT);

// module.exports = app;


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5000',
            'http://127.0.0.1:3000',
            'https://rent-finder-tau.vercel.app',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200,
    })
);

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Multer errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res
                .status(400)
                .json({ message: 'File size too large. Maximum 10MB per file.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res
                .status(400)
                .json({ message: 'Too many files. Maximum 10 files allowed.' });
        }
        return res.status(400).json({ message: err.message });
    }

    // File filter errors
    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({
        message: err.message || 'Something went wrong!',
    });
});

// Start server (FORCED PORT 5000)
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = app;
