import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiMonitor, FiUsers, FiAward } from 'react-icons/fi';

export default function TrainingSection() {
    const [activeTab, setActiveTab] = useState('clad');

    return (
        <section id="training" className="training section">
            <div className="container">
                <div className="section__header" data-animate="fade-up">
                    <span className="section__tag">Certification Programs</span>
                    <h2 className="section__title">Your Path to <span className="text-gradient">LabVIEW Certification</span></h2>
                    <p className="section__subtitle">Structured, expert-led programs designed to get you certified with confidence — available online and in-person.</p>
                </div>
                
                <div className="training__tabs">
                    <button 
                        className={`training__tab ${activeTab === 'clad' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('clad')}
                    >
                        CLAD Program
                    </button>
                    <button 
                        className={`training__tab ${activeTab === 'cld' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('cld')}
                    >
                        CLD Program
                    </button>
                </div>

                <div className="training__content">
                    {/* CLAD Tab */}
                    <div className={`training__panel ${activeTab === 'clad' ? 'active' : ''}`}>
                        <div className="training__panel-grid">
                            <div className="training__info">
                                <h3>Certified LabVIEW Associate Developer</h3>
                                <p>Our CLAD preparation course is designed for engineers and students who want to validate their foundational LabVIEW skills. We cover all exam objectives with hands-on exercises and real exam simulations.</p>
                                
                                <div className="training__details-grid">
                                    <div className="training__detail">
                                        <FiClock size={20} />
                                        <div>
                                            <strong>Duration</strong>
                                            <span>4-6 Weeks</span>
                                        </div>
                                    </div>
                                    <div className="training__detail">
                                        <FiMonitor size={20} />
                                        <div>
                                            <strong>Mode</strong>
                                            <span>Online & Classroom</span>
                                        </div>
                                    </div>
                                    <div className="training__detail">
                                        <FiUsers size={20} />
                                        <div>
                                            <strong>Batch Size</strong>
                                            <span>Max 15 Students</span>
                                        </div>
                                    </div>
                                    <div className="training__detail">
                                        <FiAward size={20} />
                                        <div>
                                            <strong>Certificate</strong>
                                            <span>Completion + Exam Prep</span>
                                        </div>
                                    </div>
                                </div>

                                <h4>Curriculum Highlights</h4>
                                <div className="training__curriculum">
                                    {[
                                        'LabVIEW Environment & Data Types',
                                        'Loops, Structures & Flow Control',
                                        'Arrays, Clusters & String Operations',
                                        'File I/O & Error Handling',
                                        'SubVI Design & Modular Programming',
                                        'Exam Strategies & Mock Tests'
                                    ].map((module, idx) => (
                                        <div key={idx} className="training__module">
                                            <span className="training__module-num">0{idx + 1}</span>
                                            <span>{module}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/contact" className="btn btn--primary btn--lg">Enroll Now</Link>
                            </div>
                            
                            <div className="training__visual">
                                <div className="training__certificate-card">
                                    <div className="training__cert-badge">CLAD</div>
                                    <div className="training__cert-title">Certified LabVIEW<br />Associate Developer</div>
                                    <div className="training__cert-ni">NI Certification</div>
                                    <div className="training__cert-line"></div>
                                    <div className="training__cert-stats">
                                        <div><strong>40</strong> Questions</div>
                                        <div><strong>60</strong> Minutes</div>
                                        <div><strong>70%</strong> Pass Mark</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CLD Tab */}
                    <div className={`training__panel ${activeTab === 'cld' ? 'active' : ''}`}>
                        <div className="training__panel-grid">
                            <div className="training__info">
                                <h3>Certified LabVIEW Developer</h3>
                                <p>The CLD is a practical exam that tests your ability to design and build a complete LabVIEW application. Our intensive program focuses on architecture, design patterns, and timed practice to ensure you're exam-ready.</p>
                                
                                <div className="training__details-grid">
                                    <div className="training__detail">
                                        <FiClock size={20} />
                                        <div>
                                            <strong>Duration</strong>
                                            <span>6-8 Weeks</span>
                                        </div>
                                    </div>
                                    <div className="training__detail">
                                        <FiMonitor size={20} />
                                        <div>
                                            <strong>Mode</strong>
                                            <span>Online & Classroom</span>
                                        </div>
                                    </div>
                                    <div className="training__detail">
                                        <FiUsers size={20} />
                                        <div>
                                            <strong>Batch Size</strong>
                                            <span>Max 10 Students</span>
                                        </div>
                                    </div>
                                    <div className="training__detail">
                                        <FiAward size={20} />
                                        <div>
                                            <strong>Prerequisite</strong>
                                            <span>CLAD Certified</span>
                                        </div>
                                    </div>
                                </div>

                                <h4>Curriculum Highlights</h4>
                                <div className="training__curriculum">
                                    {[
                                        'LabVIEW Architecture & Design Patterns',
                                        'State Machines & Event-Driven Programming',
                                        'Producer-Consumer & Queued Message Handler',
                                        'Advanced File I/O & Data Management',
                                        'UI Design & User Experience Best Practices',
                                        'Timed Full-Exam Simulations (4-hour)'
                                    ].map((module, idx) => (
                                        <div key={idx} className="training__module">
                                            <span className="training__module-num">0{idx + 1}</span>
                                            <span>{module}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/contact" className="btn btn--primary btn--lg">Enroll Now</Link>
                            </div>
                            
                            <div className="training__visual">
                                <div className="training__certificate-card training__certificate-card--cld">
                                    <div className="training__cert-badge training__cert-badge--cld">CLD</div>
                                    <div className="training__cert-title">Certified LabVIEW<br />Developer</div>
                                    <div className="training__cert-ni">NI Certification</div>
                                    <div className="training__cert-line"></div>
                                    <div className="training__cert-stats">
                                        <div><strong>1</strong> Project</div>
                                        <div><strong>4</strong> Hours</div>
                                        <div><strong>70%</strong> Pass Mark</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
