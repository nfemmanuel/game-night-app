import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import UnoCard from '../../components/uno/UnoCard';
import GameState from '../../logic/uno/GameState';
import Player from '../../logic/uno/Player';

function UnoGame() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();

    // Get settings from setup
    const {
        playerName = 'Player 1',
        numPlayers = 2,
        difficulty = 'medium',
        showCardCount = true
    } = location.state || {};

    const [game, setGame] = useState(null);
    const [, forceUpdate] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [gameMessage, setGameMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [showUnoMessage, setShowUnoMessage] = useState(false);
    const [unoPlayer, setUnoPlayer] = useState(null);
    const [lastHandSizes, setLastHandSizes] = useState([]);

    // Initialize game
    useEffect(() => {
        const players = [new Player(playerName, true)];

        for (let i = 1; i < numPlayers; i++) {
            players.push(new Player(`CPU ${i}`, false));
        }

        const newGame = new GameState(players);
        setGame(newGame);
        setLastHandSizes(players.map(p => p.hand.length));
        setGameMessage(`${playerName}'s turn!`);
    }, [playerName, numPlayers]);

    const updateGame = () => {
        forceUpdate(n => n + 1);
    };

    // Check for UNO
    useEffect(() => {
        if (!game) return;

        game.players.forEach((player, idx) => {
            if (player.hand.length === 1 && lastHandSizes[idx] > 1) {
                setUnoPlayer(player.name);
                setShowUnoMessage(true);
                setTimeout(() => {
                    setShowUnoMessage(false);
                    setUnoPlayer(null);
                }, 2000);
            }
        });

        setLastHandSizes(game.players.map(p => p.hand.length));
    }, [game?.players.map(p => p.hand.length).join(',')]);

    if (!game) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: theme.bgMedium,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textPrimary
            }}>
                Loading...
            </div>
        );
    }

    const currentPlayer = game.players[game.currentPlayerIndex];
    const isPlayerTurn = currentPlayer.isHuman;
    const humanPlayer = game.players.find(p => p.isHuman);
    const cpuPlayers = game.players.filter(p => !p.isHuman);

    // Handle card click
    const handleCardClick = (card) => {
        if (!isPlayerTurn || isAnimating) return;

        if (!game.canPlay(card)) {
            setGameMessage("❌ Can't play that card!");
            setTimeout(() => {
                setGameMessage(`${currentPlayer.name}'s turn!`);
            }, 1500);
            return;
        }

        if (card.card_type === 'wild') {
            setSelectedCard(card);
            setShowColorPicker(true);
        } else {
            playCard(card);
        }
    };

    // Play card
    const playCard = (card, chosenColor = null) => {
        setIsAnimating(true);

        setTimeout(() => {
            const success = game.playCard(currentPlayer, card, chosenColor);

            if (success) {
                setGameMessage(`${currentPlayer.name} played ${card.toString()}`);
                setShowColorPicker(false);
                setSelectedCard(null);
                updateGame();

                const winner = game.checkWinner();
                if (winner) {
                    setTimeout(() => {
                        alert(`🎉 ${winner.name} wins!`);
                        navigate('/uno-setup');
                    }, 1000);
                    return;
                }

                // Move to next turn
                game.nextTurn();
                updateGame();

                setTimeout(() => {
                    setIsAnimating(false);
                    const nextPlayer = game.players[game.currentPlayerIndex];
                    setGameMessage(`${nextPlayer.name}'s turn!`);

                    if (!nextPlayer.isHuman) {
                        setTimeout(() => cpuTurn(), 800);
                    }
                }, 600);
            } else {
                setIsAnimating(false);
            }
        }, 300);
    };

    // Draw card
    const handleDrawCard = () => {
        if (!isPlayerTurn || isAnimating) return;

        setIsAnimating(true);

        let card = game.deck.draw();
        if (!card) {
            game.reshuffleDiscard();
            card = game.deck.draw();
        }

        if (card) {
            currentPlayer.hand.push(card);
            updateGame();

            setGameMessage(`You drew: ${card.toString()}`);

            setTimeout(() => {
                if (game.canPlay(card)) {
                    const playIt = window.confirm(`You drew ${card.toString()}. Play it?`);
                    if (playIt) {
                        if (card.card_type === 'wild') {
                            setSelectedCard(card);
                            setShowColorPicker(true);
                            setIsAnimating(false);
                        } else {
                            playCard(card);
                        }
                    } else {
                        endTurn();
                    }
                } else {
                    endTurn();
                }
            }, 800);
        } else {
            setIsAnimating(false);
        }
    };

    const endTurn = () => {
        game.nextTurn();
        updateGame();
        setIsAnimating(false);

        const nextPlayer = game.players[game.currentPlayerIndex];
        setGameMessage(`${nextPlayer.name}'s turn!`);

        if (!nextPlayer.isHuman) {
            setTimeout(() => cpuTurn(), 800);
        }
    };

    // CPU turn
    const cpuTurn = () => {
        if (!game) return;

        const cpu = game.players[game.currentPlayerIndex];

        // Safety check
        if (cpu.isHuman) {
            setIsAnimating(false);
            setGameMessage(`${cpu.name}'s turn!`);
            return;
        }

        setIsAnimating(true);
        const validCards = cpu.hand.filter(card => game.canPlay(card));

        setGameMessage(`${cpu.name} is thinking...`);

        const thinkTime = difficulty === 'easy' ? 800 : difficulty === 'medium' ? 1200 : 1500;

        setTimeout(() => {
            if (validCards.length > 0) {
                let cardToPlay;

                // AI strategy
                if (difficulty === 'easy') {
                    // Random card
                    cardToPlay = validCards[Math.floor(Math.random() * validCards.length)];
                } else if (difficulty === 'medium') {
                    // Prioritize actions > numbers > wilds
                    const actions = validCards.filter(c => c.card_type === 'action');
                    const numbers = validCards.filter(c => c.card_type === 'number');
                    const wilds = validCards.filter(c => c.card_type === 'wild');

                    if (actions.length > 0) {
                        cardToPlay = actions[Math.floor(Math.random() * actions.length)];
                    } else if (numbers.length > 0) {
                        cardToPlay = numbers[Math.floor(Math.random() * numbers.length)];
                    } else {
                        cardToPlay = wilds[0];
                    }
                } else {
                    // Hard: prioritize actions, play high numbers
                    const actions = validCards.filter(c => c.card_type === 'action');
                    const numbers = validCards.filter(c => c.card_type === 'number');
                    const wilds = validCards.filter(c => c.card_type === 'wild');

                    if (actions.length > 0) {
                        cardToPlay = actions[0];
                    } else if (numbers.length > 0) {
                        numbers.sort((a, b) => parseInt(b.value) - parseInt(a.value));
                        cardToPlay = numbers[0];
                    } else {
                        cardToPlay = wilds[0];
                    }
                }

                let chosenColor = null;
                if (cardToPlay.card_type === 'wild') {
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

                setTimeout(() => {
                    game.playCard(cpu, cardToPlay, chosenColor);
                    setGameMessage(`${cpu.name} played ${cardToPlay.toString()}`);
                    updateGame();

                    const winner = game.checkWinner();
                    if (winner) {
                        setTimeout(() => {
                            alert(`🎉 ${winner.name} wins!`);
                            navigate('/uno-setup');
                        }, 1000);
                        return;
                    }

                    game.nextTurn();
                    updateGame();

                    setTimeout(() => {
                        const nextPlayer = game.players[game.currentPlayerIndex];
                        setIsAnimating(false);
                        setGameMessage(`${nextPlayer.name}'s turn!`);

                        if (!nextPlayer.isHuman) {
                            setTimeout(() => cpuTurn(), 500);
                        }
                    }, 800);
                }, 400);
            } else {
                // CPU draws
                let card = game.deck.draw();
                if (!card) {
                    game.reshuffleDiscard();
                    card = game.deck.draw();
                }

                if (card) {
                    cpu.hand.push(card);
                    setGameMessage(`${cpu.name} drew a card`);
                    updateGame();

                    setTimeout(() => {
                        if (game.canPlay(card)) {
                            let chosenColor = null;
                            if (card.card_type === 'wild') {
                                const colorCount = { red: 0, yellow: 0, green: 0, blue: 0 };
                                cpu.hand.forEach(c => {
                                    if (c.color && colorCount[c.color] !== undefined) {
                                        colorCount[c.color]++;
                                    }
                                });
                                chosenColor = Object.keys(colorCount).reduce((a, b) =>
                                    colorCount[a] > colorCount[b] ? a : b
                                );
                            }

                            game.playCard(cpu, card, chosenColor);
                            setGameMessage(`${cpu.name} played the drawn card`);
                            updateGame();

                            game.nextTurn();
                            updateGame();

                            setTimeout(() => {
                                const nextPlayer = game.players[game.currentPlayerIndex];
                                setIsAnimating(false);
                                setGameMessage(`${nextPlayer.name}'s turn!`);

                                if (!nextPlayer.isHuman) {
                                    setTimeout(() => cpuTurn(), 500);
                                }
                            }, 800);
                        } else {
                            game.nextTurn();
                            updateGame();

                            setTimeout(() => {
                                const nextPlayer = game.players[game.currentPlayerIndex];
                                setIsAnimating(false);
                                setGameMessage(`${nextPlayer.name}'s turn!`);

                                if (!nextPlayer.isHuman) {
                                    setTimeout(() => cpuTurn(), 500);
                                }
                            }, 800);
                        }
                    }, 1000);
                }
            }
        }, thinkTime);
    };

    const handleColorChoice = (color) => {
        if (selectedCard) {
            playCard(selectedCard, color);
        }
    };

    const handleRestart = () => {
        if (window.confirm('Start a new game? Current progress will be lost.')) {
            navigate('/uno-setup');
        }
    };

    const topCard = game.getTopCard();

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            <BackButton to="/uno-setup" />

            {/* Restart Button */}
            <button
                onClick={handleRestart}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    backgroundColor: theme.danger,
                    color: theme.textPrimary,
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 100,
                    fontFamily: 'inherit'
                }}
            >
                🔄 Restart
            </button>

            {/* CPU Players */}
            <div style={{
                marginTop: '60px',
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '20px',
                marginBottom: '20px'
            }}>
                {cpuPlayers.map((cpu, idx) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                        <h4 style={{
                            marginBottom: '10px',
                            color: game.players[game.currentPlayerIndex] === cpu ? theme.accent : theme.textSecondary,
                            fontSize: game.players[game.currentPlayerIndex] === cpu ? '1.2rem' : '1rem'
                        }}>
                            {cpu.name} {showCardCount && `- ${cpu.hand.length} cards`}
                        </h4>
                        <div style={{ display: 'flex', gap: '-30px', justifyContent: 'center' }}>
                            <UnoCard faceDown={true} size="normal" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Game Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '30px'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '50px',
                    alignItems: 'center'
                }}>
                    {/* Deck */}
                    <div style={{ textAlign: 'center' }}>
                        <UnoCard
                            faceDown={true}
                            onClick={handleDrawCard}
                            isPlayable={isPlayerTurn && !isAnimating}
                            size="large"
                        />
                        <p style={{
                            marginTop: '10px',
                            fontSize: '1rem',
                            color: theme.textSecondary,
                            fontWeight: 'bold'
                        }}>
                            DRAW
                        </p>
                    </div>

                    {/* Discard Pile */}
                    <div style={{ textAlign: 'center' }}>
                        <UnoCard
                            card={topCard}
                            isPlayable={false}
                            size="large"
                        />
                        <p style={{
                            marginTop: '10px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: theme.textPrimary,
                            textTransform: 'uppercase'
                        }}>
                            Color: <span style={{
                                color: {
                                    red: '#E74C3C',
                                    yellow: '#F39C12',
                                    green: '#27AE60',
                                    blue: '#3498DB'
                                }[game.currentColor]
                            }}>{game.currentColor}</span>
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
                <h3 style={{
                    marginBottom: '15px',
                    color: isPlayerTurn ? theme.accent : theme.textSecondary
                }}>
                    {humanPlayer.name}'s Hand ({humanPlayer.hand.length} cards)
                </h3>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {humanPlayer.hand.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <UnoCard
                                card={card}
                                isPlayable={isPlayerTurn && !isAnimating && game.canPlay(card)}
                                onClick={() => handleCardClick(card)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* UNO Message */}
            <AnimatePresence>
                {showUnoMessage && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: theme.danger,
                            padding: '40px 60px',
                            borderRadius: '20px',
                            border: `5px solid ${theme.light}`,
                            zIndex: 2000,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                        }}
                    >
                        <h1 style={{
                            fontSize: '4rem',
                            margin: 0,
                            color: 'white',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
                        }}>
                            UNO!
                        </h1>
                        <p style={{
                            fontSize: '1.5rem',
                            margin: '10px 0 0 0',
                            color: 'white'
                        }}>
                            {unoPlayer} has one card left!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Color Picker */}
            {showColorPicker && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: theme.bgMedium,
                        padding: '40px',
                        borderRadius: '15px',
                        border: `3px solid ${theme.light}`
                    }}>
                        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Choose a Color</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px'
                        }}>
                            {['red', 'yellow', 'green', 'blue'].map(color => (
                                <motion.button
                                    key={color}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleColorChoice(color)}
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '15px',
                                        border: '4px solid white',
                                        backgroundColor: {
                                            red: '#E74C3C',
                                            yellow: '#F39C12',
                                            green: '#27AE60',
                                            blue: '#3498DB'
                                        }[color],
                                        cursor: 'pointer',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontFamily: 'inherit',
                                        textTransform: 'capitalize',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {color}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnoGame;