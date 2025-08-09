
import { Card } from './types';

export const DECK_DATA = [
    ...Array.from({ length: 22 }, (_, i) => ({ id: `major-${i}`, title: `Major Arcana ${i}`, type: 'major', rank: i, suit: 'Major', cardId: i })),
    ...['Wands', 'Cups', 'Swords', 'Pentacles'].flatMap((suit, suitIndex) =>
        Array.from({ length: 14 }, (_, i) => ({
            id: `${suit.toLowerCase()}-${i + 1}`,
            title: `${suit} ${i + 1}`,
            type: 'minor',
            rank: i + 1,
            suit: suit,
            cardId: 22 + (suitIndex * 14) + i,
        }))
    ),
].map(card => ({ ...card, isDoubled: false }));

export const getCardValue = (card: Card | null) => {
    if (!card) return 0;
    let value = card.rank;
    if (card.type === 'major') value = card.rank;
    if (card.isDoubled) value *= 2;
    return value;
};
