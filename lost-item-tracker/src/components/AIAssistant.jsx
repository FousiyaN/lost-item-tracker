import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FiMic, FiMicOff } from 'react-icons/fi';

export const AIAssistant = ({ items }) => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { id: Date.now(), role: 'assistant', content: "Hi! What did you lose today?", type: 'text' }
    ]);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('en-US'); // 'en-US' or 'ml-IN'
    const [statusText, setStatusText] = useState('');
    const recognitionRef = useRef(null);
    const chatEndRef = useRef(null);

    // Use a ref to always point to the latest handleAskWithQuery without causing dependency loops
    const handleAskWithQueryRef = useRef();

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setStatusText('Listening...');
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                if (handleAskWithQueryRef.current) {
                    handleAskWithQueryRef.current(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                setStatusText(`Error: ${event.error} `);
                setTimeout(() => setStatusText(prev => prev.startsWith('Error:') ? '' : prev), 3000);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setStatusText(prev => prev === 'Listening...' ? '' : prev);
            };
        } else {
            setStatusText('Browser does not support voice recognition');
        }
    }, []); // Empty dependency array forces this to initialize only once

    // Keep the ref updated with the latest function closure (which has the latest `items` and `messages`)
    useEffect(() => {
        handleAskWithQueryRef.current = handleAskWithQuery;
    });

    // Auto-scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, statusText]);

    // Update language when it changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const speakResponse = (text, lang) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;

            utterance.onstart = () => setStatusText('Speaking...');
            utterance.onend = () => setStatusText('');

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleAskWithQuery = (searchString) => {
        if (!searchString.trim()) return;

        // Add User Message
        const userMsg = { id: Date.now(), role: 'user', content: searchString };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);
        setStatusText('Processing...');

        // Mock AI Logic with Malayalam translation hints
        setTimeout(() => {
            const lowerQuery = searchString.toLowerCase();

            // Basic Malayalam mappings to English equivalents to make finding easier
            const queryInTokens = lowerQuery
                .replace("കീ", "key")
                .replace("താക്കോൽ", "key")
                .replace("പേഴ്സ്", "wallet")
                .replace("ഫോൺ", "phone")
                .replace("എവിടെയാണ്", "")
                .replace("എവിടെ", "");

            const foundItem = items.find(item =>
                lowerQuery.includes(item.name.toLowerCase()) ||
                queryInTokens.includes(item.name.toLowerCase())
            );

            if (foundItem) {
                const enMsg = `I found your ${foundItem.name}! You kept it at: ${foundItem.location}.`;
                const mlMsg = `നിങ്ങളുടെ ${foundItem.name} ഞാൻ കണ്ടെത്തി! അത് ഇരിക്കുന്നത് ഇവിടെയാണ്: ${foundItem.location}.`;

                const finalMsg = language === 'ml-IN' ? mlMsg : enMsg;
                setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: finalMsg, success: true }]);
                speakResponse(finalMsg, language);

            } else {
                const enMsg = "I couldn't find any items matching your question in your tracker.";
                const mlMsg = "നിങ്ങളുടെ ചോദ്യത്തിന് അനുയോജ്യമായ വസ്തുക്കൾ കണ്ടെത്താൻ കഴിഞ്ഞില്ല.";

                const finalMsg = language === 'ml-IN' ? mlMsg : enMsg;
                setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: finalMsg, success: false }]);
                speakResponse(finalMsg, language);
            }
            setLoading(false);
            if (statusText === 'Processing...') setStatusText('');
        }, 1000);
    };

    const handleAsk = (e) => {
        e.preventDefault();
        handleAskWithQuery(query);
    };

    return (
        <div className="glass-panel mb-4" style={{ display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient AI Glow */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--color-primary-dark)', filter: 'blur(80px)', opacity: 0.2, zIndex: 0, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-primary)', fontSize: '1.5rem',
                        boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.2), 0 0 15px rgba(99, 102, 241, 0.4)',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                        🧠
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, background: 'var(--color-primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LostLink AI</h3>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Ask me to find anything</p>
                    </div>
                </div>

                <div style={{ display: 'flex', background: 'var(--color-surface)', borderRadius: '20px', padding: '4px', border: '1px solid rgba(156,163,175,0.2)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <button
                        onClick={() => setLanguage('en-US')}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '16px',
                            border: 'none',
                            background: language === 'en-US' ? 'var(--color-primary-gradient)' : 'transparent',
                            color: language === 'en-US' ? 'white' : 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                            fontWeight: language === 'en-US' ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: language === 'en-US' ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none'
                        }}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('ml-IN')}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '16px',
                            border: 'none',
                            background: language === 'ml-IN' ? 'var(--color-primary-gradient)' : 'transparent',
                            color: language === 'ml-IN' ? 'white' : 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                            fontWeight: language === 'ml-IN' ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: language === 'ml-IN' ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none'
                        }}
                    >
                        മലയാളം
                    </button>
                </div>
            </div>

            {/* Chat History */}
            <div style={{
                flex: 1, maxHeight: '300px', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px',
                padding: '8px 4px', zIndex: 1
            }}>
                {messages.map((msg, idx) => (
                    <div key={msg.id} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        animation: `fadeIn 0.3s ease-out ${idx * 0.05}s both`
                    }}>
                        <div style={{
                            padding: '14px 20px',
                            borderRadius: '20px',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '20px',
                            borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
                            background: msg.role === 'user' ? 'var(--color-primary-gradient)' : 'var(--color-surface)',
                            color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
                            boxShadow: msg.role === 'user' ? '0 8px 20px -6px rgba(99, 102, 241, 0.4)' : 'var(--shadow-sm)',
                            border: msg.role === 'assistant' && msg.success === false ? '1px solid rgba(239, 68, 68, 0.3)' :
                                msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            backdropFilter: msg.role === 'user' ? 'none' : 'blur(10px)',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {(statusText || loading) && (
                    <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                        <div style={{
                            padding: '8px 16px', borderRadius: '16px',
                            background: 'transparent', color: 'var(--color-text-muted)',
                            fontSize: '0.85rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <span style={{
                                display: 'inline-block', width: '8px', height: '8px',
                                background: 'var(--color-primary-dark)', borderRadius: '50%',
                                animation: 'pulse 1s infinite'
                            }} />
                            {statusText || 'Thinking...'}
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAsk} style={{
                display: 'flex', gap: '12px', alignItems: 'center',
                background: 'var(--color-surface)', padding: '8px',
                borderRadius: '50px', border: '1px solid rgba(156,163,175,0.2)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05), var(--shadow-sm)',
                zIndex: 1,
                backdropFilter: 'blur(10px)'
            }}>
                <input
                    type="text"
                    placeholder={language === 'ml-IN' ? 'ഉദാ. എന്റെ കീ എവിടെയാണ്?' : 'Ask about an item...'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 20px', outline: 'none', color: 'var(--color-text)', fontSize: '1rem' }}
                />

                <button
                    type="button"
                    onClick={toggleListen}
                    style={{
                        background: isListening ? 'var(--color-danger-gradient)' : 'transparent',
                        color: isListening ? 'white' : 'var(--color-text-muted)',
                        border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none',
                        animation: isListening ? 'pulse 1.5s infinite' : 'none'
                    }}
                    title={isListening ? "Stop listening" : "Start speaking"}
                    className="avatar-container"
                >
                    {isListening ? <FiMicOff size={22} /> : <FiMic size={22} />}
                </button>

                <button
                    type="submit"
                    disabled={loading || items.length === 0 || !query.trim()}
                    style={{
                        background: 'var(--color-primary-gradient)', color: 'white',
                        border: 'none', padding: '12px 24px', borderRadius: '50px',
                        cursor: (loading || items.length === 0 || !query.trim()) ? 'not-allowed' : 'pointer',
                        opacity: (loading || items.length === 0 || !query.trim()) ? 0.5 : 1,
                        fontWeight: 600,
                        boxShadow: (loading || items.length === 0 || !query.trim()) ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    className={(loading || items.length === 0 || !query.trim()) ? '' : 'avatar-container'}
                >
                    Ask
                </button>
            </form>
        </div>
    );
};
