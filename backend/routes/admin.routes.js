import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import Inquiry from '../models/Inquiry.js';
import Enrollment from '../models/Enrollment.js';
import BlogPost from '../models/BlogPost.js';

const router = Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', protect, adminOnly, async (req, res) => {
    try {
        // Counts
        const [
            totalInquiries,
            newInquiries,
            totalEnrollments,
            pendingEnrollments,
            totalPosts,
            publishedPosts
        ] = await Promise.all([
            Inquiry.countDocuments(),
            Inquiry.countDocuments({ status: 'new' }),
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: 'pending' }),
            BlogPost.countDocuments(),
            BlogPost.countDocuments({ isPublished: true })
        ]);

        // Recent inquiries
        const recentInquiries = await Inquiry.find()
            .sort('-createdAt')
            .limit(5)
            .select('name email interest status createdAt');

        // Recent enrollments
        const recentEnrollments = await Enrollment.find()
            .sort('-createdAt')
            .limit(5)
            .select('name email course mode status createdAt');

        // Inquiry breakdown by interest
        const inquiryByInterest = await Inquiry.aggregate([
            { $group: { _id: '$interest', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Enrollment breakdown by course
        const enrollmentByCourse = await Enrollment.aggregate([
            { $group: { _id: '$course', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalInquiries,
                    newInquiries,
                    totalEnrollments,
                    pendingEnrollments,
                    totalPosts,
                    publishedPosts
                },
                recentInquiries,
                recentEnrollments,
                inquiryByInterest,
                enrollmentByCourse
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
