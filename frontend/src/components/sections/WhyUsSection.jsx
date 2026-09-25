export default function WhyUsSection() {
    const reasons = [
        {
            num: '01',
            title: 'Industry-Experienced Instructors',
            desc: 'Learn from certified professionals with years of real-world LabVIEW experience in test, automation, and R&D.'
        },
        {
            num: '02',
            title: 'Hands-On Project-Based Learning',
            desc: 'Every concept is reinforced with practical exercises and real-world projects — no passive learning here.'
        },
        {
            num: '03',
            title: 'Flexible Learning Modes',
            desc: 'Choose between live online sessions, self-paced content, or in-person classroom training in Chennai.'
        },
        {
            num: '04',
            title: 'Post-Training Support',
            desc: 'We don\'t stop at certification. Get continued mentorship, doubt-clearing, and career guidance after your course.'
        }
    ];

    return (
        <section className="why-us section section--dark">
            <div className="container">
                <div className="section__header" data-animate="fade-up">
                    <span className="section__tag">Why Labvora</span>
                    <h2 className="section__title">What Sets Us <span className="text-gradient">Apart</span></h2>
                </div>
                <div className="why-us__grid">
                    {reasons.map((reason, i) => (
                        <div className="why-us__item" key={i} data-animate="fade-up" data-delay={i * 100}>
                            <div className="why-us__number">{reason.num}</div>
                            <h4>{reason.title}</h4>
                            <p>{reason.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
