import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import UnoCard from '../../components/uno/UnoCard';
import Card from '../../logic/uno/Card';

function UnoNMSetup() {
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
        navigate('/uno-nm-game', {
            state: {
                playerName,
                numPlayers,
                difficulty,
                showCardCount
            }
        });
    };

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
            <HelpButton helpText="Configure your UNO NO MERCY game - the most brutal UNO ever!" />

            {/* Title Section */}
            <div style={{
                flex: '0 0 auto',
                textAlign: 'center',
                marginTop: '50px',
                marginBottom: isMobile ? '10px' : '20px'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: isMobile ? '1.3rem' : '2rem',
                    color: theme.danger
                }}>
                    UNO NO MERCY 🔥
                </h1>
                <p style={{
                    fontSize: isMobile ? '0.8rem' : '1rem',
                    color: theme.textSecondary,
                    margin: '5px 0 0 0'
                }}>
                    SHOW NO MERCY
                </p>
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
                    border: `2px solid ${theme.danger}`,
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
                    border: `2px solid ${theme.danger}`,
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
                                backgroundColor: numPlayers > 2 ? theme.danger : theme.textDisabled,
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
                                backgroundColor: numPlayers < maxPlayers ? theme.danger : theme.textDisabled,
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
                    border: `2px solid ${theme.danger}`,
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
                                    backgroundColor: difficulty === diff ? theme.danger : theme.bgMedium,
                                    color: theme.textPrimary,
                                    border: `2px solid ${difficulty === diff ? theme.danger : theme.textDisabled}`,
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
                    border: `2px solid ${theme.danger}`,
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
                        backgroundColor: playerName.trim() ? theme.danger : theme.textDisabled,
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
                    SHOW NO MERCY 🔥
                </button>
            </div>

            {/* Instructions Modal with Card Images */}
            {showInstructions && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    overflow: 'auto'
                }}>
                    <div style={{
                        backgroundColor: theme.bgMedium,
                        padding: isMobile ? '20px' : '30px',
                        borderRadius: '15px',
                        border: `3px solid ${theme.danger}`,
                        maxWidth: '800px',
                        maxHeight: '90vh',
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
                                padding: '5px 10px',
                                zIndex: 10
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            color: theme.danger,
                            fontSize: isMobile ? '1.3rem' : '1.8rem'
                        }}>
                            UNO NO MERCY RULES 🔥
                        </h2>

                        <div style={{
                            lineHeight: '1.8',
                            fontSize: isMobile ? '0.85rem' : '1rem'
                        }}>
                            {/* Objective */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: theme.accent, marginBottom: '10px' }}>OBJECTIVE:</h3>
                                <p>Win by getting rid of all your cards OR be the last player standing after others are eliminated!</p>
                            </div>

                            {/* Special Number Cards */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: theme.accent, marginBottom: '15px' }}>SPECIAL NUMBER CARDS:</h3>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                    <UnoCard card={new Card('red', '0', 'number')} size="small" />
                                    <div>
                                        <strong>0 Card (↻):</strong> ALL players pass their hands to the next player in the current direction of play!
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                    <UnoCard card={new Card('blue', '7', 'number')} size="small" />
                                    <div>
                                        <strong>7 Card (⇄):</strong> Swap your ENTIRE hand with any other player of your choice!
                                    </div>
                                </div>
                            </div>

                            {/* New Action Cards */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: theme.accent, marginBottom: '15px' }}>NEW ACTION CARDS:</h3>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                    <UnoCard card={new Card('green', 'skip_everyone', 'action')} size="small" />
                                    <div>
                                        <strong>Skip Everyone:</strong> Everyone else is skipped - you play again immediately!
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                    <UnoCard card={new Card('yellow', 'discard_all', 'action')} size="small" />
                                    <div>
                                        <strong>Discard All:</strong> Discard all cards of one color from your hand!
                                    </div>
                                </div>
                            </div>

                            {/* New Wild Cards */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: theme.accent, marginBottom: '15px' }}>NEW WILD CARDS:</h3>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                    <UnoCard card={new Card(null, 'wild_draw6', 'wild')} size="small" />
                                    <div>
                                        <strong>Wild Draw 6:</strong> Change color + next player draws 6 cards and loses their turn!
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                    <UnoCard card={new Card(null, 'wild_draw10', 'wild')} size="small" />
                                    <div>
                                        <strong>Wild Draw 10:</strong> Change color + next player draws 10 cards and loses their turn!
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                    <UnoCard card={new Card(null, 'wild_reverse_draw4', 'wild')} size="small" />
                                    <div>
                                        <strong>Wild Reverse Draw 4:</strong> Reverse direction + previous player draws 4 cards!
                                    </div>
                                </div>
                            </div>

                            {/* Special Rules */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: theme.accent, marginBottom: '15px' }}>BRUTAL NEW RULES:</h3>

                                <div style={{
                                    backgroundColor: theme.bgDark,
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    border: `2px solid ${theme.danger}`
                                }}>
                                    <strong>🔥 STACKING RULE:</strong> If someone plays a Draw card (+2, +4, +6, +10), you can "stack" by playing a Draw card of equal or higher value! The next player must draw ALL accumulated cards unless they can stack too!
                                </div>

                                <div style={{
                                    backgroundColor: theme.bgDark,
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    border: `2px solid ${theme.danger}`
                                }}>
                                    <strong>💀 MERCY RULE:</strong> If any player reaches 25 or more cards in their hand, they are ELIMINATED from the game immediately!
                                </div>

                                <div style={{
                                    backgroundColor: theme.bgDark,
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    border: `2px solid ${theme.secondary}`
                                }}>
                                    <strong>📥 DRAW UNTIL PLAYABLE:</strong> If you can't play a card, you must keep drawing from the deck until you get a playable card!
                                </div>
                            </div>

                            {/* Winning */}
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ color: theme.accent, marginBottom: '10px' }}>WINNING:</h3>
                                <p><strong>Two ways to win:</strong></p>
                                <ol>
                                    <li>Be the first to play all your cards (traditional)</li>
                                    <li>Be the last player standing after all others are eliminated!</li>
                                </ol>
                                <p style={{ marginTop: '10px' }}><em>Don't forget to yell "UNO!" when you're down to one card!</em></p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInstructions(false)}
                            style={{
                                width: '100%',
                                padding: isMobile ? '12px' : '15px',
                                fontSize: isMobile ? '1rem' : '1.2rem',
                                backgroundColor: theme.danger,
                                color: theme.textPrimary,
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '20px',
                                fontFamily: 'inherit',
                                fontWeight: 'bold'
                            }}
                        >
                            READY TO SHOW NO MERCY 🔥
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnoNMSetup;