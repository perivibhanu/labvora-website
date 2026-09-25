import { FiAward, FiCode, FiCpu, FiMonitor, FiSettings, FiBriefcase } from 'react-icons/fi';

export default function ServicesSection() {
    const scrollTo = (e, id) => {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const services = [
        {
            title: 'CLAD Certification Training',
            desc: 'Ace the Certified LabVIEW Associate Developer exam with our structured, hands-on training program covering all exam domains.',
            features: ['Complete syllabus coverage', 'Practice exams & mock tests', 'Online & classroom modes', 'Doubt-clearing sessions'],
            icon: <FiAward size={24} />,
            color: 'red',
            featured: false
        },
        {
            title: 'CLD Certification Training',
            desc: 'Elevate your LabVIEW skills to developer level with our intensive, project-based CLD preparation program.',
            features: ['Advanced LabVIEW architecture', 'State machines & design patterns', 'Timed practice sessions', '1-on-1 mentorship available'],
            icon: <FiAward size={24} />,
            color: 'gold',
            featured: true
        },
        {
            title: 'Custom Project Development',
            desc: 'End-to-end LabVIEW application development tailored to your specific industrial and research requirements.',
            features: ['Test & measurement systems', 'Data acquisition applications', 'Process automation', 'Custom UI/UX design'],
            icon: <FiCode size={24} />,
            color: 'blue',
            featured: false
        },
        {
            title: 'LabVIEW Consulting',
            desc: 'Expert guidance on architecture, code review, performance optimization, and best practices for your LabVIEW projects.',
            features: ['Architecture review', 'Code optimization', 'Migration & upgrades', 'Technical advisory'],
            icon: <FiBriefcase size={24} />,
            color: 'green',
            featured: false
        },
        {
            title: 'Hardware Integration',
            desc: 'Seamless integration with NI hardware — DAQ, FPGA, Real-Time, PXI, and third-party instruments.',
            features: ['DAQ system design', 'FPGA programming', 'Real-Time applications', 'Instrument driver development'],
            icon: <FiCpu size={24} />,
            color: 'purple',
            featured: false
        },
        {
            title: 'TestStand Solutions',
            desc: 'Production-ready test automation sequences with NI TestStand for manufacturing and quality assurance.',
            features: ['Test sequence development', 'Custom operator interfaces', 'Database & report integration', 'Deployment & maintenance'],
            icon: <FiSettings size={24} />,
            color: 'orange',
            featured: false
        }
    ];

    return (
        <section id="services" className="services section section--dark">
            <div className="container">
                <div className="section__header" data-animate="fade-up">
                    <span className="section__tag">What We Offer</span>
                    <h2 className="section__title">Comprehensive <span className="text-gradient">LabVIEW Solutions</span></h2>
                    <p className="section__subtitle">From certification training to full-scale project development, we cover every aspect of the LabVIEW ecosystem.</p>
                </div>
                <div className="services__grid">
                    {services.map((service, i) => (
                        <div 
                            key={i} 
                            className={`service-card ${service.featured ? 'service-card--featured' : ''}`}
                            data-animate="fade-up" 
                            data-delay={(i % 3) * 100}
                        >
                            {service.featured && <div className="service-card__badge">Popular</div>}
                            <div className={`service-card__icon-wrap service-card__icon-wrap--${service.color}`}>
                                {service.icon}
                            </div>
                            <h3 className="service-card__title">{service.title}</h3>
                            <p className="service-card__desc">{service.desc}</p>
                            <ul className="service-card__features">
                                {service.features.map((feature, j) => (
                                    <li key={j}>{feature}</li>
                                ))}
                            </ul>
                            <a href="#contact" className="service-card__link" onClick={(e) => scrollTo(e, '#contact')}>
                                Enquire Now →
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
