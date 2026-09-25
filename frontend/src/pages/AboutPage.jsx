import AnimatedPage from '../components/AnimatedPage.jsx';
import AboutSection from '../components/sections/AboutSection.jsx';
import WhyUsSection from '../components/sections/WhyUsSection.jsx';

export default function AboutPage() {
    return (
        <AnimatedPage>
            <AboutSection />
            <WhyUsSection />
        </AnimatedPage>
    );
}
