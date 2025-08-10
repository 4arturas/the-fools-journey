import React from 'react';
import { Tooltip } from 'antd';
import CardPlaceholder from './CardPlaceholder';
import styles from '../game.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import { Card } from '../types';

interface FutureCardsStackProps {
    cards: Card[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, card: Card, sourceZone: string) => void;
    onHelpClick: () => void;
}

const FutureCardsStack: React.FC<FutureCardsStackProps> = ({ cards, onDragStart, onHelpClick }) => {
    const topCard = cards[0] || null;
    return (
        <div className={styles.future_cards_stack_wrapper}>
            <Tooltip title="What is the Future Deck?"><FontAwesomeIcon icon={faQuestionCircle} className={styles.help_icon} onClick={onHelpClick}></FontAwesomeIcon></Tooltip>
            <h3 style={{ marginBottom: '0.5rem' }}>Future ({cards.length})</h3>
            <div className={styles.future_cards_stack}>
                {topCard && <div draggable={true} onDragStart={(e) => onDragStart(e, topCard, 'future')} style={{ zIndex: 1, transform: `translate(0px, 0px)`, cursor: 'grab' }}><CardPlaceholder isBack={true} className={styles.top_card} card={topCard} /></div>}
            </div>
        </div>
    );
};

export default FutureCardsStack;