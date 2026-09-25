import User from '../models/User.js';

export const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@labvora.in';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@labvora2026';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) return;

        await User.create({
            name: 'Labvora Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        console.log(`✅ Admin user seeded: ${adminEmail}`);
    } catch (error) {
        // Silently fail if db isn't connected
        if (error.name !== 'MongooseError' && error.name !== 'MongoServerError') {
            console.error('Admin seed error:', error.message);
        }
    }
};
