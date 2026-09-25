import { FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <a href="#home" className="footer__logo">Lab<span>vor</span>a</a>
                        <p className="footer__tagline">Innovate. Automate. Elevate.</p>
                        <p className="footer__desc">Your trusted partner for LabVIEW training, certification, and custom project development.</p>
                        <div className="footer__social">
                            <a href="#" aria-label="LinkedIn" className="footer__social-link"><FaLinkedinIn size={18} /></a>
                            <a href="#" aria-label="YouTube" className="footer__social-link"><FaYoutube size={18} /></a>
                            <a href="#" aria-label="Instagram" className="footer__social-link"><FaInstagram size={18} /></a>
                        </div>
                    </div>
                    <div className="footer__links-col">
                        <h4>Quick Links</h4>
                        <a href="#home">Home</a>
                        <a href="#about">About Us</a>
                        <a href="#services">Services</a>
                        <a href="#training">Training</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div className="footer__links-col">
                        <h4>Services</h4>
                        <a href="#services">CLAD Training</a>
                        <a href="#services">CLD Training</a>
                        <a href="#services">Project Development</a>
                        <a href="#services">LabVIEW Consulting</a>
                        <a href="#services">Hardware Integration</a>
                        <a href="#services">TestStand Solutions</a>
                    </div>
                    <div className="footer__links-col">
                        <h4>Contact</h4>
                        <a href="mailto:testing@labvora.in">testing@labvora.in</a>
                        <a href="tel:+917032055712">+91 7032055712</a>
                        <a href="https://wa.me/917032055712" target="_blank" rel="noopener noreferrer">WhatsApp Chat</a>
                        <span>Chennai, India</span>
                    </div>
                </div>
                <div className="footer__bottom">
                    <p>&copy; {new Date().getFullYear()} Labvora. All rights reserved.</p>
                    <p>Innovate. Automate. Elevate.</p>
                </div>
            </div>
        </footer>
    );
}
