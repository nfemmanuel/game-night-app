import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import BackButton from '../../components/BackButton';
import GameState from '../../logic/uno/GameState';
import Player from '../../logic/uno/Player';

function UnoLogicTest() {
    const { theme } = useTheme();
    const [log, setLog] = useState([]);

    const runTest = () => {
        const logs = [];

        // Create players
        const players = [
            new Player('You', true),
            new Player('CPU', false)
        ];

        // Create game
        const game = new GameState(players);

        logs.push('=== GAME STARTED ===');
        logs.push(`Top card: ${game.getTopCard().toString()}`);
        logs.push(`Current color: ${game.currentColor}`);
        logs.push('');

        // Show hands
        logs.push('YOUR HAND:');
        players[0].hand.forEach((card, idx) => {
            logs.push(`  ${idx + 1}. ${card.toString()}`);
        });
        logs.push('');

        logs.push('CPU HAND:');
        logs.push(`  ${players[1].hand.length} cards`);
        logs.push('');

        // Get valid cards
        const validCards = game.getValidCards(players[0]);
        logs.push('YOUR VALID CARDS:');
        validCards.forEach(card => {
            logs.push(`  - ${card.toString()}`);
        });

        setLog(logs);
    };

    return (
        <div style={{
            padding: '20px',
            minHeight: '100vh',
            backgroundColor: theme.bgMedium,
            color: theme.textPrimary
        }}>
            <BackButton to="/" />

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                <h1>UNO Logic Test</h1>
                <button
                    onClick={runTest}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        backgroundColor: theme.accent,
                        color: theme.textPrimary,
                        marginTop: '20px',
                        cursor: 'pointer'
                    }}
                >
                    Run Test
                </button>
            </div>

            <div style={{
                maxWidth: '800px',
                margin: '40px auto',
                backgroundColor: theme.bgDark,
                padding: '20px',
                borderRadius: '10px',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
            }}>
                {log.map((line, idx) => (
                    <div key={idx}>{line}</div>
                ))}
            </div>
        </div>
    );
}

export default UnoLogicTest;