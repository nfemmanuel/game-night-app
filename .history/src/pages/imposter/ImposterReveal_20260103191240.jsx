import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { wordList } from '../.. data/wordList';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';

function ImposterReveal() {
    const location = useLocation();
    const navigate = useNavigate();
    const players = location.state?.players || [];

    // Pick random imposter and word (only once)
    const [imposter] = useState(() =>
        players.length > 0 ? players[Math.floor(Math.random() * players.length)] : null
    );
    const [word] = useState(() =>
        wordList[Math.floor(Math.random() * wordList.length)]
    );

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [canProceed, setCanProceed] = useState(false);

    // Redirect if no players (AFTER all hooks)
    useEffect(() => {
        if (players.length === 0) {
            navigate('/imposter-setup');
        }
    }, [players.length, navigate]);

    // Timer: Enable Next button 1 second after revealing
    useEffect(() => {
        if (isRevealed) {
            const timer = setTimeout(() => {
                setCanProceed(true);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [isRevealed]);

    // Don't render if no players
    if (players.length === 0) {
        return null;
    }

    const currentPlayer = players[currentPlayerIndex];
    const isImposter = currentPlayer === imposter;

    const handlePressStart = () => {
        setIsRevealed(true);
    };

    const handlePressEnd = () => {
        setIsRevealed(false);
    };

    const nextPlayer = () => {
        if (!canProceed) return; // Don't allow if timer hasn't finished

        setIsRevealed(false);
        setCanProceed(false); // Reset for next player

        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            // Game complete - go to voting
            navigate('/imposter-voting', {
                state: { players, imposter, word }
            });
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
            <BackButton to="/imposter-setup" preserveState={true} />
            <HelpButton />

            <h1 className="page-title">IMPOSTER</h1>
            <p style={{ fontSize: '1.2rem', color: '#999', marginBottom: '20px' }}>
                Player {currentPlayerIndex + 1} of {players.length}
            </p>

            <p style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FF6B35' }}>
                Hold to reveal
            </p>

            <div
                className="reveal-card"
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

            <button
                onClick={nextPlayer}
                disabled={!canProceed}
                style={{
                    marginTop: '40px',
                    padding: '20px 40px',
                    fontSize: '1.5rem',
                    backgroundColor: canProceed ? '#4CAF50' : '#666',
                    color: 'white',
                    cursor: canProceed ? 'pointer' : 'not-allowed',
                    opacity: canProceed ? 1 : 0.5
                }}
            >
                {currentPlayerIndex < players.length - 1 ? 'Next Player' : 'Finish Game'}
            </button>
        </div>
    );
}

export default ImposterReveal;