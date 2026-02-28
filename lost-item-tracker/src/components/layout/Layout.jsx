import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiUser, FiAlertCircle, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import EmergencyFindModal from '../emergency/EmergencyFindModal';

export const Layout = () => {
    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useTheme();

    // Don't show emergency button on Add page to avoid clutter
    const showEmergencyBtn = location.pathname !== '/add';
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="app-header container">
                <div className="app-logo">
                    <span style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🧠📍<span>LostLink</span>
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={toggleTheme}
                        className="btn-icon"
                        style={{ border: 'none', cursor: 'pointer', display: 'flex' }}
                        title="Toggle Dark Mode"
                    >
                        {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </button>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <FiUser size={20} />
                    </div>
                </div>
            </header>

            <main className="main-content container">
                <Outlet />
            </main>

            {/* Floating Emergency Button */}
            {showEmergencyBtn && (
                <button
                    onClick={() => setIsEmergencyOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '80px', // Above mobile nav
                        right: '20px',
                        backgroundColor: 'var(--color-danger)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)',
                        cursor: 'pointer',
                        zIndex: 40,
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <FiAlertCircle size={30} />
                </button>
            )}

            {/* Emergency Modal */}
            <EmergencyFindModal
                isOpen={isEmergencyOpen}
                onClose={() => setIsEmergencyOpen(false)}
            />

            {/* Mobile-friendly bottom navigation */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-surface)',
                backdropFilter: 'blur(16px)',
                borderTop: 'var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '16px 0',
                paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
                zIndex: 30,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
            }}>
                <Link to="/" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: location.pathname === '/' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                    transition: 'color 0.2s', gap: '4px'
                }}>
                    <FiHome size={24} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Dashboard</span>
                </Link>
                <Link to="/add" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: location.pathname === '/add' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                    transition: 'color 0.2s', gap: '4px',
                    transform: 'translateY(-10px)'
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-primary-dark)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '50%',
                        display: 'flex',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
                    }}>
                        <FiPlusCircle size={24} />
                    </div>
                </Link>
                <Link to="/profile" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    color: location.pathname === '/profile' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                    transition: 'color 0.2s', gap: '4px'
                }}>
                    <FiUser size={24} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Profile</span>
                </Link>
            </nav>
        </div>
    );
};
