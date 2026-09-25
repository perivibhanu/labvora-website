import { Router } from 'express';
import Inquiry from '../models/Inquiry.js';
import { notifyAdminNewInquiry, sendUserConfirmation } from '../utils/email.js';

const router = Router();

// @route   POST /api/contact
// @desc    Quick contact form (simpler alias for inquiries)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, interest, message } = req.body;

        if (!name || !email || !phone || !interest || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: name, email, phone, interest, and message'
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        const inquiry = await Inquiry.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            interest,
            message: message.trim()
        });

        // Send notifications (non-blocking)
        Promise.all([
            notifyAdminNewInquiry(inquiry),
            sendUserConfirmation(inquiry)
        ]).catch(err => console.error('Notification error:', err));

        res.status(201).json({
            success: true,
            message: 'Thank you for reaching out! We\'ll get back to you within 24 hours.'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

export default router;
