import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function SocialButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('party');

    const tabs = [
        { id: 'party', label: 'Party', icon: '👥' },
        { id: 'chat', label: 'Chat', icon: '💬' },
        { id: 'voice', label: 'Voice', icon: '🎤' }
    ];

    return (
        <>
            {/* Social Icon - Bottom Right */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#4A90E2',
                    border: '2px solid white',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                👥
            </button>

            {/* Social Popup with Animation */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 1001
                            }}
                        />

                        {/* Popup Menu - Positioned near button */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0, transformOrigin: 'bottom right' }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            style={{
                                position: 'fixed',
                                bottom: '80px',
                                right: '20px',
                                width: '350px',
                                maxWidth: 'calc(100vw - 40px)',
                                maxHeight: 'calc(100vh - 120px)',
                                backgroundColor: '#2a2a2a',
                                borderRadius: '15px',
                                zIndex: 1002,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Header with Close Button */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px',
                                borderBottom: '1px solid #444',
                                flexShrink: 0
                            }}>
                                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Social</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        padding: '0',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Tab Navigation */}
                            <div style={{
                                display: 'flex',
                                borderBottom: '2px solid #444',
                                backgroundColor: '#1a1a1a',
                                flexShrink: 0
                            }}>
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 8px',
                                            fontSize: '0.9rem',
                                            backgroundColor: activeTab === tab.id ? '#2a2a2a' : 'transparent',
                                            color: activeTab === tab.id ? 'white' : '#999',
                                            border: 'none',
                                            borderBottom: activeTab === tab.id ? '3px solid #4A90E2' : '3px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontFamily: 'inherit',
                                            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '5px',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                                        <span style={{ fontSize: '0.8rem' }}>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div style={{
                                flex: 1,
                                padding: '15px',
                                overflowY: 'auto',
                                minHeight: 0
                            }}>
                                {activeTab === 'party' && (
                                    <div>
                                        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Party Members</h3>
                                        <p style={{ color: '#999', fontSize: '0.9rem' }}>Party system coming soon...</p>
                                    </div>
                                )}

                                {activeTab === 'chat' && (
                                    <div>
                                        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Group Chat</h3>
                                        <p style={{ color: '#999', fontSize: '0.9rem' }}>Chat system coming soon...</p>
                                    </div>
                                )}

                                {activeTab === 'voice' && (
                                    <div>
                                        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Voice Chat</h3>
                                        <p style={{ color: '#999', fontSize: '0.9rem' }}>Voice chat coming soon...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default SocialButton;