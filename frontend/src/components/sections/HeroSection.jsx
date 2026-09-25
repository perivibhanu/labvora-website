import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiLayers } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

export default function HeroSection() {
    const particlesRef = useRef(null);
    const countersAnimated = useRef(false);

    useEffect(() => {
        // Create particles
        if (particlesRef.current) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.classList.add('hero__particle');
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 6}s`;
                particle.style.animationDuration = `${4 + Math.random() * 4}s`;
                const size = `${2 + Math.random() * 3}px`;
                particle.style.width = size;
                particle.style.height = size;
                particlesRef.current.appendChild(particle);
            }
        }

        // Counter animation observer
        const statsEl = document.querySelector('.hero__stats');
        if (statsEl) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersAnimated.current) {
                        countersAnimated.current = true;
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(statsEl);
            return () => observer.disconnect();
        }
    }, []);

    const animateCounters = () => {
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const start = performance.now();

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target;
            };
            requestAnimationFrame(update);
        });
    };

    const scrollTo = (e, id) => {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="hero">
            <div className="hero__bg">
                <div className="hero__grid-pattern"></div>
                <div className="hero__glow hero__glow--1"></div>
                <div className="hero__glow hero__glow--2"></div>
                <div className="hero__particles" ref={particlesRef}></div>
            </div>
            <div className="container hero__content">
                <div className="hero__badge" data-animate="fade-up">
                    <span className="hero__badge-dot"></span>
                    NI Alliance Partner · Chennai, India
                </div>
                <h1 className="hero__title" data-animate="fade-up" data-delay="100">
                    Master <span className="text-gradient">LabVIEW</span>.<br />
                    Build the <span className="text-gradient">Future</span>.
                </h1>
                <p className="hero__subtitle" data-animate="fade-up" data-delay="200">
                    Professional CLAD & CLD certification training, custom project development,
                    and end-to-end LabVIEW automation solutions.
                </p>
                <div className="hero__tagline" data-animate="fade-up" data-delay="250">
                    <span className="hero__tagline-line"></span>
                    Innovate. Automate. Elevate.
                    <span className="hero__tagline-line"></span>
                </div>
                <div className="hero__actions" data-animate="fade-up" data-delay="300">
                    <Link to="/training" className="btn btn--primary btn--lg">
                        <FaGraduationCap size={20} />
                        Explore Training
                    </Link>
                    <Link to="/services" className="btn btn--outline btn--lg">
                        <FiLayers size={20} />
                        Our Services
                    </Link>
                </div>
                <div className="hero__stats" data-animate="fade-up" data-delay="400">
                    <div className="hero__stat">
                        <span className="hero__stat-number" data-count="150">0</span>+
                        <span className="hero__stat-label">Students Trained</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-number" data-count="50">0</span>+
                        <span className="hero__stat-label">Projects Delivered</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-number" data-count="95">0</span>%
                        <span className="hero__stat-label">Pass Rate</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-number" data-count="5">0</span>+
                        <span className="hero__stat-label">Years Experience</span>
                    </div>
                </div>
            </div>
            <div className="hero__scroll-indicator">
                <span>Scroll</span>
                <div className="hero__scroll-line"></div>
            </div>
        </section>
    );
}
