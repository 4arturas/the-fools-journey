
import Image from 'next/image';
import React from 'react';
import { Tooltip } from 'antd';
import { FALLBACK_CARD_BACK_URL, SUIT_ICONS } from '../data';
import { getCardValue } from '../rules';
import styles from '../game.module.css';

import { Card, CardType } from '../types';

interface CardPlaceholderProps {
    isBack?: boolean;
    card?: Card | null;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, card: Card) => void;
    id?: string;
    className?: string;
    onClick?: (card: Card) => void;
    zone?: string;
}

const CardPlaceholder: React.FC<CardPlaceholderProps> = ({ isBack = false, card = null, onDragStart, id, className = '', onClick }) => {
    const isPlaceholder = card === null || card.isPlaceholder;
    const cardClass = isPlaceholder ? `${styles.card_placeholder} ${styles.empty}` : `${styles.card_placeholder} ${styles.card_face}`;
    let outlineClass = '';

    if (card && !isPlaceholder) {
        if (card.type === CardType.Major) {
            outlineClass = styles.card_outline_major;
        } else if (card.suit.name === 'Swords') {
            outlineClass = styles.card_outline_volition;
        } else if (card.suit.name === 'Pentacles') {
            outlineClass = styles.card_outline_wisdom;
        } else if (card.suit.name === 'Wands') {
            outlineClass = styles.card_outline_strength;
        } else if (card.type === CardType.Minor) {
            outlineClass = styles.card_outline_minor;
        }
    }

    const imageUrl = card && card.cardId !== null ? `https://gfx.tarot.com/images/site/decks/8-bit/full_size/${card.cardId}.jpg` : null;
    const getCardTitle = (c: Card) => c.type === 'major' ? `Major Arcana ${c.rank}` : `${c.suit} ${c.rank}`;

    return (
        <Tooltip title={card && !isPlaceholder ? card.title : ''}>
            <div id={id} draggable={!isBack && !isPlaceholder} onDragStart={onDragStart && card ? (e) => onDragStart(e, card) : undefined} onClick={onClick && card ? () => onClick(card) : undefined} className={`${cardClass} ${className} ${outlineClass}`}>
                {isBack ? <Image src={FALLBACK_CARD_BACK_URL} alt="Card back" className={styles.card_back_image} width={128} height={192} unoptimized /> : isPlaceholder ? <span className={styles.card_text}>Empty Slot</span> : (
                    <>
                        {imageUrl && <Image src={imageUrl} alt={getCardTitle(card!)} className={styles.card_image} width={128} height={192} />}
                        <div className={styles.card_value}>{getCardValue(card)}</div>
                        {card!.suit && card!.suit.name !== 'Major' && <div className={styles.card_suit}><i className={`${SUIT_ICONS[card!.suit.id]}`}></i></div>}
                    </>
                )}
            </div>
        </Tooltip>
    );
};

export default CardPlaceholder;
