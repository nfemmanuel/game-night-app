import { useState } from 'react';

function HelpButton({ helpText }) {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
            <button
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
                onClick={() => setShowHelp(!showHelp)}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#333',
                    border: '2px solid white',
                    color: 'white',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ?
            </button>

            {showHelp && helpText && (
                <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '10px',
                    maxWidth: '250px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    fontSize: '0.9rem',
                    border: '1px solid #555',
                    zIndex: 1001
                }}>
                    {helpText}
                </div>
            )}
        </div>
    );
}

export default HelpButton;