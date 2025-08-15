import React from 'react';
import { Tooltip } from 'antd';
import CardPlaceholder from './CardPlaceholder';
import styles from '../game.module.css';

import { Card } from '../types';
import {QUESTION_MARK_EMOJI} from "@/app/game/data";

interface FutureCardsStackProps {
    cards: Card[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, card: Card, sourceZone: string) => void;
    onHelpClick: (topic: string) => void;
}

const FutureCardsStack: React.FC<FutureCardsStackProps> = ({ cards, onDragStart, onHelpClick }) => {
    const topCard = cards[0] || null;
    return (
        <div className={styles.future_cards_stack_wrapper}>
            <Tooltip title="What is the Future Deck?"><span className={styles.help_icon} onClick={() => onHelpClick('Future')}>{QUESTION_MARK_EMOJI}</span></Tooltip>
            <h3 style={{ marginBottom: '0.5rem' }}>Future ({cards.length})</h3>
            <div className={styles.future_cards_stack}>
                {topCard && <div draggable={true} onDragStart={(e) => onDragStart(e, topCard, 'future')} style={{ zIndex: 1, transform: `translate(0px, 0px)`, cursor: 'grab' }}><CardPlaceholder isBack={true} className={styles.top_card} card={null} /></div>}
            </div>
        </div>
    );
};

export default FutureCardsStack;