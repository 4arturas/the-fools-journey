
export interface Suit {
    id: string;
    name: string;
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

export enum ActionType {
  SET_DECK = 'SET_DECK',
  DRAW_ADVENTURE_LINE = 'DRAW_ADVENTURE_LINE',
  DROP_CARD = 'DROP_CARD',
  PLAY_CARD = 'PLAY_CARD',
  RESOLVE_CHALLENGE = 'RESOLVE_CHALLENGE',
  DEPLOY_HELPER = 'DEPLOY_HELPER',
}

export enum CardType {
    Major = Zone.Major,
    Minor = Zone.Minor,
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

// TODO: I want Zone enum values here to be used
export type GameZone = Zone.Past | Zone.Wisdom | Zone.Strength | Zone.Volition | Zone.Satchel | Zone.Adventure | Zone.Future;

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
