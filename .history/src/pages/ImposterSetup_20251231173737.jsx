import { useState } from 'react';
import HelpButton from '../components/HelpButton';
import { useNavigate, useLocation } from 'react-router-dom';

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

    const movePlayerUp = (index) => {
        if (index === 0) return;
        const newPlayers = [...players];
        [newPlayers[index - 1], newPlayers[index]] = [newPlayers[index], newPlayers[index - 1]];
        setPlayers(newPlayers);
    };

    const movePlayerDown = (index) => {
        if (index === players.length - 1) return;
        const newPlayers = [...players];
        [newPlayers[index], newPlayers[index + 1]] = [newPlayers[index + 1], newPlayers[index]];
        setPlayers(newPlayers);
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
        navigate('/imposter-reveal', {
            state: { players }
        });
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <BackButton to="/" />
            <HelpButton /
            <h1>IMPOSTER - SETUP</h1>

            <div style={{ marginTop: '40px' }}>
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
                        color: 'white'
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

            <div style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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

                {players.length === 0 ? (
                    <p style={{ color: '#999' }}>No players added yet. Add at least 3 to start!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {players.map((player, index) => (
                            <li key={index} style={{
                                fontSize: '1.3rem',
                                margin: '15px 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#333',
                                padding: '10px 20px',
                                borderRadius: '10px'
                            }}>
                                <span>{index + 1}. {player}</span>
                                <div>
                                    <button
                                        onClick={() => movePlayerUp(index)}
                                        disabled={index === 0}
                                        style={{
                                            padding: '5px 15px',
                                            marginRight: '5px',
                                            backgroundColor: index === 0 ? '#555' : '#4A90E2',
                                            color: 'white',
                                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                                            border: 'none',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => movePlayerDown(index)}
                                        disabled={index === players.length - 1}
                                        style={{
                                            padding: '5px 15px',
                                            marginRight: '5px',
                                            backgroundColor: index === players.length - 1 ? '#555' : '#4A90E2',
                                            color: 'white',
                                            cursor: index === players.length - 1 ? 'not-allowed' : 'pointer',
                                            border: 'none',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        ▼
                                    </button>
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
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={startGame}
                disabled={players.length < 3}
                style={{
                    marginTop: '40px',
                    padding: '20px 40px',
                    fontSize: '1.5rem',
                    backgroundColor: players.length >= 3 ? '#4CAF50' : '#666',
                    color: 'white',
                    cursor: players.length >= 3 ? 'pointer' : 'not-allowed',
                    opacity: players.length >= 3 ? 1 : 0.5
                }}
            >
                Start Game
            </button>
        </div>
    );
}

export default ImposterSetup;