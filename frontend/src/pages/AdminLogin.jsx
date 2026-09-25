import { useState } from 'react';
import { useNavigate as useNav } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNav();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login successful');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--clr-bg-primary)',
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--clr-bg-card)',
                padding: '40px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid var(--clr-border)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Lab<span style={{color: 'var(--clr-primary)'}}>vor</span>a Admin</h2>
                    <p style={{ color: 'var(--clr-text-secondary)', marginTop: '8px' }}>Sign in to manage your website</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn--primary btn--full" disabled={loading} style={{ marginTop: '16px' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
