import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('labvora_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('labvora_token');
            // Only redirect if on an admin page
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// ---- Public API ----
export const submitContact = (data) => api.post('/contact', data);
export const submitEnrollment = (data) => api.post('/enrollments', data);
export const getBlogPosts = (params) => api.get('/blog', { params });
export const getBlogPost = (slug) => api.get(`/blog/${slug}`);

// ---- Auth API ----
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// ---- Admin API ----
export const getDashboard = () => api.get('/admin/dashboard');
export const getInquiries = (params) => api.get('/inquiries', { params });
export const getInquiry = (id) => api.get(`/inquiries/${id}`);
export const updateInquiry = (id, data) => api.patch(`/inquiries/${id}`, data);
export const deleteInquiry = (id) => api.delete(`/inquiries/${id}`);
export const getEnrollments = (params) => api.get('/enrollments', { params });
export const updateEnrollment = (id, data) => api.patch(`/enrollments/${id}`, data);
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);
export const getAdminPosts = (params) => api.get('/blog/admin/all', { params });
export const createPost = (data) => api.post('/blog', data);
export const updatePost = (id, data) => api.put(`/blog/${id}`, data);
export const deletePost = (id) => api.delete(`/blog/${id}`);

export default api;
