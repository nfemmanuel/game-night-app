import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import UnoCard from '../../components/uno/UnoCard';
import GameState from '../../logic/uno/GameState';
import Player from '../../logic/uno/Player';

function UnoGame() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [game, setGame] = useState(null);
    const [, forceUpdate] = useState(0); // Force re-render without breaking game object
    const [selectedCard, setSelectedCard] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [gameMessage, setGameMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    // Initialize game on mount
    useEffect(() => {
        const players = [
            new Player('You', true),
            new Player('CPU', false)
        ];
        const newGame = new GameState(players);
        setGame(newGame);
        setGameMessage("Your turn!");
    }, []);

    // Trigger re-render without breaking game object
    const updateGame = () => {
        forceUpdate(n => n + 1);
    };

    if (!game) {
        return <div>Loading...</div>;
    }

    const currentPlayer = game.players[game.currentPlayerIndex];
    const isPlayerTurn = currentPlayer.isHuman;
    const validCards = currentPlayer.hand.filter(card => game.canPlay(card));

    // Handle card click
    const handleCardClick = (card) => {
        if (!isPlayerTurn || isAnimating) return;

        if (!game.canPlay(card)) {
            setGameMessage("Can't play that card!");
            return;
        }

        // If wild card, show color picker
        if (card.card_type === 'wild') {
            setSelectedCard(card);
            setShowColorPicker(true);
        } else {
            playCard(card);
        }
    };

    // Play a card
    const playCard = (card, chosenColor = null) => {
        setIsAnimating(true);

        const success = game.playCard(currentPlayer, card, chosenColor);

        if (success) {
            setGameMessage(`You played ${card.toString()}`);
            setShowColorPicker(false);
            setSelectedCard(null);

            // Check for winner
            const winner = game.checkWinner();
            if (winner) {
                setTimeout(() => {
                    alert(`${winner.name} wins!`);
                    navigate('/');
                }, 500);
                return;
            }

            // Move to next turn
            game.nextTurn();
            updateGame();

            // CPU turn after delay
            setTimeout(() => {
                setIsAnimating(false);
                if (!game.players[game.currentPlayerIndex].isHuman) {
                    cpuTurn();
                }
            }, 800);
        } else {
            setIsAnimating(false);
        }
    };

    // Handle draw card
    const handleDrawCard = () => {
        if (!isPlayerTurn || isAnimating) return;

        setIsAnimating(true);

        let drawnCard = game.deck.draw();

        if (!drawnCard) {
            game.reshuffleDiscard();
            drawnCard = game.deck.draw();
        }

        if (drawnCard) {
            currentPlayer.hand.push(drawnCard);
            setGameMessage(`You drew: ${drawnCard.toString()}`);
            updateGame();

            // Check if drawn card can be played
            if (game.canPlay(drawnCard)) {
                setTimeout(() => {
                    const playDrawn = window.confirm(`You drew ${drawnCard.toString()}. Play it?`);
                    if (playDrawn) {
                        if (drawnCard.card_type === 'wild') {
                            setSelectedCard(drawnCard);
                            setShowColorPicker(true);
                            setIsAnimating(false);
                        } else {
                            playCard(drawnCard);
                        }
                    } else {
                        endTurn();
                    }
                }, 500);
            } else {
                setTimeout(() => endTurn(), 800);
            }
        }
    };

    // End turn and move to CPU
    const endTurn = () => {
        game.nextTurn();
        updateGame();
        setIsAnimating(false);

        if (!game.players[game.currentPlayerIndex].isHuman) {
            setTimeout(() => cpuTurn(), 500);
        }
    };

    // CPU turn logic
    const cpuTurn = () => {
        setIsAnimating(true);
        const cpu = game.players[game.currentPlayerIndex];
        const validCards = cpu.hand.filter(card => game.canPlay(card));

        setGameMessage("CPU is thinking...");

        setTimeout(() => {
            if (validCards.length > 0) {
                // Simple AI: play first valid card
                const cardToPlay = validCards[0];

                let chosenColor = null;
                if (cardToPlay.card_type === 'wild') {
                    // Pick color with most cards in hand
                    const colorCount = { red: 0, yellow: 0, green: 0, blue: 0 };
                    cpu.hand.forEach(card => {
                        if (card.color && colorCount[card.color] !== undefined) {
                            colorCount[card.color]++;
                        }
                    });
                    chosenColor = Object.keys(colorCount).reduce((a, b) =>
                        colorCount[a] > colorCount[b] ? a : b
                    );
                }

                game.playCard(cpu, cardToPlay, chosenColor);
                setGameMessage(`CPU played ${cardToPlay.toString()}`);
                updateGame();

                // Check for winner
                const winner = game.checkWinner();
                if (winner) {
                    setTimeout(() => {
                        alert(`${winner.name} wins!`);
                        navigate('/');
                    }, 500);
                    return;
                }

                game.nextTurn();
                updateGame();

                setTimeout(() => {
                    setIsAnimating(false);
                    setGameMessage("Your turn!");
                }, 800);
            } else {
                // CPU draws a card
                let drawnCard = game.deck.draw();
                if (!drawnCard) {
                    game.reshuffleDiscard();
                    drawnCard = game.deck.draw();
                }

                if (drawnCard) {
                    cpu.hand.push(drawnCard);
                    setGameMessage("CPU drew a card");
                    updateGame();

                    // Check if can play drawn card
                    if (game.canPlay(drawnCard)) {
                        setTimeout(() => {
                            let chosenColor = null;
                            if (drawnCard.card_type === 'wild') {
                                const colorCount = { red: 0, yellow: 0, green: 0, blue: 0 };
                                cpu.hand.forEach(card => {
                                    if (card.color && colorCount[card.color] !== undefined) {
                                        colorCount[card.color]++;
                                    }
                                });
                                chosenColor = Object.keys(colorCount).reduce((a, b) =>
                                    colorCount[a] > colorCount[b] ? a : b
                                );
                            }

                            game.playCard(cpu, drawnCard, chosenColor);
                            setGameMessage(`CPU played ${drawnCard.toString()}`);
                            updateGame();
                            game.nextTurn();
                            updateGame();

                            setTimeout(() => {
                                setIsAnimating(false);
                                setGameMessage("Your turn!");
                            }, 800);
                        }, 800);
                    } else {
                        game.nextTurn();
                        updateGame();
                        setTimeout(() => {
                            setIsAnimating(false);
                            setGameMessage("Your turn!");
                        }, 800);
                    }
                }
            }
        }, 1000);
    };

    // Color picker for wild cards
    const handleColorChoice = (color) => {
        if (selectedCard) {
            playCard(selectedCard, color);
        }
    };

    const topCard = game.getTopCard();
    const playerHand = game.players[0].hand;
    const cpuHand = game.players[1].hand;

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <BackButton to="/" />

            {/* CPU Hand */}
            <div style={{
                textAlign: 'center',
                marginTop: '60px',
                marginBottom: '20px'
            }}>
                <h3 style={{ marginBottom: '10px', color: theme.textSecondary }}>
                    CPU - {cpuHand.length} cards
                </h3>
                <div style={{ display: 'flex', gap: '-40px', justifyContent: 'center' }}>
                    {cpuHand.map((_, idx) => (
                        <UnoCard key={idx} faceDown={true} size="small" />
                    ))}
                </div>
            </div>

            {/* Game Area - Deck and Discard Pile */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '40px',
                flexDirection: 'column'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    {/* Deck */}
                    <div style={{ textAlign: 'center' }}>
                        <UnoCard
                            faceDown={true}
                            onClick={handleDrawCard}
                            isPlayable={isPlayerTurn && !isAnimating}
                        />
                        <p style={{
                            marginTop: '10px',
                            fontSize: '0.9rem',
                            color: theme.textSecondary
                        }}>
                            Draw Card
                        </p>
                    </div>

                    {/* Top Card */}
                    <div style={{ textAlign: 'center' }}>
                        <UnoCard
                            card={topCard}
                            isPlayable={false}
                        />
                        <p style={{
                            marginTop: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: theme.textPrimary
                        }}>
                            Current: {game.currentColor}
                        </p>
                    </div>
                </div>

                {/* Game Message */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: '15px 30px',
                    borderRadius: '10px',
                    border: `2px solid ${theme.accent}`,
                    minWidth: '300px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '1.2rem', margin: 0 }}>{gameMessage}</p>
                </div>
            </div>

            {/* Player Hand */}
            <div style={{
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px'
            }}>
                <h3 style={{ marginBottom: '15px' }}>Your Hand</h3>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {playerHand.map((card, idx) => (
                        <UnoCard
                            key={idx}
                            card={card}
                            isPlayable={isPlayerTurn && !isAnimating && game.canPlay(card)}
                            onClick={() => handleCardClick(card)}
                        />
                    ))}
                </div>
            </div>

            {/* Color Picker Modal */}
            {showColorPicker && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: theme.bgMedium,
                        padding: '40px',
                        borderRadius: '15px',
                        border: `3px solid ${theme.light}`,
                        textAlign: 'center'
                    }}>
                        <h2 style={{ marginBottom: '30px' }}>Choose a Color</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px'
                        }}>
                            {['red', 'yellow', 'green', 'blue'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleColorChoice(color)}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '10px',
                                        border: '3px solid white',
                                        backgroundColor: {
                                            red: '#E74C3C',
                                            yellow: '#F39C12',
                                            green: '#27AE60',
                                            blue: '#3498DB'
                                        }[color],
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontFamily: 'inherit',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnoGame;