import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboard, getEnrollments, getInquiries, updateInquiry, submitEnrollment, updateEnrollment } from '../services/api.js';
import { FiUsers, FiMessageSquare, FiHome, FiSettings, FiLogOut, FiUser, FiCheckCircle, FiArrowLeft, FiEdit, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaMale, FaFemale } from 'react-icons/fa';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('students');
    const [activeCourseTab, setActiveCourseTab] = useState('all');
    const [isStudentsOpen, setIsStudentsOpen] = useState(true);
    const [activePassedOutCourseTab, setActivePassedOutCourseTab] = useState('all');
    const [isPassedOutOpen, setIsPassedOutOpen] = useState(false);
    const [viewingStudent, setViewingStudent] = useState(null);
    const [newTxAmount, setNewTxAmount] = useState('');
    const [newTxDate, setNewTxDate] = useState('');
    const [newTxId, setNewTxId] = useState('');
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [dashRes, enrollRes, inqRes] = await Promise.all([
                getDashboard(),
                getEnrollments(),
                getInquiries()
            ]);
            setStats(dashRes.data.data);
            setStudents(enrollRes.data.data);
            setInquiries(inqRes.data.data);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerify = async (id) => {
        try {
            await updateInquiry(id, { status: 'resolved' });
            fetchData();
        } catch (error) {
            console.error("Error verifying inquiry:", error);
        }
    };

    const handleRegister = async (inq) => {
        try {
            await submitEnrollment({
                name: inq.name,
                email: inq.email,
                phone: inq.phone,
                course: inq.interest,
                mode: 'online',
                status: 'confirmed'
            });
            // Archive the inquiry so it moves out of Verified Students
            await updateInquiry(inq._id, { status: 'archived' });
            alert(`${inq.name} successfully registered to Student Portal!`);
            fetchData();
        } catch (error) {
            console.error("Error registering student:", error);
            alert("Failed to register student. Ensure they aren't already enrolled.");
        }
    };

    const handleMarkCompleted = async (id) => {
        try {
            await updateEnrollment(id, { status: 'completed' });
            fetchData();
        } catch (error) {
            console.error("Error updating enrollment:", error);
            alert("Failed to mark student as completed.");
        }
    };

    const handleAddTransaction = () => {
        if (!newTxAmount || !newTxDate) {
            alert('Amount and Date are required for a transaction.');
            return;
        }
        const updatedTransactions = [...(viewingStudent.transactions || []), {
            amount: Number(newTxAmount),
            date: newTxDate,
            transactionId: newTxId
        }];
        setViewingStudent({ ...viewingStudent, transactions: updatedTransactions });
        setNewTxAmount('');
        setNewTxDate('');
        setNewTxId('');
    };

    const handleRemoveTransaction = (index) => {
        const updatedTransactions = [...viewingStudent.transactions];
        updatedTransactions.splice(index, 1);
        setViewingStudent({ ...viewingStudent, transactions: updatedTransactions });
    };

    const handleSaveDetails = async () => {
        try {
            await updateEnrollment(viewingStudent._id, viewingStudent);
            fetchData();
            alert('Details saved successfully!');
        } catch (error) {
            console.error("Error saving details:", error);
            alert('Failed to save details.');
        }
    };

    const handleUpdateNotes = async (id, newNotes) => {
        try {
            await updateInquiry(id, { adminNotes: newNotes });
        } catch (error) {
            console.error("Error updating notes:", error);
        }
    };

    const downloadCSV = (data, filename) => {
        if (!data || !data.length) return alert("No data to download.");
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const handleDownloadVerified = () => {
        const verified = inquiries.filter(inq => inq.status === 'resolved');
        const formatted = verified.map(inq => ({
            Name: inq.name,
            Phone: ` ${inq.phone}`, // Prefix space to avoid Excel scientific notation
            Email: inq.email,
            Gender: inq.gender || 'N/A',
            Interest: inq.interest
            // Removed 'Message' as requested
        }));
        downloadCSV(formatted, 'verified_students.csv');
    };

    const handleDownloadStudents = () => {
        const filteredStudents = activeCourseTab === 'all' ? students : students.filter(st => st.course === activeCourseTab);
        const formatted = filteredStudents.filter(st => st.status !== 'completed').map(st => {
            const totalPaid = st.transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
            return {
                Name: st.name,
                Email: st.email,
                Phone: ` ${st.phone}`,
                Course: st.course,
                FeePaid: totalPaid,
                TotalFee: st.totalFee || 0,
                Date: new Date(st.createdAt).toLocaleDateString()
            };
        });
        downloadCSV(formatted, `${activeCourseTab}_enrolled_students.csv`);
    };

    const handleDownloadPassedOut = () => {
        const passedStudents = students.filter(st => st.status === 'completed');
        const filtered = activePassedOutCourseTab === 'all' ? passedStudents : passedStudents.filter(st => st.course === activePassedOutCourseTab);
        const formatted = filtered.map(st => ({
            Name: st.name,
            Email: st.email,
            Phone: ` ${st.phone}`,
            Course: st.course,
            Mode: st.mode,
            Status: st.status,
            CompletedDate: new Date(st.updatedAt || st.createdAt).toLocaleDateString()
        }));
        downloadCSV(formatted, `${activePassedOutCourseTab}_passed_out_students.csv`);
    };

    const courseTabs = [
        { id: 'all', label: 'All Students' },
        { id: 'clad', label: 'CLAD' },
        { id: 'cld', label: 'CLD' },
        { id: 'project', label: 'Custom Project Development' },
        { id: 'consulting', label: 'LabVIEW Consulting' },
        { id: 'hardware', label: 'Hardware Integration' },
        { id: 'teststand', label: 'TestStand Solutions' }
    ];

    const renderContent = () => {
        if (loading) return <p>Loading data...</p>;

        switch (activeTab) {
            case 'students':
                const baseStudents = students.filter(st => st.status !== 'completed');
                const filteredStudents = activeCourseTab === 'all' ? baseStudents : baseStudents.filter(st => st.course === activeCourseTab);
                
                if (viewingStudent) {
                    return (
                        <div style={{ background: 'var(--clr-bg-card)', borderRadius: '12px', padding: '30px', border: '1px solid var(--clr-border)', overflow: 'hidden' }}>
                            <button onClick={() => setViewingStudent(null)} style={{ background: 'transparent', color: 'var(--clr-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
                                <FiArrowLeft /> Back to Students
                            </button>
                            
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center', borderBottom: '1px solid var(--clr-border)', paddingBottom: '20px' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(230,57,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiUser size={40} color="var(--clr-primary)" />
                                </div>
                                <div>
                                    <h2 style={{ margin: '0 0 5px 0' }}>{viewingStudent.name}</h2>
                                    <div style={{ color: 'var(--clr-green)', fontWeight: 'bold', fontSize: '14px' }}>
                                        {courseTabs.find(t => t.id === viewingStudent.course)?.label || viewingStudent.course.toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                                {/* Left Col - Info */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Mobile Number</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{viewingStudent.phone}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Email ID</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{viewingStudent.email}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Course Start Date</div>
                                        <input type="date" value={viewingStudent.courseStartDate || ''} onChange={e => setViewingStudent({...viewingStudent, courseStartDate: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--clr-bg-primary)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-primary)', borderRadius: '8px' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Course End Date</div>
                                        <input type="date" value={viewingStudent.courseEndDate || ''} onChange={e => setViewingStudent({...viewingStudent, courseEndDate: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--clr-bg-primary)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-primary)', borderRadius: '8px' }} />
                                    </div>
                                </div>

                                {/* Right Col - Fee Box */}
                                <div style={{ background: 'var(--clr-bg-secondary)', border: '1px solid var(--clr-border)', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid var(--clr-border)', paddingBottom: '15px' }}>Fee & UPI Transactions</h3>
                                    
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Course Register Fee (₹)</div>
                                        <input type="number" value={viewingStudent.totalFee || ''} onChange={e => setViewingStudent({...viewingStudent, totalFee: e.target.value})} placeholder="e.g. 15000" style={{ width: '100%', padding: '12px', background: 'var(--clr-bg-primary)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-primary)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }} />
                                    </div>

                                    <div style={{ marginTop: '10px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--clr-text-primary)' }}>Transaction History</div>
                                        {viewingStudent.transactions && viewingStudent.transactions.length > 0 ? (
                                            <div style={{ background: 'var(--clr-bg-primary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--clr-border)' }}>
                                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                                                    <thead>
                                                        <tr style={{ background: 'rgba(69, 123, 157, 0.1)', color: 'var(--clr-blue)' }}>
                                                            <th style={{ padding: '10px' }}>Date</th>
                                                            <th style={{ padding: '10px' }}>Trans. ID</th>
                                                            <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                                                            <th style={{ padding: '10px', textAlign: 'center' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {viewingStudent.transactions.map((tx, idx) => (
                                                            <tr key={idx} style={{ borderBottom: '1px solid var(--clr-border)' }}>
                                                                <td style={{ padding: '10px' }}>{tx.date}</td>
                                                                <td style={{ padding: '10px', color: 'var(--clr-orange)' }}>{tx.transactionId || 'N/A'}</td>
                                                                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: 'var(--clr-green)' }}>₹{tx.amount}</td>
                                                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                                                    <button onClick={() => handleRemoveTransaction(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--clr-red)', cursor: 'pointer' }}><FiTrash2 size={14}/></button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        <tr style={{ background: 'rgba(42, 157, 143, 0.1)' }}>
                                                            <td colSpan="2" style={{ padding: '10px', fontWeight: 'bold', textAlign: 'right' }}>Total Paid:</td>
                                                            <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--clr-green)', textAlign: 'right', fontSize: '15px' }}>₹{viewingStudent.transactions.reduce((s, t) => s + (t.amount||0), 0)}</td>
                                                            <td></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '13px', color: 'var(--clr-text-secondary)', fontStyle: 'italic' }}>No transactions recorded yet.</div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: '10px', borderTop: '1px dashed var(--clr-border)', paddingTop: '20px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: 'var(--clr-text-primary)' }}>Add New Transaction</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', marginBottom: '5px' }}>Amount (₹)</div>
                                                <input type="number" value={newTxAmount} onChange={e => setNewTxAmount(e.target.value)} placeholder="e.g. 5000" style={{ width: '100%', padding: '10px', background: 'var(--clr-bg-primary)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-primary)', borderRadius: '6px' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', marginBottom: '5px' }}>Date</div>
                                                <input type="date" value={newTxDate} onChange={e => setNewTxDate(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--clr-bg-primary)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-primary)', borderRadius: '6px' }} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontSize: '12px', color: 'var(--clr-text-secondary)', marginBottom: '5px' }}>Transaction ID (Optional)</div>
                                            <input type="text" value={newTxId} onChange={e => setNewTxId(e.target.value)} placeholder="e.g. T23948..." style={{ width: '100%', padding: '10px', background: 'var(--clr-bg-primary)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-primary)', borderRadius: '6px' }} />
                                        </div>
                                        <button onClick={handleAddTransaction} style={{ width: '100%', padding: '10px', background: 'rgba(230, 57, 70, 0.05)', color: 'var(--clr-primary)', border: '1px dashed var(--clr-primary)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                                            <FiPlus /> Add Transaction
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--clr-border)', textAlign: 'right' }}>
                                <button onClick={handleSaveDetails} style={{ padding: '12px 30px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                                    <FiSave size={18} /> Save Details
                                </button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Student Portal {activeCourseTab !== 'all' && `- ${courseTabs.find(t=>t.id === activeCourseTab)?.label}`}</h2>
                            <button 
                                onClick={handleDownloadStudents}
                                style={{ padding: '8px 16px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Download Sheets
                            </button>
                        </div>

                        <div style={{ background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px solid var(--clr-border)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--clr-border)' }}>
                                        <th style={{ padding: '15px' }}>Name</th>
                                        <th style={{ padding: '15px' }}>Email</th>
                                        <th style={{ padding: '15px' }}>Course</th>
                                        <th style={{ padding: '15px' }}>Fee (₹)</th>
                                        <th style={{ padding: '15px' }}>Date</th>
                                        <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student, i) => {
                                        const totalPaid = student.transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
                                        const totalFee = student.totalFee || 0;
                                        const isFullyPaid = totalFee > 0 && totalPaid >= totalFee;

                                        return (
                                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px' }}>{student.name}</td>
                                                <td style={{ padding: '15px' }}>{student.email}<br/><span style={{fontSize: '12px', color: 'var(--clr-text-secondary)'}}>{student.phone}</span></td>
                                                <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--clr-primary)' }}>{courseTabs.find(t => t.id === student.course)?.label || student.course.toUpperCase()}</td>
                                                <td style={{ padding: '15px', fontWeight: 'bold' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span style={{ color: totalPaid > 0 ? 'var(--clr-green)' : 'var(--clr-red)' }}>
                                                            {totalPaid > 0 ? `₹${totalPaid}` : <span style={{ fontSize: '12px', padding: '2px 6px', background: 'rgba(230, 57, 70, 0.1)', borderRadius: '4px' }}>Unpaid</span>}
                                                        </span>
                                                        {totalFee > 0 && (
                                                            <span style={{ fontSize: '12px', color: 'var(--clr-text-secondary)' }}>of ₹{totalFee} {isFullyPaid && '✓'}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px', fontSize: '14px', color: 'var(--clr-text-secondary)' }}>{new Date(student.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button 
                                                        onClick={() => setViewingStudent(student)}
                                                        style={{ padding: '6px 12px', background: 'var(--clr-blue)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginRight: '5px' }}
                                                    >
                                                        View
                                                    </button>
                                                    <button 
                                                        onClick={() => handleMarkCompleted(student._id)}
                                                        style={{ padding: '6px 12px', background: 'var(--clr-green)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                                    >
                                                        Completed
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredStudents.length === 0 && <tr><td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>No active students in this course yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'inquiries':
                return (
                    <div>
                        <h2 style={{ marginBottom: '20px' }}>Contact Inquiries</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {inquiries.filter(inq => inq.status !== 'resolved' && inq.status !== 'archived').map((inq, i) => (
                                <div key={i} style={{ background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px solid var(--clr-border)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    
                                    {/* Avatar Circle */}
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '2px solid var(--clr-border)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {inq.gender === 'male' ? (
                                            <FaMale size={50} color="#60a5fa" style={{ marginTop: '10px' }} />
                                        ) : inq.gender === 'female' ? (
                                            <FaFemale size={50} color="#f472b6" style={{ marginTop: '10px' }} />
                                        ) : (
                                            <FiUser size={40} color="var(--clr-text-secondary)" />
                                        )}
                                    </div>

                                    {/* Details Box */}
                                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--clr-border)', borderRadius: '8px', padding: '15px', textAlign: 'left', fontSize: '14px' }}>
                                        <div style={{ marginBottom: '8px' }}><strong>Name:</strong> {inq.name}</div>
                                        <div style={{ marginBottom: '8px' }}><strong>Contact:</strong> {inq.phone}</div>
                                        <div style={{ marginBottom: '8px' }}><strong>Interest:</strong> <span style={{ color: 'var(--clr-gold)' }}>{inq.interest}</span></div>
                                        <div style={{ marginBottom: '8px' }}><strong>Mail id:</strong> {inq.email}</div>
                                        
                                        <div style={{ marginTop: '15px', borderTop: '1px solid var(--clr-border)', paddingTop: '10px' }}>
                                            <div style={{ color: 'var(--clr-text-secondary)', marginBottom: '5px' }}><strong>Message:</strong></div>
                                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', fontSize: '13px' }}>
                                                {inq.message}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge & Verify Button */}
                                    <div style={{ marginTop: '15px', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                        <span style={{ padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: 'bold' }}>
                                            Status: {inq.status}
                                        </span>
                                        <button 
                                            onClick={() => handleVerify(inq._id)}
                                            style={{ padding: '8px 20px', background: 'var(--clr-green)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                                        >
                                            Verify Student
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {inquiries.filter(inq => inq.status !== 'resolved' && inq.status !== 'archived').length === 0 && <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--clr-bg-card)', borderRadius: '12px' }}>No pending inquiries.</div>}
                        </div>
                    </div>
                );
            case 'overview':
                return (
                    <div>
                        <h2 style={{ marginBottom: '20px' }}>Overview Dashboard</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ padding: '20px', background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px solid var(--clr-border)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--clr-text-secondary)' }}>Total Students</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--clr-primary)', marginTop: '10px' }}>
                                    {stats?.stats.totalEnrollments || 0}
                                </div>
                            </div>
                            <div style={{ padding: '20px', background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px solid var(--clr-border)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--clr-text-secondary)' }}>Total Inquiries</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--clr-gold)', marginTop: '10px' }}>
                                    {stats?.stats.totalInquiries || 0}
                                </div>
                            </div>
                            <div style={{ padding: '20px', background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px solid var(--clr-border)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--clr-text-secondary)' }}>New Inquiries</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--clr-blue-light)', marginTop: '10px' }}>
                                    {stats?.stats.newInquiries || 0}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>Verified Students (From Inquiries)</h3>
                            <button 
                                onClick={handleDownloadVerified}
                                style={{ padding: '8px 16px', background: 'var(--clr-green)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Download Sheets
                            </button>
                        </div>
                        
                        <div style={{ background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px solid var(--clr-border)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--clr-border)' }}>
                                        <th style={{ padding: '15px' }}>Avatar</th>
                                        <th style={{ padding: '15px' }}>Name</th>
                                        <th style={{ padding: '15px' }}>Contact</th>
                                        <th style={{ padding: '15px' }}>Interest</th>
                                        <th style={{ padding: '15px', width: '25%' }}>Status</th>
                                        <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.filter(inq => inq.status === 'resolved').map((inq, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {inq.gender === 'male' ? <FaMale size={20} color="#60a5fa" /> : inq.gender === 'female' ? <FaFemale size={20} color="#f472b6" /> : <FiUser size={16} />}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{inq.name}</td>
                                            <td style={{ padding: '15px' }}>{inq.email}<br/><span style={{fontSize: '12px', color: 'var(--clr-text-secondary)'}}>{inq.phone}</span></td>
                                            <td style={{ padding: '15px', color: 'var(--clr-gold)' }}>{inq.interest}</td>
                                            <td style={{ padding: '15px' }}>
                                                <input 
                                                    type="text" 
                                                    defaultValue={inq.adminNotes || ''}
                                                    placeholder="e.g. Followed up on Monday..."
                                                    onBlur={(e) => handleUpdateNotes(inq._id, e.target.value)}
                                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                                                />
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <button 
                                                    onClick={() => handleRegister(inq)}
                                                    style={{ padding: '6px 12px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                                >
                                                    Register
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {inquiries.filter(inq => inq.status === 'resolved').length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>No verified students yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'passed_out':
                const basePassedStudents = students.filter(st => st.status === 'completed');
                const filteredPassedStudents = activePassedOutCourseTab === 'all' ? basePassedStudents : basePassedStudents.filter(st => st.course === activePassedOutCourseTab);
                
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Passed Out (Alumni) {activePassedOutCourseTab !== 'all' && `- ${courseTabs.find(t=>t.id === activePassedOutCourseTab)?.label}`}</h2>
                            <button 
                                onClick={handleDownloadPassedOut}
                                style={{ padding: '8px 16px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Download Sheets
                            </button>
                        </div>
                        <div style={{ background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px solid var(--clr-border)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--clr-border)' }}>
                                        <th style={{ padding: '15px' }}>Name</th>
                                        <th style={{ padding: '15px' }}>Email</th>
                                        <th style={{ padding: '15px' }}>Course Completed</th>
                                        <th style={{ padding: '15px' }}>Mode</th>
                                        <th style={{ padding: '15px' }}>Status</th>
                                        <th style={{ padding: '15px' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPassedStudents.map((student, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{student.name}</td>
                                            <td style={{ padding: '15px' }}>{student.email}<br/><span style={{fontSize: '12px', color: 'var(--clr-text-secondary)'}}>{student.phone}</span></td>
                                            <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--clr-green)' }}>{courseTabs.find(t => t.id === student.course)?.label || student.course.toUpperCase()}</td>
                                            <td style={{ padding: '15px' }}>{student.mode}</td>
                                            <td style={{ padding: '15px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(42, 157, 143, 0.2)', color: 'var(--clr-green)', fontSize: '12px', fontWeight: 'bold' }}>Passed Out</span></td>
                                            <td style={{ padding: '15px', fontSize: '14px', color: 'var(--clr-text-secondary)' }}>{new Date(student.updatedAt || student.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {filteredPassedStudents.length === 0 && <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--clr-text-secondary)' }}>No students have been marked as completed yet in this section.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'cms':
                return (
                    <div>
                        <h2 style={{ marginBottom: '20px' }}>Website Editor (CMS)</h2>
                        <div style={{ padding: '40px', background: 'var(--clr-bg-card)', borderRadius: '12px', border: '1px dashed var(--clr-border)', textAlign: 'center' }}>
                            <FiSettings size={48} style={{ color: 'var(--clr-text-secondary)', marginBottom: '20px' }} />
                            <h3>Content Management System</h3>
                            <p style={{ color: 'var(--clr-text-secondary)', marginTop: '10px', maxWidth: '500px', margin: '10px auto' }}>
                                This area is reserved for the future Website Editor. Once implemented, you will be able to easily change the text, images, and content of the live webpage directly from here without needing a developer.
                            </p>
                            <button className="btn btn--outline" style={{ marginTop: '20px' }} disabled>Coming Soon</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(69, 123, 157, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(230, 57, 70, 0.12) 0%, transparent 40%), var(--clr-bg-primary)' }}>
            {/* Sidebar */}
            <div style={{ width: '280px', background: 'linear-gradient(180deg, rgba(240, 249, 255, 0.9) 0%, rgba(224, 242, 254, 0.9) 50%, rgba(219, 234, 254, 0.95) 100%)', boxShadow: '4px 0 24px rgba(69,123,157,0.1)', borderRight: '1px solid rgba(255,255,255,0.8)', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'rgba(230,57,70,0.15)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(69,123,157,0.2)', filter: 'blur(50px)', borderRadius: '50%' }}></div>
                
                <h2 style={{ marginBottom: '40px', color: 'var(--clr-text-primary)', position: 'relative', zIndex: 1 }}>Lab<span style={{ color: 'var(--clr-primary)' }}>vor</span>a Admin</h2>
                
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                    <div>
                        <button 
                            onClick={() => {
                                setActiveTab('students');
                                setIsStudentsOpen(!isStudentsOpen);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: activeTab === 'students' ? 'var(--clr-primary)' : 'transparent', color: activeTab === 'students' ? '#fff' : 'var(--clr-text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', width: '100%', transition: 'background 0.2s' }}
                        >
                            <FiUsers size={20} /> Student Portal
                        </button>
                        {isStudentsOpen && (
                            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '35px', marginTop: '5px', gap: '5px' }}>
                                {courseTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab('students');
                                            setActiveCourseTab(tab.id);
                                        }}
                                        style={{
                                            padding: '8px 10px',
                                            background: 'transparent',
                                            color: activeTab === 'students' && activeCourseTab === tab.id ? '#fff' : 'var(--clr-text-secondary)',
                                            border: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: activeTab === 'students' && activeCourseTab === tab.id ? 'bold' : 'normal',
                                            borderLeft: activeTab === 'students' && activeCourseTab === tab.id ? '2px solid var(--clr-primary)' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setActiveTab('inquiries')}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: activeTab === 'inquiries' ? 'var(--clr-primary)' : 'transparent', color: activeTab === 'inquiries' ? '#fff' : 'var(--clr-text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
                    >
                        <FiMessageSquare size={20} /> Inquiries
                    </button>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: activeTab === 'overview' ? 'var(--clr-primary)' : 'transparent', color: activeTab === 'overview' ? '#fff' : 'var(--clr-text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
                    >
                        <FiHome size={20} /> Overview Dashboard
                    </button>
                    <div>
                        <button 
                            onClick={() => {
                                setActiveTab('passed_out');
                                setIsPassedOutOpen(!isPassedOutOpen);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: activeTab === 'passed_out' ? 'var(--clr-primary)' : 'transparent', color: activeTab === 'passed_out' ? '#fff' : 'var(--clr-text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', width: '100%', transition: 'background 0.2s' }}
                        >
                            <FiCheckCircle size={20} /> Passed Out
                        </button>
                        {isPassedOutOpen && (
                            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '35px', marginTop: '5px', gap: '5px' }}>
                                {courseTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab('passed_out');
                                            setActivePassedOutCourseTab(tab.id);
                                        }}
                                        style={{
                                            padding: '8px 10px',
                                            background: 'transparent',
                                            color: activeTab === 'passed_out' && activePassedOutCourseTab === tab.id ? '#fff' : 'var(--clr-text-secondary)',
                                            border: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: activeTab === 'passed_out' && activePassedOutCourseTab === tab.id ? 'bold' : 'normal',
                                            borderLeft: activeTab === 'passed_out' && activePassedOutCourseTab === tab.id ? '2px solid var(--clr-primary)' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setActiveTab('cms')}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: activeTab === 'cms' ? 'var(--clr-primary)' : 'transparent', color: activeTab === 'cms' ? '#fff' : 'var(--clr-text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
                    >
                        <FiSettings size={20} /> Website Editor
                    </button>
                </nav>

                <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '20px' }}>
                    <div style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--clr-text-secondary)' }}>Logged in as: <strong>{user?.name}</strong></div>
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 15px', background: 'rgba(230, 57, 70, 0.1)', color: 'var(--clr-red)', border: '1px solid rgba(230, 57, 70, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        <FiLogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
                {renderContent()}
            </div>
        </div>
    );
}
