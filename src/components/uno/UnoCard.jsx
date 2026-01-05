import React from 'react';

function UnoCard({ card, faceDown, isPlayable, onClick, size = "normal" }) {
    const sizes = {
        small: { width: 60, height: 90, fontSize: 24, cornerSize: 12 },
        normal: { width: 80, height: 120, fontSize: 32, cornerSize: 16 },
        large: { width: 100, height: 150, fontSize: 40, cornerSize: 20 }
    };

    const { width, height, fontSize, cornerSize } = sizes[size];

    // Card back
    if (faceDown) {
        return (
            <svg
                width={width}
                height={height}
                viewBox="0 0 100 150"
                style={{
                    cursor: isPlayable ? 'pointer' : 'default',
                    transition: 'transform 0.2s ease',
                    filter: isPlayable ? 'brightness(1)' : 'brightness(0.8)'
                }}
                onClick={isPlayable ? onClick : undefined}
            >
                <rect
                    x="2"
                    y="2"
                    width="96"
                    height="146"
                    rx="8"
                    fill="#2C3E50"
                    stroke="white"
                    strokeWidth="3"
                />
                <text
                    x="50"
                    y="85"
                    fontSize="28"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                >
                    UNO
                </text>
            </svg>
        );
    }

    if (!card) return null;

    const colors = {
        red: '#E74C3C',
        yellow: '#F39C12',
        green: '#27AE60',
        blue: '#3498DB'
    };

    const cardColor = colors[card.color] || '#34495E';

    const handleClick = () => {
        if (isPlayable && onClick) {
            onClick(card);
        }
    };

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 150"
            style={{
                cursor: isPlayable ? 'pointer' : 'default',
                transition: 'transform 0.2s ease',
                filter: isPlayable ? 'brightness(1)' : 'brightness(0.7)'
            }}
            onClick={handleClick}
        >
            {/* Card border */}
            <rect
                x="2"
                y="2"
                width="96"
                height="146"
                rx="8"
                fill={cardColor}
                stroke="white"
                strokeWidth="3"
            />

            {/* Center oval */}
            <ellipse
                cx="50"
                cy="75"
                rx="35"
                ry="50"
                fill="white"
            />

            {/* Card content based on type */}
            {card.card_type === 'number' && (
                <>
                    {/* Center number - ALWAYS show the actual number */}
                    <text
                        x="50"
                        y="90"
                        fontSize={fontSize}
                        fontWeight="bold"
                        fill={cardColor}
                        textAnchor="middle"
                        fontFamily="Arial, sans-serif"
                    >
                        {card.value}
                    </text>

                    {/* Top-left corner - symbols for 0 and 7, numbers otherwise */}
                    <text
                        x="15"
                        y="25"
                        fontSize={cornerSize}
                        fontWeight="bold"
                        fill="white"
                        textAnchor="middle"
                        fontFamily="Arial, sans-serif"
                    >
                        {card.value === '0' ? '↻' : card.value === '7' ? '⇄' : card.value}
                    </text>

                    {/* Bottom-right corner - symbols for 0 and 7, numbers otherwise */}
                    <text
                        x="85"
                        y="140"
                        fontSize={cornerSize}
                        fontWeight="bold"
                        fill="white"
                        textAnchor="middle"
                        fontFamily="Arial, sans-serif"
                    >
                        {card.value === '0' ? '↻' : card.value === '7' ? '⇄' : card.value}
                    </text>
                </>
            )}

            {card.card_type === 'action' && card.value === 'skip' && (
                <>
                    {/* Skip symbol - circle with diagonal line */}
                    <circle cx="50" cy="75" r="25" fill="none" stroke={cardColor} strokeWidth="4" />
                    <line x1="30" y1="95" x2="70" y2="55" stroke={cardColor} strokeWidth="4" />

                    <text x="15" y="25" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">⊘</text>
                    <text x="85" y="140" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">⊘</text>
                </>
            )}

            {card.card_type === 'action' && card.value === 'skip_everyone' && (
                <>
                    {/* Skip Everyone - multiple circles with line */}
                    <circle cx="35" cy="65" r="15" fill="none" stroke={cardColor} strokeWidth="3" />
                    <circle cx="50" cy="75" r="15" fill="none" stroke={cardColor} strokeWidth="3" />
                    <circle cx="65" cy="85" r="15" fill="none" stroke={cardColor} strokeWidth="3" />
                    <line x1="20" y1="50" x2="80" y2="100" stroke={cardColor} strokeWidth="4" />

                    <text x="15" y="25" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">⊘⊘</text>
                    <text x="85" y="140" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">⊘⊘</text>
                </>
            )}

            {card.card_type === 'action' && card.value === 'reverse' && (
                <>
                    {/* Reverse arrows */}
                    <path
                        d="M 30 60 Q 35 50, 45 50 L 45 45 L 55 55 L 45 65 L 45 60 Q 37 60, 32 65"
                        fill={cardColor}
                    />
                    <path
                        d="M 70 90 Q 65 100, 55 100 L 55 105 L 45 95 L 55 85 L 55 90 Q 63 90, 68 85"
                        fill={cardColor}
                    />

                    <text x="15" y="25" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">⟲</text>
                    <text x="85" y="140" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">⟲</text>
                </>
            )}

            {card.card_type === 'action' && card.value === 'draw2' && (
                <>
                    <text
                        x="50"
                        y="90"
                        fontSize={fontSize}
                        fontWeight="bold"
                        fill={cardColor}
                        textAnchor="middle"
                        fontFamily="Arial, sans-serif"
                    >
                        +2
                    </text>

                    <text x="15" y="25" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">+2</text>
                    <text x="85" y="140" fontSize={cornerSize} fontWeight="bold" fill="white" textAnchor="middle">+2</text>
                </>
            )}

            {card.card_type === 'action' && card.value === 'discard_all' && (
                <>
                    {/* Discard All - stack of cards with X */}
                    <rect x="30" y="60" width="20" height="30" rx="2" fill={cardColor} opacity="0.7" />
                    <rect x="37" y="65" width="20" height="30" rx="2" fill={cardColor} opacity="0.8" />
                    <rect x="44" y="70" width="20" height="30" rx="2" fill={cardColor} />
                    <text x="54" y="92" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">✕</text>

                    <text x="15" y="25" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">DA</text>
                    <text x="85" y="140" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">DA</text>
                </>
            )}

            {card.card_type === 'wild' && card.value === 'wild' && (
                <>
                    {/* Four colored squares */}
                    <rect x="30" y="55" width="15" height="15" fill="#E74C3C" />
                    <rect x="55" y="55" width="15" height="15" fill="#F39C12" />
                    <rect x="30" y="80" width="15" height="15" fill="#27AE60" />
                    <rect x="55" y="80" width="15" height="15" fill="#3498DB" />

                    <text x="15" y="25" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">W</text>
                    <text x="85" y="140" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">W</text>
                </>
            )}

            {card.card_type === 'wild' && card.value === 'wild_draw4' && (
                <>
                    <rect x="30" y="55" width="15" height="15" fill="#E74C3C" />
                    <rect x="55" y="55" width="15" height="15" fill="#F39C12" />
                    <rect x="30" y="80" width="15" height="15" fill="#27AE60" />
                    <rect x="55" y="80" width="15" height="15" fill="#3498DB" />

                    <text
                        x="50"
                        y="115"
                        fontSize="20"
                        fontWeight="bold"
                        fill="#2C3E50"
                        textAnchor="middle"
                    >
                        +4
                    </text>

                    <text x="15" y="25" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">+4</text>
                    <text x="85" y="140" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">+4</text>
                </>
            )}

            {card.card_type === 'wild' && card.value === 'wild_draw6' && (
                <>
                    <rect x="30" y="55" width="15" height="15" fill="#E74C3C" />
                    <rect x="55" y="55" width="15" height="15" fill="#F39C12" />
                    <rect x="30" y="80" width="15" height="15" fill="#27AE60" />
                    <rect x="55" y="80" width="15" height="15" fill="#3498DB" />

                    <text
                        x="50"
                        y="115"
                        fontSize="20"
                        fontWeight="bold"
                        fill="#C0392B"
                        textAnchor="middle"
                    >
                        +6
                    </text>

                    <text x="15" y="25" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">+6</text>
                    <text x="85" y="140" fontSize={cornerSize - 2} fontWeight="bold" fill="white" textAnchor="middle">+6</text>
                </>
            )}

            {card.card_type === 'wild' && card.value === 'wild_draw10' && (
                <>
                    <rect x="30" y="55" width="15" height="15" fill="#E74C3C" />
                    <rect x="55" y="55" width="15" height="15" fill="#F39C12" />
                    <rect x="30" y="80" width="15" height="15" fill="#27AE60" />
                    <rect x="55" y="80" width="15" height="15" fill="#3498DB" />

                    <text
                        x="50"
                        y="115"
                        fontSize="18"
                        fontWeight="bold"
                        fill="#8E44AD"
                        textAnchor="middle"
                    >
                        +10
                    </text>

                    <text x="15" y="25" fontSize={cornerSize - 3} fontWeight="bold" fill="white" textAnchor="middle">+10</text>
                    <text x="85" y="140" fontSize={cornerSize - 3} fontWeight="bold" fill="white" textAnchor="middle">+10</text>
                </>
            )}

            {card.card_type === 'wild' && card.value === 'wild_reverse_draw4' && (
                <>
                    <rect x="30" y="50" width="15" height="15" fill="#E74C3C" />
                    <rect x="55" y="50" width="15" height="15" fill="#F39C12" />
                    <rect x="30" y="75" width="15" height="15" fill="#27AE60" />
                    <rect x="55" y="75" width="15" height="15" fill="#3498DB" />

                    {/* Reverse arrow */}
                    <path
                        d="M 35 105 L 45 95 L 45 100 Q 55 100, 60 105"
                        fill="none"
                        stroke="#2C3E50"
                        strokeWidth="2"
                    />
                    <polygon points="60,105 65,100 65,110" fill="#2C3E50" />

                    <text
                        x="50"
                        y="125"
                        fontSize="16"
                        fontWeight="bold"
                        fill="#C0392B"
                        textAnchor="middle"
                    >
                        +4
                    </text>

                    <text x="15" y="25" fontSize={cornerSize - 4} fontWeight="bold" fill="white" textAnchor="middle">R+4</text>
                    <text x="85" y="140" fontSize={cornerSize - 4} fontWeight="bold" fill="white" textAnchor="middle">R+4</text>
                </>
            )}
        </svg>
    );
}

export default UnoCard;