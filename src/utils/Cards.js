const suits = [
    "Spades",
    "Diamonds",
    "Clubs",
    "Hearts"
];

export const makeDeck = () => {
    let deck = [];
    for (let suit of suits) {
        for (let i = 1; i <= 13; i++) {
            deck.push({
                suit: suit,
                value: i === 1 ? "A" : i === 11 ? "J" : i === 12 ? "Q" : i === 13 ? "K" : i
            });
        }
    }
    return deck;
};

export const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

export const drawCard = (deck) => {
    return deck.shift();
}

export const drawHand = (deck, handSize = 5) => {
    let hand = [];
    for (let i = 0; i < handSize; i++) {
        if (deck.length === 0) break;
        hand.push(drawCard(deck));
    }
    return hand;
}