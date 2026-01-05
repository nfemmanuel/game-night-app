import { useTheme } from '../../contexts/ThemeContext';

function UnoCard({ card, onClick, isPlayable = true, faceDown = false, size = 'normal' }) {
    const { theme } = useTheme();

    // Card dimensions
    const dimensions = {
        small: { width: 60, height: 90 },
        normal: { width: 80, height: 120 },
        large: { width: 120, height: 180 }
    };

    const { width, height } = dimensions[size];

    // UNO colors
    const unoColors = {
        red: '#E74C3C',
        yellow: '#F39C12',
        green: '#27AE60',
        blue: '#3498DB'
    };

    // Card back (face down)
    if (faceDown) {
        return (
            <svg
                width={width}
                height={height}
                viewBox="0 0 80 120"
                style={{
                    cursor: 'default',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
            >
                <rect
                    x="2" y="2"
                    width="76" height="116"
                    rx="8"
                    fill="#2C3E50"
                    stroke="#ecf0f1"
                    strokeWidth="3"
                />
                <text
                    x="40" y="70"
                    textAnchor="middle"
                    fill="white"
                    fontFamily="Piedra, cursive"
                    fontSize="28"
                    fontWeight="bold"
                >
                    UNO
                </text>
            </svg>
        );
    }

    // Get card color
    const bgColor = card.color ? unoColors[card.color] : '#2C3E50';

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 80 120"
            style={{
                cursor: isPlayable ? 'pointer' : 'not-allowed',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                opacity: isPlayable ? 1 : 0.6,
                transition: 'transform 0.2s ease'
            }}
            onClick={isPlayable ? onClick : undefined}
            onMouseEnter={(e) => {
                if (isPlayable) e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
                if (isPlayable) e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Card background */}
            <rect
                x="2" y="2"
                width="76" height="116"
                rx="8"
                fill={bgColor}
                stroke="white"
                strokeWidth="3"
            />

            {/* White center oval */}
            <ellipse
                cx="40" cy="60"
                rx="28" ry="42"
                fill="white"
            />

            {/* Main card content */}
            {renderCardValue(card)}

            {/* Top-left mini value */}
            <text
                x="12" y="20"
                textAnchor="middle"
                fill={bgColor}
                fontFamily="Piedra, cursive"
                fontSize="14"
                fontWeight="bold"
            >
                {getMiniValue(card)}
            </text>

            {/* Bottom-right mini value (rotated) */}
            <g transform="translate(68, 100) rotate(180)">
                <text
                    x="0" y="0"
                    textAnchor="middle"
                    fill={bgColor}
                    fontFamily="Piedra, cursive"
                    fontSize="14"
                    fontWeight="bold"
                >
                    {getMiniValue(card)}
                </text>
            </g>
        </svg>
    );
}

function renderCardValue(card) {
    const unoColors = {
        red: '#E74C3C',
        yellow: '#F39C12',
        green: '#27AE60',
        blue: '#3498DB'
    };

    const color = card.color ? unoColors[card.color] : '#2C3E50';

    // Number cards
    if (card.card_type === 'number') {
        return (
            <text
                x="40" y="75"
                textAnchor="middle"
                fill={color}
                fontFamily="Piedra, cursive"
                fontSize="52"
                fontWeight="bold"
            >
                {card.value}
            </text>
        );
    }

    // Skip
    if (card.value === 'skip') {
        return (
            <g>
                <circle
                    cx="40" cy="60"
                    r="22"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                />
                <line
                    x1="22" y1="42"
                    x2="58" y2="78"
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                />
            </g>
        );
    }

    // Reverse - Two curling arrows pointing up and down
    if (card.value === 'reverse') {
        return (
            <g>
                {/* Top curved arrow pointing clockwise/up */}
                <path
                    d="M 25 45 Q 25 35, 40 35 Q 55 35, 55 45"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                {/* Top arrowhead */}
                <path
                    d="M 55 45 L 50 40 L 50 50 Z"
                    fill={color}
                />

                {/* Bottom curved arrow pointing counter-clockwise/down */}
                <path
                    d="M 55 75 Q 55 85, 40 85 Q 25 85, 25 75"
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                {/* Bottom arrowhead */}
                <path
                    d="M 25 75 L 30 70 L 30 80 Z"
                    fill={color}
                />
            </g>
        );
    }

    // Draw 2
    if (card.value === 'draw2') {
        return (
            <text
                x="40" y="70"
                textAnchor="middle"
                fill={color}
                fontFamily="Piedra, cursive"
                fontSize="36"
                fontWeight="bold"
            >
                +2
            </text>
        );
    }

    // Wild Draw 4
    if (card.value === 'wild_draw4') {
        return (
            <g>
                <rect x="15" y="35" width="24" height="24" fill="#E74C3C" rx="3" />
                <rect x="41" y="35" width="24" height="24" fill="#F39C12" rx="3" />
                <rect x="15" y="61" width="24" height="24" fill="#27AE60" rx="3" />
                <rect x="41" y="61" width="24" height="24" fill="#3498DB" rx="3" />
                <text
                    x="40" y="70"
                    textAnchor="middle"
                    fill="white"
                    fontFamily="Piedra, cursive"
                    fontSize="28"
                    fontWeight="bold"
                    stroke="black"
                    strokeWidth="1.5"
                >
                    +4
                </text>
            </g>
        );
    }

    // Regular Wild
    if (card.value === 'wild') {
        return (
            <g>
                <path d="M 40 35 L 65 47.5 L 40 60 Z" fill="#E74C3C" />
                <path d="M 40 60 L 65 72.5 L 40 85 Z" fill="#F39C12" />
                <path d="M 40 85 L 15 72.5 L 40 60 Z" fill="#27AE60" />
                <path d="M 40 60 L 15 47.5 L 40 35 Z" fill="#3498DB" />
                <circle cx="40" cy="60" r="10" fill="white" />
            </g>
        );
    }

    return null;
}

function getMiniValue(card) {
    if (card.card_type === 'number') return card.value;
    if (card.value === 'skip') return 'S';
    if (card.value === 'reverse') return 'R';
    if (card.value === 'draw2') return '+2';
    if (card.value === 'wild') return 'W';
    if (card.value === 'wild_draw4') return '+4';
    return '?';
}

export default UnoCard;