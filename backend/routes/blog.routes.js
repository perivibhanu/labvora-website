import { Router } from 'express';
import BlogPost from '../models/BlogPost.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// @route   GET /api/blog
// @desc    Get published blog posts (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, page = 1, limit = 9, search } = req.query;

        const filter = { isPublished: true };
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const total = await BlogPost.countDocuments(filter);
        const posts = await BlogPost.find(filter)
            .select('-content')  // Don't send full content in list
            .sort('-publishedAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: posts,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug (public)
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({
            slug: req.params.slug,
            isPublished: true
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/blog/admin/all
// @desc    Get all posts including drafts (admin)
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

        const total = await BlogPost.countDocuments();
        const posts = await BlogPost.find()
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: posts,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/blog
// @desc    Create blog post (admin)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { title, excerpt, content, category, coverImage, tags, isPublished } = req.body;

        if (!title || !excerpt || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, excerpt, content, and category are required'
            });
        }

        const post = await BlogPost.create({
            title, excerpt, content, category, coverImage,
            tags: tags || [],
            isPublished: isPublished || false
        });

        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/blog/:id
// @desc    Update blog post (admin)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const allowedFields = ['title', 'excerpt', 'content', 'category', 'coverImage', 'tags', 'isPublished'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                post[field] = req.body[field];
            }
        });

        await post.save();
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post (admin)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
