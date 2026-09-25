import { FiImage } from 'react-icons/fi';

export default function BlogSection() {
    const articles = [
        {
            category: 'CLAD Tips',
            date: 'September 20, 2026',
            title: 'Top 10 Tips to Pass the CLAD Exam on Your First Attempt',
            excerpt: 'Master the essential strategies and avoid common pitfalls that trip up most CLAD candidates...',
            link: '#'
        },
        {
            category: 'Design Patterns',
            date: 'September 15, 2026',
            title: 'Understanding State Machines in LabVIEW: A Complete Guide',
            excerpt: 'Learn how to implement robust state machine architectures for scalable LabVIEW applications...',
            link: '#'
        },
        {
            category: 'Hardware',
            date: 'September 10, 2026',
            title: 'Getting Started with NI DAQ in LabVIEW: Beginner\'s Walkthrough',
            excerpt: 'A step-by-step guide to configuring and programming your first data acquisition system with LabVIEW...',
            link: '#'
        }
    ];

    return (
        <section id="blog" className="blog section section--dark">
            <div className="container">
                <div className="section__header" data-animate="fade-up">
                    <span className="section__tag">Resources</span>
                    <h2 className="section__title">LabVIEW <span className="text-gradient">Insights & Tips</span></h2>
                    <p className="section__subtitle">Stay updated with the latest LabVIEW tutorials, tips, and industry insights from our experts.</p>
                </div>
                <div className="blog__grid">
                    {articles.map((article, i) => (
                        <article className="blog-card" key={i} data-animate="fade-up" data-delay={i * 100}>
                            <div className="blog-card__image">
                                <div className="blog-card__image-placeholder">
                                    <FiImage size={48} />
                                </div>
                                <span className="blog-card__category">{article.category}</span>
                            </div>
                            <div className="blog-card__body">
                                <time className="blog-card__date">{article.date}</time>
                                <h3 className="blog-card__title">{article.title}</h3>
                                <p className="blog-card__excerpt">{article.excerpt}</p>
                                <a href={article.link} className="blog-card__link" onClick={(e) => e.preventDefault()}>
                                    Read More →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
