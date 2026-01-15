import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import SettingsButton from '../../components/SettingsButton';
import SocialButton from '../../components/SocialButton';

function MafiaNarrator() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const { gameState, numMafia, discussionTime } = location.state || {};

    const isMobile = window.innerWidth <= 768;

    const startGame = () => {
        navigate('/mafia-game', {
            state: { 
                gameState,
                numMafia,
                discussionTime
            }
        });
    };

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            textAlign: 'center'
        }}>
            <BackButton 
                to="/mafia-setup" 
                state={{ 
                    players: gameState?.players?.map(p => typeof p === 'object' ? p.name : p) || []
                }}
            />
            <HelpButton helpText="This screen ensures only the narrator sees the game controls. Players should NOT see the next screen!" />

            <div style={{
                maxWidth: '600px',
                padding: '40px',
                backgroundColor: theme.bgDark,
                borderRadius: '20px',
                border: `3px solid ${theme.accent}`,
                boxShadow: `0 0 30px ${theme.accent}40`
            }}>
                <h1 style={{ 
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    marginBottom: '30px',
                    color: theme.accent
                }}>
                    ⚠️ STOP ⚠️
                </h1>

                <h2 style={{ 
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    marginBottom: '20px',
                    color: theme.textPrimary
                }}>
                    This page is for the NARRATOR only!
                </h2>

                <div style={{
                    backgroundColor: theme.bgMedium,
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    border: `2px solid ${theme.secondary}`
                }}>
                    <p style={{ 
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        lineHeight: '1.6',
                        color: theme.textPrimary,
                        margin: 0
                    }}>
                        Everyone now knows their secret role.
                    </p>
                    <p style={{ 
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        lineHeight: '1.6',
                        color: theme.textPrimary,
                        marginTop: '15px',
                        marginBottom: 0
                    }}>
                        <strong style={{ color: theme.danger }}>
                            Hand the device to the NARRATOR now.
                        </strong>
                    </p>
                </div>

                <div style={{
                    backgroundColor: theme.bgLight,
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '30px'
                }}>
                    <p style={{ 
                        fontSize: isMobile ? '0.95rem' : '1.1rem',
                        color: theme.textSecondary,
                        fontStyle: 'italic',
                        margin: 0
                    }}>
                        The next screen shows all player roles and controls the game.
                        <br />
                        Only the narrator should see it!
                    </p>
                </div>

                <button
                    onClick={startGame}
                    style={{
                        padding: isMobile ? '15px 40px' : '20px 50px',
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        backgroundColor: theme.success,
                        color: theme.textPrimary,
                        cursor: 'pointer',
                        width: '100%',
                        fontWeight: 'bold',
                        border: `2px solid ${theme.light}`,
                        boxShadow: `0 4px 15px ${theme.success}40`
                    }}
                >
                    I'm the Narrator - Start Game
                </button>
            </div>

            <SettingsButton />
            <SocialButton />
        </div>
    );
}

export default MafiaNarrator;