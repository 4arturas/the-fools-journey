
import {Card, CardType, Suite} from './types';
import { SUITS } from './data';

const MAJOR_ARCANA_NAMES = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "The Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
];

const getMinorArcanaRankName = (rank: number): string => {
    switch (rank) {
        case 1: return "Ace";
        case 11: return "Page";
        case 12: return "Knight";
        case 13: return "Queen";
        case 14: return "King";
        default: return rank.toString();
    }
};

export const DECK_DATA = [
    ...Array.from({ length: 22 }, (_, i) => ({ id: `major-${i}`, title: MAJOR_ARCANA_NAMES[i], type: CardType.Major, rank: i, suit: SUITS.MAJOR, cardId: i })),
    ...[Suite.Wands, Suite.Cups, Suite.Swords, Suite.Pentacles].flatMap((suit, suitIndex) =>
        Array.from({ length: 14 }, (_, i) => ({
            id: `${suit.toLowerCase()}-${i + 1}`,
            title: `${getMinorArcanaRankName(i + 1)} of ${suit}`,
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
