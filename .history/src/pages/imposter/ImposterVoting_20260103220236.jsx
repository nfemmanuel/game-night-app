import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BackButton from '../../components/BackButton';
import HelpButton from '../../components/HelpButton';

function ImposterVoting() {
    const location = useLocation();
    const navigate = useNavigate();
    const { players, imposter, word } = location.state || {};

    const [guess, setGuess] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [skipped, setSkipped] = useState(false);

    // Random player to start next round
    const [nextStarter] = useState(() =>
        players ? players[Math.floor(Math.random() * players.length)] : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (guess.trim()) {
            const correct = guess.trim().toLowerCase() === imposter.toLowerCase();
            setIsCorrect(correct);
            setRevealed(true);
        }
    };

    const revealImposter = () => {
        setSkipped(true);
        setRevealed(true);
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
            padding: '20px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <BackButton to="/imposter-setup" preserveState={true} />
            <HelpButton />
            <h1>IMPOSTER - VOTING</h1>

            {!revealed ? (
                <>
                    <div style={{
                        backgroundColor: '#333',
                        padding: '30px',
                        borderRadius: '15px',
                        marginBottom: '40px',
                        border: '2px solid #4A90E2',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <p style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#999' }}>
                            Round starts with:
                        </p>
                        <p style={{ fontSize: '2.5rem', color: '#4A90E2', fontWeight: 'bold' }}>
                            {nextStarter}
                        </p>
                    </div>

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
                                marginBottom: '20px',
                                justifyContent: 'center',
                                alignItems: 'center',
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
                                maxWidth: '400px',
                                marginBottom: '15px'
                            }}
                        >
                            Submit Guess
                        </button>
                    </form>

                    <button
                        onClick={revealImposter}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            backgroundColor: 'transparent',
                            border: '2px solid #666',
                            color: '#999',
                            cursor: 'pointer',
                            width: '100%',
                            maxWidth: '400px',
                            borderRadius: '5px'
                        }}
                    >
                        Skip Vote - Reveal Imposter
                    </button>

                    <p style={{ fontSize: '1rem', color: '#666', marginTop: '30px' }}>
                        Players: {players.join(', ')}
                    </p>
                </>
            ) : (
                <>
                    {!skipped && (
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '30px',
                            color: isCorrect ? '#4CAF50' : '#E74C3C'
                        }}>
                            {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
                        </div>
                    )}

                    <p style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                        The imposter was: <strong style={{ color: '#E74C3C' }}>{imposter}</strong>
                    </p>

                    <p style={{ fontSize: '1.8rem', marginBottom: '40px', color: '#4A90E2' }}>
                        The word was: <strong>{word}</strong>
                    </p>

                    {!skipped && (
                        isCorrect ? (
                            <p style={{ fontSize: '1.5rem', color: '#4CAF50', marginBottom: '40px' }}>
                                Great detective work! 🕵️
                            </p>
                        ) : (
                            <p style={{ fontSize: '1.5rem', color: '#E74C3C', marginBottom: '40px' }}>
                                The imposter fooled you! 🎭
                            </p>
                        )
                    )}

                    <button
                        onClick={playAgain}
                        style={{
                            padding: '20px 40px',
                            fontSize: '1.5rem',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '5px'
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