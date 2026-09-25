import AnimatedPage from '../components/AnimatedPage.jsx';
import HeroSection from '../components/sections/HeroSection.jsx';
import CTABanner from '../components/sections/CTABanner.jsx';

export default function HomePage() {
    return (
        <AnimatedPage>
            <main>
                <HeroSection />
                <CTABanner />
            </main>
        </AnimatedPage>
    );
}
