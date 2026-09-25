import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import TestimonialsPage from './pages/TestimonialsPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function AnimatedRoutes() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    return (
        <>
            {!isAdminRoute && <Navbar />}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/training" element={<TrainingPage />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AnimatePresence>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <WhatsAppFloat />}
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1A1A24',
                            color: '#F0F0F5',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '10px',
                        },
                        success: { iconTheme: { primary: '#2A9D8F', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#E63946', secondary: '#fff' } },
                    }}
                />
                <AnimatedRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
