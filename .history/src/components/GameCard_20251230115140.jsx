function GameCard({ name, available, onClick }) {
    return (
        <div
            onClick={available ? onClick : null}
            style={{
                width: '200px',
                padding: '30px',
                backgroundColor: available ? '#4CAF50' : '#666',
                color: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: available ? 'pointer' : 'not-allowed',
                opacity: available ? 1 : 0.5
            }}
        >
            <h3>{name}</h3>
            <p>{available ? 'Play Now ▶️' : 'Coming Soon'}</p>
        </div>
    );
}
