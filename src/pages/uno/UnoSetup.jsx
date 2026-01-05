import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';

function UnoSetup() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [playerName, setPlayerName] = useState('Player 1');
    const [numPlayers, setNumPlayers] = useState(2);
    const [difficulty, setDifficulty] = useState('medium');
    const [showCardCount, setShowCardCount] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    const maxPlayers = 6;
    const isMobile = window.innerWidth <= 768;

    const startGame = () => {
        navigate('/uno-game', {
            state: {
                playerName,
                numPlayers,
                difficulty,
                showCardCount
            }
        });
    };

    const instructions = `
🎴 UNO RULES

OBJECTIVE:
Be the first player to get rid of all your cards!

HOW TO PLAY:
1. Match the top card by COLOR or NUMBER
2. If you can't play, DRAW a card
3. Special cards have unique effects

SPECIAL CARDS:
🚫 SKIP - Next player loses their turn
🔄 REVERSE - Change direction of play
+2 DRAW TWO - Next player draws 2 cards and loses turn
🌈 WILD - Change the current color
+4 WILD DRAW FOUR - Change color + next player draws 4 and loses turn

IMPORTANT RULE:
When you have only ONE card left, you must say "UNO!"
(The game does this automatically with a big announcement)

WINNING:
First player to play all their cards wins!
    `.trim();

    return (
        <div style={{
            minHeight: '100vh',
            height: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: isMobile ? '10px' : '20px'
        }}>
            <BackButton to="/" />
            <HelpButton helpText="Configure your UNO game settings before starting!" />

            {/* Title Section */}
            <div style={{
                flex: '0 0 auto',
                textAlign: 'center',
                marginTop: '50px',
                marginBottom: isMobile ? '10px' : '20px'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: isMobile ? '1.5rem' : '2rem'
                }}>
                    UNO - GAME SETUP
                </h1>
            </div>

            {/* Scrollable Content Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '10px' : '15px',
                maxWidth: '600px',
                width: '100%',
                margin: '0 auto',
                overflow: 'auto',
                paddingBottom: '10px'
            }}>
                {/* Player Name Input */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: isMobile ? '12px' : '20px',
                    borderRadius: '10px',
                    border: `2px solid ${theme.secondary}`,
                    flex: '0 0 auto'
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: isMobile ? '6px' : '10px',
                        color: theme.textPrimary
                    }}>
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        style={{
                            width: '100%',
                            padding: isMobile ? '10px' : '12px',
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            borderRadius: '5px',
                            border: `2px solid ${theme.light}`,
                            backgroundColor: theme.bgMedium,
                            color: theme.textPrimary,
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                {/* Number of Players */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: isMobile ? '12px' : '20px',
                    borderRadius: '10px',
                    border: `2px solid ${theme.secondary}`,
                    flex: '0 0 auto'
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: isMobile ? '8px' : '15px',
                        color: theme.textPrimary
                    }}>
                        Number of Players (2-{maxPlayers})
                    </label>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: isMobile ? '15px' : '20px'
                    }}>
                        <button
                            onClick={() => numPlayers > 2 && setNumPlayers(numPlayers - 1)}
                            disabled={numPlayers <= 2}
                            style={{
                                width: isMobile ? '40px' : '50px',
                                height: isMobile ? '40px' : '50px',
                                fontSize: isMobile ? '1.5rem' : '2rem',
                                backgroundColor: numPlayers > 2 ? theme.accent : theme.textDisabled,
                                color: theme.textPrimary,
                                border: 'none',
                                borderRadius: '5px',
                                cursor: numPlayers > 2 ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit',
                                fontWeight: 'bold'
                            }}
                        >
                            −
                        </button>

                        <div style={{
                            fontSize: isMobile ? '2rem' : '2.5rem',
                            fontWeight: 'bold',
                            minWidth: isMobile ? '60px' : '80px',
                            textAlign: 'center',
                            color: theme.textPrimary
                        }}>
                            {numPlayers}
                        </div>

                        <button
                            onClick={() => numPlayers < maxPlayers && setNumPlayers(numPlayers + 1)}
                            disabled={numPlayers >= maxPlayers}
                            style={{
                                width: isMobile ? '40px' : '50px',
                                height: isMobile ? '40px' : '50px',
                                fontSize: isMobile ? '1.5rem' : '2rem',
                                backgroundColor: numPlayers < maxPlayers ? theme.accent : theme.textDisabled,
                                color: theme.textPrimary,
                                border: 'none',
                                borderRadius: '5px',
                                cursor: numPlayers < maxPlayers ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit',
                                fontWeight: 'bold'
                            }}
                        >
                            +
                        </button>
                    </div>

                    <p style={{
                        marginTop: isMobile ? '8px' : '15px',
                        fontSize: isMobile ? '0.8rem' : '1rem',
                        color: theme.textSecondary,
                        textAlign: 'center',
                        margin: '8px 0 0 0'
                    }}>
                        You vs {numPlayers - 1} CPU opponent{numPlayers > 2 ? 's' : ''}
                    </p>
                </div>

                {/* Difficulty Selection */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: isMobile ? '12px' : '20px',
                    borderRadius: '10px',
                    border: `2px solid ${theme.secondary}`,
                    flex: '0 0 auto'
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: isMobile ? '8px' : '15px',
                        color: theme.textPrimary
                    }}>
                        Difficulty
                    </label>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile ? '6px' : '10px'
                    }}>
                        {['easy', 'medium', 'hard'].map(diff => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                style={{
                                    padding: isMobile ? '10px 15px' : '15px 20px',
                                    fontSize: isMobile ? '0.9rem' : '1.1rem',
                                    backgroundColor: difficulty === diff ? theme.accent : theme.bgMedium,
                                    color: theme.textPrimary,
                                    border: `2px solid ${difficulty === diff ? theme.accent : theme.textDisabled}`,
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontWeight: difficulty === diff ? 'bold' : 'normal',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Show Card Count Toggle */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: isMobile ? '12px' : '20px',
                    borderRadius: '10px',
                    border: `2px solid ${theme.secondary}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: '0 0 auto'
                }}>
                    <label style={{
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        fontWeight: 'bold',
                        color: theme.textPrimary
                    }}>
                        Show Card Count
                    </label>
                    <button
                        onClick={() => setShowCardCount(!showCardCount)}
                        style={{
                            padding: isMobile ? '8px 16px' : '10px 20px',
                            fontSize: isMobile ? '0.8rem' : '1rem',
                            backgroundColor: showCardCount ? theme.success : theme.textDisabled,
                            color: theme.textPrimary,
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: 'bold'
                        }}
                    >
                        {showCardCount ? 'ON' : 'OFF'}
                    </button>
                </div>

                {/* Instructions Button */}
                <button
                    onClick={() => setShowInstructions(true)}
                    style={{
                        padding: isMobile ? '12px' : '15px',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        backgroundColor: theme.secondary,
                        color: theme.textPrimary,
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontWeight: 'bold',
                        flex: '0 0 auto'
                    }}
                >
                    📖 How to Play
                </button>

                {/* Start Game Button */}
                <button
                    onClick={startGame}
                    disabled={!playerName.trim()}
                    style={{
                        padding: isMobile ? '15px' : '20px',
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        backgroundColor: playerName.trim() ? theme.success : theme.textDisabled,
                        color: theme.textPrimary,
                        border: 'none',
                        borderRadius: '5px',
                        cursor: playerName.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit',
                        fontWeight: 'bold',
                        opacity: playerName.trim() ? 1 : 0.5,
                        flex: '0 0 auto'
                    }}
                >
                    Start Game
                </button>
            </div>

            {/* Instructions Modal */}
            {showInstructions && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: theme.bgMedium,
                        padding: isMobile ? '20px' : '30px',
                        borderRadius: '15px',
                        border: `3px solid ${theme.light}`,
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowInstructions(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                color: theme.textPrimary,
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '5px 10px'
                            }}
                        >
                            ✕
                        </button>

                        <pre style={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            fontSize: isMobile ? '0.85rem' : '1rem',
                            lineHeight: '1.6',
                            color: theme.textPrimary,
                            margin: 0
                        }}>
                            {instructions}
                        </pre>

                        <button
                            onClick={() => setShowInstructions(false)}
                            style={{
                                width: '100%',
                                padding: isMobile ? '12px' : '15px',
                                fontSize: isMobile ? '1rem' : '1.2rem',
                                backgroundColor: theme.accent,
                                color: theme.textPrimary,
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '20px',
                                fontFamily: 'inherit',
                                fontWeight: 'bold'
                            }}
                        >
                            Got It!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnoSetup;