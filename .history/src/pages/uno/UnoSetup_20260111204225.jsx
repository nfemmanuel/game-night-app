import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import SettingsButton from '../../components/SettingsButton';
import HelpButton from '../../components/HelpButton';
import SocialButton from '../../components/SocialButton';
import storageManager from '../../utils/StorageManager';

function UnoNMSetup() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Load saved settings or use defaults
    const [playerName, setPlayerName] = useState(() => {
        const saved = storageManager.getGameSettings('uno-nm');
        return saved?.playerName || storageManager.getPlayerName();
    });

    const [numPlayers, setNumPlayers] = useState(() => {
        const saved = storageManager.getGameSettings('uno-nm');
        return saved?.numPlayers || 2;
    });

    const [difficulty, setDifficulty] = useState(() => {
        const saved = storageManager.getGameSettings('uno-nm');
        return saved?.difficulty || 'medium';
    });

    const [showCardCount, setShowCardCount] = useState(() => {
        const saved = storageManager.getGameSettings('uno-nm');
        return saved?.showCardCount !== undefined ? saved.showCardCount : true;
    });

    const [showInstructions, setShowInstructions] = useState(false);
    const isMobile = window.innerWidth <= 768;

    // Auto-save settings whenever they change
    useEffect(() => {
        const settings = {
            playerName,
            numPlayers,
            difficulty,
            showCardCount
        };
        storageManager.saveGameSettings('uno-nm', settings);

        // Also save player name globally
        storageManager.savePlayerName(playerName);
    }, [playerName, numPlayers, difficulty, showCardCount]);

    const handleStartGame = () => {
        navigate('/uno-nm-game', {
            state: { playerName, numPlayers, difficulty, showCardCount }
        });
    };

    return (
        <div style={{
            padding: isMobile ? '10px' : '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <BackButton to="/landing" />
            <SettingsButton />
            <HelpButton helpText="Configure your UNO: No Mercy game and start playing!" />
            <SocialButton />

            <div style={{
                backgroundColor: theme.bgLight,
                padding: isMobile ? '20px' : '40px',
                borderRadius: '15px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: `0 8px 16px ${theme.shadow}`
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: isMobile ? '20px' : '30px',
                    fontSize: isMobile ? '1.8rem' : '2.5rem',
                    color: theme.danger
                }}>
                    🎴 UNO 🎴
                </h1>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        fontWeight: 'bold'
                    }}>
                        Your Name:
                    </label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            borderRadius: '8px',
                            border: `2px solid ${theme.light}`,
                            backgroundColor: theme.bgDark,
                            color: theme.textPrimary,
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        fontWeight: 'bold'
                    }}>
                        Number of Players:
                    </label>
                    <select
                        value={numPlayers}
                        onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            borderRadius: '8px',
                            border: `2px solid ${theme.light}`,
                            backgroundColor: theme.bgDark,
                            color: theme.textPrimary,
                            fontFamily: 'inherit',
                            cursor: 'pointer'
                        }}
                    >
                        <option value={2}>2 Players (You + 1 CPU)</option>
                        <option value={3}>3 Players (You + 2 CPUs)</option>
                        <option value={4}>4 Players (You + 3 CPUs)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        fontWeight: 'bold'
                    }}>
                        Difficulty:
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            borderRadius: '8px',
                            border: `2px solid ${theme.light}`,
                            backgroundColor: theme.bgDark,
                            color: theme.textPrimary,
                            fontFamily: 'inherit',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="easy">Easy (Random plays)</option>
                        <option value="medium">Medium (Smart plays)</option>
                        <option value="hard">Hard (Strategic plays)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                        <input
                            type="checkbox"
                            checked={showCardCount}
                            onChange={(e) => setShowCardCount(e.target.checked)}
                            style={{
                                marginRight: '10px',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                            }}
                        />
                        Show CPU card counts
                    </label>
                </div>

                <button
                    onClick={handleStartGame}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        fontWeight: 'bold',
                        backgroundColor: theme.danger,
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: `0 4px 8px ${theme.shadow}`,
                        fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 6px 12px ${theme.shadow}`;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 4px 8px ${theme.shadow}`;
                    }}
                >
                    🎮 START GAME
                </button>

                <button
                    onClick={() => setShowInstructions(true)}
                    style={{
                        width: '100%',
                        marginTop: '15px',
                        padding: '12px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        backgroundColor: 'transparent',
                        color: theme.accent,
                        border: `2px solid ${theme.accent}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                    }}
                >
                    📖 How to Play
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
                        backgroundColor: theme.bgLight,
                        padding: isMobile ? '20px' : '40px',
                        borderRadius: '15px',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowInstructions(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: theme.textPrimary
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ marginBottom: '20px', color: theme.danger }}>
                            UNO: NO MERCY Rules
                        </h2>

                        <div style={{ fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: '1.6' }}>
                            <h3>Special Cards:</h3>
                            <ul>
                                <li><strong>Wild Color Roulette (🎰):</strong> Next player picks a color and draws until they get it!</li>
                                <li><strong>Wild Draw 6/10:</strong> Next player draws 6 or 10 cards (stackable!)</li>
                                <li><strong>Wild Reverse Draw 4:</strong> Reverse direction + next player draws 4</li>
                                <li><strong>Skip Everyone:</strong> You play again immediately</li>
                                <li><strong>Discard All:</strong> Choose a color and discard ALL cards of that color</li>
                                <li><strong>0 Card:</strong> ALL players pass hands in current direction</li>
                                <li><strong>7 Card:</strong> Swap hands with any player</li>
                            </ul>

                            <h3>Mercy Rule:</h3>
                            <p><strong>25+ cards = ELIMINATED!</strong> Show no mercy!</p>

                            <h3>Stacking:</h3>
                            <p>Draw cards can be stacked! Play Draw 2/4/6/10 on top of each other to increase the penalty.</p>

                            <h3>Draw Until Playable:</h3>
                            <p>If you can't play, draw until you get a playable card, then play it.</p>

                            <h3>Win Conditions:</h3>
                            <ul>
                                <li>Empty your hand first</li>
                                <li>Be the last player standing (all others eliminated)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnoNMSetup;