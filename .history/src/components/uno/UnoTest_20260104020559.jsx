import { useState } from 'react';
import UnoCard from '../../components/uno/UnoCard';
import BackButton from '../../components/BackButton';
import { useTheme } from '../../contexts/ThemeContext';

function UnoTest() {
    const { theme } = useTheme();

    const testCards = [
        { color: 'red', value: '5', card_type: 'number' },
        { color: 'blue', value: '7', card_type: 'number' },
        { color: 'green', value: 'skip', card_type: 'action' },
        { color: 'yellow', value: 'reverse', card_type: 'action' },
        { color: 'red', value: 'draw2', card_type: 'action' },
        { color: null, value: 'wild', card_type: 'wild' },
        { color: null, value: 'wild_draw4', card_type: 'wild' },
    ];

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary
        }}>
            <BackButton to="/" />

            <h1 style={{ textAlign: 'center', marginTop: '60px' }}>UNO Card Test</h1>

            <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '40px'
            }}>
                {testCards.map((card, idx) => (
                    <UnoCard
                        key={idx}
                        card={card}
                        isPlayable={true}
                        onClick={() => alert(`Clicked ${card.color} ${card.value}`)}
                    />
                ))}

                <UnoCard faceDown={true} />
            </div>
        </div>
    );
}

export default UnoTest;