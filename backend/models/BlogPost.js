import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt is required'],
        trim: true,
        maxlength: 500
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['clad-tips', 'cld-tips', 'design-patterns', 'hardware', 'tutorials', 'news', 'general'],
        default: 'general'
    },
    coverImage: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: 'Labvora Team'
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-generate slug from title
blogPostSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Virtual for category label
blogPostSchema.virtual('categoryLabel').get(function () {
    const labels = {
        'clad-tips': 'CLAD Tips',
        'cld-tips': 'CLD Tips',
        'design-patterns': 'Design Patterns',
        'hardware': 'Hardware',
        'tutorials': 'Tutorials',
        'news': 'News',
        'general': 'General'
    };
    return labels[this.category] || this.category;
});

blogPostSchema.set('toJSON', { virtuals: true });

export default mongoose.model('BlogPost', blogPostSchema);
