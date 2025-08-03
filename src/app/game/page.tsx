
'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Tooltip, Button, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { DECK_DATA, HELP_DESCRIPTIONS, shuffleDeck, getCardValue } from './data';
import CardPlaceholder from './components/CardPlaceholder';
import FutureCardsStack from './components/FutureCardsStack';
import DroppableArea from './components/DroppableArea';
import TokenPlaceholder from './components/TokenPlaceholder';
import GameStatusModal from './components/GameStatusModal';
import ChallengeModal from './components/ChallengeModal';
import DeployHelperModal from './components/DeployHelperModal';
import styles from './game.module.css';

interface Card {
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

const GamePage: React.FC = () => {
    const [gameState, setGameState] = useState({
        adventureCards: [] as Card[],
        pastCards: [] as Card[],
        futureCards: shuffleDeck(DECK_DATA.filter(c => c.rank !== 0)),
        wisdomCards: [] as Card[],
        strengthCard: { card: null as Card | null, value: 0 },
        volitionCard: null as Card | null,
        satchelCards: [] as Card[],
        vitality: 25,
    });
    const [draggedCard, setDraggedCard] = useState<{ card: Card, sourceZone: string } | null>(null);
    const [helpModal, setHelpModal] = useState({ open: false, title: '', description: '' });
    const [challengeModal, setChallengeModal] = useState({ open: false, card: null as Card | null });
    const [helperModal, setHelperModal] = useState({ open: false, card: null as Card | null });
    const [gameStatusModal, setGameStatusModal] = useState({ open: false, title: '', content: '' });

    const heroCard: Card = { id: 'hero-card', title: 'THE FOOL', type: 'major', rank: 0, suit: 'Major', cardId: 0, isDoubled: false, isPlaceholder: false };

    const drawAdventureLine = () => {
        setGameState(prev => {
            const currentNonPlaceholders = prev.adventureCards.filter(c => !c.isPlaceholder);
            const cardsToDraw = 4 - currentNonPlaceholders.length;
            if (prev.futureCards.length > 0 && cardsToDraw > 0) {
                const newCards = prev.futureCards.slice(0, cardsToDraw);
                return { ...prev, futureCards: prev.futureCards.slice(cardsToDraw), adventureCards: [...currentNonPlaceholders, ...newCards] };
            }
            return prev;
        });
    };

    useEffect(() => {
        if (gameState.adventureCards.filter(c => !c.isPlaceholder).length === 0 && gameState.futureCards.length > 0) {
            drawAdventureLine();
        }
    }, [gameState.futureCards.length, gameState.adventureCards.length, gameState.adventureCards]);

    useEffect(() => {
        if (gameState.adventureCards.filter(c => !c.isPlaceholder).length <= 1 && gameState.futureCards.length > 0) {
            drawAdventureLine();
        }
        if (gameState.futureCards.length === 0 && gameState.adventureCards.filter(c => !c.isPlaceholder).length === 0) {
            setGameStatusModal({ open: true, title: "Congratulations!", content: "You have successfully completed The Fool's Journey!" });
        }
        if (gameState.vitality <= 0) {
            setGameState(p => ({ ...p, vitality: 0 }));
            setGameStatusModal({ open: true, title: "Game Over", content: "The Fool's vitality has reached zero. Your journey ends here." });
        }
    }, [gameState.adventureCards, gameState.futureCards, gameState.vitality]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card, sourceZone: string) => {
        if (!card || card.isPlaceholder) return;
        setDraggedCard({ card, sourceZone });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetZone: string) => {
        e.preventDefault();
        if (!draggedCard) return;

        const { card, sourceZone } = draggedCard;
        setDraggedCard(null);

        setGameState(prev => {
            switch (targetZone) {
                case 'past':
                    break;
                case 'wisdom':
                    if (card.suit !== 'Pentacles') {
                        message.error("Only Pentacles go here.");
                        return prev;
                    }
                    if (prev.wisdomCards.length >= 3) {
                        message.error("Wisdom area is full.");
                        return prev;
                    }
                    break;
                case 'strength':
                    if (card.suit !== 'Wands') {
                        message.error("Only Wands go here.");
                        return prev;
                    }
                    if (prev.strengthCard.card) {
                        message.error("Strength slot is full.");
                        return prev;
                    }
                    break;
                case 'volition':
                    if (card.suit !== 'Swords') {
                        message.error("Only Swords go here.");
                        return prev;
                    }
                    if (prev.volitionCard) {
                        message.error("Volition slot is full.");
                        return prev;
                    }
                    break;
                case 'satchel':
                    if (card.type === 'major') {
                        message.error("Challenges cannot go here.");
                        return prev;
                    }
                    if (prev.satchelCards.length >= 3) {
                        message.error("Satchel is full.");
                        return prev;
                    }
                    break;
                default:
                    message.error("Invalid drop zone.");
                    return prev;
            }

            const nextState = {
                ...prev,
                adventureCards: [...prev.adventureCards],
                pastCards: [...prev.pastCards],
                wisdomCards: [...prev.wisdomCards],
                satchelCards: [...prev.satchelCards],
                strengthCard: prev.strengthCard,
                volitionCard: prev.volitionCard,
            };

            if (sourceZone === 'adventure') nextState.adventureCards = nextState.adventureCards.filter(c => c.id !== card.id);
            else if (sourceZone === 'wisdom') nextState.wisdomCards = nextState.wisdomCards.filter(c => c.id !== card.id);
            else if (sourceZone === 'strength') nextState.strengthCard = { card: null, value: 0 };
            else if (sourceZone === 'volition') nextState.volitionCard = null;
            else if (sourceZone === 'satchel') nextState.satchelCards = nextState.satchelCards.filter(c => c.id !== card.id);
            else if (sourceZone === 'past') nextState.pastCards = nextState.pastCards.filter(c => c.id !== card.id);

            if (targetZone === 'wisdom') nextState.wisdomCards.push(card);
            else if (targetZone === 'strength') nextState.strengthCard = { card: card, value: getCardValue(card) };
            else if (targetZone === 'volition') nextState.volitionCard = card;
            else if (targetZone === 'satchel') nextState.satchelCards.push(card);
            else if (targetZone === 'past') nextState.pastCards.push(card);

            return nextState;
        });
        setDraggedCard(null);
    };

    const handleCardClick = (card: Card) => {
        if (card.type === 'major') {
            setChallengeModal({ open: true, card: card });
        } else if (card.rank > 10 && card.rank <= 14) {
            if (gameState.wisdomCards.length > 0) {
                setHelperModal({ open: true, card: card });
            } else {
                message.error("You need a Wisdom card to deploy a helper.");
            }
        } else if (card.suit === 'Cups') {
            const value = getCardValue(card);
            setGameState(p => ({ ...p, vitality: Math.min(25, p.vitality + value), pastCards: [...p.pastCards, card], adventureCards: p.adventureCards.filter(c => c.id !== card.id), satchelCards: p.satchelCards.filter(c => c.id !== card.id) }));
            message.success(`You restored ${value} vitality.`);
        } else if (card.rank === 1) {
            setGameState(p => ({ ...p, futureCards: shuffleDeck([...p.futureCards, ...p.adventureCards.filter(c => !c.isPlaceholder && c.id !== card.id)]), adventureCards: [], pastCards: [...p.pastCards, card], satchelCards: p.satchelCards.filter(c => c.id !== card.id) }));
            message.success('You reset the adventure line.');
        }
    };

    const handleResolveChallenge = (challenge: Card, method: string) => {
        const cost = challenge.rank;
        setGameState(p => {
            const newState = { ...p };
            let success = false;
            if (method === 'volition' && p.volitionCard && getCardValue(p.volitionCard) >= cost) {
                newState.pastCards = [...p.pastCards, challenge, p.volitionCard];
                newState.volitionCard = null;
                success = true;
            } else if (method === 'strength' && p.strengthCard.card) {
                const strengthValue = getCardValue(p.strengthCard.card);
                if (strengthValue >= cost) {
                    newState.strengthCard = { card: { ...p.strengthCard.card, rank: strengthValue - cost, isDoubled: false }, value: strengthValue - cost };
                } else {
                    newState.vitality -= (cost - strengthValue);
                    newState.strengthCard = { card: null, value: 0 };
                }
                newState.pastCards = [...p.pastCards, challenge, p.strengthCard.card];
                success = true;
            } else if (method === 'vitality' && p.vitality >= cost) {
                newState.vitality -= cost;
                newState.pastCards = [...p.pastCards, challenge];
                success = true;
            }

            if (success) {
                newState.adventureCards = p.adventureCards.filter(c => c.id !== challenge.id);
                message.success(`Challenge resolved with ${method}.`);
            } else {
                message.error(`Could not resolve challenge with ${method}.`);
            }
            return newState;
        });
        setChallengeModal({ open: false, card: null });
    };

    const handleDeployHelper = (helper: Card, target: Card) => {
        setGameState(p => {
            const newState = { ...p };
            const spentWisdom = p.wisdomCards[0];
            newState.wisdomCards = p.wisdomCards.slice(1);
            newState.pastCards = [...p.pastCards, spentWisdom, helper];

            const doubleCard = (c: Card) => c.id === target.id ? { ...c, isDoubled: true } : c;

            if (target.zone === 'strength') newState.strengthCard = { ...p.strengthCard, card: doubleCard(p.strengthCard.card!), value: getCardValue(doubleCard(p.strengthCard.card!)) };
            if (target.zone === 'volition') newState.volitionCard = doubleCard(p.volitionCard!);
            if (target.zone === 'adventure') newState.adventureCards = p.adventureCards.map(doubleCard);
            if (target.zone === 'satchel') newState.satchelCards = p.satchelCards.map(doubleCard);

            newState.adventureCards = newState.adventureCards.filter(c => c.id !== helper.id);
            newState.satchelCards = newState.satchelCards.filter(c => c.id !== helper.id);

            message.success(`Used ${helper.title} to double the value of ${target.title}.`);
            return newState;
        });
        setHelperModal({ open: false, card: null });
    };

    const renderAvailableTokens = () => Array.from({ length: gameState.vitality }).map((_, i) => <TokenPlaceholder key={i} />);

    return (
        <div className={`${styles.bg_gray_50} ${styles.min_h_screen} ${styles.p_4} ${styles.md_p_8} ${styles.font_sans}`}>
            <div className={`${styles.container} ${styles.mx_auto} ${styles.max_w_7xl}`}>
                <h1 className={styles.title}>The Fool&apos;s Journey</h1>

                <div className={`${styles.flex_row_container} ${styles.top}`}>
                    <div className={`${styles.droppable_area_container} ${styles.past}`}>
                        <Tooltip title="What is the Past area?"><FontAwesomeIcon icon={faCircleQuestion} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Past', description: HELP_DESCRIPTIONS.past })} /></Tooltip>
                        <h3 className={styles.subtitle}>Past ({gameState.pastCards.length})</h3>
                        <div className={`${styles.droppable_area} ${styles.past_cards}`} onDrop={(e) => handleDrop(e, 'past')} onDragOver={handleDragOver}>
                            {gameState.pastCards.length === 0 ? <span className={styles.card_text}>Place cards here</span> : gameState.pastCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, 'past')} />)}
                        </div>
                    </div>
                    <div className={`${styles.droppable_area_container} ${styles.adventure}`}>
                        <Tooltip title="What is the Adventure area?"><FontAwesomeIcon icon={faCircleQuestion} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Adventure', description: HELP_DESCRIPTIONS.adventure })} /></Tooltip>
                        <h3 className={styles.subtitle}>Adventure Line</h3>
                        <div onDrop={(e) => handleDrop(e, 'adventure')} onDragOver={handleDragOver} className={styles.adventure_area}>
                            {gameState.adventureCards.map((card) => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, 'adventure')} onClick={() => handleCardClick(card)} />)}
                        </div>
                    </div>
                    <div className={`${styles.droppable_area_container} ${styles.future}`}>
                        <FutureCardsStack cards={gameState.futureCards} onDragStart={(e, card) => handleDragStart(e, card, 'future')} onHelpClick={() => setHelpModal({ open: true, title: 'Future Deck', description: HELP_DESCRIPTIONS.future })} />
                    </div>
                </div>

                <div className={`${styles.flex_row_container} ${styles.middle}`}>
                    <DroppableArea title="Wisdom" onDrop={(e) => handleDrop(e, 'wisdom')} onDragOver={handleDragOver} isEmpty={gameState.wisdomCards.length === 0} onHelpClick={() => setHelpModal({ open: true, title: 'Wisdom', description: HELP_DESCRIPTIONS.wisdom })} zoneId="wisdom">
                        {gameState.wisdomCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, 'wisdom')} />)}
                    </DroppableArea>
                    <DroppableArea title={`Strength (${getCardValue(gameState.strengthCard.card)})`} onDrop={(e) => handleDrop(e, 'strength')} onDragOver={handleDragOver} isEmpty={!gameState.strengthCard.card} onHelpClick={() => setHelpModal({ open: true, title: 'Strength', description: HELP_DESCRIPTIONS.strength })} zoneId="strength">
                        {gameState.strengthCard.card && <CardPlaceholder id={gameState.strengthCard.card.id} card={gameState.strengthCard.card} onDragStart={(e) => handleDragStart(e, gameState.strengthCard.card, 'strength')} onClick={() => handleCardClick(gameState.strengthCard.card!)} />}
                    </DroppableArea>
                    <div className={`${styles.droppable_area_container} ${styles.hero_card}`}>
                        <Tooltip title="What is the Hero card?"><FontAwesomeIcon icon={faCircleQuestion} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Hero', description: HELP_DESCRIPTIONS.hero })} /></Tooltip>
                        <h3 className={styles.subtitle}>Hero</h3>
                        <div className={styles.droppable_area} style={{minHeight: 'auto'}}><CardPlaceholder card={heroCard} /></div>
                    </div>
                    <DroppableArea title={`Volition (${getCardValue(gameState.volitionCard)})`} onDrop={(e) => handleDrop(e, 'volition')} onDragOver={handleDragOver} isEmpty={!gameState.volitionCard} onHelpClick={() => setHelpModal({ open: true, title: 'Volition', description: HELP_DESCRIPTIONS.volition })} zoneId="volition">
                        {gameState.volitionCard && <CardPlaceholder id={gameState.volitionCard.id} card={gameState.volitionCard} onDragStart={(e) => handleDragStart(e, gameState.volitionCard, 'volition')} onClick={() => handleCardClick(gameState.volitionCard!)} />}
                    </DroppableArea>
                    <DroppableArea title="Satchel" onDrop={(e) => handleDrop(e, 'satchel')} onDragOver={handleDragOver} isEmpty={gameState.satchelCards.length === 0} onHelpClick={() => setHelpModal({ open: true, title: 'Satchel', description: HELP_DESCRIPTIONS.satchel })} zoneId="satchel">
                        {gameState.satchelCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, 'satchel')} onClick={() => handleCardClick(card)} />)}
                    </DroppableArea>
                </div>

                <div className={`${styles.flex_row_container} ${styles.bottom}`}>
                    <div className={styles.droppable_area_container}>
                        <Tooltip title="What are Vitality Tokens?"><FontAwesomeIcon icon={faCircleQuestion} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Available Tokens', description: HELP_DESCRIPTIONS.tokens })} /></Tooltip>
                        <h3 className={styles.vitality_display}>Vitality: {gameState.vitality}</h3>
                        <div className={styles.droppable_area} style={{minHeight: '4rem'}}>{renderAvailableTokens()}</div>
                    </div>
                    <div className={styles.droppable_area_container}>
                        <h3 className={styles.subtitle}>Used Tokens</h3>
                        <div className={styles.used_tokens_area}>{gameState.vitality < 25 ? `Used Vitality: ${25 - gameState.vitality}` : `Used tokens will appear here`}</div>
                    </div>
                    <div className={`${styles.droppable_area_container}`} style={{maxWidth: '200px'}}>
                        <Button type="primary" danger block onClick={() => window.location.reload()} className={styles.restart_button}>Restart Game</Button>
                    </div>
                </div>
            </div>

            <Modal title={helpModal.title} open={helpModal.open} onOk={() => setHelpModal({ ...helpModal, open: false })} onCancel={() => setHelpModal({ ...helpModal, open: false })} footer={null}><p>{helpModal.description}</p></Modal>
            <ChallengeModal open={challengeModal.open} onCancel={() => setChallengeModal({ open: false, card: null })} challengeCard={challengeModal.card} onResolve={handleResolveChallenge} vitality={gameState.vitality} strengthCard={gameState.strengthCard} volitionCard={gameState.volitionCard} />
            <DeployHelperModal open={helperModal.open} onCancel={() => setHelperModal({ open: false, card: null })} helperCard={helperModal.card} onDeploy={handleDeployHelper} wisdomCards={gameState.wisdomCards} strengthCard={gameState.strengthCard} volitionCard={gameState.volitionCard} adventureCards={gameState.adventureCards} satchelCards={gameState.satchelCards} />
            <GameStatusModal title={gameStatusModal.title} content={gameStatusModal.content} open={gameStatusModal.open} onOk={() => window.location.reload()} />
        </div>
    );
};

export default GamePage;
