import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/BackButton';
import SettingsButton from '../components/SettingsButton';
import HelpButton from '../components/HelpButton';
import SocialButton from '../components/SocialButton';
import storageManager from '../utils/StorageManager';

function LandingPage() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Load saved tab from localStorage
    const [currentTab, setCurrentTab] = useState(() =>
        storageManager.getCurrentTab()
    );

    const isMobile = window.innerWidth <= 768;

    // Save tab whenever it changes
    const handleTabChange = (tabIndex) => {
        setCurrentTab(tabIndex);
        storageManager.saveCurrentTab(tabIndex);
    };

    const singlePlayerGames = [
        { name: 'UNO: No Mercy', route: '/uno-nm-setup', emoji: '🎴', description: 'Brutal card game' }
    ];

    const inPersonGames = [
        { name: 'Imposter', route: '/imposter-setup', emoji: '🕵️', description: 'Find the imposter' }
    ];

    const virtualGames = [
        { name: 'Trivia', route: '/trivia-setup', emoji: '🧠', description: 'Test your knowledge' }
    ];

    const tabs = [
        { label: 'Single Player', games: singlePlayerGames },
        { label: 'In-Person', games: inPersonGames },
        { label: 'Virtual', games: virtualGames }
    ];

    const renderGameCard = (game) => (
        <div
            key={game.name}
            onClick={() => navigate(game.route)}
            style={{
                backgroundColor: theme.bgLight,
                padding: isMobile ? '20px' : '30px',
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: `0 4px 6px ${theme.shadow}`,
                textAlign: 'center',
                minWidth: isMobile ? '120px' : '200px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 8px 12px ${theme.shadow}`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 6px ${theme.shadow}`;
            }}
        >
            <div style={{ fontSize: isMobile ? '3rem' : '4rem', marginBottom: '10px' }}>
                {game.emoji}
            </div>
            <h3 style={{
                color: theme.textPrimary,
                marginBottom: '5px',
                fontSize: isMobile ? '1rem' : '1.2rem'
            }}>
                {game.name}
            </h3>
            <p style={{
                color: theme.textSecondary,
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                margin: 0
            }}>
                {game.description}
            </p>
        </div>
    );

    return (
        <div style={{
            padding: isMobile ? '10px' : '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary
        }}>
            <BackButton to="/" />
            <SettingsButton />
            <HelpButton helpText="Choose your game mode and start playing!" />
            <SocialButton />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                paddingTop: '60px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: isMobile ? '20px' : '40px',
                    fontSize: isMobile ? '2rem' : '3rem',
                    color: theme.accent
                }}>
                    🎮 Game Night 🎮
                </h1>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: isMobile ? '10px' : '20px',
                    marginBottom: isMobile ? '20px' : '40px',
                    flexWrap: 'wrap'
                }}>
                    {tabs.map((tab, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleTabChange(idx)}
                            style={{
                                padding: isMobile ? '10px 20px' : '15px 40px',
                                fontSize: isMobile ? '0.9rem' : '1.2rem',
                                backgroundColor: currentTab === idx ? theme.accent : theme.bgLight,
                                color: currentTab === idx ? theme.textPrimary : theme.textSecondary,
                                border: `2px solid ${currentTab === idx ? theme.accent : theme.light}`,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: currentTab === idx ? 'bold' : 'normal',
                                fontFamily: 'inherit'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Game Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile
                        ? 'repeat(auto-fill, minmax(120px, 1fr))'
                        : 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: isMobile ? '15px' : '30px',
                    padding: isMobile ? '10px' : '20px'
                }}>
                    {tabs[currentTab].games.map(renderGameCard)}
                </div>

                {tabs[currentTab].games.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: theme.textSecondary
                    }}>
                        <p style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>
                            No games available in this category yet.
                        </p>
                        <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', marginTop: '10px' }}>
                            Check back soon! 🎮
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LandingPage;