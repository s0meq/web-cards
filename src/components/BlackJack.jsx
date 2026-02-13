import { makeDeck, shuffleDeck, drawCard } from "../utils/Cards";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card";
import { DeckPile } from "./DeckPile";
import './BlackJack.css';

const BlackJack = () => {
    const [deck, setDeck] = useState(makeDeck());
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [flyingCards, setFlyingCards] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [revealDealer, setRevealDealer] = useState(false);
    const [gameStatus, setGameStatus] = useState('idle');
    const deckRef = useRef(null);
    const handRef = useRef(null);
    const dealerRef = useRef(null);
    const animationTimeoutsRef = useRef([]);
    const flyerIdRef = useRef(0);
    const navigate = useNavigate();

    const statusMessages = {
        idle: 'Click Deal to start a round.',
        dealing: 'Dealing cards…',
        playerTurn: 'Your turn: hit or stand.',
        dealerTurn: 'Dealer is playing.',
        playerBust: 'You bust! Dealer wins.',
        dealerBust: 'Dealer busts! You win.',
        playerWin: 'You win!',
        dealerWin: 'Dealer wins.',
        push: 'Push. It’s a tie.',
        playerBlackjack: 'Blackjack! You win.',
        dealerBlackjack: 'Dealer has blackjack.'
    };

    const canDeal = !isAnimating;
    const canHit = gameStatus === 'playerTurn' && deck.length > 0 && !isAnimating;
    const canStand = gameStatus === 'playerTurn' && !isAnimating;
    const canShuffle = !isAnimating;
    const canReset = !isAnimating;

    const animationDurationMs = 650;

    const getHandValue = (hand) => {
        let total = 0;
        let aces = 0;

        hand.forEach(card => {
            if (card.value === 'A') {
                aces += 1;
                total += 11;
                return;
            }
            if (['K', 'Q', 'J'].includes(card.value)) {
                total += 10;
                return;
            }
            total += Number(card.value);
        });

        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }

        return total;
    };

    const isBlackjack = (hand) => hand.length === 2 && getHandValue(hand) === 21;

    const getHandTargetPosition = (handIndex, handCount, targetRef) => {
        const handRect = targetRef.current?.getBoundingClientRect();
        if (!handRect) return null;

        const CARD_WIDTH = 120;
        const CARD_HEIGHT = 170;
        const CARD_GAP = 20;

        const availableWidth = Math.max(handRect.width, CARD_WIDTH + CARD_GAP);
        const cardsPerRow = Math.max(1, Math.floor(availableWidth / (CARD_WIDTH + CARD_GAP)));
        const row = Math.floor(handIndex / cardsPerRow);
        const col = handIndex % cardsPerRow;

        return {
            x: handRect.left + col * (CARD_WIDTH + CARD_GAP),
            y: handRect.top + row * (CARD_HEIGHT + CARD_GAP)
        };
    };

    const getDeckCenterPosition = () => {
        const deckRect = deckRef.current?.getBoundingClientRect();
        if (!deckRect) return null;
        const CARD_WIDTH = 120;
        const CARD_HEIGHT = 170;
        return {
            x: deckRect.left + (deckRect.width - CARD_WIDTH) / 2,
            y: deckRect.top + (deckRect.height - CARD_HEIGHT) / 2
        };
    };

    const animateCardBetween = ({ card, fromX, fromY, toX, toY, flyerClass, faceDown = false }) => {
        flyerIdRef.current += 1;
        const cardId = flyerIdRef.current;
        setFlyingCards(prev => ([
            ...prev,
            {
                id: cardId,
                card,
                fromX,
                fromY,
                toX,
                toY,
                flyerClass,
                faceDown
            }
        ]));

        return new Promise(resolve => {
            const timeoutId = setTimeout(() => {
                setFlyingCards(prev => prev.filter(item => item.id !== cardId));
                resolve();
            }, animationDurationMs);
            animationTimeoutsRef.current.push(timeoutId);
        });
    };

    const animateCardToHand = async (drawnCard, handIndex, targetRef, setTargetHand, faceDown = false) => {
        const deckCenter = getDeckCenterPosition();
        const handTarget = getHandTargetPosition(handIndex, handIndex + 1, targetRef);

        if (!deckCenter || !handTarget) {
            setTargetHand(prev => [...prev, drawnCard]);
            return;
        }

        await animateCardBetween({
            card: drawnCard,
            fromX: deckCenter.x,
            fromY: deckCenter.y,
            toX: handTarget.x,
            toY: handTarget.y,
            flyerClass: 'card-flyer',
            faceDown
        });

        setTargetHand(prev => [...prev, drawnCard]);
    };

    const animateAllCardsToDeck = (cards) => {
        const deckCenter = getDeckCenterPosition();
        if (!deckCenter) return Promise.resolve();

        cards.forEach(({ card, handIndex, handCount, targetRef }) => {
            const handStart = getHandTargetPosition(handIndex, handCount, targetRef);
            if (!handStart) return;
            animateCardBetween({
                card,
                fromX: handStart.x,
                fromY: handStart.y,
                toX: deckCenter.x,
                toY: deckCenter.y,
                flyerClass: 'card-flyer-return'
            });
        });

        return new Promise(resolve => {
            const timeoutId = setTimeout(resolve, animationDurationMs);
            animationTimeoutsRef.current.push(timeoutId);
        });
    };
  
    const handleDrawHand = async () => {
        if (isAnimating) return;

        const freshDeck = shuffleDeck(makeDeck());
        setDeck([...freshDeck]);
        setPlayerHand([]);
        setDealerHand([]);
        setRevealDealer(false);
        setGameStatus('dealing');

        setIsAnimating(true);

        let nextPlayer = [];
        let nextDealer = [];
        const dealOrder = ['player', 'dealer', 'player', 'dealer'];

        for (const target of dealOrder) {
            if (freshDeck.length === 0) break;
            const drawnCard = drawCard(freshDeck);
            setDeck([...freshDeck]);
            if (target === 'player') {
                await animateCardToHand(drawnCard, nextPlayer.length, handRef, setPlayerHand);
                nextPlayer = [...nextPlayer, drawnCard];
            } else {
                const faceDown = nextDealer.length === 0;
                await animateCardToHand(drawnCard, nextDealer.length, dealerRef, setDealerHand, faceDown);
                nextDealer = [...nextDealer, drawnCard];
            }
        }

        const playerBlackjack = isBlackjack(nextPlayer);
        const dealerBlackjack = isBlackjack(nextDealer);

        if (playerBlackjack || dealerBlackjack) {
            setRevealDealer(true);
            if (playerBlackjack && dealerBlackjack) {
                setGameStatus('push');
            } else if (playerBlackjack) {
                setGameStatus('playerBlackjack');
            } else {
                setGameStatus('dealerBlackjack');
            }
            setIsAnimating(false);
            return;
        }

        setGameStatus('playerTurn');
        setIsAnimating(false);
    };

    const handleShuffleDeck = async () => {
        if (isAnimating) return;

        setIsAnimating(true);

        let workingDeck = [...deck];
        const playerCards = [...playerHand];
        const dealerCards = [...dealerHand];

        if (playerCards.length > 0 || dealerCards.length > 0) {
            setPlayerHand([]);
            setDealerHand([]);
            setRevealDealer(false);

            const returningCards = [
                ...playerCards.map((card, index) => ({
                    card,
                    handIndex: index,
                    handCount: playerCards.length,
                    targetRef: handRef
                })),
                ...dealerCards.map((card, index) => ({
                    card,
                    handIndex: index,
                    handCount: dealerCards.length,
                    targetRef: dealerRef
                }))
            ];

            await animateAllCardsToDeck(returningCards);
            workingDeck = [...workingDeck, ...playerCards, ...dealerCards];
            setDeck(workingDeck);
        }

        setGameStatus('idle');
        setIsShuffling(true);
        const shuffleTimeoutId = setTimeout(() => {
            setDeck(shuffleDeck([...workingDeck]));
            setIsShuffling(false);
            setIsAnimating(false);
        }, animationDurationMs);
        animationTimeoutsRef.current.push(shuffleTimeoutId);
    }

    const handleResetDeck = () => {
        setDeck(makeDeck());
        setPlayerHand([]);
        setDealerHand([]);
        setRevealDealer(false);
        setGameStatus('idle');
    }

    const handleDrawCard = async () => {
        if (deck.length === 0 || isAnimating || gameStatus !== 'playerTurn') return;

        const newDeck = [...deck];
        const drawnCard = drawCard(newDeck);
        const nextPlayerHand = [...playerHand, drawnCard];
        setDeck(newDeck);
        setIsAnimating(true);
        await animateCardToHand(drawnCard, playerHand.length, handRef, setPlayerHand);
        const playerValue = getHandValue(nextPlayerHand);
        if (playerValue > 21) {
            setRevealDealer(true);
            setGameStatus('playerBust');
        } else {
            setGameStatus('playerTurn');
        }
        setIsAnimating(false);
    };

    const handleStand = async () => {
        if (isAnimating || gameStatus !== 'playerTurn') return;

        setIsAnimating(true);
        setRevealDealer(true);
        setGameStatus('dealerTurn');

        let workingDeck = [...deck];
        let workingDealer = [...dealerHand];

        while (getHandValue(workingDealer) < 17 && workingDeck.length > 0) {
            const drawnCard = drawCard(workingDeck);
            workingDealer = [...workingDealer, drawnCard];
            setDeck([...workingDeck]);
            await animateCardToHand(drawnCard, workingDealer.length - 1, dealerRef, setDealerHand);
        }

        const dealerValue = getHandValue(workingDealer);
        const playerValue = getHandValue(playerHand);

        if (dealerValue > 21) {
            setGameStatus('dealerBust');
        } else if (dealerValue > playerValue) {
            setGameStatus('dealerWin');
        } else if (dealerValue < playerValue) {
            setGameStatus('playerWin');
        } else {
            setGameStatus('push');
        }

        setIsAnimating(false);
    };

    useEffect(() => {
        return () => {
            animationTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
            animationTimeoutsRef.current = [];
        };
    }, []);

    return (
        <div className="blackjack-container">
            <div className="blackjack-layout">
                <div className="deck-area">
                    <h2>Deck</h2>
                    <DeckPile
                        cardCount={deck.length}
                        onClick={handleDrawCard}
                        pileRef={deckRef}
                        className={isShuffling ? 'shuffle' : ''}
                    />
                    <p className="deck-hint">Click the deck or press Hit to draw.</p>
                </div>

                <div className="table-column">
                    <div className="table-header">
                        <h1>BlackJack</h1>
                        <p className="status-text" aria-live="polite">{statusMessages[gameStatus]}</p>
                    </div>

                    <div className="dealer-area">
                        <h2>Dealer</h2>
                        <div className="hand-container table-hand dealer-hand" ref={dealerRef}>
                            {dealerHand.map((card, index) => {
                                const angle = (index - (dealerHand.length - 1) / 2) * 3;
                                const lift = Math.abs(index - (dealerHand.length - 1) / 2) * 3;
                                return (
                                <Card
                                    key={`${card.suit}-${card.value}-${index}`}
                                    suit={card.suit}
                                    value={card.value}
                                    faceDown={!revealDealer && index === 0}
                                    style={{ zIndex: index + 1, '--card-rotate': `${angle}deg`, '--card-lift': `${lift}px` }}
                                />
                                );
                            })}
                        </div>
                        <p className="hand-value">
                            Dealer: {revealDealer ? getHandValue(dealerHand) : '??'}
                        </p>
                    </div>

                    <div className="player-area">
                        <h2>Your Hand</h2>
                        <div className="hand-container table-hand player-hand" ref={handRef}>
                            {playerHand.map((card, index) => {
                                const angle = (index - (playerHand.length - 1) / 2) * 3;
                                const lift = Math.abs(index - (playerHand.length - 1) / 2) * 3;
                                return (
                                    <Card
                                        key={`${card.suit}-${card.value}-${index}`}
                                        suit={card.suit}
                                        value={card.value}
                                        style={{ zIndex: index + 1, '--card-rotate': `${angle}deg`, '--card-lift': `${lift}px` }}
                                    />
                                );
                            })}
                        </div>
                        <p className="hand-value">You: {getHandValue(playerHand)}</p>
                    </div>
                </div>

                <div className="control-sidebar">
                    <h3>Controls</h3>
                    <button className="control-button shuffle" onClick={handleShuffleDeck} disabled={!canShuffle}>
                        🔀 Shuffle Deck
                    </button>
                    <button className="control-button reset" onClick={handleResetDeck} disabled={!canReset}>
                        🔄 Reset Deck
                    </button>
                    <button className="control-button draw" onClick={handleDrawHand} disabled={!canDeal}>
                        🃏 Deal Hand
                    </button>
                    <button className="control-button hit" onClick={handleDrawCard} disabled={!canHit}>
                        🎯 Hit
                    </button>
                    <button className="control-button stand" onClick={handleStand} disabled={!canStand}>
                        ✋ Stand
                    </button>
                    <button className="control-button back" onClick={() => navigate('/')}
                    >
                        ⬅️ Back to Menu
                    </button>
                </div>
            </div>

            {flyingCards.map(flyingCard => (
                <Card
                    key={flyingCard.id}
                    suit={flyingCard.card.suit}
                    value={flyingCard.card.value}
                    flippable={!flyingCard.faceDown}
                    faceDown={flyingCard.faceDown}
                    className={flyingCard.flyerClass}
                    style={{
                        '--from-x': `${flyingCard.fromX}px`,
                        '--from-y': `${flyingCard.fromY}px`,
                        '--to-x': `${flyingCard.toX}px`,
                        '--to-y': `${flyingCard.toY}px`
                    }}
                />
            ))}
        </div>
    );
}

export default BlackJack;