import './DeckPile.css';

const CardBack = ({ style }) => {
    return (
        <div className="card card-back" style={style}>
            <div className="card-back-pattern"></div>
        </div>
    );
};

export const DeckPile = ({ cardCount, onClick }) => {
    // Show up to 5 cards in the pile for visual effect
    const visibleCards = Math.min(cardCount, 5);
    
    return (
        <div className="deck-pile-container">
            <div className="deck-pile" onClick={cardCount > 0 ? onClick : null} style={{ cursor: cardCount > 0 ? 'pointer' : 'default' }}>
                {[...Array(visibleCards)].map((_, index) => (
                    <CardBack 
                        key={index} 
                        style={{
                            position: 'absolute',
                            top: `${index * 2}px`,
                            left: `${index * 2}px`,
                            zIndex: index
                        }}
                    />
                ))}
            </div>
            <div className="card-count">{cardCount} cards</div>
        </div>
    );
};
