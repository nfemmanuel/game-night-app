import styles from './GameCard.module.css';

function GameCard({ name, available, onClick }) {
    return (
        <div
            className={available ? styles.available : styles.disabled}
            onClick={available ? onClick : null}
        >
            <h3>{name}</h3>
            <p>{available ? '▶' : 'Coming Soon'}</p>
        </div>
    );
}

export default GameCard;