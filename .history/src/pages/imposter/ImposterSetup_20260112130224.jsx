import { useState } from 'react';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SettingsButton from '../../components/SettingsButton';
import SocialButton from '../../components/SocialButton';
import { useTheme } from '../../contexts/ThemeContext';

// Sortable Item Component
function SortablePlayer({ id, player, index, onRemove, theme }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        fontSize: '1.3rem',
        margin: '15px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDragging ? theme.bgLight : theme.bgDark,
        padding: '10px 20px',
        borderRadius: '10px',
        userSelect: 'none',
        touchAction: 'none',  // CRITICAL: Prevents browser scroll during drag
        opacity: isDragging ? 0.5 : 1,
        border: `2px solid ${theme.secondary}`
    };

    return (
        <li ref={setNodeRef} style={style}>
            <span
                {...attributes}
                {...listeners}
                style={{
                    color: theme.textPrimary,
                    flex: 1,
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <span style={{ marginRight: '10px', color: theme.textSecondary }}>☰</span>
                {index + 1}. {player}
            </span>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove();
                }}
                onPointerDown={(e) => {
                    e.stopPropagation();
                }}
                onTouchStart={(e) => {
                    e.stopPropagation();
                }}
                style={{
                    padding: '5px 15px',
                    backgroundColor: theme.danger,
                    color: theme.textPrimary,
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '5px',
                    flexShrink: 0
                }}
            >
                ✕
            </button>
        </li>
    );
}

