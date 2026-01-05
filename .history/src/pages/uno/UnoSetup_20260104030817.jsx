{/* Number of Players */ }
<div style={{
    backgroundColor: theme.bgDark,
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: `2px solid ${theme.secondary}`
}}>
    <label style={{
        display: 'block',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: theme.textPrimary
    }}>
        Number of Players (2-{maxPlayers})
    </label>

    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
    }}>
        <button
            onClick={() => numPlayers > 2 && setNumPlayers(numPlayers - 1)}
            disabled={numPlayers <= 2}
            style={{
                width: '50px',
                height: '50px',
                fontSize: '2rem',
                backgroundColor: numPlayers > 2 ? theme.accent : theme.textDisabled,
                color: theme.textPrimary,
                border: 'none',
                borderRadius: '5px',
                cursor: numPlayers > 2 ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                fontWeight: 'bold'
            }}
        >
            −
        </button>

        <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            minWidth: '80px',
            textAlign: 'center',
            color: theme.textPrimary
        }}>
            {numPlayers}
        </div>

        <button
            onClick={() => numPlayers < maxPlayers && setNumPlayers(numPlayers + 1)}
            disabled={numPlayers >= maxPlayers}
            style={{
                width: '50px',
                height: '50px',
                fontSize: '2rem',
                backgroundColor: numPlayers < maxPlayers ? theme.accent : theme.textDisabled,
                color: theme.textPrimary,
                border: 'none',
                borderRadius: '5px',
                cursor: numPlayers < maxPlayers ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                fontWeight: 'bold'
            }}
        >
            +
        </button>
    </div>

    <p style={{
        marginTop: '15px',
        fontSize: '1rem',
        color: theme.textSecondary,
        textAlign: 'center'
    }}>
        You vs {numPlayers - 1} CPU opponent{numPlayers > 2 ? 's' : ''}
    </p>
</div>