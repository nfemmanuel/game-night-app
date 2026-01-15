    import { useLocation, useNavigate } from 'react-router-dom';
    import { useState } from 'react';
    import BackButton from '../../components/BackButton';
    import HelpButton from '../../components/HelpButton';
    import { useTheme } from '../../contexts/ThemeContext';
    import SettingsButton from '../../components/SettingsButton';
    import SocialButton from '../../components/SocialButton';

    function ImposterVoting() {
        const location = useLocation();
        const navigate = useNavigate();
        const { theme } = useTheme();
        const { players, imposter, word } = location.state || {};

        const [guess, setGuess] = useState('');
        const [revealed, setRevealed] = useState(false);
        const [isCorrect, setIsCorrect] = useState(false);
        const [skipped, setSkipped] = useState(false);

        const isMobile = window.innerWidth <= 768;

        const [nextStarter] = useState(() =>
            players ? players[Math.floor(Math.random() * players.length)] : null
        );

        const handleSubmit = (e) => {
            e.preventDefault();
            if (guess.trim()) {
                const correct = guess.trim().toLowerCase() === imposter.toLowerCase();
                setIsCorrect(correct);
                setRevealed(true);
            }
        };

        const revealImposter = () => {
            setSkipped(true);
            setRevealed(true);
        };

        const playAgain = () => {
            navigate('/imposter-setup', {
                state: { players }
            });
        };

        if (!players || !imposter) {
            navigate('/imposter-setup');
            return null;
        }

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
                <HelpButton helpText="Vote for who you think the imposter was! Or skip to reveal the answer." />

                {/* SECTION 1: Title */}
                <div style={{
                    textAlign: 'center',
                    paddingBottom: '10px',
                    flexShrink: 0,
                    marginTop: isMobile ? '50px' : '10px'
                }}>
                    <h1 className="page-title">IMPOSTER - VOTING</h1>
                </div>

                {/* SECTION 2: Content (Centered) */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0
                }}>
                    <div style={{
                        maxWidth: '600px',
                        width: '100%',
                        textAlign: 'center',
                        padding: '0 10px'
                    }}>
                        {!revealed ? (
                            <>
                                <div style={{
                                    backgroundColor: theme.bgDark,
                                    padding: isMobile ? '20px' : '30px',
                                    borderRadius: '15px',
                                    marginBottom: isMobile ? '30px' : '40px',
                                    border: `2px solid ${theme.secondary}`
                                }}>
                                    <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', marginBottom: '10px', color: theme.textSecondary }}>
                                        Next round starts with:
                                    </p>
                                    <p style={{ fontSize: isMobile ? '2rem' : '2.5rem', color: theme.secondary, fontWeight: 'bold' }}>
                                        {nextStarter}
                                    </p>
                                </div>

                                <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', marginBottom: isMobile ? '20px' : '30px', color: theme.textSecondary }}>
                                    Who do you think was the imposter?
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        value={guess}
                                        onChange={(e) => setGuess(e.target.value)}
                                        placeholder="Enter player name"
                                        style={{
                                            padding: isMobile ? '12px' : '15px',
                                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                                            borderRadius: '5px',
                                            border: `2px solid ${theme.light}`,
                                            width: '100%',
                                            maxWidth: '400px',
                                            fontFamily: 'inherit',
                                            backgroundColor: theme.bgDark,
                                            color: theme.textPrimary,
                                            textAlign: 'center',
                                            marginBottom: '20px'
                                        }}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: isMobile ? '15px 30px' : '20px 40px',
                                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                                            backgroundColor: theme.accent,
                                            color: theme.textPrimary,
                                            cursor: 'pointer',
                                            width: '100%',
                                            maxWidth: '400px',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        Submit Guess
                                    </button>
                                </form>

                                <button
                                    onClick={revealImposter}
                                    style={{
                                        padding: isMobile ? '12px 24px' : '15px 30px',
                                        fontSize: isMobile ? '1rem' : '1.2rem',
                                        backgroundColor: 'transparent',
                                        border: `2px solid ${theme.textDisabled}`,
                                        color: theme.textSecondary,
                                        cursor: 'pointer',
                                        width: '100%',
                                        maxWidth: '400px',
                                        borderRadius: '5px'
                                    }}
                                >
                                    Skip Vote - Reveal Imposter
                                </button>

                                <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: theme.textDisabled, marginTop: isMobile ? '20px' : '30px' }}>
                                    Players: {players.join(', ')}
                                </p>
                            </>
                        ) : (
                            <>
                                {!skipped && (
                                    <div style={{
                                        fontSize: isMobile ? '2.5rem' : '3rem',
                                        marginBottom: isMobile ? '20px' : '30px',
                                        color: isCorrect ? theme.success : theme.danger
                                    }}>
                                        {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
                                    </div>
                                )}

                                <p style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', marginBottom: '20px', color: theme.textPrimary }}>
                                    The imposter was: <strong style={{ color: theme.danger }}>{imposter}</strong>
                                </p>

                                <p style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', marginBottom: isMobile ? '30px' : '40px', color: theme.secondary }}>
                                    The word was: <strong>{word}</strong>
                                </p>

                                {!skipped && (
                                    isCorrect ? (
                                        <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: theme.success, marginBottom: isMobile ? '30px' : '40px' }}>
                                            Great detective work! 🕵️
                                        </p>
                                    ) : (
                                        <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: theme.danger, marginBottom: isMobile ? '30px' : '40px' }}>
                                            The imposter fooled you! 🎭
                                        </p>
                                    )
                                )}

                                <button
                                    onClick={playAgain}
                                    style={{
                                        padding: isMobile ? '15px 30px' : '20px 40px',
                                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                                        backgroundColor: theme.success,
                                        color: theme.textPrimary,
                                        cursor: 'pointer',
                                        borderRadius: '5px',
                                        width: isMobile ? '100%' : 'auto',
                                        maxWidth: isMobile ? '300px' : 'none'
                                    }}
                                >
                                    Play Again
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Settings Button */}
                <SettingsButton />
                <SocialButton />
            </div>
        );
    }

    export default ImposterVoting;