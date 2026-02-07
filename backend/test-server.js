import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://rent-finder-tau.vercel.app"],
    credentials: true,
}));

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
});
