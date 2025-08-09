
import { Card, CardType } from './types';
import { SUITS } from './data';

export const DECK_DATA = [
    ...Array.from({ length: 22 }, (_, i) => ({ id: `major-${i}`, title: `Major Arcana ${i}`, type: CardType.Major, rank: i, suit: SUITS.MAJOR, cardId: i })),
    ...['Wands', 'Cups', 'Swords', 'Pentacles'].flatMap((suit, suitIndex) =>
        Array.from({ length: 14 }, (_, i) => ({
            id: `${suit.toLowerCase()}-${i + 1}`,
            title: `${suit} ${i + 1}`,
            type: CardType.Minor,
            rank: i + 1,
            suit: SUITS[suit.toUpperCase()],
            cardId: 22 + (suitIndex * 14) + i,
        }))
    ),
].map(card => ({ ...card, isDoubled: false }));

export const getCardValue = (card: Card | null) => {
    if (!card) return 0;
    let value = card.rank;
    if (card.type === CardType.Major) value = card.rank;
    if (card.isDoubled) value *= 2;
    return value;
};
