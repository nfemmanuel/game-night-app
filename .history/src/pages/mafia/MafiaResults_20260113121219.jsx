import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import { useTheme } from '../../contexts/ThemeContext';
import SettingsButton from '../../components/SettingsButton';
import SocialButton from '../../components/SocialButton';

function MafiaResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const { players, winner, roundNumber } = location.state || {};

    const isMobile = window.innerWidth <= 768;

    if (!players || !winner) {
        navigate('/mafia-setup');
        return null;
    }

    const playAgain = () => {
        navigate('/mafia-setup');
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'mafia': return theme.danger;
            case 'doctor': return theme.success;
            case 'detective': return theme.accent;
            case 'villager': return theme.secondary;
            default: return theme.textSecondary;
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'mafia': return '🔴';
            case 'doctor': return '💚';
            case 'detective': return '🔍';
            case 'villager': return '👥';
            default: return '❓';
        }
    };

    const getDeathInfo = (player) => {
        if (player.alive) {
            return { text: '✓ Survived', color: theme.success };
        }
        
        switch (player.killedBy) {
            case 'mafia':
                return { text: '☠️ Killed by Mafia', color: theme.danger };
            case 'vote':
                return { text: '⚖️ Voted Out', color: theme.accent };
            default:
                return { text: '❓ Unknown', color: theme.textSecondary };
        }
    };

    // Filter players by role directly
    const mafiaPlayers = players.filter(p => p.role === 'mafia');
    const doctorPlayer = players.find(p => p.role === 'doctor');
    const detectivePlayer = players.find(p => p.role === 'detective');
    const villagerPlayers = players.filter(p => p.role === 'villager');
    const alivePlayers = players.filter(p => p.alive);

    const winnerColor = winner === 'mafia' ? theme.danger : theme.success;

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
            <BackButton to="/mafia-setup" />
            <HelpButton helpText="Game over! See all roles and how each player died." />

            {/* Title */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0,
                marginTop: isMobile ? '30px' : '10px'
            }}>
                <div style={{
                    backgroundColor: winnerColor,
                    padding: isMobile ? '15px' : '20px',
                    borderRadius: '15px',
                    marginBottom: '20px',
                    border: `3px solid ${theme.light}`
                }}>
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: isMobile ? '2rem' : '3rem', 
                        color: theme.textPrimary 
                    }}>
                        {winner === 'mafia' ? '🔴 MAFIA WINS!' : '👥 VILLAGERS WIN!'}
                    </h1>
                    <p style={{ 
                        margin: '10px 0 0 0', 
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        color: theme.textPrimary
                    }}>
                        {winner === 'mafia' 
                            ? 'The mafia has taken over the village!'
                            : 'All mafia have been eliminated!'
                        }
                    </p>
                </div>
            </div>

            {/* Players by Role */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                minHeight: 0,
                paddingBottom: '20px'
            }}>
                {/* Mafia */}
                <div style={{
                    marginBottom: '25px',
                    backgroundColor: theme.bgDark,
                    padding: '15px',
                    borderRadius: '10px',
                    border: `2px solid ${getRoleColor('mafia')}`
                }}>
                    <h3 style={{ 
                        color: getRoleColor('mafia'),
                        fontSize: isMobile ? '1.3rem' : '1.5rem',
                        marginTop: 0,
                        marginBottom: '15px'
                    }}>
                        {getRoleIcon('mafia')} MAFIA ({mafiaPlayers.length})
                    </h3>
                    {mafiaPlayers.map((player, index) => {
                        const deathInfo = getDeathInfo(player);
                        return (
                            <div key={index} style={{
                                padding: '10px',
                                marginBottom: '8px',
                                backgroundColor: theme.bgMedium,
                                borderRadius: '5px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ 
                                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                                    fontWeight: 'bold'
                                }}>
                                    {player.name}
                                </span>
                                <span style={{ 
                                    fontSize: isMobile ? '0.95rem' : '1rem',
                                    color: deathInfo.color
                                }}>
                                    {deathInfo.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Doctor */}
                {doctorPlayer && (
                    <div style={{
                        marginBottom: '25px',
                        backgroundColor: theme.bgDark,
                        padding: '15px',
                        borderRadius: '10px',
                        border: `2px solid ${getRoleColor('doctor')}`
                    }}>
                        <h3 style={{ 
                            color: getRoleColor('doctor'),
                            fontSize: isMobile ? '1.3rem' : '1.5rem',
                            marginTop: 0,
                            marginBottom: '15px'
                        }}>
                            {getRoleIcon('doctor')} DOCTOR
                        </h3>
                        <div style={{
                            padding: '10px',
                            backgroundColor: theme.bgMedium,
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ 
                                fontSize: isMobile ? '1.1rem' : '1.2rem',
                                fontWeight: 'bold'
                            }}>
                                {doctorPlayer.name}
                            </span>
                            <span style={{ 
                                fontSize: isMobile ? '0.95rem' : '1rem',
                                color: getDeathInfo(doctorPlayer).color
                            }}>
                                {getDeathInfo(doctorPlayer).text}
                            </span>
                        </div>
                    </div>
                )}

                {/* Detective */}
                {detectivePlayer && (
                    <div style={{
                        marginBottom: '25px',
                        backgroundColor: theme.bgDark,
                        padding: '15px',
                        borderRadius: '10px',
                        border: `2px solid ${getRoleColor('detective')}`
                    }}>
                        <h3 style={{ 
                            color: getRoleColor('detective'),
                            fontSize: isMobile ? '1.3rem' : '1.5rem',
                            marginTop: 0,
                            marginBottom: '15px'
                        }}>
                            {getRoleIcon('detective')} DETECTIVE
                        </h3>
                        <div style={{
                            padding: '10px',
                            backgroundColor: theme.bgMedium,
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ 
                                fontSize: isMobile ? '1.1rem' : '1.2rem',
                                fontWeight: 'bold'
                            }}>
                                {detectivePlayer.name}
                            </span>
                            <span style={{ 
                                fontSize: isMobile ? '0.95rem' : '1rem',
                                color: getDeathInfo(detectivePlayer).color
                            }}>
                                {getDeathInfo(detectivePlayer).text}
                            </span>
                        </div>
                    </div>
                )}

                {/* Villagers */}
                {villagerPlayers.length > 0 && (
                    <div style={{
                        marginBottom: '25px',
                        backgroundColor: theme.bgDark,
                        padding: '15px',
                        borderRadius: '10px',
                        border: `2px solid ${getRoleColor('villager')}`
                    }}>
                        <h3 style={{ 
                            color: getRoleColor('villager'),
                            fontSize: isMobile ? '1.3rem' : '1.5rem',
                            marginTop: 0,
                            marginBottom: '15px'
                        }}>
                            {getRoleIcon('villager')} VILLAGERS ({villagerPlayers.length})
                        </h3>
                        {villagerPlayers.map((player, index) => {
                            const deathInfo = getDeathInfo(player);
                            return (
                                <div key={index} style={{
                                    padding: '10px',
                                    marginBottom: '8px',
                                    backgroundColor: theme.bgMedium,
                                    borderRadius: '5px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{ 
                                        fontSize: isMobile ? '1.1rem' : '1.2rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {player.name}
                                    </span>
                                    <span style={{ 
                                        fontSize: isMobile ? '0.95rem' : '1rem',
                                        color: deathInfo.color
                                    }}>
                                        {deathInfo.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Game Stats */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: '15px',
                    borderRadius: '10px',
                    border: `2px solid ${theme.secondary}`,
                    textAlign: 'center'
                }}>
                    <p style={{ 
                        margin: '5px 0',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        color: theme.textSecondary
                    }}>
                        Rounds Survived: {roundNumber}
                    </p>
                    <p style={{ 
                        margin: '5px 0',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        color: theme.textSecondary
                    }}>
                        Final Survivors: {alivePlayers.length}
                    </p>
                </div>
            </div>

            {/* Play Again Button */}
            <div style={{
                flexShrink: 0,
                marginBottom: '80px',
                maxWidth: '600px',
                margin: '0 auto 80px auto',
                width: '100%'
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
                        borderRadius: '5px'
                    }}
                >
                    Play Again
                </button>
            </div>

            <SettingsButton />
            <SocialButton />
        </div>
    );
}

export default MafiaResults;
