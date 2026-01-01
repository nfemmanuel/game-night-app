import { useState } from 'react';

function HelpButton() {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div
            className="help-button-container"
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000
            }}
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
        >
            <div
                className="help-button"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    color: 'white',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#333'
                }}
            >
                ?
            </div>

            {showHelp && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50px',
                        right: '0',
                        backgroundColor: '#222',
                        border: '2px solid white',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '300px',
                        maxWidth: '90vw',
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                    }}
                >
                    <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1rem' }}>
                        How to Play Imposter
                    </h3>
                    <ol style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>Add 3+ player names</li>
                        <li>One random player is secretly the imposter</li>
                        <li>Everyone else sees the same secret word</li>
                        <li>Pass the phone around - each player holds the card to see their word</li>
                        <li>The imposter sees "You're the imposter. Shh!"</li>
                        <li>After everyone has seen their card, discuss and guess who the imposter is</li>
                        <li>Vote for the imposter or skip to reveal</li>
                    </ol>
                </div>
            )}
        </div>
    );
}

export default HelpButton;