function ImposterSetup() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();

    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState(location.state?.players || []);
    const [numImposters, setNumImposters] = useState(1); // NEW: Number of imposters
    const [hintsEnabled, setHintsEnabled] = useState(false); // NEW: Hints toggle

    const isMobile = window.innerWidth <= 768;

    // Add sensors for both mouse and touch
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        })
    );

    const addPlayer = () => {
        if (playerName.trim()) {
            setPlayers([...players, playerName.trim()]);
            setPlayerName('');
        }
    };

    const removePlayer = (indexToRemove) => {
        setPlayers(players.filter((_, index) => index !== indexToRemove));
    };

    const resetPlayers = () => {
        setPlayers([]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addPlayer();
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setPlayers((items) => {
                const oldIndex = parseInt(active.id);
                const newIndex = parseInt(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const startGame = () => {
        navigate('/imposter-reveal', {
            state: { 
                players,
                numImposters, // Pass number of imposters
                hintsEnabled  // Pass hints setting
            }
        });
    };

    // Determine minimum players based on imposters
    const minPlayers = numImposters + 2; // At least 2 more than imposters

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            maxHeight: '100vh',  // ADDED: Prevent page from growing
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            overflow: 'hidden'  // ADDED: Prevent whole page scroll
        }}>
            <BackButton to="/" />
            <HelpButton helpText="Add at least 3 players, then start the game. Select how many imposters and whether to enable hints!" />

            {/* SECTION 1: Title */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0,
                marginTop: isMobile ? '50px' : '10px'
            }}>
                <h1 className="page-title">IMPOSTER - SETUP</h1>
            </div>

            {/* SECTION 2: Input Section */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '20px',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter player name"
                        style={{
                            padding: isMobile ? '12px' : '15px',
                            fontSize: isMobile ? '1rem' : '1.2rem',
                            borderRadius: '5px',
                            border: `2px solid ${theme.light}`,
                            width: isMobile ? 'calc(100% - 20px)' : '300px',
                            maxWidth: isMobile ? '300px' : '300px',
                            fontFamily: 'inherit',
                            backgroundColor: theme.bgDark,
                            color: theme.textPrimary,
                        }}
                    />
                    <button
                        onClick={addPlayer}
                        style={{
                            padding: isMobile ? '12px 24px' : '15px 30px',
                            fontSize: isMobile ? '1rem' : '1.2rem',
                            backgroundColor: theme.accent,
                            color: theme.textPrimary,
                            width: isMobile ? 'calc(100% - 20px)' : 'auto',
                            maxWidth: isMobile ? '300px' : 'none'
                        }}
                    >
                        Add
                    </button>
                </div>

                {/* NEW: Game Settings */}
                <div style={{
                    maxWidth: '600px',
                    margin: '20px auto',
                    padding: '15px',
                    backgroundColor: theme.bgDark,
                    borderRadius: '10px',
                    border: `2px solid ${theme.secondary}`
                }}>
                    <h3 style={{ marginTop: 0, color: theme.textPrimary, fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
                        Game Settings
                    </h3>
                    
                    {/* Number of Imposters */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            fontFamily: 'inherit'
                        }}>
                            <span>Number of Imposters:</span>
                            <select 
                                value={numImposters}
                                onChange={(e) => setNumImposters(parseInt(e.target.value))}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: isMobile ? '1rem' : '1.1rem',
                                    borderRadius: '5px',
                                    border: `2px solid ${theme.light}`,
                                    backgroundColor: theme.bgMedium,
                                    color: theme.textPrimary,
                                    cursor: 'pointer'
                                }}
                            >
                                <option value={1}>1 Imposter</option>
                                <option value={2}>2 Imposters</option>
                                <option value={3}>3 Imposters</option>
                            </select>
                        </label>
                    </div>

                    {/* Hints Toggle */}
                    <div>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={hintsEnabled}
                                onChange={(e) => setHintsEnabled(e.target.checked)}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span>Enable Imposter Hints</span>
                        </label>
                        {hintsEnabled && (
                            <p style={{ 
                                fontSize: isMobile ? '0.85rem' : '0.95rem',
                                color: theme.textSecondary,
                                marginTop: '5px',
                                marginLeft: '30px'
                            }}>
                                Each imposter will get a unique hint word
                            </p>
                        )}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                    maxWidth: '600px',
                    margin: '20px auto 0',
                    padding: '0 10px'
                }}>
                    <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 'bold', color: theme.textPrimary }}>
                        Players ({players.length})
                    </div>
                    {players.length > 0 && (
                        <button
                            onClick={resetPlayers}
                            style={{
                                padding: '10px 20px',
                                fontSize: isMobile ? '0.9rem' : '1rem',
                                backgroundColor: theme.danger,
                                color: theme.textPrimary,
                                cursor: 'pointer'
                            }}
                        >
                            Reset All
                        </button>
                    )}
                </div>
            </div>

            {/* SECTION 3: Player List (Scrollable) + Start Button */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%'
            }}>
                {/* Scrollable Player List */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: '20px',
                    minHeight: 0
                }}>
                    {players.length === 0 ? (
                        <p style={{ color: theme.textSecondary, textAlign: 'center', padding: '0 20px' }}>
                            No players added yet. Add at least {minPlayers} to start!
                        </p>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={players.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {players.map((player, index) => (
                                        <SortablePlayer
                                            key={index}
                                            id={index.toString()}
                                            player={player}
                                            index={index}
                                            onRemove={() => removePlayer(index)}
                                            theme={theme}
                                        />
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                {/* Fixed Start Button */}
                <footer style={{ flexShrink: 0, marginBottom: '80px' }}>
                    <button
                        onClick={startGame}
                        disabled={players.length < minPlayers}
                        style={{
                            padding: isMobile ? '15px 30px' : '20px 40px',
                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                            backgroundColor: players.length >= minPlayers ? theme.success : theme.textDisabled,
                            color: theme.textPrimary,
                            cursor: players.length >= minPlayers ? 'pointer' : 'not-allowed',
                            opacity: players.length >= minPlayers ? 1 : 0.5,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Start Game
                    </button>
                    {players.length < minPlayers && players.length > 0 && (
                        <p style={{ 
                            textAlign: 'center', 
                            color: theme.textSecondary, 
                            marginTop: '10px',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                        }}>
                            Need at least {minPlayers} players for {numImposters} imposter{numImposters > 1 ? 's' : ''}
                        </p>
                    )}
                </footer>
            </div>
            {/* Settings Button */}
            <SettingsButton />
            <SocialButton />
        </div>
    );
}

export default ImposterSetup;