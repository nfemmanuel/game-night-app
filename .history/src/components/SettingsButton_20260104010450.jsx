import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function SettingsButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, currentTheme, toggleTheme } = useTheme();

    return (
        <>
            {/* Settings Icon - Bottom Left */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: theme.bgDark,
                    border: `2px solid ${theme.light}`,
                    color: theme.textPrimary,
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
                ⚙️
            </button>

            {/* Settings Drawer with Animation */}
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

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '300px',
                                maxWidth: '80vw',
                                backgroundColor: theme.bgMedium,
                                padding: '20px',
                                zIndex: 1002,
                                boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
                                color: theme.textPrimary
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '30px'
                            }}>
                                <h2 style={{ margin: 0, color: theme.textPrimary }}>Settings</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: theme.textPrimary,
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        padding: '0'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Theme Toggle Setting */}
                            <div style={{
                                backgroundColor: theme.bgDark,
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '15px',
                                border: `2px solid ${theme.secondary}`
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }}>
                                    <span style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        color: theme.textPrimary
                                    }}>
                                        Theme
                                    </span>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: theme.textSecondary
                                    }}>
                                        {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                                    </span>
                                </div>

                                <button
                                    onClick={toggleTheme}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '1rem',
                                        backgroundColor: theme.accent,
                                        color: theme.textPrimary,
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.accentHover}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.accent}
                                >
                                    Switch to {currentTheme === 'dark' ? 'Light' : 'Dark'} Mode
                                </button>
                            </div>

                            {/* More Settings Coming Soon */}
                            <div style={{
                                backgroundColor: theme.bgDark,
                                padding: '15px',
                                borderRadius: '10px',
                                border: `2px solid ${theme.secondary}`,
                                opacity: 0.5
                            }}>
                                <p style={{
                                    margin: 0,
                                    color: theme.textSecondary,
                                    fontSize: '0.9rem'
                                }}>
                                    More settings coming soon...
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default SettingsButton;