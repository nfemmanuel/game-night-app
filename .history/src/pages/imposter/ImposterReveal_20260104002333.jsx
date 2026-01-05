import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { wordList } from '../../data/wordList';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import { useTheme } from '../../contexts/ThemeContext';

function ImposterReveal() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const players = location.state?.players || [];

    const [imposter] = useState(() =>
        players.length > 0 ? players[Math.floor(Math.random() * players.length)] : null
    );
    const [word] = useState(() =>
        wordList[Math.floor(Math.random() * wordList.length)]
    );

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [canProceed, setCanProceed] = useState(false);

    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        if (players.length === 0) {
            navigate('/imposter-setup');
        }
    }, [players.length, navigate]);

    useEffect(() => {
        if (isRevealed) {
            const timer = setTimeout(() => {
                setCanProceed(true);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [isRevealed]);

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
        if (!canProceed) return;

        setIsRevealed(false);
        setCanProceed(false);

        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            navigate('/imposter-voting', {
                state: { players, imposter, word }
            });
        }
    };

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary
        }}>
            <BackButton to="/imposter-setup" preserveState={true} />
            <HelpButton helpText="Press and hold the card to reveal your role. If you see a word, remember it! If you're the imposter, stay quiet!" />

            {/* SECTION 1: Title + Info */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0,
                marginTop: isMobile ? '50px' : '10px'
            }}>
                <h1 className="page-title">IMPOSTER</h1>
                <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: theme.textSecondary, margin: '10px 0' }}>
                    Player {currentPlayerIndex + 1} of {players.length}
                </p>
                <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: theme.accent, margin: '10px 0' }}>
                    Hold to reveal
                </p>
            </div>

            {/* SECTION 2: Reveal Card (Centered) */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '20px',
                minHeight: 0
            }}>
                <div
                    className="reveal-card"
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    style={{
                        width: isMobile ? '280px' : '350px',
                        height: isMobile ? '400px' : '500px',
                        backgroundColor: isRevealed ? (isImposter ? theme.danger : theme.secondary) : theme.bgDark,
                        border: `${isMobile ? '5px' : '10px'} solid ${theme.light}`,
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
                    <h2 style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '30px', color: theme.textPrimary }}>
                        {currentPlayer}
                    </h2>

                    {isRevealed && (
                        <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', color: theme.textPrimary, textAlign: 'center', padding: '0 20px' }}>
                            {isImposter ? (
                                <p>You're the imposter.<br />Shh! 🤫</p>
                            ) : (
                                <p>{word}</p>
                            )}
                        </div>
                    )}

                    {!isRevealed && (
                        <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: theme.textSecondary }}>
                            Press and hold this card
                        </p>
                    )}
                </div>

                {/* SECTION 3: Next Button */}
                <button
                    onClick={nextPlayer}
                    disabled={!canProceed}
                    style={{
                        padding: isMobile ? '15px 30px' : '20px 40px',
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        backgroundColor: canProceed ? theme.success : theme.textDisabled,
                        color: theme.textPrimary,
                        cursor: canProceed ? 'pointer' : 'not-allowed',
                        opacity: canProceed ? 1 : 0.5,
                        flexShrink: 0,
                        width: isMobile ? '100%' : 'auto',
                        maxWidth: isMobile ? '300px' : 'none'
                    }}
                >
                    {currentPlayerIndex < players.length - 1 ? 'Next Player' : 'Finish Game'}
                </button>
            </div>
        </div>
    );
}

export default ImposterReveal;