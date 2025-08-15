import { useReducer } from 'react';
import {ActionType, Card, CardType, GameState, GameZone, Zone} from './types';
import { getCardValue } from './rules';
import { message } from 'antd';
import { shuffleDeck } from './utils';
import { initialState } from './logic';

export const useGameReducer = () => useReducer(reducer, initialState);

export type Action = 
    | { type: ActionType.SET_DECK, payload: { deck: Card[] } }
    | { type: ActionType.DRAW_ADVENTURE_LINE }
    | { type: ActionType.DROP_CARD, payload: { card: Card, sourceZone: GameZone, targetZone: GameZone } }
    | { type: ActionType.PLAY_CARD, payload: { card: Card } }
    | { type: ActionType.RESOLVE_CHALLENGE, payload: { challenge: Card, method: string } }
    | { type: ActionType.DEPLOY_HELPER, payload: { helper: Card, target: Card } };

const reducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case ActionType.SET_DECK: {
            return { ...state, futureCards: action.payload.deck };
        }
        case ActionType.DRAW_ADVENTURE_LINE: {
            const currentNonPlaceholders = state.adventureCards.filter(c => !c.isPlaceholder);
            const cardsToDraw = 4 - currentNonPlaceholders.length;
            if (state.futureCards.length > 0 && cardsToDraw > 0) {
                const newCards = state.futureCards.slice(0, cardsToDraw);
                return { ...state, futureCards: state.futureCards.slice(cardsToDraw), adventureCards: [...currentNonPlaceholders, ...newCards] };
            }
            return state;
        }
        case ActionType.DROP_CARD: {
            const { card, sourceZone, targetZone } = action.payload;

            // Validation
            switch (targetZone) {
                case 'wisdom':
                    if (card.suit.name !== 'Pentacles') {
                        message.error("Only Pentacles go here.");
                        return state;
                    }
                    if (state.wisdomCards.length >= 3) {
                        message.error("Wisdom area is full.");
                        return state;
                    }
                    break;
                case Zone.Strength:
                    if (card.suit.name !== 'Wands') {
                        message.error("Only Wands go here.");
                        return state;
                    }
                    if (state.strengthCard.card) {
                        message.error("Strength slot is full.");
                        return state;
                    }
                    break;
                case 'volition':
                    if (card.suit.name !== 'Swords') {
                        message.error("Only Swords go here.");
                        return state;
                    }
                    if (state.volitionCard) {
                        message.error("Volition slot is full.");
                        return state;
                    }
                    break;
                case Zone.Satchel:
                    if (card.type === CardType.Major) {
                        message.error("Challenges cannot go here.");
                        return state;
                    }
                    if (state.satchelCards.length >= 3) {
                        message.error("Satchel is full.");
                        return state;
                    }
                    break;
            }

            let adventureCards = [...state.adventureCards];
            let wisdomCards = [...state.wisdomCards];
            let strengthCard = state.strengthCard;
            let volitionCard = state.volitionCard;
            let satchelCards = [...state.satchelCards];
            let pastCards = [...state.pastCards];
            const futureCards = [...state.futureCards];

            // Remove card from source
            if (sourceZone === Zone.Adventure) {
                adventureCards = adventureCards.filter(c => c.id !== card.id);
            } else if (sourceZone === Zone.Wisdom) {
                wisdomCards = wisdomCards.filter(c => c.id !== card.id);
            } else if (sourceZone === Zone.Strength) {
                strengthCard = { card: null, value: 0 };
            } else if (sourceZone === 'volition') {
                volitionCard = null;
            } else if (sourceZone === Zone.Satchel) {
                satchelCards = satchelCards.filter(c => c.id !== card.id);
            } else if (sourceZone === 'past') {
                pastCards = pastCards.filter(c => c.id !== card.id);
            }

            // Add card to target
            if (targetZone === Zone.Adventure) {
                adventureCards = [...adventureCards, card];
            } else if (targetZone === Zone.Wisdom) {
                wisdomCards = [...wisdomCards, card];
            } else if (targetZone === Zone.Strength) {
                strengthCard = { card: card, value: getCardValue(card) };
            } else if (targetZone === Zone.Volition) {
                volitionCard = card;
            } else if (targetZone === Zone.Satchel) {
                satchelCards = [...satchelCards, card];
            } else if (targetZone === 'past') {
                pastCards = [...pastCards, card];
            }

            return {
                ...state,
                adventureCards,
                wisdomCards,
                strengthCard,
                volitionCard,
                satchelCards,
                pastCards,
                futureCards,
            };
        }
        case ActionType.PLAY_CARD: {
            const { card } = action.payload;

            const isCardInPlay = state.adventureCards.some(c => c.id === card.id) || state.satchelCards.some(c => c.id === card.id);
            if (!isCardInPlay) {
                return state; // Card is not in play, do nothing
            }

            if (card.suit.name === 'Cups') {
                const value = getCardValue(card);
                const newVitality = Math.min(25, state.vitality + value);
                message.success(`You restored ${value} vitality.`);
                return { ...state, vitality: newVitality, pastCards: [...state.pastCards, card], adventureCards: state.adventureCards.filter(c => c.id !== card.id), satchelCards: state.satchelCards.filter(c => c.id !== card.id) };
            } else if (card.rank === 1) {
                message.success('You reset the adventure line.');
                return { ...state, futureCards: shuffleDeck([...state.futureCards, ...state.adventureCards.filter(c => !c.isPlaceholder && c.id !== card.id)]), adventureCards: [], pastCards: [...state.pastCards, card], satchelCards: state.satchelCards.filter(c => c.id !== card.id) };
            }
            return state;
        }
        case ActionType.RESOLVE_CHALLENGE: {
            const { challenge, method } = action.payload;
            const cost = challenge.rank;

            if (method === Zone.Volition && state.volitionCard) {
                const volitionValue = getCardValue(state.volitionCard);
                if (volitionValue >= cost) {
                    message.success(`Challenge resolved with ${method}.`);
                    return {
                        ...state,
                        pastCards: [...state.pastCards, challenge, state.volitionCard],
                        volitionCard: null,
                        adventureCards: state.adventureCards.filter(c => c.id !== challenge.id),
                    };
                } else {
                    message.error(`Could not fully resolve challenge with ${method}.`);
                    const newChallenge = { ...challenge, rank: challenge.rank - volitionValue };
                    return {
                        ...state,
                        adventureCards: state.adventureCards.map(c => c.id === challenge.id ? newChallenge : c),
                        pastCards: [...state.pastCards, state.volitionCard],
                        volitionCard: null,
                    };
                }
            } else if (method === Zone.Strength && state.strengthCard.card) {
                const strengthValue = getCardValue(state.strengthCard.card);
                if (strengthValue >= cost) {
                    message.success(`Challenge resolved with ${method}.`);
                    return {
                        ...state,
                        strengthCard: { card: { ...state.strengthCard.card, rank: strengthValue - cost, isDoubled: false }, value: strengthValue - cost },
                        pastCards: [...state.pastCards, challenge],
                        adventureCards: state.adventureCards.filter(c => c.id !== challenge.id),
                    };
                } else {
                    message.success(`Challenge partially resolved with ${method}. You lost some vitality.`);
                    return {
                        ...state,
                        vitality: state.vitality - (cost - strengthValue),
                        pastCards: [...state.pastCards, state.strengthCard.card, challenge],
                        strengthCard: { card: null, value: 0 },
                        adventureCards: state.adventureCards.filter(c => c.id !== challenge.id),
                    };
                }
            } else if (method === 'vitality' && state.vitality >= cost) {
                message.success(`Challenge resolved with ${method}.`);
                return {
                    ...state,
                    vitality: state.vitality - cost,
                    pastCards: [...state.pastCards, challenge],
                    adventureCards: state.adventureCards.filter(c => c.id !== challenge.id),
                };
            } else {
                message.error(`Could not resolve challenge with ${method}.`);
                return state;
            }
        }
        case ActionType.DEPLOY_HELPER: {
            const { helper, target } = action.payload;
            const newState = { ...state };
            const spentWisdom = state.wisdomCards[0];
            newState.wisdomCards = state.wisdomCards.slice(1);
            newState.pastCards = [...state.pastCards, spentWisdom, helper];

            const doubleCard = (c: Card) => c.id === target.id ? { ...c, isDoubled: true } : c;

            if (target.zone?.includes(Zone.Strength)) newState.strengthCard = { ...state.strengthCard, card: doubleCard(state.strengthCard.card!), value: getCardValue(doubleCard(state.strengthCard.card!)) };
            if (target.zone?.includes(Zone.Volition)) newState.volitionCard = doubleCard(state.volitionCard!);
            if (target.zone?.includes(Zone.Adventure)) newState.adventureCards = state.adventureCards.map(doubleCard);
            if (target.zone?.includes(Zone.Satchel)) newState.satchelCards = state.satchelCards.map(doubleCard);

            newState.adventureCards = newState.adventureCards.filter(c => c.id !== helper.id);
            newState.satchelCards = newState.satchelCards.filter(c => c.id !== helper.id);

            message.success(`Used ${helper.title} to double the value of ${target.title}.`);
            return newState;
        }
        default:
            return state;
    }
};