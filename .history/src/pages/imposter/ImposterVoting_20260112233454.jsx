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
    
    // Support both old (imposter) and new (imposters) format
    const { players, imposter, imposters, word } = location.state || {};
    const actualImposters = imposters || (imposter ? [imposter] : []);

    const [guess, setGuess] = useState('');
    const [foundImposters, setFoundImposters] = useState([]); // Correctly guessed imposters
    const [revealed, setRevealed] = useState(false);

    const isMobile = window.innerWidth <= 768;

    const [nextStarter] = useState(() =>
        players ? players[Math.floor(Math.random() * players.length)] : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guess.trim()) return;

        // Check if guess matches any remaining imposter
        const guessLower = guess.trim().toLowerCase();
        const matchingImposter = actualImposters.find(
            imp => imp.toLowerCase() === guessLower && !foundImposters.includes(imp)
        );

        if (matchingImposter) {
            const newFound = [...foundImposters, matchingImposter];
            setFoundImposters(newFound);
            
            // If all imposters found, reveal
            if (newFound.length === actualImposters.length) {
                setRevealed(true);
            }
        }
        
        setGuess(''); // Clear input for next guess
    };

    const revealAll = () => {
        setRevealed(true);
    };

    const playAgain = () => {
        navigate('/imposter-setup', {
            state: { players }
        });
    };

    if (!players || actualImposters.length === 0) {
        navigate('/imposter-setup');
        return null;
    }

    const remainingImposters = actualImposters.length - foundImposters.length;
    const allFound = foundImposters.length === actualImposters.length;

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            overflow: 'hidden'
        }}>
            <BackButton to="/imposter-setup" preserveState={true} />
            <HelpButton helpText={
                actualImposters.length > 1
                    ? "Guess the imposters one by one, or skip to reveal all!"
                    : "Guess who the imposter was, or skip to reveal!"
            } />

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
                minHeight: 0,
                overflowY: 'auto'
            }}>
                <div style={{
                    maxWidth: '600px',
                    width: '100%',
                    textAlign: 'center',
                    padding: '0 10px'
                }}>
                    {!revealed ? (
                        <>
                            {/* Next Starter Info */}
                            <div style={{
                                backgroundColor: theme.bgDark,
                                padding: isMobile ? '20px' : '30px',
                                borderRadius: '15px',
                                marginBottom: isMobile ? '20px' : '30px',
                                border: `2px solid ${theme.secondary}`
                            }}>
                                <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', marginBottom: '10px', color: theme.textSecondary }}>
                                    Next round starts with:
                                </p>
                                <p style={{ fontSize: isMobile ? '2rem' : '2.5rem', color: theme.secondary, fontWeight: 'bold' }}>
                                    {nextStarter}
                                </p>
                            </div>

                            {/* Progress Indicator (for multiple imposters) */}
                            {actualImposters.length > 1 && (
                                <div style={{
                                    backgroundColor: theme.bgDark,
                                    padding: '15px',
                                    borderRadius: '10px',
                                    marginBottom: '20px',
                                    border: `2px solid ${theme.accent}`
                                }}>
                                    <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: theme.textSecondary }}>
                                        Found: <strong style={{ color: theme.success }}>{foundImposters.length}</strong> of <strong>{actualImposters.length}</strong> imposters
                                    </p>
                                    {foundImposters.length > 0 && (
                                        <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: theme.success, marginTop: '5px' }}>
                                            ✓ {foundImposters.join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Guessing Prompt */}
                            <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', marginBottom: isMobile ? '20px' : '30px', color: theme.textSecondary }}>
                                {remainingImposters > 1 
                                    ? `Who was an imposter? (${remainingImposters} remaining)`
                                    : remainingImposters === 1
                                    ? "Who was the last imposter?"
                                    : "Who was the imposter?"
                                }
                            </p>

                            {/* Guess Input */}
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

                            {/* Skip/Reveal Button */}
                            <button
                                onClick={revealAll}
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
                                {foundImposters.length > 0 ? 'Give Up - Reveal All' : 'Skip Vote - Reveal All'}
                            </button>

                            {/* Player List */}
                            <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: theme.textDisabled, marginTop: isMobile ? '20px' : '30px' }}>
                                Players: {players.join(', ')}
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Results Screen */}
                            <div style={{
                                backgroundColor: theme.bgDark,
                                padding: isMobile ? '20px' : '30px',
                                borderRadius: '15px',
                                marginBottom: isMobile ? '20px' : '30px',
                                border: `2px solid ${theme.danger}`
                            }}>
                                <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '15px', color: theme.textSecondary }}>
                                    {actualImposters.length > 1 ? 'The imposters were:' : 'The imposter was:'}
                                </p>
                                {actualImposters.map((imp, index) => (
                                    <p key={index} style={{ 
                                        fontSize: isMobile ? '1.8rem' : '2.2rem', 
                                        marginBottom: '10px', 
                                        color: theme.danger,
                                        fontWeight: 'bold'
                                    }}>
                                        {foundImposters.includes(imp) && '✓ '}{imp}
                                    </p>
                                ))}
                            </div>

                            {/* Word Reveal */}
                            <p style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', marginBottom: isMobile ? '20px' : '30px', color: theme.secondary }}>
                                The word was: <strong>{word}</strong>
                            </p>

                            {/* Results Message */}
                            {allFound && !revealed && (
                                <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: theme.success, marginBottom: isMobile ? '20px' : '30px' }}>
                                    You found all the imposters! 🕵️
                                </p>
                            )}
                            {foundImposters.length > 0 && foundImposters.length < actualImposters.length && (
                                <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: theme.accent, marginBottom: isMobile ? '20px' : '30px' }}>
                                    You found {foundImposters.length} of {actualImposters.length}! 🎭
                                </p>
                            )}
                            {foundImposters.length === 0 && (
                                <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: theme.textSecondary, marginBottom: isMobile ? '20px' : '30px' }}>
                                    The imposters fooled everyone! 🎭
                                </p>
                            )}

                            {/* Play Again Button */}
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