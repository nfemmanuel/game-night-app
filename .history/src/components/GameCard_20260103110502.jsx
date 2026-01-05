import styles from './GameCard.module.css';

function GameCard({ name, available, onClick, color }) {
    const cardClasses = `${styles.card} ${available ? styles.available : styles.disabled} ${color ? styles[color] : ''}`;

    return (
        <div
            className={cardClasses}
            onClick={available ? onClick : null}
        >
            <div className="card-name">{name}</div>
            <div className="card-status">{available ? '▶ Play Now' : 'Coming Soon'}</div>
        </div>
    );
}

export default GameCard;