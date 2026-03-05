import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to authenticate');
        }

        setLoading(false);
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative'
        }}>
            {/* Background elements are handled globally by index.css, just need a nice centered card */}
            <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px', height: '64px', margin: '0 auto 16px',
                        background: 'var(--color-primary-gradient)',
                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '2rem', boxShadow: 'var(--shadow-md)'
                    }}>
                        🧠
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
                        Welcome to <span style={{ background: 'var(--color-primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LostLink</span>
                    </h2>
                    <p className="text-muted">
                        {isLogin ? 'Sign in to find your items' : 'Create an account to start tracking'}
                    </p>
                </div>

                {error && <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)',
                    padding: '12px', borderRadius: 'var(--border-radius-sm)', marginBottom: '20px',
                    fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--color-text-muted)' }} />
                            <input
                                type="email"
                                required
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--color-text-muted)' }} />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        {isLogin ? <FiLogIn /> : <FiUserPlus />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '24px' }}>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                background: 'none', border: 'none',
                                color: 'var(--color-primary-dark)', fontWeight: '600',
                                cursor: 'pointer', padding: 0
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
