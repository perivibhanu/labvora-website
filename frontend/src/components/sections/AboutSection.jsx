import { FiClock, FiEye, FiStar } from 'react-icons/fi';

export default function AboutSection() {
    return (
        <section id="about" className="about section">
            <div className="container">
                <div className="section__header" data-animate="fade-up">
                    <span className="section__tag">About Us</span>
                    <h2 className="section__title">Empowering Engineers with <span className="text-gradient">LabVIEW Expertise</span></h2>
                    <p className="section__subtitle">We bridge the gap between LabVIEW learners and industry-ready professionals through world-class training and project solutions.</p>
                </div>
                <div className="about__grid">
                    <div className="about__story" data-animate="fade-right">
                        <h3 className="about__heading">Our Story</h3>
                        <p>Labvora was founded with a single mission: to make LabVIEW expertise accessible and to help engineers and organizations unlock the full potential of NI's powerful platform.</p>
                        <p>Based in Chennai, India, our team of certified LabVIEW professionals brings years of hands-on industry experience across test & measurement, automation, data acquisition, and embedded systems.</p>
                        <p>Whether you're preparing for your CLAD/CLD certification or need a custom automation solution, we're your trusted LabVIEW partner.</p>
                    </div>
                    <div className="about__cards" data-animate="fade-left">
                        {[
                            { icon: <FiClock size={32} />, title: 'Our Mission', desc: 'To deliver excellence in LabVIEW education and engineering solutions, empowering the next generation of automation engineers.' },
                            { icon: <FiEye size={32} />, title: 'Our Vision', desc: 'To become the leading LabVIEW training and development partner in India, recognized for quality, innovation, and student success.' },
                            { icon: <FiStar size={32} />, title: 'Our Values', desc: 'Integrity, hands-on learning, continuous innovation, and a commitment to every student\'s and client\'s success.' },
                        ].map((card, i) => (
                            <div className="about__card" key={i}>
                                <div className="about__card-icon">{card.icon}</div>
                                <h4>{card.title}</h4>
                                <p>{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
