import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import blogRoutes from './routes/blog.routes.js';
import contactRoutes from './routes/contact.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors({
    origin: true, // Allow dynamically so phone IP works (http://10.84.118.216:5173)
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// ---- Health Check ----
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Labvora API is running',
        timestamp: new Date().toISOString()
    });
});

// ---- Global Error Handler ----
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ---- 404 Handler ----
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// ---- Start Server ----
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`\n🚀 Labvora Server running on port ${PORT}`);
        console.log(`📡 API: http://localhost:${PORT}/api/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
};

startServer();
