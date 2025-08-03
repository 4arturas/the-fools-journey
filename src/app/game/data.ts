export const CARD_BACK_URL = "https://www.wopc.co.uk/images/blog/2018/12/DLR_Figured_2.jpg";
export const FALLBACK_CARD_BACK_URL = "https://placehold.co/128x192/1e3a8a/ffffff?text=Card+Back";

export const SUIT_ICONS: { [key: string]: string } = {
    Wands: 'fa-solid fa-fire',
    Swords: 'fa-solid fa-hand-fist',
    Pentacles: 'fa-solid fa-coins',
    Cups: 'fa-solid fa-gem',
};

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

export const HELP_DESCRIPTIONS: { [key: string]: string } = {
    past: "This is the **Past**, or the discard pile. Cards you've used or discarded are placed here.",
    adventure: "This is the **Adventure Line**. Draw cards from the Future Deck here to start your journey. When a Major Arcana appears, you must face it as a challenge. When only one card remains, the line is refilled.",
    future: "This is the **Future Deck**. Draw the top card from this stack to fill your Adventure Line and begin your journey.",
    wisdom: "This is your **Wisdom** area. You can place up to 3 Pentacle cards here. Pentacles can be used to deploy helpers.",
    strength: "This is your **Strength** slot. Place a single Wands card here. It can be used to endure the strength of a challenge.",
    hero: "This is your hero card, **The Fool**. It represents your starting point and cannot be moved.",
    volition: "This is your **Volition** slot. Place a single Swords card here. It can be used to attack and reduce the strength of a Major Arcana challenge.",
    satchel: "This is your **Satchel**. You can store up to 3 Minor Arcana cards here for later use.",
    tokens: "These are your **Vitality** tokens. You start with 25. Losing all of your vitality means the end of your journey."
};

export const shuffleDeck = (deck: Card[]) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const getCardValue = (card: Card) => {
    if (!card) return 0;
    let value = card.rank;
    if (card.type === 'major') value = card.rank;
    if (card.isDoubled) value *= 2;
    return value;
};