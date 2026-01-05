import styles from './GameCard.module.css';
import { useTheme } from '../contexts/ThemeContext';

function GameCard({ name, available, onClick, color }) {
    const { theme } = useTheme();

    const cardClasses = `${styles.card} ${available ? styles.available : styles.disabled}`;

    const backgroundColor = available
        ? (color === 'color1' ? theme.cardColor1 : theme.cardColor2)
        : theme.bgLight;

    return (
        <div
            className={cardClasses}
            onClick={available ? onClick : null}
            style={{
                backgroundColor: backgroundColor,
                borderColor: theme.light,
                color: theme.textPrimary
            }}
        >
            <div className={styles.cardName}>{name}</div>
            <div className={styles.cardAvailable}>
                {available ? '▶ Play Now' : 'Coming Soon'}
            </div>
        </div>
    );
}

export default GameCard;