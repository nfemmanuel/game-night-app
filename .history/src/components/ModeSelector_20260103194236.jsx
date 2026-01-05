function ModeSelector({ currentMode, onModeChange }) {
    const modes = [
        { id: 'in-person', label: 'In-Person' },
        { id: 'virtual', label: 'Virtual' },
        { id: 'single', label: 'Single' }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            flexShrink: 0
        }}>
            <div style={{
                display: 'flex',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                padding: '4px',
                border: '2px solid #444',
                gap: '4px'
            }}>
                {modes.map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        style={{
                            padding: '10px 20px',
                            fontSize: '0.95rem',
                            backgroundColor: currentMode === mode.id ? '#FF6B35' : 'transparent',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit',
                            fontWeight: currentMode === mode.id ? 'bold' : 'normal',
                            minWidth: '100px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {mode.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ModeSelector;