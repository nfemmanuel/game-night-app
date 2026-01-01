import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ImposterSetup() {
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const addPlayer = () => {
        if (playerName.trim() && !players.includes(playerName.trim())) {
            setPlayers([...players, playerName.trim()]);
            setPlayerName('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addPlayer();
        }
    };

    const startGame = () => {
        // Navigate to reveal screen with game data
        navigate('/imposter-reveal', {
            state: { players }
        });
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
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
                        fontFamily: 'inherit'
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
                    Add Player
                </button>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2>Players ({players.length})</h2>
                {players.length === 0 ? (
                    <p style={{ color: '#999' }}>No players added yet. Add at least 3 to start!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {players.map((player, index) => (
                            <li key={index} style={{ fontSize: '1.5rem', margin: '10px 0' }}>
                                {index + 1}. {player}
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
                    backgroundColor: players.length >= 3 ? '#4A90E2' : '#666',
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