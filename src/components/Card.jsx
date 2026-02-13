import './Card.css';

const getSuitSymbol = (suit) => {
    const suits = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };
    return suits[suit.toLowerCase()] || suit;
};

const getSuitColor = (suit) => {
    const lowerSuit = suit.toLowerCase();
    return (lowerSuit === 'hearts' || lowerSuit === 'diamonds') ? 'red' : 'black';
};

export const Card = ({ suit, value, className = '', style, flippable = false, faceDown = false }) => {
    const color = getSuitColor(suit);
    
    return (
        <div className={`card ${color} ${flippable ? 'card-flip' : ''} ${faceDown ? 'face-down' : ''} ${className}`} style={style}>
            {faceDown ? (
                <div className="card-back-face">
                    <div className="card-back-pattern"></div>
                </div>
            ) : flippable ? (
                <>
                    <div className="card-face card-front">
                        <div className="card-corner top-left">
                            <div className="card-value">{value}</div>
                            <div className="card-suit">{getSuitSymbol(suit)}</div>
                        </div>
                        <div className="card-center">
                            <span className="card-suit-large">{getSuitSymbol(suit)}</span>
                        </div>
                        <div className="card-corner bottom-right">
                            <div className="card-value">{value}</div>
                            <div className="card-suit">{getSuitSymbol(suit)}</div>
                        </div>
                    </div>
                    <div className="card-face card-back-face">
                        <div className="card-back-pattern"></div>
                    </div>
                </>
            ) : (
                <>
                    <div className="card-corner top-left">
                        <div className="card-value">{value}</div>
                        <div className="card-suit">{getSuitSymbol(suit)}</div>
                    </div>
                    <div className="card-center">
                        <span className="card-suit-large">{getSuitSymbol(suit)}</span>
                    </div>
                    <div className="card-corner bottom-right">
                        <div className="card-value">{value}</div>
                        <div className="card-suit">{getSuitSymbol(suit)}</div>
                    </div>
                </>
            )}
        </div>
    );
};