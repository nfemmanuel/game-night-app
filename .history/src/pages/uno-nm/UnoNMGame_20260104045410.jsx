import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import SettingsButton from '../../components/SettingsButton';
import HelpButton from '../../components/HelpButton';
import SocialButton from '../../components/SocialButton';
import UnoCard from '../../components/uno/UnoCard';
import GameState from '../../logic/uno-nm/GameState';
import Player from '../../logic/uno-nm/Player';

function UnoNMGame() {
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
    const [showPlayerPicker, setShowPlayerPicker] = useState(false); // For 7 card
    const [showDiscardAllPicker, setShowDiscardAllPicker] = useState(false); // For Discard All
    const [gameMessage, setGameMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [showUnoMessage, setShowUnoMessage] = useState(false);
    const [unoPlayer, setUnoPlayer] = useState(null);
    const [lastHandSizes, setLastHandSizes] = useState([]);
    const [needsCpuTurn, setNeedsCpuTurn] = useState(false);
    const [showUnplayableCards, setShowUnplayableCards] = useState(false);
    const [eliminatedMessage, setEliminatedMessage] = useState('');
    const [showEliminatedMessage, setShowEliminatedMessage] = useState(false);

    const updateGame = () => {
        forceUpdate(n => n + 1);
    };

    // CPU turn function
    const cpuTurn = () => {
        if (!game) return;

        const cpu = game.players[game.currentPlayerIndex];

        // Safety check
        if (cpu.isHuman || cpu.isEliminated) {
            setIsAnimating(false);
            const nextPlayer = game.players[game.currentPlayerIndex];
            setGameMessage(`${nextPlayer.name}'s turn!`);
            return;
        }

        setIsAnimating(true);
        const validCards = cpu.hand.filter(card => game.canPlay(card));

        setGameMessage(`${cpu.name} is thinking...`);

        const thinkTime = difficulty === 'easy' ? 800 : difficulty === 'medium' ? 1200 : 1500;

        setTimeout(() => {
            // If in stacking situation and can stack
            if (game.isStacking && validCards.length > 0) {
                const stackableCards = validCards.filter(c => game.isStackableDrawCard(c));

                if (stackableCards.length > 0) {
                    // CPU tries to stack
                    const cardToPlay = stackableCards[0];
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

                    game.playCard(cpu, cardToPlay, chosenColor);
                    setGameMessage(`${cpu.name} stacked ${cardToPlay.toString()}! Draw penalty now ${game.stackedDrawCount}!`);
                    updateGame();

                    setTimeout(() => {
                        setIsAnimating(false);
                        const nextPlayer = game.players[game.currentPlayerIndex];
                        setGameMessage(`${nextPlayer.name}'s turn!`);

                        if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                            setNeedsCpuTurn(true);
                        }
                    }, 1000);
                    return;
                }

                // Can't stack - must draw
                game.executeStackedDraw();
                setGameMessage(`${cpu.name} drew ${game.stackedDrawCount} cards!`);

                // Check if eliminated
                if (cpu.isEliminated) {
                    showElimination(cpu.name);
                }

                updateGame();

                setTimeout(() => {
                    setIsAnimating(false);
                    const nextPlayer = game.players[game.currentPlayerIndex];
                    setGameMessage(`${nextPlayer.name}'s turn!`);

                    if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                        setNeedsCpuTurn(true);
                    }
                }, 1500);
                return;
            }

            // Normal turn - try to play a card
            if (validCards.length > 0) {
                let cardToPlay;

                // AI strategy
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

                // Handle special cards
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

                // Handle 7 card (swap hands)
                if (cardToPlay.value === '7') {
                    // CPU swaps with player who has most cards
                    const otherPlayers = game.players.filter((p, idx) =>
                        idx !== game.currentPlayerIndex && !p.isEliminated
                    );
                    otherPlayers.sort((a, b) => b.hand.length - a.hand.length);
                    const targetPlayer = otherPlayers[0];
                    const targetIndex = game.players.indexOf(targetPlayer);

                    game.playCard(cpu, cardToPlay);
                    game.swapHands(game.currentPlayerIndex, targetIndex);
                    setGameMessage(`${cpu.name} played 7 and swapped hands with ${targetPlayer.name}!`);
                    updateGame();

                    setTimeout(() => {
                        checkForWinner();
                        game.nextTurn();
                        updateGame();

                        setTimeout(() => {
                            setIsAnimating(false);
                            const nextPlayer = game.players[game.currentPlayerIndex];
                            setGameMessage(`${nextPlayer.name}'s turn!`);

                            if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                                setNeedsCpuTurn(true);
                            }
                        }, 800);
                    }, 1500);
                    return;
                }

                // Handle Discard All
                if (cardToPlay.value === 'discard_all') {
                    game.playCard(cpu, cardToPlay);

                    // CPU discards all of the most common color
                    const colorCount = { red: 0, yellow: 0, green: 0, blue: 0 };
                    cpu.hand.forEach(card => {
                        if (card.color && colorCount[card.color] !== undefined) {
                            colorCount[card.color]++;
                        }
                    });
                    const mostCommonColor = Object.keys(colorCount).reduce((a, b) =>
                        colorCount[a] > colorCount[b] ? a : b
                    );

                    cpu.hand = cpu.hand.filter(card => card.color !== mostCommonColor);
                    setGameMessage(`${cpu.name} discarded all ${mostCommonColor} cards!`);
                    updateGame();

                    setTimeout(() => {
                        checkForWinner();
                        game.nextTurn();
                        updateGame();

                        setTimeout(() => {
                            setIsAnimating(false);
                            const nextPlayer = game.players[game.currentPlayerIndex];
                            setGameMessage(`${nextPlayer.name}'s turn!`);

                            if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                                setNeedsCpuTurn(true);
                            }
                        }, 800);
                    }, 1500);
                    return;
                }

                // Normal card play
                game.playCard(cpu, cardToPlay, chosenColor);
                setGameMessage(`${cpu.name} played ${cardToPlay.toString()}`);
                updateGame();

                setTimeout(() => {
                    checkForWinner();
                    game.nextTurn();
                    updateGame();

                    setTimeout(() => {
                        setIsAnimating(false);
                        const nextPlayer = game.players[game.currentPlayerIndex];
                        setGameMessage(`${nextPlayer.name}'s turn!`);

                        if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                            setNeedsCpuTurn(true);
                        }
                    }, 800);
                }, 1000);
            } else {
                // CPU must draw until playable
                const drawnCards = game.drawUntilPlayable(cpu);
                setGameMessage(`${cpu.name} drew ${drawnCards.length} card(s)`);

                // Check if eliminated
                if (cpu.isEliminated) {
                    showElimination(cpu.name);
                }

                updateGame();

                setTimeout(() => {
                    game.nextTurn();
                    updateGame();

                    const nextPlayer = game.players[game.currentPlayerIndex];
                    setIsAnimating(false);
                    setGameMessage(`${nextPlayer.name}'s turn!`);

                    if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                        setNeedsCpuTurn(true);
                    }
                }, 1500);
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

        const startingPlayer = newGame.players[newGame.currentPlayerIndex];
        setGameMessage(`${startingPlayer.name} starts!`);

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
            if (player.hand.length === 1 && lastHandSizes[idx] > 1 && !player.isEliminated) {
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
    const isPlayerTurn = currentPlayer.isHuman && !currentPlayer.isEliminated;
    const humanPlayer = game.players.find(p => p.isHuman);
    const cpuPlayers = game.players.filter(p => !p.isHuman);
    const isMobile = window.innerWidth <= 768;

    const playableCards = [];
    const unplayableCards = [];

    if (humanPlayer && !humanPlayer.isEliminated) {
        humanPlayer.hand.forEach((card, idx) => {
            if (game.canPlay(card)) {
                playableCards.push({ card, originalIndex: idx });
            } else {
                unplayableCards.push({ card, originalIndex: idx });
            }
        });
    }

    const showElimination = (playerName) => {
        setEliminatedMessage(playerName);
        setShowEliminatedMessage(true);
        setTimeout(() => {
            setShowEliminatedMessage(false);
        }, 3000);
    };

    const checkForWinner = () => {
        const winner = game.checkWinner();
        if (winner) {
            setTimeout(() => {
                alert(`🎉 ${winner.name} wins!`);
                navigate('/uno-nm-setup');
            }, 1000);
        }
    };

    const handleCardClick = (card) => {
        if (!isPlayerTurn || isAnimating) return;

        if (!game.canPlay(card)) {
            setGameMessage("❌ Can't play that card!");
            setTimeout(() => {
                setGameMessage(`${currentPlayer.name}'s turn!`);
            }, 1500);
            return;
        }

        // Handle special cards
        if (card.value === '7') {
            setSelectedCard(card);
            setShowPlayerPicker(true);
        } else if (card.value === 'discard_all') {
            setSelectedCard(card);
            setShowDiscardAllPicker(true);
        } else if (card.card_type === 'wild') {
            setSelectedCard(card);
            setShowColorPicker(true);
        } else {
            playCard(card);
        }
    };

    const playCard = (card, chosenColor = null) => {
        setIsAnimating(true);

        setTimeout(() => {
            const success = game.playCard(currentPlayer, card, chosenColor);

            if (success) {
                setGameMessage(`${currentPlayer.name} played ${card.toString()}`);
                setShowColorPicker(false);
                setSelectedCard(null);
                updateGame();

                checkForWinner();

                game.nextTurn();
                updateGame();

                setTimeout(() => {
                    setIsAnimating(false);
                    const nextPlayer = game.players[game.currentPlayerIndex];
                    setGameMessage(`${nextPlayer.name}'s turn!`);

                    if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                        setNeedsCpuTurn(true);
                    }
                }, 600);
            } else {
                setIsAnimating(false);
            }
        }, 300);
    };

    const handleDrawCard = () => {
        if (!isPlayerTurn || isAnimating) return;

        setIsAnimating(true);

        // Check if in stacking situation
        if (game.isStacking) {
            // Must draw all stacked cards
            game.executeStackedDraw();
            setGameMessage(`You drew ${game.stackedDrawCount} cards!`);

            if (humanPlayer.isEliminated) {
                showElimination(humanPlayer.name);
            }

            updateGame();

            setTimeout(() => {
                setIsAnimating(false);
                const nextPlayer = game.players[game.currentPlayerIndex];
                setGameMessage(`${nextPlayer.name}'s turn!`);

                if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                    setNeedsCpuTurn(true);
                }
            }, 1500);
            return;
        }

        // Draw until playable
        const drawnCards = game.drawUntilPlayable(currentPlayer);
        setGameMessage(`You drew ${drawnCards.length} card(s)`);

        if (humanPlayer.isEliminated) {
            showElimination(humanPlayer.name);
        }

        updateGame();

        setTimeout(() => {
            game.nextTurn();
            updateGame();

            const nextPlayer = game.players[game.currentPlayerIndex];
            setGameMessage(`${nextPlayer.name}'s turn!`);
            setIsAnimating(false);

            if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                setNeedsCpuTurn(true);
            }
        }, 1000);
    };

    const handleColorChoice = (color) => {
        if (selectedCard) {
            playCard(selectedCard, color);
        }
    };

    const handlePlayerChoice = (targetIndex) => {
        if (selectedCard) {
            game.playCard(currentPlayer, selectedCard);
            game.swapHands(game.currentPlayerIndex, targetIndex);
            setGameMessage(`You swapped hands with ${game.players[targetIndex].name}!`);
            setShowPlayerPicker(false);
            setSelectedCard(null);
            updateGame();

            checkForWinner();

            setTimeout(() => {
                game.nextTurn();
                updateGame();

                setTimeout(() => {
                    setIsAnimating(false);
                    const nextPlayer = game.players[game.currentPlayerIndex];
                    setGameMessage(`${nextPlayer.name}'s turn!`);

                    if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                        setNeedsCpuTurn(true);
                    }
                }, 600);
            }, 1500);
        }
    };

    const handleDiscardAllChoice = (color) => {
        if (selectedCard) {
            game.playCard(currentPlayer, selectedCard);
            humanPlayer.hand = humanPlayer.hand.filter(card => card.color !== color);
            setGameMessage(`You discarded all ${color} cards!`);
            setShowDiscardAllPicker(false);
            setSelectedCard(null);
            updateGame();

            checkForWinner();

            setTimeout(() => {
                game.nextTurn();
                updateGame();

                setTimeout(() => {
                    setIsAnimating(false);
                    const nextPlayer = game.players[game.currentPlayerIndex];
                    setGameMessage(`${nextPlayer.name}'s turn!`);

                    if (!nextPlayer.isHuman && !nextPlayer.isEliminated) {
                        setNeedsCpuTurn(true);
                    }
                }, 600);
            }, 1500);
        }
    };

    const handleRestart = () => {
        if (window.confirm('Start a new game? Current progress will be lost.')) {
            navigate('/uno-nm-setup');
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
            <BackButton to="/uno-nm-setup" />
            <SettingsButton />
            <HelpButton helpText="UNO NO MERCY! Stack draw cards, eliminate opponents, show no mercy!" />
            <SocialButton />

            {/* Restart Button */}
            <button
                onClick={handleRestart}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
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

            {/* CPU Players Section */}
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
                            minWidth: 0,
                            opacity: cpu.isEliminated ? 0.3 : 1
                        }}>
                            <h4 style={{
                                marginBottom: '5px',
                                color: cpu.isEliminated ? theme.textDisabled :
                                    (game.players[game.currentPlayerIndex] === cpu ? theme.danger : theme.textSecondary),
                                fontSize: isMobile ? '0.7rem' : '1rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {cpu.name} {cpu.isEliminated ? '💀' : (showCardCount && `- ${cpu.hand.length}`)}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <UnoCard faceDown={true} size={isMobile ? "small" : "normal"} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Game Area */}
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
                            disabled={!isPlayerTurn || isAnimating || humanPlayer.isEliminated}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: (isPlayerTurn && !isAnimating && !humanPlayer.isEliminated) ? 'pointer' : 'not-allowed',
                                transition: 'transform 0.2s ease, filter 0.2s ease',
                                filter: (isPlayerTurn && !isAnimating && !humanPlayer.isEliminated) ? 'brightness(1)' : 'brightness(0.6)',
                            }}
                            onMouseEnter={(e) => {
                                if (isPlayerTurn && !isAnimating && !humanPlayer.isEliminated) {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isPlayerTurn && !isAnimating && !humanPlayer.isEliminated) {
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
                            {game.isStacking ? `DRAW ${game.stackedDrawCount}!` : 'DRAW'}
                        </p>
                        {!isMobile && (
                            <p style={{
                                fontSize: '0.8rem',
                                color: theme.textDisabled,
                                marginTop: '5px'
                            }}>
                                {game.isStacking ? '(or stack!)' : '(until playable)'}
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
                    border: `2px solid ${game.isStacking ? theme.danger : theme.accent}`,
                    minWidth: isMobile ? '200px' : '300px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', margin: 0 }}>{gameMessage}</p>
                </div>
            </div>

            {/* Player Hand Section */}
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
                    color: humanPlayer.isEliminated ? theme.textDisabled :
                        (isPlayerTurn ? theme.danger : theme.textSecondary),
                    fontSize: isMobile ? '0.9rem' : '1.2rem'
                }}>
                    {humanPlayer.name}'s Hand ({humanPlayer.hand.length}) {humanPlayer.isEliminated && '💀 ELIMINATED'}
                </h3>

                {!humanPlayer.isEliminated && (
                    <>
                        {/* Playable Cards */}
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

                        {/* Unplayable Cards */}
                        {unplayableCards.length > 0 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: isMobile ? '5px' : '10px',
                                opacity: 0.5
                            }}>
                                {unplayableCards.length === 1 ? (
                                    <UnoCard
                                        card={unplayableCards[0].card}
                                        isPlayable={false}
                                        size={isMobile ? "small" : "normal"}
                                    />
                                ) : (
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

                        {playableCards.length === 0 && unplayableCards.length > 0 && (
                            <p style={{
                                textAlign: 'center',
                                color: theme.textSecondary,
                                fontSize: isMobile ? '0.8rem' : '0.9rem',
                                marginTop: '5px'
                            }}>
                                {game.isStacking ? 'Stack or draw!' : 'No playable cards - draw!'}
                            </p>
                        )}
                    </>
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

            {/* Eliminated Message */}
            <AnimatePresence>
                {showEliminatedMessage && (
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
                            backgroundColor: '#2C3E50',
                            padding: isMobile ? '20px 30px' : '40px 60px',
                            borderRadius: '20px',
                            border: `5px solid ${theme.textDisabled}`,
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
                            💀
                        </h1>
                        <p style={{
                            fontSize: isMobile ? '1rem' : '1.5rem',
                            margin: '10px 0 0 0',
                            color: 'white'
                        }}>
                            {eliminatedMessage} ELIMINATED!
                        </p>
                        <p style={{
                            fontSize: isMobile ? '0.8rem' : '1rem',
                            margin: '5px 0 0 0',
                            color: theme.textDisabled
                        }}>
                            Mercy Rule: 25+ cards
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

            {/* Player Picker for 7 Card */}
            {showPlayerPicker && (
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
                            Swap Hands With?
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? '10px' : '15px'
                        }}>
                            {game.players.map((player, idx) => {
                                if (idx === game.currentPlayerIndex || player.isEliminated) return null;
                                return (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handlePlayerChoice(idx)}
                                        style={{
                                            padding: isMobile ? '15px' : '20px',
                                            borderRadius: '10px',
                                            border: `2px solid ${theme.accent}`,
                                            backgroundColor: theme.bgDark,
                                            cursor: 'pointer',
                                            fontSize: isMobile ? '1rem' : '1.2rem',
                                            fontWeight: 'bold',
                                            color: theme.textPrimary,
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        {player.name} ({player.hand.length} cards)
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Discard All Color Picker */}
            {showDiscardAllPicker && (
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
                            Discard All Cards of Which Color?
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: isMobile ? '10px' : '20px'
                        }}>
                            {['red', 'yellow', 'green', 'blue'].map(color => {
                                const count = humanPlayer.hand.filter(c => c.color === color).length;
                                return (
                                    <motion.button
                                        key={color}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDiscardAllChoice(color)}
                                        disabled={count === 0}
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
                                            cursor: count > 0 ? 'pointer' : 'not-allowed',
                                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontFamily: 'inherit',
                                            textTransform: 'capitalize',
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                            opacity: count === 0 ? 0.5 : 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <div>{color}</div>
                                        <div style={{ fontSize: '0.8rem' }}>({count})</div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnoNMGame;