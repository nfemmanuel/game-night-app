import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MafiaGameState from '../../logic/mafia/MafiaGameState';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import { useTheme } from '../../contexts/ThemeContext';
import SettingsButton from '../../components/SettingsButton';
import SocialButton from '../../components/SocialButton';

function MafiaGame() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const { players, numMafia, discussionTime, gameState: existingGameState } = location.state || {};
    
    // Reconstruct or create gameState
    const [gameState] = useState(() => {
        if (existingGameState) {
            // Reconstruct from serialized state (preserves roles!)
            const newGameState = Object.create(MafiaGameState.prototype);
            Object.assign(newGameState, existingGameState);
            return newGameState;
        } else if (players) {
            // Fallback: Create new from player data (only for backwards compatibility)
            return new MafiaGameState(players.map(p => p.name), numMafia, discussionTime);
        }
        return null;
    });
    
    const [, forceUpdate] = useState();
    const [countdown, setCountdown] = useState(null);
    const [discussionTimeLeft, setDiscussionTimeLeft] = useState(null);
    const [discussionStarted, setDiscussionStarted] = useState(false);

    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        if (!gameState) {
            navigate('/mafia-setup');
        }
    }, [gameState, navigate]);

    // Discussion timer
    useEffect(() => {
        if (discussionStarted && discussionTimeLeft !== null && discussionTimeLeft > 0) {
            const timer = setTimeout(() => {
                setDiscussionTimeLeft(discussionTimeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [discussionStarted, discussionTimeLeft]);

    // Countdown timer
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            handleCountdownComplete();
        }
    }, [countdown]);

    if (!gameState) {
        return null;
    }

    const handlePlayerTap = (playerName) => {
        const player = gameState.getPlayer(playerName);
        
        if (gameState.phase === 'night') {
            switch (gameState.nightStep) {
                case 'mafia':
                    if (player.alive && player.role !== 'mafia') {
                        gameState.mafiaKill(playerName);
                    }
                    break;
                    
                case 'doctor':
                    // Doctor can heal alive players OR newly killed
                    gameState.doctorHeal(playerName);
                    break;
                    
                case 'detective':
                    // Detective can suspect anyone (even newly dead)
                    gameState.detectiveSuspect(playerName);
                    // Check if detective found mafia (instant win)
                    const { over: detectiveWin, winner: detectiveWinner } = gameState.checkWinCondition();
                    if (detectiveWin) {
                        navigate('/mafia-results', {
                            state: { 
                                players: gameState.players,
                                winner: gameState.winner,
                                roundNumber: gameState.roundNumber
                            }
                        });
                        return;
                    }
                    break;
            }
        } else if (gameState.phase === 'day') {
            // Day phase voting
            if (player.alive) {
                gameState.voteOut(playerName);
                // Check win condition immediately after vote
                const { over, winner } = gameState.checkWinCondition();
                if (over) {
                    navigate('/mafia-results', {
                        state: { 
                            players: gameState.players,
                            winner: gameState.winner,
                            roundNumber: gameState.roundNumber
                        }
                    });
                    return;
                }
            }
        }
        
        forceUpdate({});
    };

    const handleUndo = () => {
        gameState.undo();
        forceUpdate({});
    };

    const handleEndPhase = () => {
        setCountdown(3);
    };

    const handleCountdownComplete = () => {
        setCountdown(null);
        
        if (gameState.phase === 'night') {
            // Move to next night step or day
            gameState.nextNightStep();
            
            if (gameState.phase === 'day') {
                // Reset discussion timer
                setDiscussionTimeLeft(gameState.discussionTime);
                setDiscussionStarted(false);
            }
        } else {
            // Day to night
            gameState.nextDayPhase();
        }
        
        // Check win condition
        const { over, winner } = gameState.checkWinCondition();
        if (over) {
            navigate('/mafia-results', {
                state: { 
                    players: gameState.players,
                    winner: gameState.winner,
                    roundNumber: gameState.roundNumber
                }
            });
            return;
        }
        
        forceUpdate({});
    };

    const startDiscussion = () => {
        setDiscussionStarted(true);
    };

    const skipDiscussion = () => {
        setDiscussionTimeLeft(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getPhaseColor = () => {
        if (gameState.phase === 'night') {
            return theme.secondary;
        } else {
            return theme.accent;
        }
    };

    // Get role display with emoji and text
    const getRoleDisplay = (role) => {
        const roleMap = {
            'mafia': '🔪 Mafia',
            'doctor': '⚕️ Doctor',
            'detective': '🔍 Detective',
            'villager': '👤 Villager'
        };
        return roleMap[role] || role;
    };

    const getPlayerCardStyle = (player) => {
        const baseStyle = {
            width: isMobile ? '140px' : '160px',
            height: isMobile ? '180px' : '200px',
            backgroundColor: theme.bgDark,
            border: `3px solid ${theme.secondary}`,
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '10px',
            margin: '10px',
            position: 'relative'
        };

        // Style for dead players (but show as clickable during night for doctor/detective)
        if (!player.alive) {
            if (gameState.phase === 'night' && (gameState.nightStep === 'doctor' || gameState.nightStep === 'detective')) {
                // Clickable during doctor/detective turn
                baseStyle.opacity = 0.7;
                baseStyle.cursor = 'pointer';
            } else {
                // Not clickable otherwise
                baseStyle.opacity = 0.4;
                baseStyle.backgroundColor = theme.bgMedium;
                baseStyle.cursor = 'not-allowed';
            }
        }

        if (player.savedByDoctor) {
            baseStyle.border = `3px solid ${theme.success}`;
            baseStyle.boxShadow = `0 0 20px ${theme.success}`;
        }

        if (player.wasSuspected) {
            baseStyle.border = `3px solid ${theme.accent}`;
            baseStyle.boxShadow = `0 0 15px ${theme.accent}`;
        }

        return baseStyle;
    };

    const getPlayerIcon = (player) => {
        const icons = [];
        
        if (!player.alive) {
            icons.push('💀');
        }
        if (player.savedByDoctor) {
            icons.push('❤️‍🩹');
        }
        if (player.wasSuspected) {
            icons.push('🔍');
        }
        
        return icons.join(' ');
    };

    const alivePlayers = gameState.getAlivePlayersForDisplay();
    const deadPlayers = gameState.getDeadPlayersForDisplay();

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
            <BackButton 
                to="/mafia-setup" 
                state={{ players: gameState.players.map(p => p.name) }} 
            />
            <HelpButton helpText={
                gameState.phase === 'night'
                    ? "Narrator: Tap players for night actions. Use undo if you make a mistake. End phase when ready."
                    : "Narrator: Start discussion timer or skip. After voting, tap the voted-out player and end phase."
            } />

            {/* Phase Header */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0,
                marginTop: isMobile ? '30px' : '10px'
            }}>
                <div style={{
                    backgroundColor: getPhaseColor(),
                    padding: isMobile ? '10px' : '15px',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    border: `2px solid ${theme.light}`
                }}>
                    <h2 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem', color: theme.textPrimary }}>
                        {gameState.phase === 'night' ? '🌙 NIGHT PHASE' : '☀️ DAY PHASE'}
                    </h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: isMobile ? '1rem' : '1.2rem', color: theme.textPrimary }}>
                        {gameState.phase === 'night' 
                            ? `${gameState.nightStep.toUpperCase()}'S TURN`
                            : discussionStarted 
                                ? `DISCUSSION: ${formatTime(discussionTimeLeft)}`
                                : 'READY TO DISCUSS'
                        }
                    </p>
                </div>
                
                {countdown !== null && (
                    <div style={{
                        fontSize: '3rem',
                        color: theme.accent,
                        fontWeight: 'bold',
                        padding: '10px'
                    }}>
                        {countdown}
                    </div>
                )}
            </div>

            {/* Players Section */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                minHeight: 0,
                paddingBottom: '10px'
            }}>
                {/* Alive Players */}
                <div style={{
                    marginBottom: '20px'
                }}>
                    <h3 style={{ 
                        textAlign: 'center', 
                        color: theme.textSecondary,
                        fontSize: isMobile ? '1.2rem' : '1.4rem',
                        marginBottom: '10px'
                    }}>
                        ALIVE PLAYERS ({alivePlayers.length})
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        {alivePlayers.map(player => (
                            <div
                                key={player.name}
                                onClick={() => handlePlayerTap(player.name)}
                                style={getPlayerCardStyle(player)}
                            >
                                <div style={{ 
                                    fontSize: '2rem',
                                    marginBottom: '5px',
                                    minHeight: '2rem'
                                }}>
                                    {getPlayerIcon(player)}
                                </div>
                                <div style={{ 
                                    fontSize: isMobile ? '1.1rem' : '1.3rem',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    color: theme.textPrimary,
                                    marginBottom: '3px'
                                }}>
                                    {player.name}
                                </div>
                                <div style={{
                                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                                    textAlign: 'center',
                                    color: theme.textSecondary,
                                    fontWeight: '500'
                                }}>
                                    {getRoleDisplay(player.role)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dead Players */}
                {deadPlayers.length > 0 && (
                    <div>
                        <h3 style={{ 
                            textAlign: 'center', 
                            color: theme.textSecondary,
                            fontSize: isMobile ? '1.2rem' : '1.4rem',
                            marginBottom: '10px'
                        }}>
                            DEAD PLAYERS ({deadPlayers.length})
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '10px'
                        }}>
                            {deadPlayers.map(player => (
                                <div
                                    key={player.name}
                                    onClick={() => handlePlayerTap(player.name)}
                                    style={getPlayerCardStyle(player)}
                                >
                                    <div style={{ 
                                        fontSize: '3rem',
                                        marginBottom: '10px'
                                    }}>
                                        ☠️
                                    </div>
                                    <div style={{ 
                                        fontSize: isMobile ? '1.2rem' : '1.4rem',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: theme.textPrimary,
                                        marginBottom: '3px'
                                    }}>
                                        {player.name}
                                    </div>
                                    <div style={{
                                        fontSize: isMobile ? '0.85rem' : '0.95rem',
                                        textAlign: 'center',
                                        color: theme.textSecondary,
                                        fontWeight: '500'
                                    }}>
                                        {getRoleDisplay(player.role)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{
                flexShrink: 0,
                marginBottom: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: '600px',
                margin: '0 auto 80px auto',
                width: '100%'
            }}>
                {/* Day Phase Timer Controls */}
                {gameState.phase === 'day' && !discussionStarted && discussionTimeLeft > 0 && (
                    <button
                        onClick={startDiscussion}
                        style={{
                            padding: isMobile ? '15px 30px' : '20px 40px',
                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                            backgroundColor: theme.accent,
                            color: theme.textPrimary,
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        Start Discussion Timer
                    </button>
                )}

                {gameState.phase === 'day' && discussionStarted && discussionTimeLeft > 0 && (
                    <button
                        onClick={skipDiscussion}
                        style={{
                            padding: isMobile ? '12px 24px' : '15px 30px',
                            fontSize: isMobile ? '1rem' : '1.2rem',
                            backgroundColor: 'transparent',
                            border: `2px solid ${theme.textDisabled}`,
                            color: theme.textSecondary,
                            cursor: 'pointer',
                            width: '100%',
                            borderRadius: '5px'
                        }}
                    >
                        Skip Discussion
                    </button>
                )}

                {/* Undo Button */}
                {gameState.lastAction && countdown === null && (
                    <button
                        onClick={handleUndo}
                        style={{
                            padding: isMobile ? '12px 24px' : '15px 30px',
                            fontSize: isMobile ? '1rem' : '1.2rem',
                            backgroundColor: 'transparent',
                            border: `2px solid ${theme.textDisabled}`,
                            color: theme.textSecondary,
                            cursor: 'pointer',
                            width: '100%',
                            borderRadius: '5px'
                        }}
                    >
                        ↶ Undo Last Action
                    </button>
                )}

                {/* End Phase Button */}
                {countdown === null && (
                    <button
                        onClick={handleEndPhase}
                        style={{
                            padding: isMobile ? '15px 30px' : '20px 40px',
                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                            backgroundColor: theme.success,
                            color: theme.textPrimary,
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        {gameState.phase === 'night'
                            ? `End ${gameState.nightStep.charAt(0).toUpperCase() + gameState.nightStep.slice(1)} Turn`
                            : 'End Day Phase'
                        }
                    </button>
                )}
            </div>

            <SettingsButton />
            <SocialButton />
        </div>
    );
}

export default MafiaGame;