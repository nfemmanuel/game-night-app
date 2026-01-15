import { useState } from 'react';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsButton from '../../components/SettingsButton';
import SocialButton from '../../components/SocialButton';
import { useTheme } from '../../contexts/ThemeContext';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Player Component
function SortablePlayer({ player, index, onRemove, theme }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: player });

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
        opacity: isDragging ? 0.5 : 1,
        border: `2px solid ${theme.secondary}`
    };

    return (
        <li ref={setNodeRef} style={style}>
            <span
                {...attributes}
                style={{
                    color: theme.textPrimary,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <span 
                    {...listeners}
                    style={{ 
                        marginRight: '10px', 
                        color: theme.textSecondary,
                        cursor: 'grab',
                        padding: '5px',
                        touchAction: 'none'
                    }}
                >
                    ☰
                </span>
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

function MafiaSetup() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();

    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState(() => {
        // Extract players from location.state
        // Could be an array of strings OR array of player objects
        const stateData = location.state?.players;
        
        if (!stateData) return [];
        
        // If it's an array of objects (from MafiaGame), extract names
        if (stateData.length > 0 && typeof stateData[0] === 'object') {
            return stateData.map(p => p.name);
        }
        
        // Otherwise it's already an array of strings
        return stateData;
    });
    const [numMafia, setNumMafia] = useState(1);
    const [discussionTime, setDiscussionTime] = useState(60);
    const [settingsExpanded, setSettingsExpanded] = useState(false); // For mobile collapsible

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
                delay: 150,
                tolerance: 5,
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPlayers((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

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

    const startGame = () => {
        navigate('/mafia-reveal', {
            state: { 
                players,
                numMafia,
                discussionTime
            }
        });
    };

    // Calculate role distribution
    const numDoctor = 1;
    const numDetective = 1;
    const numVillagers = Math.max(0, players.length - numMafia - numDoctor - numDetective);
    
    // Minimum players: mafia + doctor + detective + 2 villagers
    const minPlayers = numMafia + 3; // +3 for doctor, detective, at least 1 villager

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
            <BackButton to="/" />
            <HelpButton helpText="Add at least 5 players. Drag the ☰ icon to reorder players. Choose number of mafia and discussion time. Roles will be assigned randomly!" />

            {/* SECTION 1: Title */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0,
                marginTop: isMobile ? '50px' : '10px'
            }}>
                <h1 className="page-title">MAFIA - SETUP</h1>
            </div>

            {/* SECTION 2: Input Section */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '20px',
                flexShrink: 0,
                overflowY: 'auto'
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

                {/* Game Settings */}
                <div style={{
                    maxWidth: '600px',
                    margin: '20px auto',
                    backgroundColor: theme.bgDark,
                    borderRadius: '10px',
                    border: `2px solid ${theme.secondary}`
                }}>
                    {/* Collapsible Header (Mobile) / Regular Header (Desktop) */}
                    <div 
                        onClick={() => isMobile && setSettingsExpanded(!settingsExpanded)}
                        style={{ 
                            padding: '15px',
                            cursor: isMobile ? 'pointer' : 'default',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: (!isMobile || settingsExpanded) ? `1px solid ${theme.secondary}` : 'none'
                        }}
                    >
                        <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
                            Game Settings
                        </h3>
                        {isMobile && (
                            <span style={{ fontSize: '1.5rem', color: theme.textPrimary }}>
                                {settingsExpanded ? '▼' : '▶'}
                            </span>
                        )}
                    </div>
                    
                    {/* Settings Content - Always visible on desktop, collapsible on mobile */}
                    {(!isMobile || settingsExpanded) && (
                        <div style={{ padding: '15px' }}>
                            {/* Number of Mafia */}
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    fontSize: isMobile ? '1rem' : '1.1rem'
                                }}>
                                    <span>Number of Mafia:</span>
                                    <select 
                                        value={numMafia}
                                        onChange={(e) => setNumMafia(parseInt(e.target.value))}
                                        style={{
                                            fontFamily: 'inherit',
                                            padding: '8px 12px',
                                            fontSize: isMobile ? '1rem' : '1.1rem',
                                            borderRadius: '5px',
                                            border: `2px solid ${theme.light}`,
                                            backgroundColor: theme.bgMedium,
                                            color: theme.textPrimary,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value={1}>1 Mafia</option>
                                        <option value={2}>2 Mafia</option>
                                        <option value={3}>3 Mafia</option>
                                    </select>
                                </label>
                            </div>

                            {/* Discussion Time */}
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    fontSize: isMobile ? '1rem' : '1.1rem'
                                }}>
                                    <span>Discussion Time:</span>
                                    <select 
                                        value={discussionTime}
                                        onChange={(e) => setDiscussionTime(parseInt(e.target.value))}
                                        style={{
                                            fontFamily: 'inherit',
                                            padding: '8px 12px',
                                            fontSize: isMobile ? '1rem' : '1.1rem',
                                            borderRadius: '5px',
                                            border: `2px solid ${theme.light}`,
                                            backgroundColor: theme.bgMedium,
                                            color: theme.textPrimary,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value={30}>30 seconds</option>
                                        <option value={60}>60 seconds</option>
                                        <option value={90}>90 seconds</option>
                                        <option value={120}>120 seconds</option>
                                    </select>
                                </label>
                            </div>

                            {/* Role Distribution Preview */}
                            <div style={{
                                marginTop: '15px',
                                padding: '10px',
                                backgroundColor: theme.bgMedium,
                                borderRadius: '5px',
                                fontSize: isMobile ? '0.9rem' : '1rem'
                            }}>
                                <p style={{ margin: '5px 0', color: theme.textSecondary }}>
                                    <strong>Roles ({players.length} players):</strong>
                                </p>
                                <p style={{ margin: '5px 0', color: theme.danger }}>
                                    🔴 Mafia: {numMafia}
                                </p>
                                <p style={{ margin: '5px 0', color: theme.success }}>
                                    💚 Doctor: {numDoctor}
                                </p>
                                <p style={{ margin: '5px 0', color: theme.accent }}>
                                    🔍 Detective: {numDetective}
                                </p>
                                <p style={{ margin: '5px 0', color: theme.textPrimary }}>
                                    👥 Villagers: {numVillagers}
                                </p>
                            </div>
                        </div>
                    )}
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
                            <SortableContext
                                items={players}
                                strategy={verticalListSortingStrategy}
                            >
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {players.map((player, index) => (
                                        <SortablePlayer
                                            key={player}
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
                            Need at least {minPlayers} players ({numMafia} mafia + doctor + detective + villagers)
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

export default MafiaSetup;