import { Router } from 'express';
import Enrollment from '../models/Enrollment.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { notifyAdminNewEnrollment, sendEmail } from '../utils/email.js';

const router = Router();

// @route   POST /api/enrollments
// @desc    Submit enrollment request (public)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, course, mode, experience, message } = req.body;

        if (!name || !email || !phone || !course || !mode) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, phone, course, and mode are required'
            });
        }

        const enrollment = await Enrollment.create({
            name, email, phone, course, mode, experience, message
        });

        // Notify admin
        notifyAdminNewEnrollment(enrollment).catch(err => console.error('Enrollment notification failed:', err));

        // Send confirmation to user
        const courseLabel = course === 'clad' ? 'CLAD' : 'CLD';
        sendEmail({
            to: email,
            subject: `Enrollment Request Received - ${courseLabel} Training | Labvora`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #E63946;">Welcome, ${name}!</h2>
                    <p>We've received your enrollment request for <strong>${courseLabel} Certification Training</strong>.</p>
                    <p>Our team will review your application and contact you within 24 hours with next steps.</p>
                    <p><strong>Training Mode:</strong> ${mode === 'online' ? 'Online' : 'Classroom (Chennai)'}</p>
                    <p>For immediate assistance, reach us on WhatsApp: <a href="https://wa.me/917032055712">+91 7032055712</a></p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #999; font-size: 12px;">Labvora | Innovate. Automate. Elevate.</p>
                </div>
            `
        }).catch(err => console.error('Enrollment confirmation failed:', err));

        res.status(201).json({
            success: true,
            message: `Thank you! Your enrollment request for ${courseLabel} Training has been submitted. We'll contact you within 24 hours.`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/enrollments
// @desc    Get all enrollments (admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const { status, course, page = 1, limit = 20, sort = '-createdAt' } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (course) filter.course = course;

        const total = await Enrollment.countDocuments(filter);
        const enrollments = await Enrollment.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: enrollments,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PATCH /api/enrollments/:id
// @desc    Update enrollment status
// @access  Private/Admin
router.patch('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const update = {};
        if (status) update.status = status;
        if (adminNotes !== undefined) update.adminNotes = adminNotes;

        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id, update, { new: true, runValidators: true }
        );

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }

        res.json({ success: true, data: enrollment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/enrollments/:id
// @desc    Delete enrollment
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
        res.json({ success: true, message: 'Enrollment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
