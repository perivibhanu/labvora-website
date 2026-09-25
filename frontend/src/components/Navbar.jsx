import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/training', label: 'Training' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => {
        setMobileOpen(false);
        document.body.style.overflow = '';
    };

    const toggleMobile = () => {
        setMobileOpen(!mobileOpen);
        document.body.style.overflow = !mobileOpen ? 'hidden' : '';
    };

    return (
        <>
            <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
                <div className="container navbar__inner">
                    <Link to="/" className="navbar__logo" onClick={closeMenu}>
                        Lab<span>vor</span>a
                    </Link>
                    <nav className="navbar__nav">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
                                onClick={closeMenu}
                                end={link.to === '/'}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="navbar__actions">
                        <Link to="/contact" className="btn btn--primary btn--sm" onClick={closeMenu}>
                            Get Started
                        </Link>
                        <button className={`navbar__hamburger${mobileOpen ? ' active' : ''}`} onClick={toggleMobile} aria-label="Toggle Menu">
                            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-menu${mobileOpen ? ' active' : ''}`}>
                <nav className="mobile-menu__nav">
                    {navLinks.map(link => (
                        <NavLink 
                            key={link.to} 
                            to={link.to} 
                            className="mobile-menu__link" 
                            onClick={closeMenu}
                            end={link.to === '/'}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <Link to="/contact" className="btn btn--primary btn--lg mobile-menu__cta" onClick={closeMenu}>
                        Get Started
                    </Link>
                </nav>
            </div>
        </>
    );
}
