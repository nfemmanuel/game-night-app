import { useState } from 'react';
import BackButton from '../components/BackButton';
import HelpButton from '../components/HelpButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortablePlayer({ id, player, index, onRemove }) {
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
        backgroundColor: isDragging ? '#444' : '#333',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span>
                <span style={{ marginRight: '10px', color: '#999' }}>☰</span>
                {index + 1}. {player}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                style={{
                    padding: '5px 15px',
                    backgroundColor: '#E74C3C',
                    color: 'white',
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

        if (active.id !== over.id) {
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
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            height: 'calc(100vh - 80px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <BackButton to="/" />
            <HelpButton />

            <h1 className="page-title">IMPOSTER - SETUP</h1>

            {/* Input section - fixed */}
            <div style={{ marginBottom: '20px', flexShrink: 0 }}>
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
                        border: '2px solid white',
                        width: '300px',
                        marginRight: '10px',
                        fontFamily: 'inherit',
                        backgroundColor: '#333',
                        color: 'white',
                    }}
                />
                <button
                    onClick={addPlayer}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        backgroundColor: '#FF6B35',
                        color: 'white'
                    }}
                >
                    Add
                </button>
            </div>

            {/* Player list header - fixed */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                flexShrink: 0
            }}>
                <h2>Players ({players.length})</h2>
                {players.length > 0 && (
                    <button
                        onClick={resetPlayers}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1rem',
                            backgroundColor: '#E74C3C',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Reset All
                    </button>
                )}
            </div>

            {/* SCROLLABLE PLAYER LIST - Drag and drop enabled */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '20px',
                minHeight: 0
            }}>
                {players.length === 0 ? (
                    <p style={{ color: '#999' }}>No players added yet. Add at least 3 to start!</p>
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
                                    />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* START BUTTON - Sticky at bottom */}
            <footer style={{ flexShrink: 0 }}>
                <button
                    onClick={startGame}
                    disabled={players.length < 3}
                    style={{
                        padding: '20px 40px',
                        fontSize: '1.5rem',
                        backgroundColor: players.length >= 3 ? '#4CAF50' : '#666',
                        color: 'white',
                        cursor: players.length >= 3 ? 'pointer' : 'not-allowed',
                        opacity: players.length >= 3 ? 1 : 0.5,
                        width: '100%'
                    }}
                >
                    Start Game
                </button>
            </footer>
        </div>
    );
}

export default ImposterSetup;