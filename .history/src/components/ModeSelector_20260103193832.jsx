function ModeSelector({ currentMode, onModeChange }) {
    const modes = [
        { id: 'in-person', label: 'In-Person' },
        { id: 'virtual', label: 'Virtual' },
        { id: 'single', label: 'Single Player' }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '30px',
            flexShrink: 0
        }}>
            {modes.map(mode => (
                <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    style={{
                        padding: '12px 24px',
                        fontSize: '1rem',
                        backgroundColor: currentMode === mode.id ? '#FF6B35' : 'transparent',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit',
                        fontWeight: currentMode === mode.id ? 'bold' : 'normal'
                    }}
                >
                    {mode.label}
                </button>
            ))}
        </div>
    );
}

export default ModeSelector;