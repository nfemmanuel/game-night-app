import styles from './GameCard.module.css';

function GameCard({ name, available, onClick, color }) {  // Add color here
    // Combine card + available/disabled classes + color
    const cardClasses = `${styles.card} ${available ? styles.available : styles.disabled} ${color ? styles[color] : ''}`;

    return (
        <div
            className={cardClasses}
            onClick={available ? onClick : null}
        >
            <h2 style={{ fontSize: '20%' }}>{name}</h2>
            <p>{available ? '▶ Play Now' : 'Coming Soon'}</p>
        </div>
    );
}

export default GameCard;