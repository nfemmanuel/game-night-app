import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import SettingsButton from '../components/SettingsButton';
import SocialButton from '../components/SocialButton';

function LandingPage() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const games = [
        {
            title: 'Imposter',
            description: 'Find the imposter among your friends!',
            icon: '🕵️',
            path: '/imposter',
            color: theme.danger,
            available: true
        },
        {
            title: 'UNO',
            description: 'Classic card game - match colors and numbers!',
            icon: '🎴',
            path: '/uno-setup',
            color: theme.accent,
            available: true
        },
        {
            title: 'UNO No Mercy',
            description: 'The most brutal UNO ever - show no mercy!',
            icon: '🔥',
            path: '/uno-nm-setup',
            color: theme.danger,
            available: true
        },
        {
            title: 'Mafia',
            description: 'Social deduction game of lies and deception',
            icon: '🤵',
            path: '/mafia',
            color: theme.secondary,
            available: false
        },
        {
            title: 'Truth or Dare',
            description: 'Classic party game with fun challenges',
            icon: '🎯',
            path: '/truth-or-dare',
            color: theme.success,
            available: false
        },
        {
            title: 'Charades',
            description: 'Act out words and phrases for your team',
            icon: '🎭',
            path: '/charades',
            color: theme.accent,
            available: false
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            padding: '20px',
            position: 'relative'
        }}>
            <SettingsButton />
            <SocialButton />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                paddingTop: '80px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '50px' }}
                >
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: '10px',
                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.secondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        🎮 Game Night Hub
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: theme.textSecondary
                    }}>
                        Choose your adventure
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    padding: '20px'
                }}>
                    {games.map((game, index) => (
                        <motion.div
                            key={game.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={game.available ? { scale: 1.05, y: -5 } : {}}
                            style={{
                                backgroundColor: theme.bgDark,
                                borderRadius: '15px',
                                padding: '30px',
                                cursor: game.available ? 'pointer' : 'not-allowed',
                                border: `3px solid ${game.available ? game.color : theme.textDisabled}`,
                                transition: 'all 0.3s ease',
                                opacity: game.available ? 1 : 0.6,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => game.available && navigate(game.path)}
                        >
                            {!game.available && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: theme.textDisabled,
                                    color: theme.textPrimary,
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    Coming Soon
                                </div>
                            )}

                            <div style={{
                                fontSize: '4rem',
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}>
                                {game.icon}
                            </div>

                            <h2 style={{
                                fontSize: '1.8rem',
                                marginBottom: '10px',
                                textAlign: 'center',
                                color: game.available ? game.color : theme.textDisabled
                            }}>
                                {game.title}
                            </h2>

                            <p style={{
                                fontSize: '1rem',
                                textAlign: 'center',
                                color: theme.textSecondary,
                                lineHeight: '1.5'
                            }}>
                                {game.description}
                            </p>

                            {game.available && (
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    style={{
                                        marginTop: '20px',
                                        textAlign: 'center',
                                        color: game.color,
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Play Now →
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    style={{
                        textAlign: 'center',
                        marginTop: '50px',
                        paddingBottom: '30px'
                    }}
                >
                    <p style={{
                        fontSize: '0.9rem',
                        color: theme.textSecondary
                    }}>
                        More games coming soon! 🎉
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default LandingPage;