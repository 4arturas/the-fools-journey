
import { Suit } from "./types";

export const CARD_BACK_URL = "https://www.wopc.co.uk/images/blog/2018/12/DLR_Figured_2.jpg";
export const FALLBACK_CARD_BACK_URL = "https://placehold.co/128x192/1e3a8a/ffffff?text=Card+Back";

export const SUITS: Record<string, Suit> = {
    WANDS: { id: 'wands', name: 'Wands' },
    CUPS: { id: 'cups', name: 'Cups' },
    SWORDS: { id: 'swords', name: 'Swords' },
    PENTACLES: { id: 'pentacles', name: 'Pentacles' },
        // Major Arcana cards don't have a traditional suit, but we include 'Major' here
    // to ensure all cards have a `suit` property conforming to the `Suit` interface.
    MAJOR: { id: 'major', name: 'Major' },
};

export const SUIT_ICONS: { [key: string]: string } = {
    Wands: 'fa-solid fa-fire',
    Swords: 'fa-solid fa-hand-fist',
    Pentacles: 'fa-solid fa-coins',
    Cups: 'fa-solid fa-gem',
};

export const QUESTION_MARK_EMOJI = `❓`;

