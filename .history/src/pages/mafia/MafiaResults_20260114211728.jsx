import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import SettingsButton from '../../components/SettingsButton';
import SocialButton from '../../components/SocialButton';

function MafiaResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const { players, winner, roundNumber } = location.state || {};

    const isMobile = window.innerWidth <= 768;

    // Get all players with their roles
    const mafiaPlayers = players?.filter(p => p.role === 'mafia') || [];
    const doctorPlayer = players?.find(p => p.role === 'doctor');
    const detectivePlayer = players?.find(p => p.role === 'detective');
    const villagers = players?.filter(p => p.role === 'villager') || [];

    const playAgain = () => {
        // Extract just the player names for replay
        const playerNames = players?.map(p => p.name) || [];
        navigate('/mafia-setup', {
            state: { players: playerNames }
        });
    };

    const backToHome = () => {
        navigate('/');
    };

    // Get winner display info
    const getWinnerInfo = () => {
        if (winner === 'mafia') {
            return {
                title: '🔴 MAFIA WINS!',
                color: theme.danger,
                message: 'The mafia has taken over the village!'
            };
        } else {
            return {
                title: '💚 VILLAGERS WIN!',
                color: theme.success,
                message: 'The village is safe! All mafia members have been eliminated.'
            };
        }
    };

    const winnerInfo = getWinnerInfo();

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
            <BackButton to="/" />
            <HelpButton helpText="Game over! Review the roles and start a new game with the same players or go back home." />

            {/* SECTION 1: Winner Announcement */}
            <div style={{
                textAlign: 'center',
                paddingTop: isMobile ? '40px' : '60px',
                paddingBottom: '30px',
                flexShrink: 0
            }}>
                <h1 style={{ 
                    fontSize: isMobile ? '2.5rem' : '3.5rem',
                    marginBottom: '20px',
                    color: winnerInfo.color,
                    textShadow: `0 0 20px ${winnerInfo.color}60`
                }}>
                    {winnerInfo.title}
                </h1>
                <p style={{ 
                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                    color: theme.textSecondary,
                    marginBottom: '10px'
                }}>
                    {winnerInfo.message}
                </p>
                <p style={{ 
                    fontSize: isMobile ? '1rem' : '1.2rem',
                    color: theme.textDisabled,
                    fontStyle: 'italic'
                }}>
                    Game lasted {roundNumber} round{roundNumber !== 1 ? 's' : ''}
                </p>
            </div>

            {/* SECTION 2: Role Reveal */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%',
                paddingBottom: '20px'
            }}>
                <h2 style={{ 
                    textAlign: 'center',
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    marginBottom: '30px',
                    color: theme.accent
                }}>
                    🎭 ROLE REVEAL
                </h2>

                {/* Mafia Section */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '20px',
                    border: `3px solid ${theme.danger}`
                }}>
                    <h3 style={{ 
                        fontSize: isMobile ? '1.3rem' : '1.6rem',
                        marginBottom: '15px',
                        color: theme.danger
                    }}>
                        🔴 MAFIA ({mafiaPlayers.length})
                    </h3>
                    {mafiaPlayers.map((player, index) => (
                        <div key={index} style={{
                            fontSize: isMobile ? '1.1rem' : '1.3rem',
                            padding: '10px',
                            marginBottom: '5px',
                            backgroundColor: theme.bgMedium,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{player.name}</span>
                            <span style={{ 
                                color: player.alive ? theme.success : theme.textDisabled,
                                fontSize: isMobile ? '0.9rem' : '1rem'
                            }}>
                                {player.alive ? '✅ Survived' : '💀 Eliminated'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Special Roles Section */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '20px',
                    border: `3px solid ${theme.accent}`
                }}>
                    <h3 style={{ 
                        fontSize: isMobile ? '1.3rem' : '1.6rem',
                        marginBottom: '15px',
                        color: theme.accent
                    }}>
                        ✨ SPECIAL ROLES
                    </h3>
                    
                    {/* Doctor */}
                    {doctorPlayer && (
                        <div style={{
                            fontSize: isMobile ? '1.1rem' : '1.3rem',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: theme.bgMedium,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>⚕️ Doctor: {doctorPlayer.name}</span>
                            <span style={{ 
                                color: doctorPlayer.alive ? theme.success : theme.textDisabled,
                                fontSize: isMobile ? '0.9rem' : '1rem'
                            }}>
                                {doctorPlayer.alive ? '✅ Survived' : '💀 Eliminated'}
                            </span>
                        </div>
                    )}

                    {/* Detective */}
                    {detectivePlayer && (
                        <div style={{
                            fontSize: isMobile ? '1.1rem' : '1.3rem',
                            padding: '10px',
                            marginBottom: '5px',
                            backgroundColor: theme.bgMedium,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>🔍 Detective: {detectivePlayer.name}</span>
                            <span style={{ 
                                color: detectivePlayer.alive ? theme.success : theme.textDisabled,
                                fontSize: isMobile ? '0.9rem' : '1rem'
                            }}>
                                {detectivePlayer.alive ? '✅ Survived' : '💀 Eliminated'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Villagers Section */}
                {villagers.length > 0 && (
                    <div style={{
                        backgroundColor: theme.bgDark,
                        borderRadius: '15px',
                        padding: '20px',
                        border: `3px solid ${theme.secondary}`
                    }}>
                        <h3 style={{ 
                            fontSize: isMobile ? '1.3rem' : '1.6rem',
                            marginBottom: '15px',
                            color: theme.textSecondary
                        }}>
                            👥 VILLAGERS ({villagers.length})
                        </h3>
                        {villagers.map((player, index) => (
                            <div key={index} style={{
                                fontSize: isMobile ? '1.1rem' : '1.3rem',
                                padding: '10px',
                                marginBottom: '5px',
                                backgroundColor: theme.bgMedium,
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>{player.name}</span>
                                <span style={{ 
                                    color: player.alive ? theme.success : theme.textDisabled,
                                    fontSize: isMobile ? '0.9rem' : '1rem'
                                }}>
                                    {player.alive ? '✅ Survived' : '💀 Eliminated'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 3: Action Buttons */}
            <div style={{
                flexShrink: 0,
                marginBottom: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                maxWidth: '600px',
                margin: '0 auto 80px auto',
                width: '100%',
                padding: '0 20px'
            }}>
                <button
                    onClick={playAgain}
                    style={{
                        padding: isMobile ? '15px 30px' : '20px 40px',
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        backgroundColor: theme.success,
                        color: theme.textPrimary,
                        cursor: 'pointer',
                        width: '100%',
                        fontWeight: 'bold',
                        border: `2px solid ${theme.light}`
                    }}
                >
                    🔄 Play Again (Same Players)
                </button>

                <button
                    onClick={backToHome}
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
                    🏠 Back to Home
                </button>
            </div>

            <SettingsButton />
            <SocialButton />
        </div>
    );
}

export default MafiaResults;