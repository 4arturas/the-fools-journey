
export interface Suit {
    id: string;
    name: string;
}

export enum CardType {
    Major = 'major',
    Minor = 'minor',
}

export interface GameState {
    adventureCards: Card[];
    pastCards: Card[];
    futureCards: Card[];
    wisdomCards: Card[];
    strengthCard: { card: Card | null, value: number };
    volitionCard: Card | null;
    satchelCards: Card[];
    vitality: number;
}

export enum Zone {
    Major = 'major',
    Minor = 'minor',
    Past = 'past',
    Wisdom = 'wisdom',
    Strength = 'strength',
    Volition = 'volition',
    Satchel = 'satchel',
    Adventure = 'adventure',
    Future = 'future'
}

export type GameZone = 'past' | 'wisdom' | 'strength' | 'volition' | 'satchel' | 'adventure' | 'future';

export interface Card {
    id: string;
    title: string;
    type: CardType;
    rank: number;
    suit: Suit;
    cardId: number;
    isDoubled: boolean;
    isPlaceholder?: boolean;
    zone?: GameZone;
}
