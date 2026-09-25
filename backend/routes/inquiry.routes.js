import { Router } from 'express';
import Inquiry from '../models/Inquiry.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { notifyAdminNewInquiry, sendUserConfirmation } from '../utils/email.js';

const router = Router();

// @route   POST /api/inquiries
// @desc    Submit a new inquiry (public - contact form)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, interest, message } = req.body;

        // Validation
        if (!name || !email || !phone || !interest || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const inquiry = await Inquiry.create({
            name, email, phone, interest, message
        });

        // Send email notifications (non-blocking)
        notifyAdminNewInquiry(inquiry).catch(err => console.error('Admin notification failed:', err));
        sendUserConfirmation(inquiry).catch(err => console.error('User confirmation failed:', err));

        res.status(201).json({
            success: true,
            message: 'Thank you! Your inquiry has been submitted. We\'ll get back to you within 24 hours.',
            data: { id: inquiry._id }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries (admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const { status, interest, page = 1, limit = 20, sort = '-createdAt' } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (interest) filter.interest = interest;

        const total = await Inquiry.countDocuments(filter);
        const inquiries = await Inquiry.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: inquiries,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/inquiries/:id
// @desc    Get single inquiry
// @access  Private/Admin
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        // Mark as read
        if (!inquiry.isRead) {
            inquiry.isRead = true;
            await inquiry.save();
        }

        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PATCH /api/inquiries/:id
// @desc    Update inquiry status/notes
// @access  Private/Admin
router.patch('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const update = {};
        if (status) update.status = status;
        if (adminNotes !== undefined) update.adminNotes = adminNotes;

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete inquiry
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }
        res.json({ success: true, message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
