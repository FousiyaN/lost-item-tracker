import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FiX, FiSearch, FiClock, FiMapPin } from 'react-icons/fi';

const QUICK_SUGGESTIONS = ['Keys', 'Wallet', 'Phone', 'Passport', 'Glasses'];

export default function EmergencyFindModal({ isOpen, onClose }) {
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch recent items when modal opens
    useEffect(() => {
        if (isOpen && currentUser) {
            fetchItems();
        }
    }, [isOpen, currentUser]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'users', currentUser.uid, 'items'),
                orderBy('timestamp', 'desc'),
                limit(20) // Get the 20 most recent
            );
            const snapshot = await getDocs(q);
            const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(itemsList);
        } catch (err) {
            console.error("Error fetching items for emergency search", err);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--color-surface-solid)',
                width: '100%', maxWidth: '600px',
                maxHeight: '90vh',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex', flexDirection: 'column',
                boxShadow: 'var(--shadow-lg)'
            }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🚨 Emergency Find
                    </h2>
                    <Button variant="icon" icon={<FiX size={24} />} onClick={onClose} />
                </div>

                {/* Search & Suggestions */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                    <div className="input-group" style={{ marginBottom: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <FiSearch style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="What did you lose? (e.g. Keys)"
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '44px', borderColor: 'var(--color-danger)', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {QUICK_SUGGESTIONS.map(sug => (
                            <button
                                key={sug}
                                onClick={() => setSearchQuery(sug)}
                                style={{
                                    background: 'white', border: '1px solid rgba(0,0,0,0.1)',
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {sug}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        <div className="text-center text-muted">Searching...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center text-muted">No matched items found.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredItems.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex', gap: '16px', padding: '16px',
                                    border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-sm)',
                                    backgroundColor: 'white'
                                }}>
                                    {item.imageUrl && (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', marginBottom: '4px' }}>{item.name}</h3>
                                        <p style={{ margin: 0, color: 'var(--color-danger)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FiMapPin /> {item.location}
                                        </p>
                                        <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FiClock /> {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'Just now'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
