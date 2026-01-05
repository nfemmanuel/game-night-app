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
    const [showInstructions, setShowInstructions] = useState(false);

    const maxPlayers = 6; // Can be 2-6 players

    const startGame = () => {
        navigate('/uno-game', {
            state: {
                playerName,
                numPlayers,
                difficulty
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
(Don't worry, the game does this automatically)

WINNING:
First player to play all their cards wins!
    `.trim();

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <BackButton to="/" />
            <HelpButton helpText="Configure your UNO game settings before starting!" />

            <div style={{
                marginTop: '60px',
                maxWidth: '600px',
                margin: '60px auto 0',
                width: '100%',
                padding: '0 20px'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
                    UNO - GAME SETUP
                </h1>

                {/* Player Name Input */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    border: `2px solid ${theme.secondary}`
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: '10px',
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
                            padding: '12px',
                            fontSize: '1.1rem',
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
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    border: `2px solid ${theme.secondary}`
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: theme.textPrimary
                    }}>
                        Number of Players (2-{maxPlayers})
                    </label>
                    <input
                        type="number"
                        min="2"
                        max={maxPlayers}
                        value={numPlayers}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 2 && val <= maxPlayers) {
                                setNumPlayers(val);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '1.1rem',
                            borderRadius: '5px',
                            border: `2px solid ${theme.light}`,
                            backgroundColor: theme.bgMedium,
                            color: theme.textPrimary,
                            fontFamily: 'inherit'
                        }}
                    />
                    <p style={{
                        marginTop: '10px',
                        fontSize: '0.9rem',
                        color: theme.textSecondary
                    }}>
                        You vs {numPlayers - 1} CPU opponent{numPlayers > 2 ? 's' : ''}
                    </p>
                </div>

                {/* Difficulty Selection */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    border: `2px solid ${theme.secondary}`
                }}>
                    <label style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                        color: theme.textPrimary
                    }}>
                        Difficulty
                    </label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {['easy', 'medium', 'hard'].map(diff => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                style={{
                                    flex: 1,
                                    minWidth: '100px',
                                    padding: '12px 20px',
                                    fontSize: '1rem',
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

                {/* Instructions Button */}
                <button
                    onClick={() => setShowInstructions(true)}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '1.1rem',
                        backgroundColor: theme.secondary,
                        color: theme.textPrimary,
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        fontFamily: 'inherit',
                        fontWeight: 'bold'
                    }}
                >
                    📖 How to Play
                </button>

                {/* Start Game Button */}
                <button
                    onClick={startGame}
                    disabled={!playerName.trim()}
                    style={{
                        width: '100%',
                        padding: '20px',
                        fontSize: '1.5rem',
                        backgroundColor: playerName.trim() ? theme.success : theme.textDisabled,
                        color: theme.textPrimary,
                        border: 'none',
                        borderRadius: '5px',
                        cursor: playerName.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit',
                        fontWeight: 'bold',
                        opacity: playerName.trim() ? 1 : 0.5
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
                        padding: '30px',
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
                            fontSize: '1rem',
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
                                padding: '15px',
                                fontSize: '1.2rem',
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