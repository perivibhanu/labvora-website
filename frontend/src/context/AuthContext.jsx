import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginApi, logout as logoutApi } from '../services/api.js';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('labvora_token');
            if (!token) {
                setLoading(false);
                return;
            }
            const res = await getMe();
            setUser(res.data.user);
        } catch {
            localStorage.removeItem('labvora_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await loginApi({ email, password });
        if (res.data.success) {
            localStorage.setItem('labvora_token', res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch { /* ignore */ }
        localStorage.removeItem('labvora_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};
