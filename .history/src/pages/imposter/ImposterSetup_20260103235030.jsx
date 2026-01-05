import { useState } from 'react';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
        cursor: 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        border: `2px solid ${theme.secondary}`
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span style={{ color: theme.textPrimary }}>
                <span style={{ marginRight: '10px', color: theme.textSecondary }}>☰</span>
                {index + 1}. {player}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                style={{
                    padding: '5px 15px',
                    backgroundColor: theme.danger,
                    color: theme.textPrimary,
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '5px'
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
            state: { players }
        });
    };

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
            <HelpButton />

            {/* SECTION 1: Title */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '10px',
                flexShrink: 0
            }}>
                <h1 className="page-title">IMPOSTER - SETUP</h1>
            </div>

            {/* SECTION 2: Input Section */}
            <div style={{
                textAlign: 'center',
                paddingBottom: '20px',
                flexShrink: 0
            }}>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter player name"
                    style={{
                        padding: '15px',
                        fontSize: '1.2rem',
                        borderRadius: '5px',
                        border: `2px solid ${theme.light}`,
                        width: '300px',
                        marginRight: '10px',
                        fontFamily: 'inherit',
                        backgroundColor: theme.bgDark,
                        color: theme.textPrimary,
                    }}
                />
                <button
                    onClick={addPlayer}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        backgroundColor: theme.accent,
                        color: theme.textPrimary
                    }}
                >
                    Add
                </button>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                    maxWidth: '600px',
                    margin: '20px auto 0'
                }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: theme.textPrimary }}>
                        Players ({players.length})
                    </div>
                    {players.length > 0 && (
                        <button
                            onClick={resetPlayers}
                            style={{
                                padding: '10px 20px',
                                fontSize: '1rem',
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
                        <p style={{ color: theme.textSecondary, textAlign: 'center' }}>
                            No players added yet. Add at least 3 to start!
                        </p>
                    ) : (
                        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                <footer style={{ flexShrink: 0 }}>
                    <button
                        onClick={startGame}
                        disabled={players.length < 3}
                        style={{
                            padding: '20px 40px',
                            fontSize: '1.5rem',
                            backgroundColor: players.length >= 3 ? theme.success : theme.textDisabled,
                            color: theme.textPrimary,
                            cursor: players.length >= 3 ? 'pointer' : 'not-allowed',
                            opacity: players.length >= 3 ? 1 : 0.5,
                            width: '100%'
                        }}
                    >
                        Start Game
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default ImposterSetup;