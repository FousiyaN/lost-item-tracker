import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { FiImage, FiMapPin, FiTag, FiUpload, FiCheckCircle } from 'react-icons/fi';

export default function AddItem() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false); // Reset success state on new submission

        try {
            let imageUrl = null;
            if (image) {
                const fileRef = ref(storage, `users/${currentUser.uid}/${Date.now()}_${image.name}`);
                const snapshot = await uploadBytes(fileRef, image);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            await addDoc(collection(db, 'users', currentUser.uid, 'items'), {
                name,
                location,
                imageUrl,
                timestamp: serverTimestamp()
            });

            setSuccess(true);
            setName('');
            setLocation('');
            setImage(null);
        } catch (err) {
            console.error(err);
            setError('Failed to add the item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="glass-panel text-center" style={{ padding: '40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ color: 'var(--color-success)' }}>Item Saved!</h2>
                    <p className="text-muted mt-4">Your item has been securely stored.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                        style={{ marginTop: '20px', padding: '12px 24px' }}
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => setSuccess(false)}
                        className="btn"
                        style={{ marginTop: '10px', backgroundColor: 'transparent', color: 'var(--color-text-muted)', border: '1px solid rgba(156, 163, 175, 0.3)' }}
                    >
                        Add Another Item
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '20px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Add New Item</h2>
                <p className="text-muted">Track something important so you never lose it again.</p>
            </div>

            <div className="glass-panel">
                {success && (
                    <div style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)',
                        padding: '16px', borderRadius: 'var(--border-radius-sm)', marginBottom: '24px',
                        display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500,
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                        <FiCheckCircle size={20} /> Item saved successfully!
                    </div>
                )}
                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)',
                        padding: '16px', borderRadius: 'var(--border-radius-sm)', marginBottom: '24px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>What did you stash?</label>
                        <div style={{ position: 'relative' }}>
                            <FiTag style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                required
                                placeholder="e.g. Passport, House Keys"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Where is it?</label>
                        <div style={{ position: 'relative' }}>
                            <FiMapPin style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                required
                                placeholder="e.g. Blue Backpack, Drawer 2"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Upload a Photo (Optional)</label>
                        <label style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            border: '2px dashed rgba(156, 163, 175, 0.4)', borderRadius: 'var(--border-radius-md)',
                            padding: '40px 20px', cursor: 'pointer',
                            backgroundColor: 'var(--color-surface-solid)', transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-dark)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.4)'}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                            {image ? (
                                <div style={{ textAlign: 'center' }}>
                                    <FiImage size={32} style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
                                    <p style={{ color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>{image.name}</p>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>Click to change image</p>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <FiUpload size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
                                    <p style={{ color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>Click to browse</p>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>PNG, JPG or GIF</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                        {loading ? 'Saving Item...' : 'Save Item Securely'}
                    </button>

                    <button
                        type="button"
                        className="btn"
                        onClick={() => navigate('/')}
                        style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--color-text-muted)', border: '1px solid rgba(156, 163, 175, 0.3)' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
