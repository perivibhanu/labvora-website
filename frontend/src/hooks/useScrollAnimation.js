import { useEffect, useRef } from 'react';

/**
 * Hook for scroll-based visibility animations using IntersectionObserver
 */
export default function useScrollAnimation() {
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, parseInt(delay));
                        observerRef.current.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        // Observe all animated elements
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);
}
