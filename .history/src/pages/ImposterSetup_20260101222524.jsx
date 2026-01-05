import { useState } from 'react';
import BackButton from '../components/BackButton';
import HelpButton from '../components/HelpButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ImposterSetup() {
    const navigate = useNavigate();
    const location = useLocation();

    // Keep player list if coming back from game
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState(location.state?.players || []);

    const addPlayer = () => {
        if (playerName.trim() && !players.includes(playerName.trim())) {
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

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newPlayers = Array.from(players);
        const [removed] = newPlayers.splice(result.source.index, 1);
        newPlayers.splice(result.destination.index, 0, removed);

        setPlayers(newPlayers);
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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="players">
                            {(provided) => (
                                <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ listStyle: 'none', padding: 0, margin: 0 }}
                                >
                                    {players.map((player, index) => (
                                        <Draggable key={player} draggableId={player} index={index}>
                                            {(provided, snapshot) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        fontSize: '1.3rem',
                                                        margin: '15px 0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        backgroundColor: snapshot.isDragging ? '#444' : '#333',
                                                        padding: '10px 20px',
                                                        borderRadius: '10px',
                                                        userSelect: 'none',
                                                        ...provided.draggableProps.style
                                                    }}
                                                >
                                                    <span>
                                                        <span style={{ marginRight: '10px', color: '#999', cursor: 'grab' }}>☰</span>
                                                        {index + 1}. {player}
                                                    </span>
                                                    <button
                                                        onClick={() => removePlayer(index)}
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
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
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