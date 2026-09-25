import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function CTABanner() {
    return (
        <section className="cta-banner">
            <div className="cta-banner__bg">
                <div className="cta-banner__glow"></div>
            </div>
            <div className="container cta-banner__content" data-animate="fade-up">
                <h2>Ready to Level Up Your LabVIEW Skills?</h2>
                <p>Join hundreds of engineers who trust Labvora for their LabVIEW training and project needs.</p>
                <div className="cta-banner__actions">
                    <Link to="/contact" className="btn btn--white btn--lg">
                        Get in Touch
                    </Link>
                    <a 
                        href="https://wa.me/917032055712" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn--whatsapp btn--lg"
                    >
                        <FaWhatsapp size={20} />
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
}
