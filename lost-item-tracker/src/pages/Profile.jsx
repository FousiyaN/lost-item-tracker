import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiSettings, FiBell, FiShield } from 'react-icons/fi';

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out:", error);
            alert("Failed to log out.");
        }
    };

    return (
        <div style={{ paddingBottom: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Profile</h1>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>Manage your account settings</p>
            </div>

            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', marginBottom: '24px' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-gradient)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'white',
                    marginBottom: '16px', fontSize: '2rem', boxShadow: 'var(--shadow-md)'
                }}>
                    <FiUser />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{currentUser?.email || 'User'}</h2>
                <p className="text-muted" style={{ marginBottom: '24px' }}>Free Plan</p>

                <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '50px' }}
                >
                    <FiLogOut /> Sign Out
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                    <div style={{ color: 'var(--color-primary-dark)', padding: '10px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                        <FiSettings size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Account Settings</h4>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Update your email and password</p>
                    </div>
                </div>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                    <div style={{ color: 'var(--color-success)', padding: '10px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }}>
                        <FiBell size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h4>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Manage location alerts and sounds</p>
                    </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                    <div style={{ color: 'var(--color-text-muted)', padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                        <FiShield size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Privacy & Security</h4>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Data usage and permissions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
