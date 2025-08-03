
import React from 'react';
import { FALLBACK_CARD_BACK_URL, SUIT_ICONS, getCardValue } from '../data';
import styles from '../game.module.css';

interface Card {
    id: string;
    title: string;
    type: string;
    rank: number;
    suit: string;
    cardId: number;
    isDoubled: boolean;
    isPlaceholder?: boolean;
}

interface CardPlaceholderProps {
    isBack?: boolean;
    card?: Card | null;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, card: Card) => void;
    id?: string;
    className?: string;
    onClick?: (card: Card) => void;
}

const CardPlaceholder: React.FC<CardPlaceholderProps> = ({ isBack = false, card = null, onDragStart, id, className = '', onClick }) => {
    const isPlaceholder = card === null || card.isPlaceholder;
    const cardClass = isPlaceholder ? `${styles.card_placeholder} ${styles.empty}` : `${styles.card_placeholder} ${styles.card_face}`;
    const imageUrl = card && card.cardId !== null ? `https://gfx.tarot.com/images/site/decks/8-bit/full_size/${card.cardId}.jpg` : null;
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_CARD_BACK_URL; };
    const getCardTitle = (c: Card) => c.type === 'major' ? `Major Arcana ${c.rank}` : `${c.suit} ${c.rank}`;

    return (
        <div id={id} draggable={!isBack && !isPlaceholder} onDragStart={onDragStart && card ? (e) => onDragStart(e, card) : undefined} onClick={onClick && card ? () => onClick(card) : undefined} className={`${cardClass} ${className}`}>
            {isBack ? <img src={FALLBACK_CARD_BACK_URL} alt="Card back" className={styles.card_back_image} onError={handleImageError} /> : isPlaceholder ? <span className={styles.card_text}>Empty Slot</span> : (
                <>
                    {imageUrl && <img src={imageUrl} alt={getCardTitle(card!)} className={styles.card_image} onError={handleImageError} />}
                    <div className={styles.card_value}>{getCardValue(card)}</div>
                    {card!.suit && card!.suit !== 'Major' && <div className={styles.card_suit}><i className={`${SUIT_ICONS[card!.suit]}`}></i></div>}
                </>
            )}
        </div>
    );
};

export default CardPlaceholder;
