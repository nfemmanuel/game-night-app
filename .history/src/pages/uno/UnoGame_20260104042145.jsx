import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import SettingsButton from '../../components/SettingsButton';
import HelpButton from '../../components/HelpButton';
import SocialButton from '../../components/SocialButton';
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
    const [needsCpuTurn, setNeedsCpuTurn] = useState(false);
    const [showUnplayableCards, setShowUnplayableCards] = useState(false);

    const updateGame = () => {
        forceUpdate(n => n + 1);
    };

    // CPU turn function
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
            // If CPU has valid cards, play one
            if (validCards.length > 0) {
                let cardToPlay;

                // AI strategy based on difficulty
                if (difficulty === 'easy') {
                    cardToPlay = validCards[Math.floor(Math.random() * validCards.length)];
                } else if (difficulty === 'medium') {
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
                    const actions = validCards.filter(c => c.card_type === 'action');
                    const numbers = validCards.filter(c => c.card_type === 'number');
                    const wilds = validCards.filter(c => c.card_type === 'wild');

                    if (actions.length > 0) {
                        cardToPlay = actions[0];
                    } else if (numbers.length > 0) {
                        numbers.sort((a, b) => parseInt(b.value || 0) - parseInt(a.value || 0));
                        cardToPlay = numbers[0];
                    } else {
                        cardToPlay = wilds[0];
                    }
                }

                // Choose color for wild cards
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

                // Play the card
                setTimeout(() => {
                    game.playCard(cpu, cardToPlay, chosenColor);
                    setGameMessage(`${cpu.name} played ${cardToPlay.toString()}`);
                    updateGame();

                    // Check winner
                    const winner = game.checkWinner();
                    if (winner) {
                        setTimeout(() => {
                            alert(`🎉 ${winner.name} wins!`);
                            navigate('/uno-setup');
                        }, 1000);
                        return;
                    }

                    // Next turn
                    game.nextTurn();
                    updateGame();

                    setTimeout(() => {
                        const nextPlayer = game.players[game.currentPlayerIndex];
                        setIsAnimating(false);
                        setGameMessage(`${nextPlayer.name}'s turn!`);

                        if (!nextPlayer.isHuman) {
                            setNeedsCpuTurn(true);
                        }
                    }, 800);
                }, 400);
            } else {
                // CPU has no valid cards - must draw
                let card = game.deck.draw();
                if (!card) {
                    game.reshuffleDiscard();
                    card = game.deck.draw();
                }

                if (card) {
                    cpu.hand.push(card);
                    setGameMessage(`${cpu.name} drew a card`);
                    updateGame();

                    // Drawing ends CPU's turn
                    setTimeout(() => {
                        game.nextTurn();
                        updateGame();

                        const nextPlayer = game.players[game.currentPlayerIndex];
                        setIsAnimating(false);
                        setGameMessage(`${nextPlayer.name}'s turn!`);

                        if (!nextPlayer.isHuman) {
                            setNeedsCpuTurn(true);
                        }
                    }, 1000);
                }
            }
        }, thinkTime);
    };

    // Initialize game
    useEffect(() => {
        const players = [new Player(playerName, true)];

        for (let i = 1; i < numPlayers; i++) {
            players.push(new Player(`CPU ${i}`, false));
        }

        const newGame = new GameState(players);
        setGame(newGame);
        setLastHandSizes(players.map(p => p.hand.length));

        // Show who starts
        const startingPlayer = newGame.players[newGame.currentPlayerIndex];
        setGameMessage(`${startingPlayer.name} starts!`);

        // If CPU starts, trigger CPU turn
        if (!startingPlayer.isHuman) {
            setTimeout(() => {
                setNeedsCpuTurn(true);
            }, 1500);
        }
    }, [playerName, numPlayers]);

    // Trigger CPU turn when needed
    useEffect(() => {
        if (needsCpuTurn && game && !isAnimating) {
            setNeedsCpuTurn(false);
            cpuTurn();
        }
    }, [needsCpuTurn, game, isAnimating]);

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

    // Detect mobile
    const isMobile = window.innerWidth <= 768;

    // Split player's hand into playable and unplayable
    const playableCards = [];
    const unplayableCards = [];

    humanPlayer.hand.forEach((card, idx) => {
        if (game.canPlay(card)) {
            playableCards.push({ card, originalIndex: idx });
        } else {
            unplayableCards.push({ card, originalIndex: idx });
        }
    });

    // Handle card click - play a card
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

    // Play a card
    const playCard = (card, chosenColor = null) => {
        setIsAnimating(true);

        setTimeout(() => {
            const success = game.playCard(currentPlayer, card, chosenColor);

            if (success) {
                setGameMessage(`${currentPlayer.name} played ${card.toString()}`);
                setShowColorPicker(false);
                setSelectedCard(null);
                updateGame();

                // Check winner
                const winner = game.checkWinner();
                if (winner) {
                    setTimeout(() => {
                        alert(`🎉 ${winner.name} wins!`);
                        navigate('/uno-setup');
                    }, 1000);
                    return;
                }

                // Move to next turn (effects already applied in playCard)
                game.nextTurn();
                updateGame();

                setTimeout(() => {
                    setIsAnimating(false);
                    const nextPlayer = game.players[game.currentPlayerIndex];
                    setGameMessage(`${nextPlayer.name}'s turn!`);

                    if (!nextPlayer.isHuman) {
                        setNeedsCpuTurn(true);
                    }
                }, 600);
            } else {
                setIsAnimating(false);
            }
        }, 300);
    };

    // Draw a card - ALWAYS ends your turn
    const handleDrawCard = () => {
        if (!isPlayerTurn || isAnimating) return;

        setIsAnimating(true);

        // Draw card
        let card = game.deck.draw();
        if (!card) {
            game.reshuffleDiscard();
            card = game.deck.draw();
        }

        if (!card) {
            setGameMessage("No cards left!");
            setIsAnimating(false);
            return;
        }

        // Add to player's hand
        currentPlayer.hand.push(card);
        updateGame();

        setGameMessage(`You drew a card`);

        // Drawing a card ENDS your turn
        setTimeout(() => {
            game.nextTurn();
            updateGame();

            const nextPlayer = game.players[game.currentPlayerIndex];
            setGameMessage(`${nextPlayer.name}'s turn!`);
            setIsAnimating(false);

            if (!nextPlayer.isHuman) {
                setNeedsCpuTurn(true);
            }
        }, 1000);
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
            padding: isMobile ? '10px' : '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            <BackButton to="/uno-setup" />
            <SettingsButton />
            <HelpButton helpText="Play UNO! Match colors or numbers. Wild cards change the color. Draw from the deck if you can't play. First to empty their hand wins!" />
            <SocialButton />

            {/* Restart Button */}
            <button
                onClick={handleRestart}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: isMobile ? '8px 16px' : '10px 20px',
                    fontSize: isMobile ? '0.9rem' : '1rem',
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

            {/* CPU Players Section - Flex 1 */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: '60px',
                minHeight: 0
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    gap: isMobile ? '5px' : '20px',
                    flexWrap: 'nowrap',
                    overflow: 'hidden',
                    padding: isMobile ? '5px' : '10px'
                }}>
                    {cpuPlayers.map((cpu, idx) => (
                        <div key={idx} style={{
                            textAlign: 'center',
                            flex: '0 1 auto',
                            minWidth: 0
                        }}>
                            <h4 style={{
                                marginBottom: '5px',
                                color: game.players[game.currentPlayerIndex] === cpu ? theme.accent : theme.textSecondary,
                                fontSize: isMobile ? '0.7rem' : '1rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {cpu.name} {showCardCount && `- ${cpu.hand.length}`}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <UnoCard faceDown={true} size={isMobile ? "small" : "normal"} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Game Area - Flex 1 */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: isMobile ? '15px' : '30px',
                minHeight: 0
            }}>
                <div style={{
                    display: 'flex',
                    gap: isMobile ? '20px' : '50px',
                    alignItems: 'center',
                    flexWrap: 'nowrap'
                }}>
                    {/* Deck */}
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={handleDrawCard}
                            disabled={!isPlayerTurn || isAnimating}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: (isPlayerTurn && !isAnimating) ? 'pointer' : 'not-allowed',
                                transition: 'transform 0.2s ease, filter 0.2s ease',
                                filter: (isPlayerTurn && !isAnimating) ? 'brightness(1)' : 'brightness(0.6)',
                            }}
                            onMouseEnter={(e) => {
                                if (isPlayerTurn && !isAnimating) {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isPlayerTurn && !isAnimating) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <UnoCard
                                faceDown={true}
                                isPlayable={false}
                                size={isMobile ? "normal" : "large"}
                            />
                        </button>
                        <p style={{
                            marginTop: '5px',
                            fontSize: isMobile ? '0.8rem' : '1rem',
                            color: theme.textSecondary,
                            fontWeight: 'bold'
                        }}>
                            DRAW
                        </p>
                        {!isMobile && (
                            <p style={{
                                fontSize: '0.8rem',
                                color: theme.textDisabled,
                                marginTop: '5px'
                            }}>
                                (ends turn)
                            </p>
                        )}
                    </div>

                    {/* Discard Pile */}
                    <div style={{ textAlign: 'center' }}>
                        <UnoCard
                            card={topCard}
                            isPlayable={false}
                            size={isMobile ? "normal" : "large"}
                        />
                        <p style={{
                            marginTop: '5px',
                            fontSize: isMobile ? '0.9rem' : '1.2rem',
                            fontWeight: 'bold',
                            color: theme.textPrimary,
                            textTransform: 'uppercase'
                        }}>
                            <span style={{
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
                    padding: isMobile ? '10px 20px' : '15px 30px',
                    borderRadius: '10px',
                    border: `2px solid ${theme.accent}`,
                    minWidth: isMobile ? '200px' : '300px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', margin: 0 }}>{gameMessage}</p>
                </div>
            </div>

            {/* Player Hand Section - Flex 1 */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: 0,
                marginBottom: isMobile ? '10px' : '20px'
            }}>
                <h3 style={{
                    marginBottom: '10px',
                    textAlign: 'center',
                    color: isPlayerTurn ? theme.accent : theme.textSecondary,
                    fontSize: isMobile ? '0.9rem' : '1.2rem'
                }}>
                    {humanPlayer.name}'s Hand ({humanPlayer.hand.length})
                </h3>

                {/* Playable Cards - Scrollable */}
                {playableCards.length > 0 && (
                    <div style={{
                        display: 'flex',
                        gap: isMobile ? '5px' : '10px',
                        justifyContent: playableCards.length <= 5 ? 'center' : 'flex-start',
                        flexWrap: 'nowrap',
                        overflowX: 'auto',
                        padding: isMobile ? '5px' : '10px',
                        marginBottom: unplayableCards.length > 0 ? '10px' : '0'
                    }}>
                        {playableCards.map(({ card, originalIndex }) => (
                            <motion.div
                                key={originalIndex}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: originalIndex * 0.05 }}
                                style={{
                                    flex: '0 0 auto'
                                }}
                            >
                                <UnoCard
                                    card={card}
                                    isPlayable={isPlayerTurn && !isAnimating}
                                    onClick={() => handleCardClick(card)}
                                    size={isMobile ? "small" : "normal"}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Unplayable Cards - Clickable to Expand */}
                {unplayableCards.length > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: isMobile ? '5px' : '10px',
                        opacity: 0.5
                    }}>
                        {unplayableCards.length === 1 ? (
                            // Single unplayable card
                            <UnoCard
                                card={unplayableCards[0].card}
                                isPlayable={false}
                                size={isMobile ? "small" : "normal"}
                            />
                        ) : (
                            // Multiple unplayable cards - stacked and clickable
                            <div
                                onClick={() => setShowUnplayableCards(true)}
                                style={{
                                    position: 'relative',
                                    width: isMobile ? '60px' : '80px',
                                    height: isMobile ? '90px' : '120px',
                                    cursor: 'pointer'
                                }}
                            >
                                {unplayableCards.slice(0, 3).map((item, idx) => (
                                    <div
                                        key={item.originalIndex}
                                        style={{
                                            position: 'absolute',
                                            top: `${idx * 3}px`,
                                            left: `${idx * 3}px`,
                                            zIndex: idx
                                        }}
                                    >
                                        <UnoCard
                                            card={item.card}
                                            isPlayable={false}
                                            size={isMobile ? "small" : "normal"}
                                        />
                                    </div>
                                ))}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.8rem',
                                    color: theme.textSecondary,
                                    whiteSpace: 'nowrap'
                                }}>
                                    Tap to view ({unplayableCards.length})
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* All cards unplayable message */}
                {playableCards.length === 0 && unplayableCards.length > 0 && (
                    <p style={{
                        textAlign: 'center',
                        color: theme.textSecondary,
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        marginTop: '5px'
                    }}>
                        No playable cards - draw a card!
                    </p>
                )}
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
                            padding: isMobile ? '20px 30px' : '40px 60px',
                            borderRadius: '20px',
                            border: `5px solid ${theme.light}`,
                            zIndex: 2000,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                        }}
                    >
                        <h1 style={{
                            fontSize: isMobile ? '2.5rem' : '4rem',
                            margin: 0,
                            color: 'white',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
                        }}>
                            UNO!
                        </h1>
                        <p style={{
                            fontSize: isMobile ? '1rem' : '1.5rem',
                            margin: '10px 0 0 0',
                            color: 'white'
                        }}>
                            {unoPlayer} has one card left!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Unplayable Cards Popup */}
            <AnimatePresence>
                {showUnplayableCards && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1500,
                            padding: '20px'
                        }}
                        onClick={() => setShowUnplayableCards(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                backgroundColor: theme.bgMedium,
                                padding: isMobile ? '20px' : '30px',
                                borderRadius: '15px',
                                border: `3px solid ${theme.light}`,
                                maxWidth: '90vw',
                                maxHeight: '80vh',
                                overflow: 'auto',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setShowUnplayableCards(false)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    color: theme.textPrimary,
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    padding: '5px 10px'
                                }}
                            >
                                ✕
                            </button>

                            <h2 style={{
                                marginBottom: '20px',
                                textAlign: 'center',
                                fontSize: isMobile ? '1.2rem' : '1.5rem',
                                color: theme.textPrimary
                            }}>
                                Unplayable Cards ({unplayableCards.length})
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(60px, 1fr))' : 'repeat(auto-fill, minmax(80px, 1fr))',
                                gap: isMobile ? '10px' : '15px',
                                justifyItems: 'center'
                            }}>
                                {unplayableCards.map(({ card, originalIndex }) => (
                                    <UnoCard
                                        key={originalIndex}
                                        card={card}
                                        isPlayable={false}
                                        size="small"
                                    />
                                ))}
                            </div>
                        </motion.div>
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
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: theme.bgMedium,
                        padding: isMobile ? '20px' : '40px',
                        borderRadius: '15px',
                        border: `3px solid ${theme.light}`,
                        maxWidth: '90vw'
                    }}>
                        <h2 style={{
                            marginBottom: isMobile ? '20px' : '30px',
                            textAlign: 'center',
                            fontSize: isMobile ? '1.2rem' : '1.5rem'
                        }}>
                            Choose a Color
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: isMobile ? '10px' : '20px'
                        }}>
                            {['red', 'yellow', 'green', 'blue'].map(color => (
                                <motion.button
                                    key={color}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleColorChoice(color)}
                                    style={{
                                        width: isMobile ? '80px' : '120px',
                                        height: isMobile ? '80px' : '120px',
                                        borderRadius: '15px',
                                        border: '4px solid white',
                                        backgroundColor: {
                                            red: '#E74C3C',
                                            yellow: '#F39C12',
                                            green: '#27AE60',
                                            blue: '#3498DB'
                                        }[color],
                                        cursor: 'pointer',
                                        fontSize: isMobile ? '1rem' : '1.3rem',
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