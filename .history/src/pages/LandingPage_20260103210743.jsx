import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import GameCard from '../components/GameCard';
import ModeSelector from '../components/ModeSelector';
import SettingsButton from '../components/SettingsButton';

function LandingPage() {
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState('in-person');
    const [slideDirection, setSlideDirection] = useState('');

    const games = [
        { name: "Mafia", modes: ["in-person"], route: "/mafia-setup", available: false, color: "blue" },
        { name: "Imposter", modes: ["in-person", "virtual"], route: "/imposter-setup", available: true, color: "orange" },
        { name: "Trio", modes: ["in-person", "virtual", "single"], route: "/trio-setup", available: false, color: "orange" },
        { name: "UNO", modes: ["virtual", "single"], route: "/uno-setup", available: false, color: "blue" },
        { name: "UNO: Show 'Em No Mercy", modes: ["virtual", "single"], route: "/uno-nm-setup", available: false, color: "orange" },
        { name: "Charades", modes: ["in-person"], route: "/charades-setup", available: false, color: "blue" }
    ];

    const filteredGames = games.filter(game => game.modes.includes(currentMode));

    const handleClick = (gameName, route) => {
        if (route) {
            navigate(route);
        }
    };

    // Swipe handlers with animation
    const modes = ['in-person', 'virtual', 'single'];
    const currentIndex = modes.indexOf(currentMode);

    const changeMode = (newMode, direction) => {
        setSlideDirection(direction);
        setTimeout(() => {
            setCurrentMode(newMode);
            setSlideDirection('');
        }, 50);
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentIndex < modes.length - 1) {
                changeMode(modes[currentIndex + 1], 'left');
            }
        },
        onSwipedRight: () => {
            if (currentIndex > 0) {
                changeMode(modes[currentIndex - 1], 'right');
            }
        },
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    const handleModeChange = (newMode) => {
        const newIndex = modes.indexOf(newMode);
        const direction = newIndex > currentIndex ? 'left' : 'right';
        changeMode(newMode, direction);
    };

    return (
        <div
            className="landing-page"
            style={{
                padding: '20px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
        >
            {/* SECTION 1: Title - Fixed height, centered content */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0
            }}>
                <h1 style={{ margin: '10px 0' }}>GAME NIGHT</h1>
            </div>

            {/* SECTION 2: Mode Selector - Fixed height, centered content */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '20px',
                flexShrink: 0
            }}>
                <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />
            </div>

            {/* SECTION 3: Game Cards - Takes remaining space, centered content */}
            <div
                {...handlers}
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <div
                    key={currentMode}
                    style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        padding: '0 8px',
                        width: '100%',
                        boxSizing: 'border-box',
                        animation: slideDirection
                            ? `slide-in-${slideDirection} 0.3s ease-out`
                            : 'none'
                    }}
                >
                    {filteredGames.map(game => (
                        <GameCard
                            key={game.name}
                            name={game.name}
                            available={game.available}
                            color={game.color}
                            onClick={() => handleClick(game.name, game.route)}
                        />
                    ))}
                </div>
            </div>

            {/* Settings Button */}
            <SettingsButton />
        </div>
    );
}

export default LandingPage;