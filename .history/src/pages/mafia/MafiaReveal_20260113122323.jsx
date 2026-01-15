import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MafiaGameState from '../../logic/mafia/MafiaGameState';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import { useTheme } from '../../contexts/ThemeContext';
import SettingsButton from '../../components/SettingsButton';
import SocialButton from '../../components/SocialButton';

function MafiaReveal() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const { players, numMafia, discussionTime } = location.state || {};

    // Initialize game state once
    const [gameState] = useState(() => {
        if (!players || players.length === 0) return null;
        return new MafiaGameState(players, numMafia, discussionTime);
    });

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [canProceed, setCanProceed] = useState(false);

    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        if (!gameState) {
            navigate('/mafia-setup');
        }
    }, [gameState, navigate]);

    useEffect(() => {
        if (isRevealed) {
            const timer = setTimeout(() => {
                setCanProceed(true);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [isRevealed]);

    if (!gameState) {
        return null;
    }

    const currentPlayer = gameState.players[currentPlayerIndex];
    const role = currentPlayer.role;
    
    // Get role display info
    const getRoleInfo = () => {
        switch (role) {
            case 'mafia':
                const mafiaPartners = gameState.getPlayersByRole('mafia')
                    .filter(p => p.name !== currentPlayer.name)
                    .map(p => p.name);
                
                return {
                    title: '🔴 MAFIA',
                    color: theme.danger,
                    description: mafiaPartners.length > 0 
                        ? `Your partners: ${mafiaPartners.join(', ')}`
                        : 'You are the only mafia!',
                    mission: 'Eliminate villagers without getting caught'
                };
                
            case 'doctor':
                return {
                    title: '💚 DOCTOR',
                    color: theme.success,
                    description: 'Protect one person each night',
                    mission: 'You can save yourself once per game'
                };
                
            case 'detective':
                return {
                    title: '🔍 DETECTIVE',
                    color: theme.accent,
                    description: 'Investigate one person each night',
                    mission: 'Find the mafia and convince the village'
                };
                
            case 'villager':
                return {
                    title: '👥 VILLAGER',
                    color: theme.secondary,
                    description: 'Work with others to find the mafia',
                    mission: 'Vote wisely during the day phase'
                };
                
            default:
                return {
                    title: 'UNKNOWN',
                    color: theme.textSecondary,
                    description: '',
                    mission: ''
                };
        }
    };

    const roleInfo = getRoleInfo();

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

        if (currentPlayerIndex < gameState.players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            // All players revealed, start game
            // Pass raw data instead of class instance
            navigate('/mafia-game', {
                state: { 
                    players: gameState.players,
                    numMafia,
                    discussionTime
                }
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
            <BackButton to="/mafia-setup" preserveState={true} />
            <HelpButton helpText="Press and hold the card to reveal your role. Keep it secret!" />

            {/* SECTION 1: Title + Info */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0,
                marginTop: isMobile ? '50px' : '10px'
            }}>
                <h1 className="page-title">MAFIA - ROLE REVEAL</h1>
                <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: theme.textSecondary, margin: '10px 0' }}>
                    Player {currentPlayerIndex + 1} of {gameState.players.length}
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
                        width: isMobile ? '300px' : '400px',
                        height: isMobile ? '450px' : '550px',
                        backgroundColor: isRevealed ? roleInfo.color : theme.bgDark,
                        border: `${isMobile ? '5px' : '10px'} solid ${theme.light}`,
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        userSelect: 'none',
                        padding: '20px'
                    }}
                >
                    <h2 style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '30px', color: theme.textPrimary }}>
                        {currentPlayer.name}
                    </h2>

                    {isRevealed && (
                        <div style={{ 
                            textAlign: 'center',
                            color: theme.textPrimary
                        }}>
                            <p style={{ 
                                fontSize: isMobile ? '2.5rem' : '3rem', 
                                fontWeight: 'bold',
                                marginBottom: '20px'
                            }}>
                                {roleInfo.title}
                            </p>
                            
                            <p style={{ 
                                fontSize: isMobile ? '1.2rem' : '1.4rem',
                                marginBottom: '15px',
                                opacity: 0.9
                            }}>
                                {roleInfo.description}
                            </p>
                            
                            <p style={{ 
                                fontSize: isMobile ? '1rem' : '1.2rem',
                                fontStyle: 'italic',
                                opacity: 0.8
                            }}>
                                {roleInfo.mission}
                            </p>
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
                    {currentPlayerIndex < gameState.players.length - 1 ? 'Next Player' : 'Start Game'}
                </button>
            </div>

            {/* Settings Button */}
            <SettingsButton />
            <SocialButton />
        </div>
    );
}

export default MafiaReveal;