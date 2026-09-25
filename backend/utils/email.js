import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || EMAIL_USER === 'your_email@gmail.com') {
        console.log('⚠️  Email not configured. Emails will be logged to console instead.');
        return null;
    }

    transporter = nodemailer.createTransport({
        host: EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    return transporter;
};

/**
 * Send an email notification
 * @param {Object} options - { to, subject, html }
 */
export const sendEmail = async ({ to, subject, html }) => {
    try {
        const transport = getTransporter();

        if (!transport) {
            // Fallback: log to console
            console.log('\n📧 EMAIL (console mode):');
            console.log(`   To: ${to}`);
            console.log(`   Subject: ${subject}`);
            console.log(`   Body: ${html.replace(/<[^>]*>/g, '').substring(0, 200)}...`);
            console.log('');
            return true;
        }

        await transport.sendMail({
            from: process.env.EMAIL_FROM || `Labvora <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        return true;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        return false;
    }
};

/**
 * Send notification to admin about new inquiry
 */
export const notifyAdminNewInquiry = async (inquiry) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@labvora.in';
    await sendEmail({
        to: adminEmail,
        subject: `🔔 New Inquiry from ${inquiry.name} - ${inquiry.interestLabel || inquiry.interest}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #E63946;">New Inquiry Received</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${inquiry.name}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${inquiry.email}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${inquiry.phone}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Interest:</td><td style="padding: 8px;">${inquiry.interestLabel || inquiry.interest}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${inquiry.message}</td></tr>
                </table>
                <p style="color: #666; margin-top: 20px;">Log in to the admin dashboard to manage this inquiry.</p>
            </div>
        `
    });
};

/**
 * Send confirmation email to the user
 */
export const sendUserConfirmation = async (inquiry) => {
    await sendEmail({
        to: inquiry.email,
        subject: 'Thank you for contacting Labvora!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #E63946;">Thank You, ${inquiry.name}!</h2>
                <p>We have received your inquiry and will get back to you within 24 hours.</p>
                <p><strong>Your inquiry details:</strong></p>
                <ul>
                    <li><strong>Interest:</strong> ${inquiry.interestLabel || inquiry.interest}</li>
                    <li><strong>Message:</strong> ${inquiry.message.substring(0, 200)}${inquiry.message.length > 200 ? '...' : ''}</li>
                </ul>
                <p>In the meantime, feel free to reach us on WhatsApp: <a href="https://wa.me/917032055712">+91 7032055712</a></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">Labvora | Innovate. Automate. Elevate.<br>Chennai, India</p>
            </div>
        `
    });
};

/**
 * Notify admin about new enrollment
 */
export const notifyAdminNewEnrollment = async (enrollment) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@labvora.in';
    const courseLabel = enrollment.course === 'clad' ? 'CLAD Training' : 'CLD Training';
    await sendEmail({
        to: adminEmail,
        subject: `🎓 New Enrollment Request: ${courseLabel} from ${enrollment.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #E63946;">New Enrollment Request</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${enrollment.name}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${enrollment.email}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${enrollment.phone}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Course:</td><td style="padding: 8px;">${courseLabel}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Mode:</td><td style="padding: 8px;">${enrollment.mode}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Experience:</td><td style="padding: 8px;">${enrollment.experience}</td></tr>
                </table>
            </div>
        `
    });
};
