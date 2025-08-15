'use client';

import '@ant-design/v5-patch-for-react-19';
import {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {message, Tooltip} from 'antd';

import {ActionType, Card, CardType, GameZone, Zone} from './types';
import {DECK_DATA, getCardValue} from './rules';
import CardPlaceholder from './components/CardPlaceholder';
import FutureCardsStack from './components/FutureCardsStack';
import DroppableArea from './components/DroppableArea';
import TokenPlaceholder from './components/TokenPlaceholder';
import GameStatusModal from './components/GameStatusModal';
import ChallengeModal from './components/ChallengeModal';
import DeployHelperModal from './components/DeployHelperModal';
import styles from './game.module.css';
import {useGameReducer} from './hooks';
import {shuffleDeck} from './utils';
import {QUESTION_MARK_EMOJI} from "@/app/game/data";

const DynamicHelp = dynamic(() => import('./components/Help'), { ssr: false });

const GamePage: React.FC = () => {
    const [gameState, dispatch] = useGameReducer();
    const [draggedCard, setDraggedCard] = useState<{ card: Card, sourceZone: GameZone } | null>(null);
    
    const [challengeModal, setChallengeModal] = useState({ open: false, card: null as Card | null });
    const [helperModal, setHelperModal] = useState({ open: false, card: null as Card | null });
    const [gameStatusModal, setGameStatusModal] = useState({ open: false, title: '', content: '' });
    const [isInitialized, setIsInitialized] = useState(false);
    const [helpModalVisible, setHelpModalVisible] = useState(false);
    const [selectedHelpTopic, setSelectedHelpTopic] = useState<string | null>(null);

    const handleHelpClick = (topic: string) => {
        setSelectedHelpTopic(topic);
        setHelpModalVisible(true);
    };

    useEffect(() => {
        dispatch({ type: ActionType.SET_DECK, payload: { deck: shuffleDeck(DECK_DATA.filter(c => c.rank !== 0)) } });
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
            dispatch({ type: ActionType.DRAW_ADVENTURE_LINE });
        }
    }, [gameState.futureCards.length, gameState.adventureCards, dispatch, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        if (gameState.adventureCards.filter(c => !c.isPlaceholder).length <= 1 && gameState.futureCards.length > 0) {
            dispatch({ type: ActionType.DRAW_ADVENTURE_LINE });
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
        dispatch({ type: ActionType.DROP_CARD, payload: { card, sourceZone, targetZone } });
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
            dispatch({ type: ActionType.PLAY_CARD, payload: { card } });
        }
    };

    const handleResolveChallenge = (challenge: Card, method: string) => {
        dispatch({ type: ActionType.RESOLVE_CHALLENGE, payload: { challenge, method } });
        setChallengeModal({ open: false, card: null });
    };

    const handleDeployHelper = (helper: Card, target: Card) => {
        dispatch({ type: ActionType.DEPLOY_HELPER, payload: { helper, target } });
        setHelperModal({ open: false, card: null });
    };

    const renderAvailableTokens = () => Array.from({ length: gameState.vitality }).map((_, i) => <TokenPlaceholder key={i} />);

    return (
        <div className={`${styles.bg_gray_50} ${styles.min_h_screen} ${styles.p_4} ${styles.md_p_8} ${styles.font_sans}`}>
            <div className={`${styles.container} ${styles.mx_auto} ${styles.max_w_7xl}`}>
                <h1 className={styles.title}>The Fool&apos;s Journey</h1>

                <div className={`${styles.flex_row_container} ${styles.top}`}>
                    <div className={`${styles.droppable_area_container} ${styles.past}`}>
                        <Tooltip title="What is the Past area?"><span className={styles.help_icon} onClick={() => handleHelpClick('Past')}>{QUESTION_MARK_EMOJI}</span></Tooltip>
                        <h3 className={styles.subtitle}>Past ({gameState.pastCards.length})</h3>
                        <div className={`${styles.droppable_area} ${styles.past_cards}`} onDrop={(e) => handleDrop(e, Zone.Past)} onDragOver={handleDragOver}>
                            {gameState.pastCards.length === 0 ? <span className={styles.card_text}>Place cards here</span> : gameState.pastCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, Zone.Past)} />)}
                        </div>
                    </div>
                    <div className={`${styles.droppable_area_container} ${styles.adventure}`}>
                        <Tooltip title="What is the Adventure area?"><span className={styles.help_icon} onClick={() => handleHelpClick('Adventure Line')}>{QUESTION_MARK_EMOJI}</span></Tooltip>
                        <h3 className={styles.subtitle}>Adventure Line</h3>
                        <div onDrop={(e) => handleDrop(e, Zone.Adventure)} onDragOver={handleDragOver} className={styles.adventure_area}>
                            {gameState.adventureCards.map((card) => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, Zone.Adventure)} onClick={() => handleCardClick(card)} />)}
                        </div>
                    </div>
                    <div className={`${styles.droppable_area_container} ${styles.future}`}>
                        <FutureCardsStack cards={gameState.futureCards} onDragStart={(e, card) => handleDragStart(e, card, Zone.Future)} onHelpClick={handleHelpClick} />
                    </div>
                </div>

                <div className={`${styles.flex_row_container} ${styles.middle}`}>
                    <DroppableArea title="Wisdom" onDrop={(e) => handleDrop(e, Zone.Wisdom)} onDragOver={handleDragOver} isEmpty={gameState.wisdomCards.length === 0} zoneId="wisdom" className={styles.area_outline_wisdom} onHelpClick={handleHelpClick}>
                        {gameState.wisdomCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, Zone.Wisdom)} zone="wisdom" />)}
                    </DroppableArea>
                    <DroppableArea title={`Strength (${getCardValue(gameState.strengthCard.card)})`} onDrop={(e) => handleDrop(e, Zone.Strength)} onDragOver={handleDragOver} isEmpty={!gameState.strengthCard.card} zoneId="strength" className={styles.area_outline_strength} onHelpClick={() => handleHelpClick(Zone.Strength)}>
                        {gameState.strengthCard.card && <CardPlaceholder id={gameState.strengthCard.card.id} card={gameState.strengthCard.card} onDragStart={(e) => handleDragStart(e, gameState.strengthCard.card!, Zone.Strength)} onClick={() => handleCardClick(gameState.strengthCard.card!)} zone="strength" />}
                    </DroppableArea>
                    <div className={`${styles.droppable_area_container} ${styles.hero_card}`}>
                        <Tooltip title="What is the Hero card?"><span className={styles.help_icon} onClick={() => handleHelpClick('Hero')}>{QUESTION_MARK_EMOJI}</span></Tooltip>
                        <h3 className={styles.subtitle}>Hero</h3>
                        <div className={styles.droppable_area} style={{minHeight: 'auto'}}><CardPlaceholder card={heroCard} /></div>
                    </div>
                    <DroppableArea title={`Volition (${getCardValue(gameState.volitionCard)})`} onDrop={(e) => handleDrop(e, Zone.Volition)} onDragOver={handleDragOver} isEmpty={!gameState.volitionCard} zoneId="volition" className={styles.area_outline_volition} onHelpClick={() => handleHelpClick(Zone.Volition)}>
                        {gameState.volitionCard && <CardPlaceholder id={gameState.volitionCard.id} card={gameState.volitionCard} onDragStart={(e) => handleDragStart(e, gameState.volitionCard!, Zone.Volition)} onClick={() => handleCardClick(gameState.volitionCard!)} zone="volition" />}
                    </DroppableArea>
                    <DroppableArea title="Satchel" onDrop={(e) => handleDrop(e, Zone.Satchel)} onDragOver={handleDragOver} isEmpty={gameState.satchelCards.length === 0} zoneId="satchel" className={styles.area_outline_satchel} onHelpClick={handleHelpClick}>
                        {gameState.satchelCards.map(card => <CardPlaceholder key={card.id} id={card.id} card={card} onDragStart={(e) => handleDragStart(e, card, Zone.Satchel)} onClick={() => handleCardClick(card)} zone="satchel" />)}
                    </DroppableArea>
                </div>

                <div className={`${styles.flex_row_container} ${styles.bottom}`}>
                    <div className={`${styles.droppable_area_container} ${styles.vitality_area_full_width}`}>
                        <Tooltip title="What are Vitality Tokens?"><span className={styles.help_icon} onClick={() => handleHelpClick('Vitality')}>{QUESTION_MARK_EMOJI}</span></Tooltip>
                        <h3 className={styles.vitality_display}>Vitality: {gameState.vitality}</h3>
                        <div className={styles.droppable_area} style={{minHeight: '4rem'}}>{renderAvailableTokens()}</div>
                    </div>
                </div>
            </div>

            {helpModalVisible && <DynamicHelp link={selectedHelpTopic} setHelpModalVisible={setHelpModalVisible} />}
            <ChallengeModal open={challengeModal.open} onCancel={() => setChallengeModal({ open: false, card: null })} challengeCard={challengeModal.card} onResolve={handleResolveChallenge} vitality={gameState.vitality} strengthCard={gameState.strengthCard} volitionCard={gameState.volitionCard} />
            <DeployHelperModal open={helperModal.open} onCancel={() => setHelperModal({ open: false, card: null })} helperCard={helperModal.card} onDeploy={handleDeployHelper} wisdomCards={gameState.wisdomCards} strengthCard={gameState.strengthCard} volitionCard={gameState.volitionCard} adventureCards={gameState.adventureCards} satchelCards={gameState.satchelCards} />
            <GameStatusModal title={gameStatusModal.title} content={gameStatusModal.content} open={gameStatusModal.open} onOk={() => window.location.reload()} />
        </div>
    );
};

export default GamePage;
