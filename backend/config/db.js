import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri || uri.includes('<username>')) {
            console.log('⚠️  MongoDB URI not configured. Running in demo mode (no database).');
            console.log('   To connect: Update MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
            console.log('   Free signup: https://www.mongodb.com/atlas\n');
            return;
        }

        const conn = await mongoose.connect(uri, {
            family: 4 // Force IPv4 to bypass DNS/ISP blocking issues
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);

        // Seed admin user on first connection
        const { seedAdmin } = await import('../utils/seedAdmin.js');
        await seedAdmin();
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        // Don't exit - allow server to run for demo purposes
        console.log('   Server will continue running without database.\n');
    }
};
