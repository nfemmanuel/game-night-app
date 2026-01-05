import { useState } from 'react';

function SettingsButton() {
    const [isOpen, setIsOpen] = useState(false);

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
                    backgroundColor: '#333',
                    border: '2px solid white',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ⚙️
            </button>

            {/* Settings Drawer */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
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
                    <div
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '300px',
                            maxWidth: '80vw',
                            backgroundColor: '#2a2a2a',
                            padding: '20px',
                            zIndex: 1002,
                            boxShadow: '2px 0 10px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2 style={{ margin: 0 }}>Settings</h2>
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

                        <p style={{ color: '#999' }}>Settings coming soon...</p>
                    </div>
                </>
            )}
        </>
    );
}

export default SettingsButton;