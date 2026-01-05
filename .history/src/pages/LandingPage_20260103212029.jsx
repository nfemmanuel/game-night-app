import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from '../components/GameCard';
import ModeSelector from '../components/ModeSelector';
import SettingsButton from '../components/SettingsButton';
import SocialButton from '../components/SocialButton';

function LandingPage() {
    const navigate = useNavigate();
    const [currentMode, setCurrentMode] = useState('in-person');
    const [direction, setDirection] = useState(0);

    const games = [
        { name: "Mafia", modes: ["in-person"], route: "/mafia-setup", available: false, color: "blue" },
        { name: "Imposter", modes: ["in-person", "virtual"], route: "/imposter-setup", available: true, color: "orange" },
        { name: "Trio", modes: ["in-person", "virtual", "single"], route: "/trio-setup", available: false, color: "orange" },
        { name: "UNO", modes: ["virtual", "single"], route: "/uno-setup", available: false, color: "blue" },
        { name: "UNO: Show 'Em No Mercy", modes: ["virtual", "single"], route: "/uno-nm-setup", available: false, color: "orange" },
        { name: "Charades", modes: ["in-person"], route: "/charades-setup", available: false, color: "blue" }
    ];

    const modes = ['in-person', 'virtual', 'single'];
    const currentIndex = modes.indexOf(currentMode);
    const filteredGames = games.filter(game => game.modes.includes(currentMode));

    const handleClick = (gameName, route) => {
        if (route) {
            navigate(route);
        }
    };

    const paginate = (newDirection) => {
        const newIndex = currentIndex + newDirection;
        if (newIndex >= 0 && newIndex < modes.length) {
            setDirection(newDirection);
            setCurrentMode(modes[newIndex]);
        }
    };

    const handleModeChange = (newMode) => {
        const newIndex = modes.indexOf(newMode);
        setDirection(newIndex > currentIndex ? 1 : -1);
        setCurrentMode(newMode);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
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
            {/* SECTION 1: Title */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0
            }}>
                <h1 style={{ margin: '10px 0' }}>GAME NIGHT</h1>
            </div>

            {/* SECTION 2: Mode Selector */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '20px',
                flexShrink: 0
            }}>
                <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />
            </div>

            {/* SECTION 3: Game Cards with Drag-to-Swipe */}
            <div
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
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentMode}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1); // Swipe left = next
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1); // Swipe right = previous
                            }
                        }}
                        style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            padding: '0 8px',
                            width: '100%',
                            boxSizing: 'border-box',
                            position: 'absolute',
                            cursor: 'grab'
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
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Settings Button */}
            <SettingsButton />
        <SocialBButton/>
        </div >
    );
}

export default LandingPage;