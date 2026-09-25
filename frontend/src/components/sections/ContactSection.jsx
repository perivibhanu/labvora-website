import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { submitContact } from '../../services/api.js';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: '',
        gender: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await submitContact(formData);
            if (res.data.success) {
                toast.success(res.data.message);
                setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="contact section">
            <div className="container">
                <div className="section__header" data-animate="fade-up">
                    <span className="section__tag">Get in Touch</span>
                    <h2 className="section__title">Let's <span className="text-gradient">Connect</span></h2>
                    <p className="section__subtitle">Have a question about our training programs or need a custom LabVIEW solution? We'd love to hear from you.</p>
                </div>
                <div className="contact__grid">
                    <div className="contact__info" data-animate="fade-right">
                        <div className="contact__info-card">
                            <div className="contact__info-icon"><FiMail size={24} /></div>
                            <div>
                                <h4>Email Us</h4>
                                <a href="mailto:testing@labvora.in">testing@labvora.in</a>
                            </div>
                        </div>
                        <div className="contact__info-card">
                            <div className="contact__info-icon"><FiPhone size={24} /></div>
                            <div>
                                <h4>Call Us</h4>
                                <a href="tel:+917032055712">+91 7032055712</a>
                            </div>
                        </div>
                        <div className="contact__info-card">
                            <div className="contact__info-icon"><FiMapPin size={24} /></div>
                            <div>
                                <h4>Visit Us</h4>
                                <span>Chennai, Tamil Nadu, India</span>
                            </div>
                        </div>
                        <div className="contact__info-card">
                            <div className="contact__info-icon contact__info-icon--whatsapp">
                                <FaWhatsapp size={24} />
                            </div>
                            <div>
                                <h4>WhatsApp</h4>
                                <a href="https://wa.me/917032055712" target="_blank" rel="noopener noreferrer">Chat with us</a>
                            </div>
                        </div>

                        <div className="contact__map">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497511.23481668584!2d79.87933028906249!3d13.047985950000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sin!4v1695000000000!5m2!1sen!2sin" 
                                width="100%" 
                                height="200" 
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Labvora Location - Chennai, India"
                            ></iframe>
                        </div>
                    </div>
                    
                    <div className="contact__form-wrap" data-animate="fade-left">
                        <form className="contact__form" onSubmit={handleSubmit}>
                            <h3 className="contact__form-title">Send Us a Message</h3>
                            <div className="form-group">
                                <label htmlFor="contact-name">Full Name *</label>
                                <input 
                                    type="text" 
                                    id="contact-name" 
                                    name="name" 
                                    required 
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-email">Email *</label>
                                    <input 
                                        type="email" 
                                        id="contact-email" 
                                        name="email" 
                                        required 
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-phone">Phone *</label>
                                    <input 
                                        type="tel" 
                                        id="contact-phone" 
                                        name="phone" 
                                        required 
                                        placeholder="+91 XXXXX XXXXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-gender">Gender *</label>
                                    <select 
                                        id="contact-gender" 
                                        name="gender" 
                                        required
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-interest">I'm Interested In *</label>
                                    <select 
                                        id="contact-interest" 
                                        name="interest" 
                                        required
                                        value={formData.interest}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select an option</option>
                                        <option value="clad">CLAD Training</option>
                                        <option value="cld">CLD Training</option>
                                        <option value="project">Custom Project Development</option>
                                        <option value="consulting">LabVIEW Consulting</option>
                                        <option value="hardware">Hardware Integration (DAQ/FPGA/RT)</option>
                                        <option value="teststand">TestStand Solutions</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-message">Message *</label>
                                <textarea 
                                    id="contact-message" 
                                    name="message" 
                                    required 
                                    placeholder="Tell us about your requirements..." 
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                                        </svg>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <FiSend size={20} />
                                    </>
                                )}
                            </button>
                            <p className="contact__form-note">We typically respond within 24 hours.</p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
