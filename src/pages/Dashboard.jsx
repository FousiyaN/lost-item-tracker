import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { FiTrash2, FiMapPin, FiClock, FiLogOut, FiHome, FiSearch, FiCamera, FiBox } from 'react-icons/fi';
import { AIAssistant } from '../components/AIAssistant';

export default function Dashboard() {
    const { currentUser, logout } = useAuth();
    const { homeLocation, saveHomeLocation } = useLocation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'users', currentUser.uid, 'items'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(itemsList);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDoc(doc(db, 'users', currentUser.uid, 'items', itemId));
            } catch (err) {
                console.error("Error deleting item:", err);
                alert("Failed to delete item.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to log out:", error);
            alert("Failed to log out.");
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Welcome back <span style={{ animation: 'spin-slow 4s linear infinite', display: 'inline-block' }}>👋</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem' }}>Where did you keep something today?</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-icon"
                    title="Logout"
                    style={{ color: 'var(--color-danger)' }}
                >
                    <FiLogOut size={24} />
                </button>
            </div>

            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', gap: '16px', flexWrap: 'wrap', padding: '16px 24px', position: 'relative', overflow: 'hidden' }}>
                {/* Subtle gradient flash in logic */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                    background: homeLocation ? 'var(--color-success)' : 'var(--color-danger)'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
                    <div style={{
                        background: homeLocation ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
                        color: homeLocation ? 'var(--color-success)' : 'var(--color-danger)',
                        padding: '16px', borderRadius: '50%', boxShadow: homeLocation ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
                    }}>
                        <FiHome size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>Smart Reminders</p>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                            {homeLocation ? "Active. We'll alert you if you leave items behind." : "Set your home location to enable alerts."}
                        </p>
                    </div>
                </div>
                <button
                    className={`btn ${homeLocation ? "btn-danger" : "btn-primary"}`}
                    style={{ fontSize: '0.85rem', padding: '10px 20px', borderRadius: '12px' }}
                    onClick={async () => {
                        const success = await saveHomeLocation();
                        if (success) { alert("Home location successfully updated!"); }
                        else { alert("Could not save location. Make sure location permissions are enabled."); }
                    }}
                >
                    {homeLocation ? "Update Pin" : "Set Home Pin"}
                </button>
            </div>

            <AIAssistant items={items} />

            <div className="input-group" style={{ marginBottom: '32px' }}>
                <div style={{ position: 'relative' }}>
                    <FiSearch style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--color-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search items by name or location..."
                        className="input-field"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', paddingLeft: '44px', borderRadius: '16px' }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center" style={{ padding: '60px' }}>
                    <div style={{
                        width: '48px', height: '48px', border: '3px solid var(--color-primary-light)',
                        borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto',
                        animation: 'spin-slow 1s linear infinite'
                    }}></div>
                    <p className="mt-4 text-muted" style={{ fontWeight: 500 }}>Syncing your tracker...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center glass-panel fade-in" style={{ padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        color: 'var(--color-primary-dark)',
                        width: '100px', height: '100px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
                        boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.1)'
                    }}>
                        <FiBox size={48} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Your Vault is Empty</h3>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Tap the Add button below to secure your first item.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredItems.map((item, index) => (
                        <div key={item.id} className="glass-panel card-hover" style={{
                            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                        }}>
                            {item.imageUrl ? (
                                <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </div>
                            ) : (
                                <div style={{
                                    width: '100%', height: '200px',
                                    background: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-text-muted)', borderBottom: '1px solid rgba(0,0,0,0.02)'
                                }}>
                                    <FiCamera size={40} opacity={0.3} />
                                </div>
                            )}
                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600 }}>{item.name}</h3>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="btn-icon"
                                        style={{ color: 'var(--color-text-muted)', border: 'none', padding: '8px', background: 'var(--color-background)' }}
                                        title="Delete Item"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>

                                <div style={{
                                    backgroundColor: 'var(--color-background)', padding: '12px 16px', borderRadius: '12px',
                                    marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'
                                }}>
                                    <p style={{ margin: 0, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                                        <div style={{ padding: '6px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                                            <FiMapPin size={16} />
                                        </div>
                                        {item.location}
                                    </p>
                                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', width: '100%' }} />
                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '6px' }}>
                                            <FiClock size={16} />
                                        </div>
                                        {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
