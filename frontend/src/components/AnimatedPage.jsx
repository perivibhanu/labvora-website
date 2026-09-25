import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation.js';

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

export default function AnimatedPage({ children }) {
    useScrollAnimation();

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ width: '100%', minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }} // Added padding for fixed navbar
        >
            {children}
        </motion.div>
    );
}
