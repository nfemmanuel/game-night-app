import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { wordList } from '../data/wordList';

function ImposterReveal() {
    const location = useLocation();
    const navigate = useNavigate();
    const players = location.state?.players || [];

    // If no players, redirect back to setup
    if (players.length === 0) {
        navigate('/imposter-setup');
        return null;
    }

    // Pick random imposter and word (only once)
    const [imposter] = useState(players[Math.floor(Math.random() * players.length)]);
    const [word] = useState(wordList[Math.floor(Math.random() * wordList.length)]);

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);

    const currentPlayer = players[currentPlayerIndex];
    const isImposter = currentPlayer === imposter;

    const handlePressStart = () => {
        setIsRevealed(true);
    };

    const handlePressEnd = () => {
        setIsRevealed(false);
    };

    const nextPlayer = () => {
        setIsRevealed(false);
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            // Game complete - go back to landing or show end screen
            navigate('/');
        }
    };

    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <h1>IMPOSTER</h1>
            <p style={{ fontSize: '1.2rem', color: '#999', marginBottom: '20px' }}>
                Player {currentPlayerIndex + 1} of {players.length}
            </p>

            <p style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FF6B35' }}>
                Hold to reveal
            </p>

            <div
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: isRevealed ? (isImposter ? '#E74C3C' : '#4A90E2') : '#333',
                    border: '10px solid white',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                }}
            >
                <h2 style={{ fontSize: '3rem', marginBottom: '30px' }}>
                    {currentPlayer}
                </h2>

                {isRevealed && (
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        {isImposter ? (
                            <p>You're the imposter.<br />Shh! 🤫</p>
                        ) : (
                            <p>{word}</p>
                        )}
                    </div>
                )}

                {!isRevealed && (
                    <p style={{ fontSize: '1.2rem', color: '#999' }}>
                        Press and hold this card
                    </p>
                )}
            </div>

            {isRevealed && (
                <button
                    onClick={nextPlayer}
                    style={{
                        marginTop: '40px',
                        padding: '20px 40px',
                        fontSize: '1.5rem',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    {currentPlayerIndex < players.length - 1 ? 'Next Player' : 'Finish Game'}
                </button>
            )}
        </div>
    );
}

export default ImposterReveal;