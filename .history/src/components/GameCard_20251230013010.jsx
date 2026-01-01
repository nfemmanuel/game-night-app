function GameCard({ name, available, onClick }) {
    return (
        <div
            onClick={available ? onClick : null}
            style={{
                // Your inline styles here (we'll move to CSS later)
            }}
        >
            {/* Game name */}
            {/* Status text */}
        </div>
    );
}

export default GameCard;