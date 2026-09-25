/* ===== LABVORA - Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 1800);
    });
    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 3000);

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.navbar__link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Hero Particles ----
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero__particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particle.style.animationDuration = `${4 + Math.random() * 4}s`;
            particle.style.width = `${2 + Math.random() * 3}px`;
            particle.style.height = particle.style.width;
            particle.style.opacity = `${0.2 + Math.random() * 0.4}`;
            particlesContainer.appendChild(particle);
        }
    }

    // ---- Counter Animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const start = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                    counter.dataset.animated = 'true';
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ---- Scroll Animations (Intersection Observer) ----
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Counter observer
    const statsSection = document.querySelector('.hero__stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(statsSection);
    }

    // ---- Training Tabs ----
    const tabButtons = document.querySelectorAll('.training__tab');
    const tabPanels = document.querySelectorAll('.training__panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update panels
            tabPanels.forEach(panel => panel.classList.remove('active'));
            const targetPanel = document.getElementById(`panel-${targetTab}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ---- Testimonials Carousel ----
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonial-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        const totalSlides = Math.max(1, cards.length - cardsPerView + 1);

        // Create dots
        function createDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('testimonials__dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap);
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

            // Update dots
            document.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        createDots();

        // Auto-play
        let autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1);
        }, 5000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                goToSlide(currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1);
            }, 5000);
        });

        // Recalculate on resize
        window.addEventListener('resize', () => {
            cardsPerView = getCardsPerView();
            goToSlide(0);
        });
    }

    // ---- Contact Form ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('contact-submit');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                    Sending...
                </span>`;
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                        Message Sent!
                    </span>`;
                submitBtn.style.background = '#2A9D8F';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ---- Add spin animation for loading ----
    const style = document.createElement('style');
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
});
