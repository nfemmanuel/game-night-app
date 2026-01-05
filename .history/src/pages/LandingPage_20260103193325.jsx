import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import GameCard from '../components/GameCard';
import ModeSelector from '../components/ModeSelector';
import SettingsButton from '../components/SettingsButton';

function LandingPage() {
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState('in-person');

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

    // Swipe handlers
    const modes = ['in-person', 'virtual', 'single'];
    const currentIndex = modes.indexOf(currentMode);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentIndex < modes.length - 1) {
                setCurrentMode(modes[currentIndex + 1]);
            }
        },
        onSwipedRight: () => {
            if (currentIndex > 0) {
                setCurrentMode(modes[currentIndex - 1]);
            }
        },
        trackMouse: true
    });

    return (
        <div
            {...handlers}
            className="landing-page"
            style={{
                padding: '20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                overflow: 'hidden'
            }}
        >
            {/* Fixed Header */}
            <div style={{ flexShrink: 0 }}>
                <h1 style={{ marginBottom: '20px', marginTop: '20px' }}>GAME NIGHT</h1>
                <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />
            </div>

            {/* Vertically Centered Game Cards */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0
            }}>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    padding: '0 8px',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
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