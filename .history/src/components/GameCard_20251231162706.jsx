import styles from './GameCard.module.css';

function GameCard({ name, available, onClick }) {
    // Combine card + available/disabled classes
    const cardClasses = `${styles.card} ${available ? styles.available : styles.disabled}`;

    return (
        <div
            className={cardClasses}
            onClick={available ? onClick : null}
        >
            <h3>{name}</h3>
            <p>{available ? 'Play Now ▶️' : 'Coming Soon'}</p>
        </div>
    );
}

export default GameCard;