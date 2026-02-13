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

export const Card = ({ suit, value }) => {
    const color = getSuitColor(suit);
    
    return (
        <div className={`card ${color}`}>
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
    );
};