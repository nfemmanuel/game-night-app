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

                        {/* Popup Menu */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '400px',
                                maxWidth: '90vw',
                                maxHeight: '80vh',
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
                                padding: '20px',
                                borderBottom: '1px solid #444'
                            }}>
                                <h2 style={{ margin: 0 }}>Social</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        padding: '0'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Tab Navigation */}
                            <div style={{
                                display: 'flex',
                                borderBottom: '2px solid #444',
                                backgroundColor: '#1a1a1a'
                            }}>
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            flex: 1,
                                            padding: '15px',
                                            fontSize: '1rem',
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
                                            gap: '5px'
                                        }}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div style={{
                                flex: 1,
                                padding: '20px',
                                overflowY: 'auto'
                            }}>
                                {activeTab === 'party' && (
                                    <div>
                                        <h3 style={{ marginTop: 0 }}>Party Members</h3>
                                        <p style={{ color: '#999' }}>Party system coming soon...</p>
                                    </div>
                                )}

                                {activeTab === 'chat' && (
                                    <div>
                                        <h3 style={{ marginTop: 0 }}>Group Chat</h3>
                                        <p style={{ color: '#999' }}>Chat system coming soon...</p>
                                    </div>
                                )}

                                {activeTab === 'voice' && (
                                    <div>
                                        <h3 style={{ marginTop: 0 }}>Voice Chat</h3>
                                        <p style={{ color: '#999' }}>Voice chat coming soon...</p>
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