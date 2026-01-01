import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ImposterVoting() {
    const location = useLocation();
    const navigate = useNavigate();
    const { players, imposter, word } = location.state || {};

    const [guess, setGuess] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (guess.trim()) {
            const correct = guess.trim().toLowerCase() === imposter.toLowerCase();
            setIsCorrect(correct);
            setRevealed(true);
        }
    };

    const playAgain = () => {
        navigate('/imposter-setup', {
            state: { players }
        });
    };

    if (!players || !imposter) {
        navigate('/imposter-setup');
        return null;
    }

    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <h1>IMPOSTER - VOTING</h1>

            {!revealed ? (
                <>
                    <p style={{ fontSize: '1.5rem', margin: '40px 0' }}>
                        The word was: <strong style={{ color: '#4A90E2' }}>{word}</strong>
                    </p>
                    <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#999' }}>
                        Who do you think was the imposter?
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Enter player name"
                            style={{
                                padding: '15px',
                                fontSize: '1.5rem',
                                borderRadius: '5px',
                                border: '2px solid white',
                                width: '100%',
                                maxWidth: '400px',
                                fontFamily: 'inherit',
                                backgroundColor: '#333',
                                color: 'white',
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}
                            autoFocus
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '20px 40px',
                                fontSize: '1.5rem',
                                backgroundColor: '#FF6B35',
                                color: 'white',
                                cursor: 'pointer',
                                width: '100%',
                                maxWidth: '400px'
                            }}
                        >
                            Submit Guess
                        </button>
                    </form>

                    <p style={{ fontSize: '1rem', color: '#666', marginTop: '20px' }}>
                        Players: {players.join(', ')}
                    </p>
                </>
            ) : (
                <>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '30px',
                        color: isCorrect ? '#4CAF50' : '#E74C3C'
                    }}>
                        {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
                    </div>

                    <p style={{ fontSize: '2rem', marginBottom: '40px' }}>
                        The imposter was: <strong style={{ color: '#E74C3C' }}>{imposter}</strong>
                    </p>

                    {isCorrect ? (
                        <p style={{ fontSize: '1.5rem', color: '#4CAF50', marginBottom: '40px' }}>
                            Great detective work! 🕵️
                        </p>
                    ) : (
                        <p style={{ fontSize: '1.5rem', color: '#E74C3C', marginBottom: '40px' }}>
                            The imposter fooled you! 🎭
                        </p>
                    )}

                    <button
                        onClick={playAgain}
                        style={{
                            padding: '20px 40px',
                            fontSize: '1.5rem',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Play Again
                    </button>
                </>
            )}
        </div>
    );
}

export default ImposterVoting;