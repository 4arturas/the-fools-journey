
'use client';

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Modal, Tooltip, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { HELP_DESCRIPTIONS } from './data';
import { Card, CardType, GameZone } from './types';
import { getCardValue } from './rules';
import CardPlaceholder from './components/CardPlaceholder';
import FutureCardsStack from './components/FutureCardsStack';
import DroppableArea from './components/DroppableArea';
import TokenPlaceholder from './components/TokenPlaceholder';
import GameStatusModal from './components/GameStatusModal';
import ChallengeModal from './components/ChallengeModal';
import DeployHelperModal from './components/DeployHelperModal';
import styles from './game.module.css';
import { useGameReducer } from './hooks';
import { DECK_DATA } from './rules';
import { shuffleDeck } from './utils';

const GamePage: React.FC = () => {
    const [gameState, dispatch] = useGameReducer();
    const [draggedCard, setDraggedCard] = useState<{ card: Card, sourceZone: GameZone } | null>(null);
    const [helpModal, setHelpModal] = useState({ open: false, title: '', description: '' });
    const [challengeModal, setChallengeModal] = useState({ open: false, card: null as Card | null });
    const [helperModal, setHelperModal] = useState({ open: false, card: null as Card | null });
    const [gameStatusModal, setGameStatusModal] = useState({ open: false, title: '', content: '' });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        dispatch({ type: 'SET_DECK', payload: { deck: shuffleDeck(DECK_DATA.filter(c => c.rank !== 0)) } });
        setIsInitialized(true);
    }, [dispatch]);

    const heroCard: Card = {
        id: 'hero-card',
        title: 'THE FOOL',
        type: CardType.Major,
        rank: 0, suit: { id: 'major', name: 'Major' }, cardId: 0, isDoubled: false, isPlaceholder: false
    };

    useEffect(() => {
        if (!isInitialized) return;
        if (gameState.adventureCards.filter(c => !c.isPlaceholder).length === 0 && gameState.futureCards.length > 0) {
            dispatch({ type: 'DRAW_ADVENTURE_LINE' });
        }
    }, [gameState.futureCards.length, gameState.adventureCards, dispatch, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        if (gameState.adventureCards.filter(c => !c.isPlaceholder).length <= 1 && gameState.futureCards.length > 0) {
            dispatch({ type: 'DRAW_ADVENTURE_LINE' });
        }
        if (gameState.futureCards.length === 0 && gameState.adventureCards.filter(c => !c.isPlaceholder).length === 0) {
            setGameStatusModal({ open: true, title: "Congratulations!", content: "You have successfully completed The Fool's Journey!" });
        }
        if (gameState.vitality <= 0) {
            setGameStatusModal({ open: true, title: "Game Over", content: "The Fool's vitality has reached zero. Your journey ends here." });
        }
    }, [gameState.adventureCards, gameState.futureCards, gameState.vitality, dispatch, isInitialized]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card, sourceZone: GameZone) => {
        if (!card || card.isPlaceholder) return;
        setDraggedCard({ card, sourceZone });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetZone: GameZone) => {
        e.preventDefault();
        if (!draggedCard) return;

        const { card, sourceZone } = draggedCard;
        dispatch({ type: 'DROP_CARD', payload: { card, sourceZone, targetZone } });
        setDraggedCard(null);
    };

    const handleCardClick = (card: Card) => {
        if (card.type === CardType.Major) {
            setChallengeModal({ open: true, card: card });
        } else if (card.rank > 10 && card.rank <= 14) {
            if (gameState.wisdomCards.length > 0) {
                setHelperModal({ open: true, card: card });
            } else {
                message.error("You need a Wisdom card to deploy a helper.");
            }
        } else {
            dispatch({ type: 'PLAY_CARD', payload: { card } });
        }
    };

    const handleResolveChallenge = (challenge: Card, method: string) => {
        dispatch({ type: 'RESOLVE_CHALLENGE', payload: { challenge, method } });
        setChallengeModal({ open: false, card: null });
    };

    const handleDeployHelper = (helper: Card, target: Card) => {
        dispatch({ type: 'DEPLOY_HELPER', payload: { helper, target } });
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
                    <DroppableArea title="Wisdom" onDrop={(e) => handleDrop(e, 'wisdom')} onDragOver={handleDragOver} isEmpty={gameState.wisdomCards.length === 0} onHelpClick={() => setHelpModal({ open: true, title: 'Wisdom', description: HELP_DESCRIPTIONS.wisdom })} zoneId="wisdom" className={styles.area_outline_wisdom}>
                        <Tooltip title="What is the Wisdom area?"><FontAwesomeIcon icon={faQuestionCircle} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Wisdom', description: HELP_DESCRIPTIONS.wisdom })} /></Tooltip>
                        {gameState.wisdomCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, 'wisdom')} zone="wisdom" />)}
                    </DroppableArea>
                    <DroppableArea title={`Strength (${getCardValue(gameState.strengthCard.card)})`} onDrop={(e) => handleDrop(e, 'strength')} onDragOver={handleDragOver} isEmpty={!gameState.strengthCard.card} onHelpClick={() => setHelpModal({ open: true, title: 'Strength', description: HELP_DESCRIPTIONS.strength })} zoneId="strength" className={styles.area_outline_strength}>
                        <Tooltip title="What is the Strength area?"><FontAwesomeIcon icon={faQuestionCircle} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Strength', description: HELP_DESCRIPTIONS.strength })} /></Tooltip>
                        {gameState.strengthCard.card && <CardPlaceholder id={gameState.strengthCard.card.id} card={gameState.strengthCard.card} onDragStart={(e) => handleDragStart(e, gameState.strengthCard.card!, 'strength')} onClick={() => handleCardClick(gameState.strengthCard.card!)} zone="strength" />}
                    </DroppableArea>
                    <div className={`${styles.droppable_area_container} ${styles.hero_card}`}>
                        <Tooltip title="What is the Hero card?"><FontAwesomeIcon icon={faCircleQuestion} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Hero', description: HELP_DESCRIPTIONS.hero })} /></Tooltip>
                        <h3 className={styles.subtitle}>Hero</h3>
                        <div className={styles.droppable_area} style={{minHeight: 'auto'}}><CardPlaceholder card={heroCard} /></div>
                    </div>
                    <DroppableArea title={`Volition (${getCardValue(gameState.volitionCard)})`} onDrop={(e) => handleDrop(e, 'volition')} onDragOver={handleDragOver} isEmpty={!gameState.volitionCard} onHelpClick={() => setHelpModal({ open: true, title: 'Volition', description: HELP_DESCRIPTIONS.volition })} zoneId="volition" className={styles.area_outline_volition}>
                        <Tooltip title="What is the Volition area?"><FontAwesomeIcon icon={faQuestionCircle} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Volition', description: HELP_DESCRIPTIONS.volition })} /></Tooltip>
                        {gameState.volitionCard && <CardPlaceholder id={gameState.volitionCard.id} card={gameState.volitionCard} onDragStart={(e) => handleDragStart(e, gameState.volitionCard!, 'volition')} onClick={() => handleCardClick(gameState.volitionCard!)} zone="volition" />}
                    </DroppableArea>
                    <DroppableArea title="Satchel" onDrop={(e) => handleDrop(e, 'satchel')} onDragOver={handleDragOver} isEmpty={gameState.satchelCards.length === 0} onHelpClick={() => setHelpModal({ open: true, title: 'Satchel', description: HELP_DESCRIPTIONS.satchel })} zoneId="satchel">
                        <Tooltip title="What is the Satchel area?"><FontAwesomeIcon icon={faQuestionCircle} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Satchel', description: HELP_DESCRIPTIONS.satchel })} /></Tooltip>
                        {gameState.satchelCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, 'satchel')} onClick={() => handleCardClick(card)} />)}
                    </DroppableArea>
                </div>

                <div className={`${styles.flex_row_container} ${styles.bottom}`}>
                    <div className={`${styles.droppable_area_container} ${styles.vitality_area_full_width}`}>
                        <Tooltip title="What are Vitality Tokens?"><FontAwesomeIcon icon={faCircleQuestion} className={styles.help_icon} onClick={() => setHelpModal({ open: true, title: 'Available Tokens', description: HELP_DESCRIPTIONS.tokens })} /></Tooltip>
                        <h3 className={styles.vitality_display}>Vitality: {gameState.vitality}</h3>
                        <div className={styles.droppable_area} style={{minHeight: '4rem'}}>{renderAvailableTokens()}</div>
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
