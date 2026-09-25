import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    interest: {
        type: String,
        required: [true, 'Interest/service selection is required'],
        enum: ['clad', 'cld', 'project', 'consulting', 'hardware', 'teststand', 'other']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other'
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: 2000
    },
    status: {
        type: String,
        enum: ['new', 'read', 'contacted', 'resolved', 'archived'],
        default: 'new'
    },
    adminNotes: {
        type: String,
        trim: true,
        default: ''
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for interest label
inquirySchema.virtual('interestLabel').get(function () {
    const labels = {
        clad: 'CLAD Training',
        cld: 'CLD Training',
        project: 'Custom Project Development',
        consulting: 'LabVIEW Consulting',
        hardware: 'Hardware Integration (DAQ/FPGA/RT)',
        teststand: 'TestStand Solutions',
        other: 'Other'
    };
    return labels[this.interest] || this.interest;
});

inquirySchema.set('toJSON', { virtuals: true });

export default mongoose.model('Inquiry', inquirySchema);
