import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import UnoCard from '../../components/uno/UnoCard';
import Card from '../../logic/uno/Card';

function UnoTest() {
    const { theme } = useTheme();

    // Number cards (including special 0 and 7)
    const numberCards = [
        new Card('red', '0', 'number'),
        new Card('red', '1', 'number'),
        new Card('red', '2', 'number'),
        new Card('red', '3', 'number'),
        new Card('red', '4', 'number'),
        new Card('red', '5', 'number'),
        new Card('red', '6', 'number'),
        new Card('red', '7', 'number'),
        new Card('red', '8', 'number'),
        new Card('red', '9', 'number'),
    ];

    // Action cards - Regular UNO
    const actionCardsRegular = [
        new Card('blue', 'skip', 'action'),
        new Card('green', 'reverse', 'action'),
        new Card('yellow', 'draw2', 'action'),
    ];

    // Action cards - UNO No Mercy
    const actionCardsNoMercy = [
        new Card('red', 'skip_everyone', 'action'),
        new Card('blue', 'discard_all', 'action'),
    ];

    // Wild cards - Regular UNO
    const wildCardsRegular = [
        new Card(null, 'wild', 'wild'),
        new Card(null, 'wild_draw4', 'wild'),
    ];

    // Wild cards - UNO No Mercy
    const wildCardsNoMercy = [
        new Card(null, 'wild_draw6', 'wild'),
        new Card(null, 'wild_draw10', 'wild'),
        new Card(null, 'wild_reverse_draw4', 'wild'),
    ];

    // Card back
    const cardBack = null; // Used for faceDown prop

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary
        }}>
            <BackButton to="/" />

            <div style={{
                marginTop: '60px',
                maxWidth: '1400px',
                margin: '60px auto 0'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
                    UNO NO MERCY - CARD TEST
                </h1>

                {/* Card Back */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Card Back</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <UnoCard faceDown={true} size="small" />
                        <UnoCard faceDown={true} size="normal" />
                        <UnoCard faceDown={true} size="large" />
                    </div>
                </div>

                {/* Number Cards */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Number Cards (0-9)</h2>
                    <p style={{
                        fontSize: '0.9rem',
                        color: theme.textSecondary,
                        marginBottom: '15px'
                    }}>
                        Note: 0 = Hand Rotation (↻), 7 = Hand Swap (⇄)
                    </p>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {numberCards.map((card, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <UnoCard card={card} />
                                <p style={{
                                    marginTop: '5px',
                                    fontSize: '0.8rem',
                                    color: theme.textSecondary
                                }}>
                                    {card.value === '0' ? 'Rotate All' : card.value === '7' ? 'Swap Hands' : `Red ${card.value}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regular Action Cards */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Action Cards - Regular UNO</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {actionCardsRegular.map((card, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <UnoCard card={card} />
                                <p style={{
                                    marginTop: '5px',
                                    fontSize: '0.8rem',
                                    color: theme.textSecondary
                                }}>
                                    {card.value === 'skip' ? 'Skip' : card.value === 'reverse' ? 'Reverse' : 'Draw 2'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UNO No Mercy Action Cards */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Action Cards - UNO No Mercy NEW! 🔥</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {actionCardsNoMercy.map((card, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <UnoCard card={card} />
                                <p style={{
                                    marginTop: '5px',
                                    fontSize: '0.8rem',
                                    color: theme.textSecondary
                                }}>
                                    {card.value === 'skip_everyone' ? 'Skip Everyone' : 'Discard All'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regular Wild Cards */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Wild Cards - Regular UNO</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {wildCardsRegular.map((card, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <UnoCard card={card} />
                                <p style={{
                                    marginTop: '5px',
                                    fontSize: '0.8rem',
                                    color: theme.textSecondary
                                }}>
                                    {card.value === 'wild' ? 'Wild' : 'Wild Draw 4'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UNO No Mercy Wild Cards */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Wild Cards - UNO No Mercy NEW! 🔥</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {wildCardsNoMercy.map((card, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <UnoCard card={card} />
                                <p style={{
                                    marginTop: '5px',
                                    fontSize: '0.8rem',
                                    color: theme.textSecondary
                                }}>
                                    {card.value === 'wild_draw6' ? 'Wild Draw 6' :
                                        card.value === 'wild_draw10' ? 'Wild Draw 10' :
                                            'Wild Reverse Draw 4'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Colors Example */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>All Colors - Number 5 Example</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                            <UnoCard card={new Card('red', '5', 'number')} />
                            <p style={{
                                marginTop: '5px',
                                fontSize: '0.8rem',
                                color: theme.textSecondary
                            }}>Red 5</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <UnoCard card={new Card('yellow', '5', 'number')} />
                            <p style={{
                                marginTop: '5px',
                                fontSize: '0.8rem',
                                color: theme.textSecondary
                            }}>Yellow 5</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <UnoCard card={new Card('green', '5', 'number')} />
                            <p style={{
                                marginTop: '5px',
                                fontSize: '0.8rem',
                                color: theme.textSecondary
                            }}>Green 5</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <UnoCard card={new Card('blue', '5', 'number')} />
                            <p style={{
                                marginTop: '5px',
                                fontSize: '0.8rem',
                                color: theme.textSecondary
                            }}>Blue 5</p>
                        </div>
                    </div>
                </div>

                {/* Size Comparison */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Size Comparison</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ textAlign: 'center' }}>
                            <UnoCard card={new Card('red', '5', 'number')} size="small" />
                            <p style={{
                                marginTop: '5px',
                                fontSize: '0.8rem',
                                color: theme.textSecondary
                            }}>Small</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <UnoCard card={new Card('red', '5', 'number')} size="normal" />
                            <p style={{
                                marginTop: '5px',
                                fontSize: '0.8rem',
                                color: theme.textSecondary
                            }}>Normal</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <UnoCard card={new Card('red', '5', 'number')} size="large" />
                            <p style={{
                                marginTop: '5px',
                                fontSize: '0.8rem',
                                color: theme.textSecondary
                            }}>Large</p>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div style={{
                    backgroundColor: theme.bgDark,
                    padding: '20px',
                    borderRadius: '10px',
                    marginTop: '40px',
                    border: `2px solid ${theme.secondary}`
                }}>
                    <h3 style={{ marginBottom: '15px' }}>🔥 UNO No Mercy New Features:</h3>
                    <ul style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                        <li><strong>0 Cards (↻):</strong> All players pass hands clockwise/counterclockwise</li>
                        <li><strong>7 Cards (⇄):</strong> Swap your entire hand with any player</li>
                        <li><strong>Skip Everyone:</strong> Everyone skips, you play again</li>
                        <li><strong>Discard All:</strong> Discard all cards of one color</li>
                        <li><strong>Wild Draw 6:</strong> Next player draws 6 cards</li>
                        <li><strong>Wild Draw 10:</strong> Next player draws 10 cards</li>
                        <li><strong>Wild Reverse Draw 4:</strong> Reverse direction, previous player draws 4</li>
                        <li><strong>Stacking Rule:</strong> Stack draw cards to pass penalty (+2, +4, +6, +10)</li>
                        <li><strong>Mercy Rule:</strong> 25+ cards = ELIMINATED</li>
                        <li><strong>Draw Until Playable:</strong> Keep drawing until you can play</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UnoTest;