import styles from './GameCard.module.css';

function GameCard({ name, available, onClick }) {
    // Combine card + available/disabled classes
    const cardClasses = `${styles.card} ${available ? styles.available : styles.disabled}`;

    return (
        <div
            className={cardClasses}
            onClick={available ? onClick : null}
        >
            <h1>{name}</h1>
            <p>{available ? 'Play Now ▶️' : 'Coming Soon'}</p>
        </div>
    );
}

export default GameCard;