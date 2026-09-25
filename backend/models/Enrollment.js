import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
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
    course: {
        type: String,
        required: [true, 'Course selection is required'],
        enum: ['clad', 'cld', 'project', 'consulting', 'hardware', 'teststand', 'other']
    },
    mode: {
        type: String,
        required: [true, 'Training mode is required'],
        enum: ['online', 'classroom']
    },
    experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    message: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true,
        default: ''
    },
    totalFee: {
        type: Number,
        default: 0
    },
    transactions: [{
        amount: Number,
        date: String,
        transactionId: String
    }],
    courseStartDate: {
        type: String,
        default: ''
    },
    courseEndDate: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Virtual for course label
enrollmentSchema.virtual('courseLabel').get(function () {
    const labels = {
        clad: 'CLAD Certification Training',
        cld: 'CLD Certification Training',
        project: 'Custom Project Development',
        consulting: 'LabVIEW Consulting',
        hardware: 'Hardware Integration (DAQ/FPGA/RT)',
        teststand: 'TestStand Solutions',
        other: 'Other'
    };
    return labels[this.course] || this.course;
});

enrollmentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Enrollment', enrollmentSchema);
