import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0A0A0F',
                color: '#F0F0F5',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        Lab<span style={{ color: '#E63946' }}>vor</span>a
                    </div>
                    <p style={{ color: '#6B6B80', marginTop: '1rem' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
