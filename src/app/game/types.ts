
export interface Card {
    id: string;
    title: string;
    type: string;
    rank: number;
    suit: string;
    cardId: number;
    isDoubled: boolean;
    isPlaceholder?: boolean;
    zone?: string;
}
