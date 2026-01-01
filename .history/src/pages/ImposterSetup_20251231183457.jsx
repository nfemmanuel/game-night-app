return (
    <div style={{
        padding: '20px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 60px)'
    }}>
        <BackButton to="/" />
        <HelpButton />

        <h1 className="page-title">IMPOSTER - SETUP</h1>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '30px' }}>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter player name"
                    style={{
                        padding: '15px',
                        fontSize: '1.2rem',
                        borderRadius: '5px',
                        border: '2px solid white',
                        width: '300px',
                        marginRight: '10px',
                        fontFamily: 'inherit',
                        backgroundColor: '#333',
                        color: 'white'
                    }}
                />
                <button
                    onClick={addPlayer}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        backgroundColor: '#FF6B35',
                        color: 'white'
                    }}
                >
                    Add
                </button>
            </div>

            {/* Rest of your code stays the same */}