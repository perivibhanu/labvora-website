import { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);
    const [isHovered, setIsHovered] = useState(false);

    const testimonials = [
        {
            text: "Labvora's CLAD training was exceptional. The structured approach and mock exams gave me the confidence I needed. I cleared CLAD on my first attempt!",
            author: "Rajesh Kumar",
            role: "Test Engineer, Chennai",
            initials: "RK"
        },
        {
            text: "The CLD preparation was intense but incredibly well-organized. The timed practice sessions and 1-on-1 feedback from the instructor made all the difference.",
            author: "Priya Sharma",
            role: "Automation Engineer, Bangalore",
            initials: "PS"
        },
        {
            text: "We hired Labvora for a custom DAQ project and they delivered beyond expectations. Professional, responsive, and technically excellent.",
            author: "Arun Venkat",
            role: "Project Manager, Hyderabad",
            initials: "AV"
        },
        {
            text: "As someone transitioning from a different domain, Labvora's LabVIEW training made the complex concepts easy to grasp. Highly recommended for beginners!",
            author: "Meena Nair",
            role: "R&D Engineer, Pune",
            initials: "MN"
        }
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) setCardsPerView(1);
            else if (window.innerWidth <= 1024) setCardsPerView(2);
            else setCardsPerView(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = Math.max(1, testimonials.length - cardsPerView + 1);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev + 1 >= totalSlides ? 0 : prev + 1));
    }, [totalSlides]);

    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 < 0 ? totalSlides - 1 : prev - 1));
    };

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isHovered, nextSlide]);

    return (
        <section id="testimonials" className="testimonials section">
            <div className="container">
                <div className="section__header" data-animate="fade-up">
                    <span className="section__tag">Testimonials</span>
                    <h2 className="section__title">What Our <span className="text-gradient">Students Say</span></h2>
                    <p className="section__subtitle">Hear from engineers who transformed their careers with Labvora's training programs.</p>
                </div>
                <div 
                    className="testimonials__carousel"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div 
                        className="testimonials__track"
                        style={{ 
                            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                            width: `${(testimonials.length / cardsPerView) * 100}%`
                        }}
                    >
                        {testimonials.map((t, i) => (
                            <div className="testimonial-card" key={i} style={{ width: `${100 / testimonials.length}%` }}>
                                <div className="testimonial-card__stars">★★★★★</div>
                                <p className="testimonial-card__text">"{t.text}"</p>
                                <div className="testimonial-card__author">
                                    <div className="testimonial-card__avatar">{t.initials}</div>
                                    <div>
                                        <strong>{t.author}</strong>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="testimonials__nav">
                        <button className="testimonials__arrow" onClick={prevSlide} aria-label="Previous testimonial">
                            <FiChevronLeft size={24} />
                        </button>
                        <div className="testimonials__dots">
                            {Array.from({ length: totalSlides }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`testimonials__dot ${i === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(i)}
                                />
                            ))}
                        </div>
                        <button className="testimonials__arrow" onClick={nextSlide} aria-label="Next testimonial">
                            <FiChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
