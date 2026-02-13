import { makeDeck, shuffleDeck, drawCard, drawHand } from "../utils/Cards";
import { useEffect, useState } from "react";
import { Card } from "./Card";
import { DeckPile } from "./DeckPile";
import './BlackJack.css';

const BlackJack = () => {
    const [deck, setDeck] = useState(makeDeck());
    const [hand, setHand] = useState([]);
  
    const handleDrawHand = () => {
        setDeck(makeDeck());
        setDeck(shuffleDeck([...deck]));
        setHand(drawHand(deck));
    };

    const handleShuffleDeck = () => {
        setDeck(shuffleDeck([...deck]));
        setHand([]);
    }

    const handleResetDeck = () => {
        setDeck(makeDeck());
        setHand([]);
    }

    const handleDrawCard = () => {
        if (deck.length > 0) {
            const newDeck = [...deck];
            const drawnCard = drawCard(newDeck);
            setDeck(newDeck);
            setHand([...hand, drawnCard]);
        }
    };

    return (
        <div className="blackjack-container">
            <div className="control-sidebar">
                <h3>Controls</h3>
                <button className="control-button shuffle" onClick={handleShuffleDeck}>
                    🔀 Shuffle Deck
                </button>
                <button className="control-button reset" onClick={handleResetDeck}>
                    🔄 Reset Deck
                </button>
                <button className="control-button draw" onClick={handleDrawHand}>
                    🃏 Draw Hand
                </button>
            </div>

            <h1>BlackJack</h1>

            <div style={{ marginTop: '20px' }}>
                <h2>Deck</h2>
                <DeckPile cardCount={deck.length} onClick={handleDrawCard} />
                <p style={{ fontSize: '14px', color: '#666' }}>Click the deck to draw a card</p>
            </div>

            {hand.length > 0 && (
                <div>
                    <h2>Your Hand</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {hand.map((card, index) => (
                            <Card key={index} suit={card.suit} value={card.value} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlackJack;